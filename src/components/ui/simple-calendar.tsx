"use client";

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCalendarProps {
  selected?: Date;
  onSelect?: (date?: Date) => void;
  disabled?: boolean;
  modifiers?: {
    hasReservation?: Date[];
  };
  modifiersStyles?: {
    hasReservation?: React.CSSProperties;
  };
  className?: string;
}

export function SimpleCalendar({
  selected,
  onSelect,
  disabled = false,
  modifiers,
  modifiersStyles,
  className = ""
}: SimpleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Dias do mês anterior (para preencher a primeira semana)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Dias do próximo mês (para completar a última semana)
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  }, [currentDate]);

  const isDateWithReservation = (date: Date) => {
    if (!modifiers?.hasReservation) return false;
    return modifiers.hasReservation.some(reservationDate => 
      reservationDate.toDateString() === date.toDateString()
    );
  };

  const isSelectedDate = (date: Date) => {
    if (!selected) return false;
    return selected.toDateString() === date.toDateString();
  };

  const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
    if (disabled || !isCurrentMonth) return;
    onSelect?.(date);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className={`p-4 border rounded-lg bg-white ${className}`}>
      {/* Header com navegação */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={disabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <h2 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={disabled}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map(({ date, isCurrentMonth }, index) => {
          const hasReservation = isDateWithReservation(date);
          const isSelected = isSelectedDate(date);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date, isCurrentMonth)}
              disabled={disabled || !isCurrentMonth}
              className={`
                p-2 text-sm rounded transition-colors
                ${!isCurrentMonth 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-900 hover:bg-gray-100'
                }
                ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${hasReservation && !isSelected ? 'bg-blue-100 text-blue-800 font-semibold' : ''}
              `}
              style={hasReservation && !isSelected ? modifiersStyles?.hasReservation : undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
