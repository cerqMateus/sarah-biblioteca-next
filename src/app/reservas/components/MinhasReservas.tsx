"use client";

import { useReservas } from "@/hooks/useReservas";
import { useAuth } from "@/contexts/AuthContext";
import ReservaCard from "./ReservaCard";
import { useMemo } from "react";

const MinhasReservas = () => {
  const { user } = useAuth();
  const { reservas, loading, error } = useReservas(user?.matricula);

  // As reservas já vêm filtradas da API, então não precisamos filtrar aqui
  const minhasReservas = reservas;

  // Separar reservas ativas e passadas
  const { reservasAtivas, reservasPassadas } = useMemo(() => {
    const now = new Date();

    const ativas = minhasReservas.filter(
      (reserva) => new Date(reserva.endDateTime) >= now
    );

    const passadas = minhasReservas.filter(
      (reserva) => new Date(reserva.endDateTime) < now
    );

    // Ordenar: ativas por data mais próxima, passadas por mais recente
    ativas.sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
    );
    passadas.sort(
      (a, b) =>
        new Date(b.startDateTime).getTime() -
        new Date(a.startDateTime).getTime()
    );

    return { reservasAtivas: ativas, reservasPassadas: passadas };
  }, [minhasReservas]);

  if (loading) {
    return (
      <div className="w-3/4 flex-1 p-8 overflow-y-auto">
        <div className="text-lg font-semibold text-primary mb-6">
          Minhas Reservas
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Carregando reservas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-3/4 flex-1 p-8 overflow-y-auto">
        <div className="text-lg font-semibold text-primary mb-6">
          Minhas Reservas
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">Erro ao carregar reservas: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3/4 flex-1 p-8 overflow-y-auto">
      <div className="text-lg font-semibold text-primary mb-6">
        Minhas Reservas
      </div>

      {minhasReservas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            Você ainda não possui reservas
          </div>
          <div className="text-gray-400 text-sm">
            Use o botão "Criar nova reserva" para fazer sua primeira reserva
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Reservas Ativas */}
          {reservasAtivas.length > 0 && (
            <div>
              <h2 className="text-md font-medium text-gray-800 mb-4">
                Reservas Ativas ({reservasAtivas.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reservasAtivas.map((reserva) => (
                  <ReservaCard key={reserva.id} reserva={reserva} />
                ))}
              </div>
            </div>
          )}

          {/* Reservas Passadas */}
          {reservasPassadas.length > 0 && (
            <div>
              <h2 className="text-md font-medium text-gray-800 mb-4">
                Histórico ({reservasPassadas.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reservasPassadas.map((reserva) => (
                  <ReservaCard key={reserva.id} reserva={reserva} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MinhasReservas;
