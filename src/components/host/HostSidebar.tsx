import { LayoutDashboard, PlusCircle, List, User, Settings, LogOut, TreePine, HardHat } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Painel", url: "/hospedeiro", icon: LayoutDashboard },
  { title: "Nova Experiência", url: "/hospedeiro/nova", icon: PlusCircle },
  { title: "Minhas Experiências", url: "/hospedeiro/experiencias", icon: List },
  { title: "Meu Perfil", url: "/hospedeiro/perfil", icon: User },
];

export function HostSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6">
            <a href="/" className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-primary shrink-0" />
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
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
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
