import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const roomName = searchParams.get('room');
        const date = searchParams.get('date');
        const startTime = searchParams.get('startTime');
        const endTime = searchParams.get('endTime');

        if (!roomName || !date || !startTime || !endTime) {
            return NextResponse.json(
                { error: 'Parâmetros obrigatórios: room, date, startTime, endTime' },
                { status: 400 }
            );
        }

        // Encontrar a sala
        const room = await prisma.room.findFirst({
            where: {
                name: roomName,
                isAvailable: true
            }
        });

        if (!room) {
            return NextResponse.json(
                { available: false, error: "Sala não encontrada" },
                { status: 404 }
            );
        }

        // Criar as datas de início e fim
        const startDateTime = new Date(`${date}T${startTime}:00`);
        const endDateTime = new Date(`${date}T${endTime}:00`);

        // Verificar conflitos
        const conflictingReservations = await prisma.reservation.findMany({
            where: {
                roomId: room.id,
                status: "ACTIVE",
                OR: [
                    // Nova reserva começa durante uma reserva existente
                    {
                        AND: [
                            { startDateTime: { lte: startDateTime } },
                            { endDateTime: { gt: startDateTime } }
                        ]
                    },
                    // Nova reserva termina durante uma reserva existente
                    {
                        AND: [
                            { startDateTime: { lt: endDateTime } },
                            { endDateTime: { gte: endDateTime } }
                        ]
                    },
                    // Nova reserva engloba uma reserva existente
                    {
                        AND: [
                            { startDateTime: { gte: startDateTime } },
                            { endDateTime: { lte: endDateTime } }
                        ]
                    },
                    // Nova reserva está totalmente dentro de uma reserva existente
                    {
                        AND: [
                            { startDateTime: { lte: startDateTime } },
                            { endDateTime: { gte: endDateTime } }
                        ]
                    }
                ]
            },
            include: {
                user: true
            }
        });

        if (conflictingReservations.length > 0) {
            const conflicts = conflictingReservations.map(reservation => ({
                startTime: new Date(reservation.startDateTime).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
                endTime: new Date(reservation.endDateTime).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
                userName: reservation.user.name
            }));

            return NextResponse.json({
                available: false,
                conflicts,
                message: `Horário não disponível. ${conflicts.length} conflito(s) encontrado(s).`
            });
        }

        return NextResponse.json({
            available: true,
            message: "Horário disponível!"
        });

    } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
