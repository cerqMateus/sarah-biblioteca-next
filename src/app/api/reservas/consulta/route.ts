import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const roomName = searchParams.get('room');

        if (!roomName) {
            return NextResponse.json(
                { error: 'Parâmetro room é obrigatório' },
                { status: 400 }
            );
        }

        // Encontrar a sala
        const room = await prisma.room.findFirst({
            where: {
                name: roomName
            }
        });

        if (!room) {
            return NextResponse.json(
                { error: 'Sala não encontrada' },
                { status: 404 }
            );
        }

        // Buscar todas as reservas da sala
        const reservations = await prisma.reservation.findMany({
            where: {
                roomId: room.id,
                status: "ACTIVE"
            },
            include: {
                user: true,
                room: true,
            },
            orderBy: {
                startDateTime: 'asc'
            }
        });

        return NextResponse.json(reservations);
    } catch (error) {
        console.error("Erro ao buscar reservas para consulta:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
