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

export function useReservas() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReservas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/reservas');
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
        nome: string;
        matricula: string;
        ramal: string;
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
            setReservas(prev => [...prev, newReserva]);
            return newReserva;
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
    };
}
