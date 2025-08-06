"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";

const LoginPage = () => {
  const [matricula, setMatricula] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!matricula.trim()) {
      setError("Matrícula é obrigatória");
      return;
    }

    setIsLoading(true);
    setError("");

    const success = await login(matricula);

    if (success) {
      router.push("/");
    } else {
      setError("Matrícula não encontrada. Verifique e tente novamente.");
    }

    setIsLoading(false);
  };

  return (
    <PublicOnlyRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">SARAH</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Sistema de Reservas
            </h2>
            <p className="text-gray-600">
              Digite sua matrícula para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="matricula"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Matrícula
              </label>
              <input
                id="matricula"
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">
            <p>Biblioteca SARAH</p>
            <p>Sistema de Agendamento de Recursos</p>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
};

export default LoginPage;
