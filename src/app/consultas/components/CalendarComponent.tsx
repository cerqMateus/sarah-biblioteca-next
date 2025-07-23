"use client";

import SideBar from "@/app/components/SideBar";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const CalendarComponent = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <>
      <SideBar title="Consulta">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />
        <div className="mt-6 text-xs text-muted-foreground">
          Selecione uma data para consultar a disponibilidade dos livros.
        </div>
      </SideBar>
    </>
  );
};

export default CalendarComponent;
