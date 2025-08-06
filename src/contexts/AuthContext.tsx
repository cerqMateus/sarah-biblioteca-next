"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  matricula: number;
  name: string;
  ramal: string;
}

interface AuthContextType {
  user: User | null;
  login: (matricula: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há uma sessão ativa no localStorage
    const storedUser = localStorage.getItem("sarah-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (matricula: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Buscar usuário pela matrícula
      const response = await fetch(`/api/usuarios?matricula=${matricula}`);

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();

      if (userData) {
        setUser(userData);
        localStorage.setItem("sarah-user", JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sarah-user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
