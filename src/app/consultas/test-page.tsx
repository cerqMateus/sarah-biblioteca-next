"use client";

import { useState, useEffect } from "react";

interface Sala {
  id: number;
  name: string;
  capacity: number;
}

interface Reserva {
  id: number;
  startDateTime: string;
  endDateTime: string;
  user: {
    name: string;
    matricula: number;
    ramal: string;
  };
  room: {
    name: string;
  };
}

export default function TestConsultasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Testar carregamento de salas
    fetch("/api/salas")
      .then((res) => res.json())
      .then((data) => {
        console.log("Salas carregadas:", data);
        setSalas(data);
      })
      .catch((err) => console.error("Erro ao carregar salas:", err));
  }, []);

  const buscarReservas = async (roomName: string) => {
    setLoading(true);
    try {
      const url = `/api/reservas/consulta?room=${encodeURIComponent(roomName)}`;
      console.log("Buscando reservas em:", url);
      const response = await fetch(url);
      const data = await response.json();
      console.log("Reservas encontradas:", data);
      setReservas(data);
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste Consultas</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Salas disponíveis:</h2>
        <div className="space-y-2">
          {salas.map((sala) => (
            <button
              key={sala.id}
              onClick={() => buscarReservas(sala.name)}
              className="block w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded"
            >
              {sala.name} (Cap. {sala.capacity})
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">
          Reservas {loading && "(Carregando...)"}:
        </h2>
        <div className="space-y-2">
          {reservas.map((reserva) => (
            <div key={reserva.id} className="p-4 bg-gray-100 rounded">
              <h3 className="font-semibold">{reserva.user.name}</h3>
              <p>Matrícula: {reserva.user.matricula}</p>
              <p>Sala: {reserva.room.name}</p>
              <p>
                Data:{" "}
                {new Date(reserva.startDateTime).toLocaleDateString("pt-BR")}
              </p>
              <p>
                Horário:{" "}
                {new Date(reserva.startDateTime).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(reserva.endDateTime).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
          {reservas.length === 0 && !loading && (
            <p className="text-gray-500">Nenhuma reserva encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
}
