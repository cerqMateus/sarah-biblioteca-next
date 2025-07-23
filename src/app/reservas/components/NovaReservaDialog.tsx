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

const reservaSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  matricula: z.string().min(1, "Matrícula obrigatória"),
  ramal: z.string().min(1, "Ramal obrigatório"),
  local: z.string().min(1, "Local obrigatório"),
  data: z.string().min(1, "Data obrigatória"),
});

type FormData = z.infer<typeof reservaSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const NovaReservaDialog = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>({
    nome: "",
    matricula: "",
    ramal: "",
    local: "",
    data: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = reservaSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof FormData;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    // Aqui você pode enviar os dados da reserva
    setOpen(false);
    setForm({ nome: "", matricula: "", ramal: "", local: "", data: "" });
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
          <Button type="submit" className="mt-2">
            Confirmar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovaReservaDialog;
