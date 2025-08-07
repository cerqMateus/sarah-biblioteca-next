import { useState, useEffect } from 'react';

export interface Reserva {
    id: number;
    startDateTime: string;
    endDateTime: string;
    status: string;
    user: {
        name: string;
        matricula: number;
        ramal: string;
    };
    room: {
        name: string;
    };
}

export function useReservas(matricula?: number) {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReservas = async () => {
        setLoading(true);
        setError(null);
        try {
            // Executar limpeza de reservas expiradas antes de buscar
            await fetch('/api/reservas/cleanup-expired', { method: 'POST' });

            const url = matricula
                ? `/api/reservas?matricula=${matricula}`
                : '/api/reservas';

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro ao carregar reservas');
            }
            const data = await response.json();
            setReservas(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    const createReserva = async (data: {
        nome?: string;
        matricula: string;
        ramal?: string;
        local: string;
        data: string;
        horaInicio: string;
        horaFim: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao criar reserva');
            }

            const newReserva = await response.json();
            // Recarregar todas as reservas para garantir que a lista esteja atualizada
            await fetchReservas();
            return newReserva;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteReserva = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/reservas/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao cancelar reserva');
            }

            // Recarregar todas as reservas para garantir que a lista esteja atualizada
            await fetchReservas();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    return {
        reservas,
        loading,
        error,
        fetchReservas,
        createReserva,
        deleteReserva,
    };
}
