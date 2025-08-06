import ListaReservas from "./ListaReservas";

const ReservaSidebarContent = () => {
  return (
    <div className="space-y-4">
      <div className="text-sm">
        <p>Faça sua reserva de salas de forma rápida e fácil.</p>
        <ul className="mt-4 list-disc list-inside text-xs text-muted-foreground">
          <li>Preencha seus dados.</li>
          <li>Selecione o local desejado.</li>
          <li>Escolha a data e horário.</li>
          <li>Confirme sua reserva.</li>
        </ul>
      </div>

      <div className="border-t pt-4">
        <ListaReservas />
      </div>
    </div>
  );
};

export default ReservaSidebarContent;
