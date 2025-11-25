import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const reservations = await prisma.reservation.findMany({
            include: {
                user: true,
                room: true,
            },
            orderBy: {
                startDateTime: 'desc'
            }
        });

        const now = new Date();
        const categorized = {
            expired: reservations.filter(r => new Date(r.endDateTime) < now && r.status === 'ACTIVE'),
            active: reservations.filter(r => new Date(r.endDateTime) >= now && r.status === 'ACTIVE'),
            completed: reservations.filter(r => r.status === 'COMPLETED'),
            cancelled: reservations.filter(r => r.status === 'CANCELLED'),
            all: reservations
        };

        return NextResponse.json({
            currentTime: now.toISOString(),
            counts: {
                total: categorized.all.length,
                expired: categorized.expired.length,
                active: categorized.active.length,
                completed: categorized.completed.length,
                cancelled: categorized.cancelled.length
            },
            expired: categorized.expired.map(r => ({
                id: r.id,
                endDateTime: r.endDateTime,
                status: r.status,
                user: r.user.name,
                room: r.room.name
            })),
            all: categorized.all.map(r => ({
                id: r.id,
                startDateTime: r.startDateTime,
                endDateTime: r.endDateTime,
                status: r.status,
                user: r.user.name,
                room: r.room.name
            }))
        });
    } catch (error) {
        console.error("Erro ao buscar todas as reservas:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
