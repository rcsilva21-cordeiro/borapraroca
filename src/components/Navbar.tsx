import { useState } from "react";
import { Menu, X, TreePine, LogOut, User, ChevronDown, Shield, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Experiências", href: "#experiencias" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Categorias", href: "#categorias" },
    { label: "Seja Hospedeiro", href: "#hospedeiro" },
  ];

  const profileLabel = (role: string) => {
    if (role === "admin") return "Admin";
    if (role === "hospedeiro") return "Hospedeiro";
    return "Turista";
  };
  const profileIcon = (role: string) => {
    if (role === "admin") return Shield;
    if (role === "hospedeiro") return Briefcase;
    return Home;
  };
  const profileRoute = (role: string) => {
    if (role === "admin") return "/admin";
    if (role === "hospedeiro") return "/hospedeiro";
    return "/turista";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/" className="flex items-center gap-2">
            <TreePine className="h-7 w-7 text-primary" />
            <span className="font-display text-xl lg:text-2xl font-bold text-foreground">
              Bora<span className="text-primary">PraRoça</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-[120px] truncate">{profile?.full_name || user.email}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Acessar como</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Always show turista */}
                    <DropdownMenuItem onClick={() => navigate("/turista")} className="gap-2 cursor-pointer">
                      <Home className="h-4 w-4" /> Turista
                    </DropdownMenuItem>
                    {hasRole("hospedeiro") && (
                      <DropdownMenuItem onClick={() => navigate("/hospedeiro")} className="gap-2 cursor-pointer">
                        <Briefcase className="h-4 w-4" /> Hospedeiro
                      </DropdownMenuItem>
                    )}
                    {hasRole("admin") && (
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" /> Administrador
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="gap-2 cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/entrar">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link to="/entrar">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                      <User className="h-4 w-4" />
                      <span>{profile?.full_name || user.email}</span>
                    </div>
                    <Link to="/turista" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2"><Home className="h-4 w-4" />Minha Área</Button>
                    </Link>
                    {hasRole("hospedeiro") && (
                      <Link to="/hospedeiro" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2"><Briefcase className="h-4 w-4" />Painel Hospedeiro</Button>
                      </Link>
                    )}
                    {hasRole("admin") && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2"><Shield className="h-4 w-4" />Admin</Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" onClick={signOut} className="w-full gap-2">
                      <LogOut className="h-4 w-4" />Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/entrar" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">Entrar</Button>
                    </Link>
                    <Link to="/entrar" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full">Cadastrar</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
