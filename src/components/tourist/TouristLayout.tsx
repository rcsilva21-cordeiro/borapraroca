import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TouristSidebar } from "./TouristSidebar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function TouristLayout() {
  const { t } = useTranslation("tourist");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <TouristSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-display text-lg font-semibold text-foreground">
              {t("layout.title")}
            </h1>
            <div className="ml-auto">
              <LanguageSwitcher />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
