"use client";

import { useState } from "react";
import { Reserva } from "@/hooks/useReservas";
import { useReservas } from "@/hooks/useReservas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ReservaDetailsDialogProps {
  reserva: Reserva | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReservaDetailsDialog = ({
  reserva,
  open,
  onOpenChange,
}: ReservaDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const { deleteReserva } = useReservas();

  // Função simples de notificação (substitui useToast temporariamente)
  const showNotification = (message: string, type: "success" | "error") => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(message); // Substituto temporário até implementar toast
  };

  // Função para formatar data e hora
  const formatarDataHora = (dateTimeString: string) => {
    try {
      const data = new Date(dateTimeString);
      return {
        data: format(data, "dd/MM/yyyy", { locale: ptBR }),
        hora: format(data, "HH:mm", { locale: ptBR }),
        dataCompleta: format(data, "EEEE, dd 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        }),
      };
    } catch {
      return {
        data: dateTimeString,
        hora: dateTimeString,
        dataCompleta: dateTimeString,
      };
    }
  };

  // Inicializar descrição quando o dialog abrir
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && reserva) {
      // Description feature removed - setEditedDescription(reserva.description || "");
      setEditedDescription("");
    }
    if (!newOpen) {
      setIsEditing(false);
      setEditedDescription("");
    }
    onOpenChange(newOpen);
  };

  // Salvar descrição editada
  // Note: Update functionality is not implemented yet
  const handleSaveDescription = async () => {
    if (!reserva) return;

    setLoading(true);
    try {
      // TODO: Implement updateReserva in useReservas hook
      // await updateReserva(reserva.id, { description: editedDescription });
      setIsEditing(false);
      showNotification(
        "Funcionalidade de atualização não implementada",
        "error"
      );
    } catch (error) {
      console.error("Erro ao atualizar descrição:", error);
      showNotification(
        "Erro ao atualizar descrição. Tente novamente.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Deletar reserva
  const handleDeleteReserva = async () => {
    if (!reserva) return;

    setLoading(true);
    try {
      await deleteReserva(String(reserva.id));
      setShowDeleteAlert(false);
      onOpenChange(false);
      showNotification("Reserva deletada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao deletar reserva:", error);
      showNotification("Erro ao deletar reserva. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!reserva) return null;

  const dataHora = formatarDataHora(reserva.startDateTime);
  const dataHoraFim = formatarDataHora(reserva.endDateTime);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Detalhes da Reserva</span>
              <button
                onClick={() => setShowDeleteAlert(true)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                title="Deletar reserva"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {reserva.status}
              </span>
            </div>

            {/* Informações da Sala */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {reserva.room.name}
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{dataHora.dataCompleta}</p>
                <p>
                  {dataHora.hora} - {dataHoraFim.hora}
                </p>
              </div>
            </div>

            {/* Informações do Usuário */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg
                    className="w-4 h-4 text-blue-600"
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
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nome</p>
                  <p className="text-sm font-medium">{reserva.user.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Matrícula</p>
                  <p className="text-sm font-medium">
                    {reserva.user.matricula}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <svg
                    className="w-4 h-4 text-purple-600"
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
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ramal</p>
                  <p className="text-sm font-medium">{reserva.user.ramal}</p>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Descrição</h4>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Editar
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Adicione uma descrição para esta reserva..."
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveDescription}
                      disabled={loading}
                    >
                      {loading ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedDescription("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 min-h-[80px] flex items-center">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    Nenhuma descrição adicionada.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para confirmar exclusão */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta reserva? Esta ação não pode
              ser desfeita.
              <br />
              <br />
              <strong>Sala:</strong> {reserva.room.name}
              <br />
              <strong>Data:</strong> {dataHora.data} às {dataHora.hora}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReserva}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReservaDetailsDialog;
