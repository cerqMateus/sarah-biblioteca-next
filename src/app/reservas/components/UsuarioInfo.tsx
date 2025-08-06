"use client";

import { Usuario } from "@/hooks/useUsuario";

interface UsuarioInfoProps {
  matricula: string;
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
}

const UsuarioInfo = ({
  matricula,
  usuario,
  loading,
  error,
}: UsuarioInfoProps) => {
  if (!matricula || matricula.length < 3) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">Buscando usuário...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-xs text-red-800">{error}</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg max-h-20 overflow-y-auto">
      <h4 className="font-medium text-green-900 text-sm mb-1">
        ✓ Usuário encontrado
      </h4>
      <div className="text-xs text-green-800 space-y-1">
        <p>
          <strong>Nome:</strong> {usuario.name}
        </p>
        <p>
          <strong>Setor:</strong> {usuario.sector}
        </p>
        <p>
          <strong>Ramal:</strong> {usuario.ramal}
        </p>
      </div>
    </div>
  );
};

export default UsuarioInfo;
