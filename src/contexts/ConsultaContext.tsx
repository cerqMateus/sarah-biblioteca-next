"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  useConsultaReservas,
  ReservaConsulta,
} from "@/hooks/useConsultaReservas";

interface ConsultaContextType {
  selectedRoom: string | null;
  selectedDate: Date | undefined;
  setSelectedRoom: (room: string | null) => void;
  setSelectedDate: (date: Date | undefined) => void;
  reservas: ReservaConsulta[];
  loading: boolean;
  error: string | null;
  getReservasPorData: (date: Date) => ReservaConsulta[];
  getDatasComReservas: () => string[];
}

const ConsultaContext = createContext<ConsultaContextType | undefined>(
  undefined
);

export function ConsultaProvider({ children }: { children: ReactNode }) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const {
    reservas,
    loading,
    error,
    fetchReservasPorSala,
    getReservasPorData,
    getDatasComReservas,
  } = useConsultaReservas();

  const handleSetSelectedRoom = (room: string | null) => {
    setSelectedRoom(room);
    setSelectedDate(undefined); // Reset da data quando muda a sala
    if (room) {
      fetchReservasPorSala(room);
    }
  };

  return (
    <ConsultaContext.Provider
      value={{
        selectedRoom,
        selectedDate,
        setSelectedRoom: handleSetSelectedRoom,
        setSelectedDate,
        reservas,
        loading,
        error,
        getReservasPorData,
        getDatasComReservas,
      }}
    >
      {children}
    </ConsultaContext.Provider>
  );
}

export function useConsultaContext() {
  const context = useContext(ConsultaContext);
  if (context === undefined) {
    throw new Error(
      "useConsultaContext must be used within a ConsultaProvider"
    );
  }
  return context;
}
