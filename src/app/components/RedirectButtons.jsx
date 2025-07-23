"use client";

import { Button } from "@/components/ui/button";

const RedirectButtons = () => {
  return (
    <div className="flex justify-center items-center mt-10 gap-3">
      <Button
        className="w-50 h-15 text-xl cursor-pointer"
        onClick={() => (window.location.href = "/reservar")}
      >
        Reservar
      </Button>
      <Button
        className="w-50 h-15 text-xl cursor-pointer"
        variant="outline"
        onClick={() => (window.location.href = "/consultar")}
      >
        Consultar
      </Button>
    </div>
  );
};

export default RedirectButtons;
