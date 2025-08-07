import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET - Buscar notificações do usuário
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const matricula = searchParams.get('matricula');

        if (!matricula) {
            return NextResponse.json(
                { error: 'Matrícula é obrigatória' },
                { status: 400 }
            );
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: parseInt(matricula),
            },
            include: {
                reservation: {
                    include: {
                        room: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// POST - Criar uma nova notificação
export async function POST(request: NextRequest) {
    try {
        const { userId, reservationId, title, message, type } = await request.json();

        if (!userId || !title || !message || !type) {
            return NextResponse.json(
                { error: 'Dados obrigatórios: userId, title, message, type' },
                { status: 400 }
            );
        }

        const notification = await prisma.notification.create({
            data: {
                userId,
                reservationId: reservationId || null,
                title,
                message,
                type,
            },
            include: {
                reservation: {
                    include: {
                        room: true,
                    },
                },
            },
        });

        return NextResponse.json(notification, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar notificação:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// PATCH - Marcar todas as notificações como lidas
export async function PATCH(request: NextRequest) {
    try {
        const { matricula } = await request.json();

        if (!matricula) {
            return NextResponse.json(
                { error: 'Matrícula é obrigatória' },
                { status: 400 }
            );
        }

        await prisma.notification.updateMany({
            where: {
                userId: parseInt(matricula),
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao marcar notificações como lidas:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
