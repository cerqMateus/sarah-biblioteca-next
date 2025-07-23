import TopBar from "@/components/TopBar";
import SideBar from "../components/SideBar";
import NovaReservaDialog from "./components/NovaReservaDialog";
import ReservaSidebarContent from "./components/ReservaSidebarContent";
import ReservaFormContent from "./components/ReservaFormContent";

const ReservePage = () => {
  return (
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
  );
};

export default ReservePage;
