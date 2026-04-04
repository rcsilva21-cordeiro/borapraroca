import { useState } from "react";
import { Menu, X, TreePine, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, hasRole } = useAuth();

  const navLinks = [
    { label: "Experiências", href: "#experiencias" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Categorias", href: "#categorias" },
    { label: "Seja Hospedeiro", href: "#hospedeiro" },
  ];

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
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{profile?.full_name || user.email}</span>
                </div>
                {hasRole("hospedeiro") && (
                  <Link to="/hospedeiro">
                    <Button variant="outline" size="sm">
                      Painel Hospedeiro
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/entrar">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/entrar">
                  <Button size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                      <User className="h-4 w-4" />
                      <span>{profile?.full_name || user.email}</span>
                    </div>
                    {hasRole("hospedeiro") && (
                      <Link to="/hospedeiro" className="flex-1" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full">
                          Painel Hospedeiro
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" onClick={signOut} className="flex-1">
                      <LogOut className="h-4 w-4 mr-1" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/entrar" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/entrar" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full">
                        Cadastrar
                      </Button>
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
