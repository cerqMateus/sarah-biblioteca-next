"use client";

import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";

const RedirectButtons = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center mt-10 gap-3">
      <Button
        className="w-50 h-15 text-xl cursor-pointer"
        onClick={() => redirect("/reservas")}
      >
        Reservar
      </Button>
      <Button
        className="w-50 h-15 text-xl cursor-pointer"
        variant="outline"
        onClick={() => router.push("/consultar")}
      >
        Consultar
      </Button>
    </div>
  );
};

export default RedirectButtons;
