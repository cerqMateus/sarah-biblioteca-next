"use client";

import { useAutoCleanupExpiredReservations } from "@/hooks/useAutoCleanupExpiredReservations";

export function AutoCleanupProvider() {
  useAutoCleanupExpiredReservations();
  return null; // Este componente não renderiza nada visível
}
