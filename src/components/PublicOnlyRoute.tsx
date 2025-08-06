"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não está carregando e há um usuário logado, redirecionar para home
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se há usuário logado, não renderizar nada (redirecionamento já foi feito)
  if (user) {
    return null;
  }

  // Se não há usuário, renderizar o conteúdo público (página de login)
  return <>{children}</>;
};

export default PublicOnlyRoute;
