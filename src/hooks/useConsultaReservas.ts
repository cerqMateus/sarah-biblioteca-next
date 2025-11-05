import { useState, useCallback } from 'react';

export interface ReservaConsulta {
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
    createdAt?: string;
}

export function useConsultaReservas() {
    const [reservas, setReservas] = useState<ReservaConsulta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReservasPorSala = useCallback(async (roomName?: string) => {
        if (!roomName) {
            setReservas([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Executar limpeza de reservas expiradas antes de buscar
            await fetch('/api/reservas/cleanup-expired', { method: 'POST' });

            const url = `/api/reservas/consulta?room=${encodeURIComponent(roomName)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erro ao carregar reservas');
            }

            const data = await response.json();
            setReservas(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            setReservas([]);
        } finally {
            setLoading(false);
        }
    }, []); const getReservasPorData = useCallback((date: Date) => {
        if (!date) return [];

        const dateStr = date.toISOString().split('T')[0];
        return reservas.filter(reserva => {
            const reservaDate = new Date(reserva.startDateTime).toISOString().split('T')[0];
            return reservaDate === dateStr;
        });
    }, [reservas]);

    const getDatasComReservas = useCallback(() => {
        const dates = new Set<string>();
        reservas.forEach(reserva => {
            const dateStr = new Date(reserva.startDateTime).toISOString().split('T')[0];
            dates.add(dateStr);
        });
        return Array.from(dates);
    }, [reservas]);

    return {
        reservas,
        loading,
        error,
        fetchReservasPorSala,
        getReservasPorData,
        getDatasComReservas,
    };
}
