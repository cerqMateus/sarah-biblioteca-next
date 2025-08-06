import TopBar from "@/components/TopBar";
import CalendarComponent from "./components/CalendarComponent";
import ConsultaReservas from "./components/ConsultaReservas";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ConsultaProvider } from "@/contexts/ConsultaContext";

const ConsultPage = () => {
  return (
    <ProtectedRoute>
      <ConsultaProvider>
        <div className="flex flex-col h-screen">
          <TopBar />
          <div className="flex flex-1 bg-background">
            <div className="w-1/4 min-w-[260px] max-w-xs">
              <CalendarComponent />
            </div>
            <ConsultaReservas />
          </div>
        </div>
      </ConsultaProvider>
    </ProtectedRoute>
  );
};

export default ConsultPage;
