"use client";

import { useReservas } from "@/hooks/useReservas";
import { formatDate, formatTime } from "@/lib/utils";

const ListaReservas = () => {
  const { reservas, loading, error } = useReservas();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            Carregando reservas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-red-500">
          Erro ao carregar reservas: {error}
        </p>
      </div>
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhuma reserva encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Reservas Ativas</h3>
      <div className="space-y-2">
        {reservas.map((reserva) => (
          <div key={reserva.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{reserva.user.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Matrícula: {reserva.user.matricula} | Ramal:{" "}
                  {reserva.user.ramal}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  reserva.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {reserva.status}
              </span>
            </div>
            <div className="text-sm">
              <p>
                <strong>Local:</strong> {reserva.room.name}
              </p>
              <p>
                <strong>Data:</strong> {formatDate(reserva.startDateTime)}
              </p>
              <p>
                <strong>Horário:</strong> {formatTime(reserva.startDateTime)} -{" "}
                {formatTime(reserva.endDateTime)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaReservas;
