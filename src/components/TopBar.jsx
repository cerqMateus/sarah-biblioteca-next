"use client";

import { Bell, User } from "lucide-react";

const TopBar = () => {
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
            <p>20221301 - Mateus Cerqueira</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
