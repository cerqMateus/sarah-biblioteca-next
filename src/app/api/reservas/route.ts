import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema de validação para criação de reserva
const createReservaSchema = z.object({
    nome: z.string().min(1, "Nome obrigatório"),
    matricula: z.string().min(1, "Matrícula obrigatória"),
    ramal: z.string().min(1, "Ramal obrigatório"),
    local: z.string().min(1, "Local obrigatório"),
    data: z.string().min(1, "Data obrigatória"),
    horaInicio: z.string().min(1, "Hora de início obrigatória"),
    horaFim: z.string().min(1, "Hora de fim obrigatória"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createReservaSchema.parse(body);

        // Buscar o usuário (não criar novo)
        const user = await prisma.user.findUnique({
            where: { matricula: parseInt(validatedData.matricula) }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado. Verifique a matrícula informada." },
                { status: 400 }
            );
        }

        // Encontrar a sala (não criar nova)
        const room = await prisma.room.findFirst({
            where: {
                name: validatedData.local,
                isAvailable: true
            }
        });

        if (!room) {
            return NextResponse.json(
                { error: "Sala não encontrada ou não disponível" },
                { status: 400 }
            );
        }

        // Criar as datas de início e fim
        const startDateTime = new Date(`${validatedData.data}T${validatedData.horaInicio}:00`);
        const endDateTime = new Date(`${validatedData.data}T${validatedData.horaFim}:00`);

        // Verificar se já existe uma reserva conflitante
        const conflictingReservation = await prisma.reservation.findFirst({
            where: {
                roomId: room.id,
                status: "ACTIVE",
                OR: [
                    {
                        AND: [
                            { startDateTime: { lte: startDateTime } },
                            { endDateTime: { gt: startDateTime } }
                        ]
                    },
                    {
                        AND: [
                            { startDateTime: { lt: endDateTime } },
                            { endDateTime: { gte: endDateTime } }
                        ]
                    },
                    {
                        AND: [
                            { startDateTime: { gte: startDateTime } },
                            { endDateTime: { lte: endDateTime } }
                        ]
                    }
                ]
            }
        });

        if (conflictingReservation) {
            return NextResponse.json(
                { error: "Já existe uma reserva neste horário para esta sala" },
                { status: 400 }
            );
        }

        // Criar a reserva
        const reservation = await prisma.reservation.create({
            data: {
                userId: user.matricula,
                roomId: room.id,
                startDateTime,
                endDateTime,
                status: "ACTIVE",
            },
            include: {
                user: true,
                room: true,
            }
        });

        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar reserva:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const reservations = await prisma.reservation.findMany({
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
        console.error("Erro ao buscar reservas:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
