"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { z } from "zod";
import React from "react";
import { useReservas } from "@/hooks/useReservas";
import { useToast } from "@/components/Toast";
import { useSalas } from "@/hooks/useSalas";
import { useAuth } from "@/contexts/AuthContext";
import SalaInfo from "./SalaInfo";

const reservaSchema = z.object({
  local: z.string().min(1, "Local obrigatório"),
  data: z.string().min(1, "Data obrigatória"),
  horaInicio: z.string().min(1, "Hora de início obrigatória"),
  horaFim: z.string().min(1, "Hora de fim obrigatória"),
  finalidade: z.string().min(1, "Finalidade obrigatória"),
});

// Interface estendida para incluir campos de exibição
interface FormDataDisplay extends z.infer<typeof reservaSchema> {
  nome: string;
  matricula: string;
  ramal: string;
}

type FormData = z.infer<typeof reservaSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const NovaReservaDialog = () => {
  const { createReserva } = useReservas();
  const { salas, loading: salasLoading } = useSalas();
  const { user } = useAuth(); // Usuário logado
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    local: "",
    data: "",
    horaInicio: "",
    horaFim: "",
    finalidade: "",
  });
  const [displayData, setDisplayData] = useState<FormDataDisplay>({
    nome: "",
    matricula: "",
    ramal: "",
    local: "",
    data: "",
    horaInicio: "",
    horaFim: "",
    finalidade: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Atualizar dados de exibição quando usuário mudar
  useEffect(() => {
    if (user) {
      setDisplayData((prev) => ({
        ...prev,
        nome: user.name || "",
        matricula: user.matricula?.toString() || "",
        ramal: user.ramal || "",
      }));
    }
  }, [user]);

  // Função para resetar o formulário
  function resetForm() {
    setForm({
      local: "",
      data: "",
      horaInicio: "",
      horaFim: "",
      finalidade: "",
    });
    if (user) {
      setDisplayData({
        nome: user.name || "",
        matricula: user.matricula?.toString() || "",
        ramal: user.ramal || "",
        local: "",
        data: "",
        horaInicio: "",
        horaFim: "",
        finalidade: "",
      });
    }
    setErrors({});
    setLoading(false);
  }

  // Handler para quando o dialog for fechado
  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    // Atualizar dados do formulário principal
    if (name in form) {
      setForm({ ...form, [name]: value });
    }

    // Atualizar dados de exibição
    setDisplayData({ ...displayData, [name]: value });
  }

  async function handleConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const result = reservaSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof FormData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    // Validação adicional de horário
    if (form.horaInicio >= form.horaFim) {
      setErrors({ horaFim: "Hora de fim deve ser posterior à hora de início" });
      setLoading(false);
      return;
    }

    // Validação de data não pode ser anterior a hoje
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split("T")[0]; // Formato YYYY-MM-DD

    if (form.data < hojeStr) {
      setErrors({ data: "Data da reserva não pode ser anterior a hoje" });
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      // Criar reserva com dados do usuário logado
      const reservaData = {
        ...form,
        nome: user?.name || "",
        matricula: user?.matricula?.toString() || "",
        ramal: user?.ramal || "",
      };

      await createReserva(reservaData);

      // Sucesso - fechar dialog (resetForm será chamado automaticamente pelo handleOpenChange)
      setOpen(false);

      // Notificação de sucesso
      addToast("Reserva criada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao enviar reserva:", error);
      setErrors({
        local:
          error instanceof Error
            ? error.message
            : "Erro de conexão. Tente novamente.",
      });
      addToast("Erro ao criar reserva. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">Criar nova reserva</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleConfirm} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              name="nome"
              value={displayData.nome}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700"
              placeholder="Nome será preenchido automaticamente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Matrícula</label>
            <input
              name="matricula"
              value={displayData.matricula}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700"
              placeholder="Matrícula será preenchida automaticamente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ramal</label>
            <input
              name="ramal"
              value={displayData.ramal}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700"
              placeholder="Ramal será preenchido automaticamente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Local</label>
            <select
              name="local"
              value={displayData.local}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white"
              disabled={salasLoading}
            >
              <option value="">Selecione uma sala</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.name}>
                  {sala.name} (Capacidade: {sala.capacity} pessoas)
                </option>
              ))}
            </select>
            {errors.local && (
              <span className="text-xs text-red-500">{errors.local}</span>
            )}
            {salasLoading && (
              <span className="text-xs text-gray-500">Carregando salas...</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              name="data"
              value={displayData.data}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border rounded px-3 py-2"
            />
            {errors.data && (
              <span className="text-xs text-red-500">{errors.data}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Hora de Início
              </label>
              <input
                type="time"
                name="horaInicio"
                value={displayData.horaInicio}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              {errors.horaInicio && (
                <span className="text-xs text-red-500">
                  {errors.horaInicio}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Hora de Fim
              </label>
              <input
                type="time"
                name="horaFim"
                value={displayData.horaFim}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              {errors.horaFim && (
                <span className="text-xs text-red-500">{errors.horaFim}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Finalidade</label>
            <input
              type="text"
              name="finalidade"
              value={displayData.finalidade}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Descrição da finalidade da reserva"
              required
            />
          </div>

          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? "Criando..." : "Confirmar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovaReservaDialog;
