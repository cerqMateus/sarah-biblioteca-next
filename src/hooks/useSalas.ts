import { useState, useEffect } from 'react';

export interface Sala {
    id: number;
    name: string;
    capacity: number;
    isAvailable: boolean;
    resources: {
        id: number;
        name: string;
        type: string;
    }[];
}

export function useSalas() {
    const [salas, setSalas] = useState<Sala[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSalas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/salas');
            if (!response.ok) {
                throw new Error('Erro ao carregar salas');
            }
            const data = await response.json();
            setSalas(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalas();
    }, []);

    return {
        salas,
        loading,
        error,
        fetchSalas,
    };
}
