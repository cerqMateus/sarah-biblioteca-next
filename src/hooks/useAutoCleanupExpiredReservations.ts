import { useCallback, useEffect } from 'react';

export function useAutoCleanupExpiredReservations() {
    const cleanupExpiredReservations = useCallback(async () => {
        try {
            const response = await fetch('/api/reservas/cleanup-expired', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Erro ao limpar reservas expiradas');
            }

            const result = await response.json();

            if (result.deletedCount > 0) {
                console.log(`✅ ${result.deletedCount} reservas expiradas foram processadas automaticamente`);
                return result.deletedCount;
            }

            return 0;
        } catch (error) {
            console.error('❌ Erro na limpeza automática de reservas:', error);
            return 0;
        }
    }, []);

    useEffect(() => {
        // Executar limpeza imediatamente ao carregar
        cleanupExpiredReservations();

        // Executar limpeza a cada 5 minutos
        const interval = setInterval(() => {
            cleanupExpiredReservations();
        }, 5 * 60 * 1000); // 5 minutos

        return () => clearInterval(interval);
    }, [cleanupExpiredReservations]);

    return {
        cleanupExpiredReservations,
        // Para uso manual se necessário
        manualCleanup: cleanupExpiredReservations
    };
}
