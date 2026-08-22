import { useTranslation } from "react-i18next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AdminLayout() {
  const { t } = useTranslation("admin");
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-display text-lg font-semibold text-foreground">
              {t("layout.title")}
            </h1>
            <LanguageSwitcher className="ml-auto" />
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
