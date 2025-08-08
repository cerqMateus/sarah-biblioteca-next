"use client";

import SideBar from "@/app/components/SideBar";
import { SimpleCalendar } from "@/components/ui/simple-calendar";
import { useConsultaContext } from "@/contexts/ConsultaContext";
import { useSalas } from "@/hooks/useSalas";
import { useMemo } from "react";

const CalendarComponent = () => {
  const {
    selectedRoom,
    selectedDate,
    setSelectedRoom,
    setSelectedDate,
    getDatasComReservas,
    loading: consultaLoading,
  } = useConsultaContext();

  const { salas, loading: salasLoading } = useSalas();

  // Datas que têm reservas
  const datasComReservas = useMemo(() => {
    return getDatasComReservas().map(
      (dateStr) => new Date(dateStr + "T00:00:00")
    );
  }, [getDatasComReservas]);

  // Função para determinar se uma data deve ser destacada
  const modifiers = useMemo(
    () => ({
      hasReservation: datasComReservas,
    }),
    [datasComReservas]
  );

  const modifiersStyles = useMemo(
    () => ({
      hasReservation: {
        backgroundColor: "#3b82f6",
        color: "white",
        fontWeight: "bold",
      },
    }),
    []
  );

  return (
    <SideBar title="Consulta">
      {/* Select de Salas */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Selecione uma sala:
        </label>
        <select
          value={selectedRoom || ""}
          onChange={(e) => setSelectedRoom(e.target.value || null)}
          className="w-full border rounded px-3 py-2 bg-white"
          disabled={salasLoading}
        >
          <option value="">Escolha uma sala</option>
          {salas.map((sala) => (
            <option key={sala.id} value={sala.name}>
              {sala.name} (Cap. {sala.capacity})
            </option>
          ))}
        </select>
        {salasLoading && (
          <span className="text-xs text-gray-500 mt-1 block">
            Carregando salas...
          </span>
        )}
        {consultaLoading && (
          <span className="text-xs text-blue-500 mt-1 block">
            Carregando reservas...
          </span>
        )}
      </div>

      {/* Calendário */}
      <SimpleCalendar
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-lg border"
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        disabled={!selectedRoom}
      />

      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        {!selectedRoom ? (
          <p>Selecione uma sala para ver as datas com reservas.</p>
        ) : (
          <>
            <p>Datas em azul possuem reservas.</p>
            <p>Clique em uma data para ver os detalhes.</p>
            {datasComReservas.length > 0 && (
              <p className="text-blue-600 font-medium">
                {datasComReservas.length} data(s) com reservas encontrada(s).
              </p>
            )}
          </>
        )}
      </div>
    </SideBar>
  );
};

export default CalendarComponent;
