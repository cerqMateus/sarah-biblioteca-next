import TopBar from "@/components/TopBar";
import CalendarComponent from "./components/CalendarComponent";
import ProtectedRoute from "@/components/ProtectedRoute";

const ConsultPage = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex flex-1 bg-background">
          <div className="w-1/4 min-w-[260px] max-w-xs">
            <CalendarComponent />
          </div>
          <div className="w-3/4 flex-1 p-8 overflow-y-auto">
            {/* Conteúdo principal da consulta */}
            <div className="text-lg font-semibold text-primary mb-4">
              Resultados da Consulta
            </div>
            {/* Aqui podem ser exibidos os resultados da consulta futuramente */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ConsultPage;
