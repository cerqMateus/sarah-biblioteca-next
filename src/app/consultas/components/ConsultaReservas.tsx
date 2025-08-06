"use client";

import { useConsultaContext } from "@/contexts/ConsultaContext";
import { ReservaConsulta } from "@/hooks/useConsultaReservas";

interface ReservaConsultaCardProps {
  reserva: ReservaConsulta;
}

const ReservaConsultaCard = ({ reserva }: ReservaConsultaCardProps) => {
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const startFormatted = formatDateTime(reserva.startDateTime);
  const endFormatted = formatDateTime(reserva.endDateTime);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">
            {reserva.user.name}
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Matrícula:</span>{" "}
              {reserva.user.matricula}
            </p>
            <p>
              <span className="font-medium">Ramal:</span> {reserva.user.ramal}
            </p>
            <p>
              <span className="font-medium">Horário:</span>{" "}
              {startFormatted.time} às {endFormatted.time}
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Ativa
        </div>
      </div>

      {reserva.createdAt && (
        <div className="text-xs text-gray-400 pt-2 border-t">
          Criada em: {formatDateTime(reserva.createdAt).date}
        </div>
      )}
    </div>
  );
};

const ConsultaReservas = () => {
  const { selectedRoom, selectedDate, getReservasPorData, loading } =
    useConsultaContext();

  if (!selectedRoom) {
    return (
      <div className="w-3/4 flex-1 p-8 overflow-y-auto">
        <div className="text-lg font-semibold text-primary mb-4">
          Consulta de Reservas
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Selecione uma sala</div>
          <div className="text-gray-400 text-sm">
            Escolha uma sala na barra lateral para ver as reservas
          </div>
        </div>
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <div className="w-3/4 flex-1 p-8 overflow-y-auto">
        <div className="text-lg font-semibold text-primary mb-4">
          Consulta de Reservas - {selectedRoom}
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Selecione uma data</div>
          <div className="text-gray-400 text-sm">
            Clique em uma data no calendário para ver as reservas
          </div>
        </div>
      </div>
    );
  }

  const reservasData = getReservasPorData(selectedDate);
  const dataFormatada = selectedDate.toLocaleDateString("pt-BR");

  if (loading) {
    return (
      <div className="w-3/4 flex-1 p-8 overflow-y-auto">
        <div className="text-lg font-semibold text-primary mb-4">
          Consulta de Reservas - {selectedRoom}
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Carregando reservas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3/4 flex-1 p-8 overflow-y-auto">
      <div className="text-lg font-semibold text-primary mb-2">
        Consulta de Reservas - {selectedRoom}
      </div>
      <div className="text-sm text-gray-600 mb-6">Data: {dataFormatada}</div>

      {reservasData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            Nenhuma reserva encontrada
          </div>
          <div className="text-gray-400 text-sm">
            Não há reservas para {dataFormatada} na sala {selectedRoom}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-800">
              {reservasData.length} reserva(s) encontrada(s)
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reservasData.map((reserva) => (
              <ReservaConsultaCard key={reserva.id} reserva={reserva} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaReservas;
