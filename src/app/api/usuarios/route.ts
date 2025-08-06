import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const matriculaParam = searchParams.get('matricula');

        if (!matriculaParam) {
            return NextResponse.json(
                { error: "Parâmetro matrícula é obrigatório" },
                { status: 400 }
            );
        }

        const matricula = parseInt(matriculaParam);

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
        console.error('Erro ao buscar usuário:', error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
