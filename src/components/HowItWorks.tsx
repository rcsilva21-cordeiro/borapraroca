import { Search, CalendarCheck, Smile } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Explore",
    description: "Navegue por centenas de experiências rurais autênticas em todo o Brasil.",
  },
  {
    icon: <CalendarCheck className="h-8 w-8" />,
    title: "Reserve",
    description: "Escolha a data, o número de pessoas e faça sua reserva com segurança.",
  },
  {
    icon: <Smile className="h-8 w-8" />,
    title: "Viva",
    description: "Desconecte do cotidiano e viva momentos inesquecíveis no campo.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-gradient-warm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Como funciona
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Em três passos simples, você sai da cidade e mergulha na vida rural.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5">
                {step.icon}
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
