import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HostSidebar } from "./HostSidebar";
import { Outlet } from "react-router-dom";

export default function HostLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <HostSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-display text-lg font-semibold text-foreground">
              Painel do Hospedeiro
            </h1>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
