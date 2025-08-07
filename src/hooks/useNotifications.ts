import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
    id: number;
    userId: number;
    reservationId?: number;
    title: string;
    message: string;
    type: 'RESERVATION_CREATED' | 'RESERVATION_CANCELLED' | 'RESERVATION_REMINDER_3_DAYS' | 'RESERVATION_REMINDER_1_DAY' | 'RESERVATION_COMPLETED';
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    reservation?: {
        id: number;
        startDateTime: string;
        endDateTime: string;
        room: {
            name: string;
        };
    };
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchNotifications = useCallback(async () => {
        if (!user?.matricula) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/notifications?matricula=${user.matricula}`);

            if (!response.ok) {
                throw new Error('Erro ao carregar notificações');
            }

            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    }, [user?.matricula]);

    const markAllAsRead = useCallback(async () => {
        if (!user?.matricula) return;

        try {
            const response = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ matricula: user.matricula }),
            });

            if (!response.ok) {
                throw new Error('Erro ao marcar notificações como lidas');
            }

            // Atualizar estado local
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, isRead: true }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        }
    }, [user?.matricula]);

    const deleteNotification = useCallback(async (id: number) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar notificação');
            }

            // Remover do estado local
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        }
    }, []);

    const createNotification = useCallback(async (
        title: string,
        message: string,
        type: Notification['type'],
        reservationId?: number
    ) => {
        if (!user?.matricula) return;

        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.matricula,
                    reservationId,
                    title,
                    message,
                    type,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar notificação');
            }

            const newNotification = await response.json();

            // Adicionar ao estado local
            setNotifications(prev => [newNotification, ...prev]);

            return newNotification;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        }
    }, [user?.matricula]);

    // Carregar notificações quando o usuário mudar
    useEffect(() => {
        if (user?.matricula) {
            fetchNotifications();
        }
    }, [user?.matricula, fetchNotifications]);

    // Contar notificações não lidas
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return {
        notifications,
        loading,
        error,
        unreadCount,
        fetchNotifications,
        markAllAsRead,
        deleteNotification,
        createNotification,
    };
}
