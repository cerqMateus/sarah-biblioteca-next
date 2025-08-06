"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { z } from "zod";
import React from "react";
import { useReservas } from "@/hooks/useReservas";
import { useToast } from "@/components/Toast";

const reservaSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  matricula: z.string().min(1, "Matrícula obrigatória"),
  ramal: z.string().min(1, "Ramal obrigatório"),
  local: z.string().min(1, "Local obrigatório"),
  data: z.string().min(1, "Data obrigatória"),
  horaInicio: z.string().min(1, "Hora de início obrigatória"),
  horaFim: z.string().min(1, "Hora de fim obrigatória"),
});

type FormData = z.infer<typeof reservaSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const NovaReservaDialog = () => {
  const { createReserva } = useReservas();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    nome: "",
    matricula: "",
    ramal: "",
    local: "",
    data: "",
    horaInicio: "",
    horaFim: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    setErrors({});

    try {
      await createReserva(form);

      // Sucesso - fechar dialog e limpar formulário
      setOpen(false);
      setForm({
        nome: "",
        matricula: "",
        ramal: "",
        local: "",
        data: "",
        horaInicio: "",
        horaFim: "",
      });

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Criar nova reserva</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleConfirm} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.nome && (
              <span className="text-xs text-red-500">{errors.nome}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Matrícula</label>
            <input
              name="matricula"
              value={form.matricula}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.matricula && (
              <span className="text-xs text-red-500">{errors.matricula}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ramal</label>
            <input
              name="ramal"
              value={form.ramal}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.ramal && (
              <span className="text-xs text-red-500">{errors.ramal}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Local</label>
            <input
              name="local"
              value={form.local}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.local && (
              <span className="text-xs text-red-500">{errors.local}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
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
