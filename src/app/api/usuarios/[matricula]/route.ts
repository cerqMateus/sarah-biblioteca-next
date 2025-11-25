import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ matricula: string }> }
) {
    try {
        const { matricula: matriculaStr } = await params;
        const matricula = parseInt(matriculaStr);

        if (isNaN(matricula)) {
            return NextResponse.json(
                { error: "Matrícula deve ser um número válido" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { matricula },
            select: {
                matricula: true,
                name: true,
                ramal: true,
                sector: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
