"use client";

import { Bell, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full h-16 bg-primary flex items-center px-6 text-white font-bold shadow-md">
      <div className="flex w-full h-full">
        <div className="flex items-center w-[70%] h-full">
          <p
            className="text-2xl cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            SARAH
          </p>
        </div>
        <div className="flex items-center justify-end gap-4 w-[30%] h-full">
          <Bell className="cursor-pointer" />
          <User />
          <div className="text-sm">
            <p>Usuário:</p>
            <p>
              {user?.matricula} - {user?.name}
            </p>
          </div>
          <LogOut
            className="cursor-pointer hover:text-gray-200"
            onClick={logout}
            title="Sair"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
