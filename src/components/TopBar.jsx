"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const TopBar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

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
          <div className="relative" ref={menuRef}>
            <User
              className="cursor-pointer hover:text-gray-200"
              onClick={handleUserClick}
              title="Menu do usuário"
            />
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white text-black shadow-lg rounded-md border min-w-[120px] z-50">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 rounded-md"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            )}
          </div>
          <div className="text-sm">
            <p>Usuário:</p>
            <p>
              {user?.matricula} - {user?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
