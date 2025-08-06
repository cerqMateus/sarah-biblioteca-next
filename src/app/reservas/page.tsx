import TopBar from "@/components/TopBar";
import SideBar from "../components/SideBar";
import ReservaSidebarContent from "./components/ReservaSidebarContent";
import ReservaFormContent from "./components/ReservaFormContent";
import ProtectedRoute from "@/components/ProtectedRoute";
import NovaReservaDialog from "./components/NovaReservaDialog";

const ReservePage = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex flex-1 bg-background">
          <div className="w-1/4 min-w-[260px] max-w-xs">
            <SideBar title="Reservas" bottomButton={<NovaReservaDialog />}>
              <ReservaSidebarContent />
            </SideBar>
          </div>
          <ReservaFormContent />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReservePage;
