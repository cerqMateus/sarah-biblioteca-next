"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useReservasContext } from "@/contexts/ReservasContext";
import { useToast } from "@/components/Toast";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

interface ReservaCardProps {
  reserva: {
    id: number;
    startDateTime: string;
    endDateTime: string;
    status: string;
    user: {
      name: string;
      matricula: number;
      ramal: string;
    };
    room: {
      name: string;
    };
    createdAt?: string;
  };
}

const ReservaCard = ({ reserva }: ReservaCardProps) => {
  const { deleteReserva } = useReservasContext();
  const { addToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReserva(reserva.id.toString());
      addToast("Reserva cancelada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      addToast("Erro ao cancelar reserva. Tente novamente.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const isReservaPassed = () => {
    const now = new Date();
    const endDate = new Date(reserva.endDateTime);
    return endDate < now;
  };

  const startFormatted = formatDateTime(reserva.startDateTime);
  const endFormatted = formatDateTime(reserva.endDateTime);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {reserva.room.name}
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Data:</span> {startFormatted.date}
            </p>
            <p>
              <span className="font-medium">Horário:</span>{" "}
              {startFormatted.time} às {endFormatted.time}
            </p>
            <p>
              <span className="font-medium">Ramal:</span> {reserva.user.ramal}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium mb-3 ${
              isReservaPassed()
                ? "bg-gray-100 text-gray-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isReservaPassed() ? "Concluída" : "Ativa"}
          </div>

          {!isReservaPassed() && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar esta reserva?
                    <br />
                    <strong>{reserva.room.name}</strong> - {startFormatted.date}{" "}
                    das {startFormatted.time} às {endFormatted.time}
                    <br />
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? "Cancelando..." : "Confirmar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {reserva.createdAt && (
        <div className="text-xs text-gray-400 pt-3 border-t">
          Criada em: {formatDateTime(reserva.createdAt).date}
        </div>
      )}
    </div>
  );
};

export default ReservaCard;
