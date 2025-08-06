import { useState } from 'react';

export interface Usuario {
    matricula: number;
    name: string;
    ramal: string;
    sector: string;
}

export function useUsuario() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarUsuario = async (matricula: string) => {
        if (!matricula || matricula.trim() === '') {
            setUsuario(null);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/usuarios/${matricula}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Usuário não encontrado');
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar usuário');
            }

            const data = await response.json();
            setUsuario(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            setUsuario(null);
        } finally {
            setLoading(false);
        }
    };

    const limparUsuario = () => {
        setUsuario(null);
        setError(null);
    };

    return {
        usuario,
        loading,
        error,
        buscarUsuario,
        limparUsuario,
    };
}
