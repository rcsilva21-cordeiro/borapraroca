import { LayoutDashboard, CalendarCheck, Heart, DollarSign, LogOut, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useTranslation } from "react-i18next";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

export function TouristSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t } = useTranslation("tourist");

  const menuItems = [
    { title: t("sidebar.dashboard"), url: "/turista", icon: LayoutDashboard },
    { title: t("sidebar.bookings"), url: "/turista/reservas", icon: CalendarCheck },
    { title: t("sidebar.favorites"), url: "/turista/favoritos", icon: Heart },
    { title: t("sidebar.financial"), url: "/turista/financeiro", icon: DollarSign },
    { title: t("sidebar.profile"), url: "/turista/perfil", icon: User },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6">
            <a href="/" className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary shrink-0" />
              {!collapsed && (
                <span className="font-display text-lg font-bold text-foreground">
                  Bora<span className="text-primary">PraRoça</span>
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
                {!collapsed && <span>{t("sidebar.backToSite")}</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
