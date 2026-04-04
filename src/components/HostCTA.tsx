import { ArrowRight, Home, TrendingUp, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  { icon: <Home className="h-5 w-5" />, text: "Cadastre sua propriedade ou atividade gratuitamente" },
  { icon: <TrendingUp className="h-5 w-5" />, text: "Aumente sua visibilidade e faturamento" },
  { icon: <Shield className="h-5 w-5" />, text: "Curadoria e suporte da plataforma" },
];

const HostCTA = () => {
  return (
    <section id="hospedeiro" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-primary rounded-2xl p-8 md:p-14 lg:p-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Tem um sítio, fazenda ou experiência rural?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg">
              Torne-se um Hospedeiro e compartilhe o melhor do campo com turistas de todo o Brasil.
            </p>
            <div className="flex flex-col gap-4 mb-8">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 text-primary-foreground/90">
                  <div className="text-earth-gold">{b.icon}</div>
                  <span className="text-sm">{b.text}</span>
                </div>
              ))}
            </div>
            <Link to="/hospedeiro">
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 font-semibold"
              >
                Quero ser Hospedeiro
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-primary-foreground/60 text-sm mt-6">
              Tem um sítio ou fazenda e não sabe como começar no turismo rural? A gente te ajuda!
            </p>
            <Link to="/hospedeiro/construcao" className="mt-2 inline-block">
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 font-semibold"
              >
                <HelpCircle className="h-4 w-4" />
                Preciso de ajuda com minha propriedade
              </Button>
            </Link>
          </div>
          <div className="flex-1 hidden lg:block">
            <div className="bg-primary-foreground/10 rounded-xl p-8 text-center">
              <p className="font-display text-5xl font-bold text-primary-foreground mb-2">500+</p>
              <p className="text-primary-foreground/70 text-sm">hospedeiros já cadastrados</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-display text-2xl font-bold text-earth-gold">4.8</p>
                  <p className="text-primary-foreground/60 text-xs">avaliação média</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-earth-gold">12k+</p>
                  <p className="text-primary-foreground/60 text-xs">experiências realizadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostCTA;
