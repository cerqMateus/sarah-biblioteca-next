import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function createReservationNotifications(reservationId: number, userId: number, action: 'created' | 'cancelled') {
    try {
        // Buscar a reserva com dados da sala
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: {
                room: true,
                user: true,
            },
        });

        if (!reservation) {
            throw new Error('Reserva não encontrada');
        }

        const startDateTime = new Date(reservation.startDateTime);
        const endDateTime = new Date(reservation.endDateTime);

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        };

        const formatTime = (date: Date) => {
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        let title, message, type;

        if (action === 'created') {
            title = 'Reserva Confirmada';
            message = `Sua reserva da sala "${reservation.room.name}" foi confirmada para ${formatDate(startDateTime)} das ${formatTime(startDateTime)} às ${formatTime(endDateTime)}.`;
            type = 'RESERVATION_CREATED';
        } else {
            title = 'Reserva Cancelada';
            message = `Sua reserva da sala "${reservation.room.name}" para ${formatDate(startDateTime)} das ${formatTime(startDateTime)} às ${formatTime(endDateTime)} foi cancelada.`;
            type = 'RESERVATION_CANCELLED';
        }

        // Criar a notificação
        await prisma.notification.create({
            data: {
                userId,
                reservationId,
                title,
                message,
                type: type as any,
            },
        });

        console.log(`Notificação de ${action} criada para usuário ${userId}`);
    } catch (error) {
        console.error('Erro ao criar notificação de reserva:', error);
    }
}

export async function createReminderNotifications() {
    try {
        const now = new Date();

        // Data em 3 dias
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);
        threeDaysFromNow.setHours(0, 0, 0, 0);

        const threeDaysFromNowEnd = new Date(threeDaysFromNow);
        threeDaysFromNowEnd.setHours(23, 59, 59, 999);

        // Data em 1 dia
        const oneDayFromNow = new Date();
        oneDayFromNow.setDate(now.getDate() + 1);
        oneDayFromNow.setHours(0, 0, 0, 0);

        const oneDayFromNowEnd = new Date(oneDayFromNow);
        oneDayFromNowEnd.setHours(23, 59, 59, 999);

        // Buscar reservas para 3 dias
        const reservationsIn3Days = await prisma.reservation.findMany({
            where: {
                startDateTime: {
                    gte: threeDaysFromNow,
                    lte: threeDaysFromNowEnd,
                },
                status: 'ACTIVE',
            },
            include: {
                room: true,
                user: true,
                notifications: {
                    where: {
                        type: 'RESERVATION_REMINDER_3_DAYS',
                    },
                },
            },
        });

        // Buscar reservas para 1 dia
        const reservationsIn1Day = await prisma.reservation.findMany({
            where: {
                startDateTime: {
                    gte: oneDayFromNow,
                    lte: oneDayFromNowEnd,
                },
                status: 'ACTIVE',
            },
            include: {
                room: true,
                user: true,
                notifications: {
                    where: {
                        type: 'RESERVATION_REMINDER_1_DAY',
                    },
                },
            },
        });

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        };

        const formatTime = (date: Date) => {
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        // Criar notificações para reservas em 3 dias (apenas se não existir ainda)
        for (const reservation of reservationsIn3Days) {
            if (reservation.notifications.length === 0) {
                await prisma.notification.create({
                    data: {
                        userId: reservation.userId,
                        reservationId: reservation.id,
                        title: 'Lembrete - Reserva em 3 dias',
                        message: `Lembre-se: você tem uma reserva da sala "${reservation.room.name}" em 3 dias (${formatDate(new Date(reservation.startDateTime))}) das ${formatTime(new Date(reservation.startDateTime))} às ${formatTime(new Date(reservation.endDateTime))}.`,
                        type: 'RESERVATION_REMINDER_3_DAYS',
                    },
                });
                console.log(`Lembrete de 3 dias criado para reserva ${reservation.id}`);
            }
        }

        // Criar notificações para reservas em 1 dia (apenas se não existir ainda)
        for (const reservation of reservationsIn1Day) {
            if (reservation.notifications.length === 0) {
                await prisma.notification.create({
                    data: {
                        userId: reservation.userId,
                        reservationId: reservation.id,
                        title: 'Lembrete - Reserva amanhã',
                        message: `Lembre-se: você tem uma reserva da sala "${reservation.room.name}" amanhã (${formatDate(new Date(reservation.startDateTime))}) das ${formatTime(new Date(reservation.startDateTime))} às ${formatTime(new Date(reservation.endDateTime))}.`,
                        type: 'RESERVATION_REMINDER_1_DAY',
                    },
                });
                console.log(`Lembrete de 1 dia criado para reserva ${reservation.id}`);
            }
        }

    } catch (error) {
        console.error('Erro ao criar lembretes de reserva:', error);
    }
}

export async function createCompletionNotifications() {
    try {
        const now = new Date();

        // Buscar reservas que acabaram de terminar (últimos 5 minutos)
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        const completedReservations = await prisma.reservation.findMany({
            where: {
                endDateTime: {
                    gte: fiveMinutesAgo,
                    lte: now,
                },
                status: 'ACTIVE',
            },
            include: {
                room: true,
                user: true,
                notifications: {
                    where: {
                        type: 'RESERVATION_COMPLETED',
                    },
                },
            },
        });

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        };

        const formatTime = (date: Date) => {
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        // Criar notificações para reservas completadas (apenas se não existir ainda)
        for (const reservation of completedReservations) {
            if (reservation.notifications.length === 0) {
                // Atualizar status da reserva para COMPLETED
                await prisma.reservation.update({
                    where: { id: reservation.id },
                    data: { status: 'COMPLETED' },
                });

                // Criar notificação de conclusão
                await prisma.notification.create({
                    data: {
                        userId: reservation.userId,
                        reservationId: reservation.id,
                        title: 'Reserva Concluída',
                        message: `Sua reserva da sala "${reservation.room.name}" foi concluída. Obrigado por utilizar nossos serviços! (${formatDate(new Date(reservation.startDateTime))} das ${formatTime(new Date(reservation.startDateTime))} às ${formatTime(new Date(reservation.endDateTime))})`,
                        type: 'RESERVATION_COMPLETED',
                    },
                });
                console.log(`Notificação de conclusão criada para reserva ${reservation.id}`);
            }
        }

    } catch (error) {
        console.error('Erro ao criar notificações de conclusão:', error);
    }
}
