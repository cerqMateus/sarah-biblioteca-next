import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            where: {
                isAvailable: true
            },
            orderBy: {
                name: 'asc'
            },
            include: {
                resources: true
            }
        });

        return NextResponse.json(rooms);
    } catch (error) {
        console.error("Erro ao buscar salas:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
