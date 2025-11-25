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
import { useReservasContext } from "@/contexts/ReservasContext";
import { useToast } from "@/components/Toast";
import { useSalas } from "@/hooks/useSalas";
import { useAuth } from "@/contexts/AuthContext";
import { useAvailabilityCheck } from "@/hooks/useAvailabilityCheck";
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
  const { createReserva } = useReservasContext();
  const { salas, loading: salasLoading } = useSalas();
  const { user } = useAuth(); // Usuário logado
  const { addToast } = useToast();
  const {
    checkAvailability,
    clearResult,
    loading: checkingAvailability,
    result: availabilityResult,
  } = useAvailabilityCheck();
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

  // Função para gerar horários de 15 em 15 minutos
  const generateTimeOptions = () => {
    const times: string[] = [];
    for (let hour = 7; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(timeString);
      }
    }
    return times;
  };

  // Horários de início até 17:00
  const maxStartTime = "17:00";
  const timeOptions = generateTimeOptions().filter(
    (time) => time <= maxStartTime
  );

  // Filtrar opções de hora fim baseadas na hora início
  const getEndTimeOptions = () => {
    // Filtrar para horários até 18:00
    const maxEndTime = "18:00";
    const filteredOptions = timeOptions.filter((time) => time <= maxEndTime);
    if (!form.horaInicio) return filteredOptions;

    const startTimeIndex = filteredOptions.indexOf(form.horaInicio);
    if (startTimeIndex === -1) return filteredOptions;

    // Retornar apenas horários posteriores ao horário de início
    return filteredOptions.slice(startTimeIndex + 1);
  };

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
      clearResult();
    }
  }

  // Verificar disponibilidade quando os campos relevantes mudarem
  useEffect(() => {
    if (form.local && form.data && form.horaInicio && form.horaFim) {
      const timeoutId = setTimeout(() => {
        checkAvailability(form.local, form.data, form.horaInicio, form.horaFim);
      }, 500); // Debounce de 500ms

      return () => clearTimeout(timeoutId);
    } else {
      clearResult();
    }
  }, [
    form.local,
    form.data,
    form.horaInicio,
    form.horaFim,
    checkAvailability,
    clearResult,
  ]);

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

    // Se mudou a hora de início, limpar a hora de fim se ela for inválida
    if (name === "horaInicio") {
      const newForm = { ...form, [name]: value };

      // Se já tem hora fim selecionada, verificar se ainda é válida
      if (form.horaFim && value) {
        const startIndex = timeOptions.indexOf(value);
        const endIndex = timeOptions.indexOf(form.horaFim);

        // Se hora fim não é posterior à nova hora início, limpar
        if (endIndex <= startIndex) {
          newForm.horaFim = "";
        }
      }

      setForm(newForm);
    } else {
      setForm({ ...form, [name]: value });
    }
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

    // Validação de data e hora não pode ser anterior ao momento atual
    const agora = new Date();
    const dataHoraReserva = new Date(`${form.data}T${form.horaInicio}:00`);

    if (dataHoraReserva < agora) {
      setErrors({
        data: "Não é possível fazer reserva para data/hora anterior ao momento atual",
      });
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

      let errorMessage = "Erro de conexão. Tente novamente.";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Se é um erro de conflito (status 409), mostrar no campo de local
        if (error.message.includes("Conflito de horário")) {
          setErrors({
            local: errorMessage,
          });
          addToast("Conflito de horário detectado!", "error");
          return;
        }
      }

      setErrors({
        local: errorMessage,
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
              <select
                name="horaInicio"
                value={form.horaInicio}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white"
              >
                <option value="">Selecione o horário</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
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
              <select
                name="horaFim"
                value={form.horaFim}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white"
                disabled={!form.horaInicio}
              >
                <option value="">
                  {!form.horaInicio
                    ? "Selecione primeiro a hora de início"
                    : "Selecione o horário"}
                </option>
                {getEndTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.horaFim && (
                <span className="text-xs text-red-500">{errors.horaFim}</span>
              )}
            </div>
          </div>

          {/* Status de Disponibilidade */}
          {(checkingAvailability || availabilityResult) && (
            <div className="mt-4">
              {checkingAvailability ? (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-700 text-sm">
                    Verificando disponibilidade...
                  </span>
                </div>
              ) : (
                availabilityResult && (
                  <div
                    className={`p-3 border rounded-md ${
                      availabilityResult.available
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        availabilityResult.available
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {availabilityResult.message}
                    </div>

                    {!availabilityResult.available &&
                      availabilityResult.conflicts && (
                        <div className="mt-2 text-xs text-red-600">
                          <div className="font-medium mb-1">
                            Conflitos encontrados:
                          </div>
                          {availabilityResult.conflicts.map(
                            (conflict, index) => (
                              <div key={index} className="ml-2">
                                • {conflict.startTime} às {conflict.endTime} -{" "}
                                {conflict.userName}
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                )
              )}
            </div>
          )}

          <Button
            type="submit"
            className="mt-4"
            disabled={
              loading ||
              checkingAvailability ||
              (availabilityResult ? !availabilityResult.available : false)
            }
          >
            {loading ? "Criando..." : "Confirmar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovaReservaDialog;
