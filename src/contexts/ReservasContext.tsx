"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import { useReservas } from "@/hooks/useReservas";
import { useAuth } from "@/contexts/AuthContext";

interface ReservasContextType {
  reservas: any[];
  loading: boolean;
  error: string | null;
  createReserva: (data: any) => Promise<any>;
  deleteReserva: (id: string) => Promise<void>;
  refreshReservas: () => Promise<void>;
}

const ReservasContext = createContext<ReservasContextType | undefined>(
  undefined
);

export function ReservasProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const reservasHook = useReservas(user?.matricula);

  const refreshReservas = useCallback(async () => {
    await reservasHook.fetchReservas();
  }, [reservasHook]);

  const createReserva = useCallback(
    async (data: any) => {
      const result = await reservasHook.createReserva(data);
      // O hook já recarrega os dados automaticamente
      return result;
    },
    [reservasHook]
  );

  const deleteReserva = useCallback(
    async (id: string) => {
      await reservasHook.deleteReserva(id);
      // O hook já recarrega os dados automaticamente
    },
    [reservasHook]
  );

  return (
    <ReservasContext.Provider
      value={{
        reservas: reservasHook.reservas,
        loading: reservasHook.loading,
        error: reservasHook.error,
        createReserva,
        deleteReserva,
        refreshReservas,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservasContext() {
  const context = useContext(ReservasContext);
  if (context === undefined) {
    throw new Error(
      "useReservasContext must be used within a ReservasProvider"
    );
  }
  return context;
}
