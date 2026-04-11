import { TreePine, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TreePine className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold text-background">
                Bora<span className="text-primary">PraRoça</span>
              </span>
            </div>
            <p className="text-background/50 text-sm leading-relaxed mb-4">
              Conectando turistas a experiências rurais autênticas em todo o Brasil.
            </p>
            
              href="https://instagram.com/boraparoca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-background/50 hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-sm">@boraparoca</span>
            </a>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Experiências</h4>
            <ul className="space-y-2 text-sm text-background/50">
              <li><a href="#" className="hover:text-background/80 transition-colors">Hospedagem Rural</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Trilhas & Ecoturismo</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Gastronomia</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Bike Tour</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-background/50">
              <li><a href="#" className="hover:text-background/80 transition-colors">Como Funciona</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Seja Hospedeiro</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-background/50">
              <li><a href="#" className="hover:text-background/80 transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-background/80 transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 pt-6 text-center text-sm text-background/40">
          © 2026 BoraPraRoça. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
