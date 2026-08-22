import { LayoutDashboard, CheckCircle, Users, DollarSign, LogOut, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t } = useTranslation(["admin", "common"]);

  const menuItems = [
    { title: t("sidebar.dashboard"), url: "/admin", icon: LayoutDashboard },
    { title: t("sidebar.experiences"), url: "/admin/experiencias", icon: CheckCircle },
    { title: t("sidebar.newExperience"), url: "/admin/nova-experiencia", icon: PlusCircle },
    { title: t("sidebar.users"), url: "/admin/usuarios", icon: Users },
    { title: t("sidebar.financial"), url: "/admin/financeiro", icon: DollarSign },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6">
            <a href="/" className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary shrink-0" />
              {!collapsed && (
                <span className="font-display text-lg font-bold text-foreground">
                  {t("sidebar.brandPrefix")} <span className="text-primary">BPR</span>
                </span>
              )}
            </a>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/" className="hover:bg-muted/50 text-muted-foreground">
                <LogOut className="mr-2 h-4 w-4 shrink-0" />
                {!collapsed && <span>{t("common:actions.backToSite")}</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
