import { HardHat, CheckCircle, ArrowRight, Lightbulb, Camera, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const steps = [
  {
    icon: Lightbulb,
    title: "Diagnóstico da Propriedade",
    description: "Nossa equipe visita sua propriedade e identifica o potencial turístico: paisagens, atividades, gastronomia local e infraestrutura existente.",
  },
  {
    icon: FileText,
    title: "Plano de Experiência",
    description: "Criamos juntos um roteiro personalizado, definindo atividades, público-alvo, precificação e melhorias necessárias.",
  },
  {
    icon: Camera,
    title: "Produção Visual",
    description: "Realizamos fotos e vídeos profissionais da propriedade para criar um perfil atrativo na plataforma.",
  },
  {
    icon: Star,
    title: "Lançamento e Acompanhamento",
    description: "Publicamos sua experiência e acompanhamos as primeiras reservas, ajustando detalhes para garantir avaliações positivas.",
  },
];

const benefits = [
  "Consultoria personalizada sem custo inicial",
  "Apoio na adequação de infraestrutura básica",
  "Material fotográfico profissional incluso",
  "Treinamento para recepção de turistas",
  "Acompanhamento nos 3 primeiros meses",
  "Visibilidade na plataforma BoraPraRoça",
];

export default function HostExperienceBuilding() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-accent/20">
            <HardHat className="h-6 w-6 text-accent-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Experiência em Construção
          </h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Tem uma propriedade rural mas não sabe por onde começar? Nossa equipe de curadoria te ajuda a transformar seu espaço em uma experiência inesquecível.
        </p>
      </div>

      {/* Steps */}
      <div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">Como funciona</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <Card key={i} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {i + 1}
                  </div>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">O que você ganha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">{b}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-foreground">Pronto para começar?</h3>
              <p className="text-sm text-muted-foreground">Preencha o formulário e entraremos em contato em até 48h.</p>
            </div>
            <Button
              onClick={() => toast.success("Solicitação enviada! Entraremos em contato em breve.")}
              className="gap-2"
            >
              Solicitar Assessoria <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
