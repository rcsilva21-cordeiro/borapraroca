import { LayoutDashboard, PlusCircle, List, User, LogOut, HardHat, CalendarCheck, DollarSign, CalendarDays } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Painel", url: "/hospedeiro", icon: LayoutDashboard },
  { title: "Reservas", url: "/hospedeiro/reservas", icon: CalendarCheck },
  { title: "Nova Experiência", url: "/hospedeiro/nova", icon: PlusCircle },
  { title: "Minhas Experiências", url: "/hospedeiro/experiencias", icon: List },
  { title: "Disponibilidade", url: "/hospedeiro/disponibilidade", icon: CalendarDays },
  { title: "Financeiro", url: "/hospedeiro/financeiro", icon: DollarSign },
  { title: "Meu Perfil", url: "/hospedeiro/perfil", icon: User },
  { title: "Em Construção", url: "/hospedeiro/construcao", icon: HardHat },
];

export function HostSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
                {!collapsed && <span>Voltar ao site</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
