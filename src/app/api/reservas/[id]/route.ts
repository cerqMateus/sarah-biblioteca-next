import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            );
        }        // Verificar se a reserva existe
        const reserva = await prisma.reservation.findUnique({
            where: { id },
        });

        if (!reserva) {
            return NextResponse.json(
                { error: 'Reserva não encontrada' },
                { status: 404 }
            );
        }

        // Deletar a reserva
        await prisma.reservation.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Reserva cancelada com sucesso' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}