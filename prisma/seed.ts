import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...')

    // Limpar dados existentes (opcional - remova se não quiser limpar)
    await prisma.reservation.deleteMany()
    await prisma.roomResource.deleteMany()
    await prisma.room.deleteMany()
    await prisma.user.deleteMany()

    // Criar usuários de exemplo
    const users = await prisma.user.createMany({
        data: [
            {
                name: 'João Silva',
                sector: 'TI',
                ramal: '1234'
            },
            {
                name: 'Maria Santos',
                sector: 'RH',
                ramal: '5678'
            },
            {
                name: 'Pedro Oliveira',
                sector: 'Financeiro',
                ramal: '9012'
            },
            {
                name: 'Ana Costa',
                sector: 'Marketing',
                ramal: '3456'
            },
            {
                name: 'Carlos Ferreira',
                sector: 'Vendas',
                ramal: '7890'
            },
            {
                name: 'Luciana Pereira',
                sector: 'Jurídico',
                ramal: '2345'
            },
            {
                name: 'Roberto Lima',
                sector: 'Operações',
                ramal: '6789'
            },
            {
                name: 'Fernanda Alves',
                sector: 'Comunicação',
                ramal: '1357'
            },
            {
                name: 'Diego Souza',
                sector: 'TI',
                ramal: '2468'
            },
            {
                name: 'Juliana Rocha',
                sector: 'RH',
                ramal: '3691'
            },
            {
                name: 'Marcos Barbosa',
                sector: 'Financeiro',
                ramal: '4702'
            },
            {
                name: 'Patricia Dias',
                sector: 'Marketing',
                ramal: '5813'
            },
            {
                name: 'Ricardo Monteiro',
                sector: 'Vendas',
                ramal: '6924'
            },
            {
                name: 'Camila Nunes',
                sector: 'Jurídico',
                ramal: '7035'
            },
            {
                name: 'Felipe Castro',
                sector: 'Operações',
                ramal: '8146'
            },
            {
                name: 'Tatiana Gomes',
                sector: 'Comunicação',
                ramal: '9257'
            },
            {
                name: 'Leonardo Martins',
                sector: 'TI',
                ramal: '1368'
            },
            {
                name: 'Vanessa Campos',
                sector: 'RH',
                ramal: '2479'
            },
            {
                name: 'Bruno Cardoso',
                sector: 'Financeiro',
                ramal: '3580'
            },
            {
                name: 'Gabriela Torres',
                sector: 'Marketing',
                ramal: '4691'
            },
        ],
    })

    // Criar salas
    const sala1 = await prisma.room.create({
        data: {
            name: 'Sala de Reunião A',
            capacity: 10,
            isAvailable: true,
        }
    })

    const sala2 = await prisma.room.create({
        data: {
            name: 'Sala de Conferência B',
            capacity: 20,
            isAvailable: true,
        }
    })

    const sala3 = await prisma.room.create({
        data: {
            name: 'Auditório',
            capacity: 100,
            isAvailable: true,
        }
    })

    // Adicionar recursos às salas
    await prisma.roomResource.createMany({
        data: [
            // Recursos da Sala A
            { name: 'Projetor', type: 'Equipamento', roomId: sala1.id },
            { name: 'TV 55"', type: 'Equipamento', roomId: sala1.id },
            { name: 'Mesa para 10 pessoas', type: 'Mobília', roomId: sala1.id },
            { name: 'Ar condicionado', type: 'Climatização', roomId: sala1.id },

            // Recursos da Sala B
            { name: 'Projetor 4K', type: 'Equipamento', roomId: sala2.id },
            { name: 'Sistema de som', type: 'Equipamento', roomId: sala2.id },
            { name: 'Mesa para 20 pessoas', type: 'Mobília', roomId: sala2.id },
            { name: 'Ar condicionado', type: 'Climatização', roomId: sala2.id },
            { name: 'Quadro branco', type: 'Material', roomId: sala2.id },

            // Recursos do Auditório
            { name: 'Projetor laser', type: 'Equipamento', roomId: sala3.id },
            { name: 'Sistema de som profissional', type: 'Equipamento', roomId: sala3.id },
            { name: 'Microfones sem fio', type: 'Equipamento', roomId: sala3.id },
            { name: '100 cadeiras', type: 'Mobília', roomId: sala3.id },
            { name: 'Ar condicionado central', type: 'Climatização', roomId: sala3.id },
            { name: 'Palco', type: 'Estrutura', roomId: sala3.id },
        ]
    })

    console.log('✅ Seed concluído com sucesso!')
    console.log(`📊 Criados: ${users.count} usuários, 3 salas, 15 recursos`)
}

main()
    .catch((e) => {
        console.error('❌ Erro durante o seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
