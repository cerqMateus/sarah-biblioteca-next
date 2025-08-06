"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useReservas } from "@/hooks/useReservas";
import { useSalas } from "@/hooks/useSalas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ReservaFormContent = () => {
  const { user } = useAuth();
  const { reservas, loading: reservasLoading } = useReservas();
  const { salas } = useSalas();

  // Filtrar reservas do usuário ativo
  const reservasDoUsuario =
    reservas?.filter((reserva) => reserva.user.matricula === user?.matricula) ||
    [];

  // Função para formatar data e hora
  const formatarDataHora = (dateTimeString: string) => {
    try {
      const data = new Date(dateTimeString);
      return {
        data: format(data, "dd/MM/yyyy", { locale: ptBR }),
        hora: format(data, "HH:mm", { locale: ptBR }),
      };
    } catch {
      return {
        data: dateTimeString,
        hora: dateTimeString,
      };
    }
  };

  if (reservasLoading) {
    return (
      <div className="w-3/4 flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando suas reservas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3/4 flex-1 p-8 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Minhas Reservas
        </h1>
        <p className="text-gray-600">
          Aqui estão todas as suas reservas de salas da biblioteca
        </p>
      </div>

      {reservasDoUsuario.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 11a2 2 0 002 2h8a2 2 0 002-2l-2-11m-6 0V7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-gray-500">
              Você ainda não fez nenhuma reserva. Use o botão "Criar nova
              reserva" para fazer sua primeira reserva.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservasDoUsuario.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {reserva.room.name}
                  </h3>
                  <p className="text-sm text-gray-600">Reserva de sala</p>
                </div>
                <div className="ml-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {reserva.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 11a2 2 0 002 2h8a2 2 0 002-2l-2-11m-6 0V7"
                    />
                  </svg>
                  {formatarDataHora(reserva.startDateTime).data}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatarDataHora(reserva.startDateTime).hora} -{" "}
                  {formatarDataHora(reserva.endDateTime).hora}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {reserva.user.name}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Ramal: {reserva.user.ramal}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Matrícula: {reserva.user.matricula}
                  </span>
                  <button className="text-xs text-primary hover:text-primary-dark font-medium">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservaFormContent;
