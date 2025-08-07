import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const now = new Date();

        // Buscar reservas que já passaram do horário de encerramento e ainda estão ativas
        const reservasExpiradas = await prisma.reservation.findMany({
            where: {
                endDateTime: {
                    lt: now
                },
                status: 'ACTIVE'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        matricula: true
                    }
                },
                room: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (reservasExpiradas.length === 0) {
            return NextResponse.json({
                message: 'Nenhuma reserva expirada encontrada',
                deletedCount: 0
            });
        }

        // Atualizar status para COMPLETED ou deletar as reservas expiradas
        const result = await prisma.reservation.updateMany({
            where: {
                endDateTime: {
                    lt: now
                },
                status: 'ACTIVE'
            },
            data: {
                status: 'COMPLETED'
            }
        });

        console.log(`${result.count} reservas expiradas foram marcadas como COMPLETED`);

        return NextResponse.json({
            message: `${result.count} reservas expiradas foram processadas`,
            deletedCount: result.count,
            reservasProcessadas: reservasExpiradas.map(r => ({
                id: r.id,
                usuario: r.user.name,
                sala: r.room.name,
                dataEncerramento: r.endDateTime
            }))
        });

    } catch (error) {
        console.error('Erro ao processar reservas expiradas:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// Função para ser chamada automaticamente
export async function GET(request: NextRequest) {
    return POST(request);
}
