import TopBar from "../components/TopBar.jsx";
import RedirectButtons from "./components/RedirectButtons.jsx";
import Image from "next/image.js";

function App() {
  return (
    <div>
      <TopBar />
      <div className="flex justify-center items-center mt-20">
        <Image
          src="/sarah-logo.png"
          alt="Logo do Hospital Sarah"
          className="max-w-56"
          width={224}
          height={224}
        />
      </div>
      <div className="flex justify-center items-center text-primary text-6xl font-bold">
        Bem-vindo ao Sistema de Reservas!
      </div>
      <div className="flex justify-center mt-3 items-center mx-72 text-center">
        Aqui você pode reservar espaços da biblioteca, auditório e salas de
        reunião do Hospital Sarah. Ao reservar, você pode escolher a data e o
        horário, além de adicionar uma descrição para a reserva. Você também
        pode visualizar suas reservas pendentes e canceladas.
      </div>
      <RedirectButtons />
    </div>
  );
}

export default App;
