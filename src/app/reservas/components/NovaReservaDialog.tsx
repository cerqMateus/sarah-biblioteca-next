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
  nome: z.string().optional(),
  matricula: z.string().optional(),
  ramal: z.string().optional(),
  local: z.string().min(1, "Local obrigatório"),
  data: z.string().min(1, "Data obrigatória"),
  horaInicio: z.string().min(1, "Hora de início obrigatória"),
  horaFim: z.string().min(1, "Hora de fim obrigatória"),
});

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
    nome: user?.name || "",
    matricula: user?.matricula?.toString() || "",
    ramal: user?.ramal || "",
    local: "",
    data: "",
    horaInicio: "",
    horaFim: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Função para resetar o formulário
  function resetForm() {
    setForm({
      nome: user?.name || "",
      matricula: user?.matricula?.toString() || "",
      ramal: user?.ramal || "",
      local: "",
      data: "",
      horaInicio: "",
      horaFim: "",
    });
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

  // Atualizar formulário quando dados do usuário estiverem disponíveis
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nome: user.name || "",
        matricula: user.matricula?.toString() || "",
        ramal: user.ramal || "",
      }));
    }
  }, [user]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
      // Criar reserva com dados do formulário (já contém dados do usuário)
      const reservaData = {
        ...form,
        matricula: form.matricula || user?.matricula?.toString() || "",
        nome: form.nome || user?.name || "",
        ramal: form.ramal || user?.ramal || "",
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
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-100"
              disabled
            />
            {errors.nome && (
              <span className="text-xs text-red-500">{errors.nome}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Matrícula</label>
            <input
              type="text"
              name="matricula"
              value={form.matricula}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-100"
              disabled
            />
            {errors.matricula && (
              <span className="text-xs text-red-500">{errors.matricula}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ramal</label>
            <input
              type="text"
              name="ramal"
              value={form.ramal}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-gray-100"
              disabled
            />
            {errors.ramal && (
              <span className="text-xs text-red-500">{errors.ramal}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Local</label>
            <select
              name="local"
              value={form.local}
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
            <SalaInfo salaNome={form.local} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
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
                value={form.horaInicio}
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
                value={form.horaFim}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              {errors.horaFim && (
                <span className="text-xs text-red-500">{errors.horaFim}</span>
              )}
            </div>
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
