import { useState, useCallback } from 'react';

interface AvailabilityCheck {
    available: boolean;
    conflicts?: Array<{
        startTime: string;
        endTime: string;
        userName: string;
    }>;
    message: string;
    error?: string;
}

export function useAvailabilityCheck() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AvailabilityCheck | null>(null);

    const checkAvailability = useCallback(async (
        room: string,
        date: string,
        startTime: string,
        endTime: string
    ) => {
        if (!room || !date || !startTime || !endTime) {
            setResult(null);
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams({
                room,
                date,
                startTime,
                endTime
            });

            const response = await fetch(`/api/reservas/check-availability?${params}`);
            const data = await response.json();

            setResult(data);
            return data;
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            setResult({
                available: false,
                message: 'Erro ao verificar disponibilidade',
                error: 'Erro de conexão'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResult = useCallback(() => {
        setResult(null);
    }, []);

    return {
        checkAvailability,
        clearResult,
        loading,
        result
    };
}
