import { useState } from "react";
import { HardHat, CheckCircle, ArrowRight, Lightbulb, Camera, FileText, Star, Search, Upload, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const steps = [
  {
    icon: Search,
    title: "Raio-X da Propriedade",
    description: "Fazemos uma análise inicial gratuita do potencial turístico do seu espaço — paisagens, atividades possíveis, gastronomia e infraestrutura.",
    badge: "Gratuito",
  },
  {
    icon: Lightbulb,
    title: "Plano de Experiência",
    description: "Criamos juntos um roteiro personalizado com atividades, público-alvo, precificação e melhorias necessárias para receber turistas.",
    badge: null,
  },
  {
    icon: Camera,
    title: "Produção Visual",
    description: "Fotos e vídeos profissionais da propriedade para criar um perfil atrativo e convidativo na plataforma.",
    badge: null,
  },
  {
    icon: Star,
    title: "Lançamento e Acompanhamento",
    description: "Publicamos sua experiência e acompanhamos as primeiras reservas, ajustando detalhes para garantir o sucesso.",
    badge: null,
  },
];

const benefits = [
  "Raio-X inicial da propriedade sem custo",
  "Investimento acessível e facilitado para implantação",
  "Apoio na adequação de infraestrutura básica",
  "Material fotográfico profissional",
  "Treinamento para recepção de turistas",
  "Acompanhamento nos 3 primeiros meses",
  "Visibilidade na plataforma BoraPraRoça",
];

export default function HostExperienceBuilding() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyName: "",
    location: "",
    size: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.location) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    toast.success("Solicitação de Raio-X enviada! Entraremos em contato em até 48h.");
    setShowForm(false);
    setFormData({ name: "", email: "", phone: "", propertyName: "", location: "", size: "", description: "" });
  };

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
          Tem uma propriedade rural mas não sabe por onde começar? Fazemos um Raio-X gratuito do seu espaço e te ajudamos a criar sua primeira experiência turística.
        </p>
      </div>

      {/* Raio-X CTA highlight */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10 shrink-0 mt-0.5">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">Raio-X Gratuito da sua Propriedade</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Analisamos o potencial turístico do seu espaço sem nenhum custo. A partir do diagnóstico, você decide se quer seguir com o projeto.
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2 shrink-0">
              Quero o Raio-X agora <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Formulário de Assessoria — Raio-X
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para solicitar a análise gratuita da sua propriedade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                  <Input id="phone" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="(11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Nome da propriedade</Label>
                  <Input id="propertyName" value={formData.propertyName} onChange={e => setFormData(p => ({ ...p, propertyName: e.target.value }))} placeholder="Sítio, Fazenda, Chácara..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localização (cidade/estado) *</Label>
                  <Input id="location" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="Ex: Atibaia - SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Tamanho aproximado</Label>
                  <Input id="size" value={formData.size} onChange={e => setFormData(p => ({ ...p, size: e.target.value }))} placeholder="Ex: 5 hectares" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Conte um pouco sobre sua propriedade</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Descreva o que tem no local: mata, rio, pomar, criação de animais, estruturas existentes..." rows={4} />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Tem fotos do local?</p>
                  <p className="text-xs text-muted-foreground">Em breve você poderá enviar fotos. Por enquanto, descreva o máximo possível no campo acima.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit" className="gap-2">
                  Enviar solicitação <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      <div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">Como funciona</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <Card key={i} className="border-border relative">
              {step.badge && (
                <span className="absolute top-3 right-3 bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                  {step.badge}
                </span>
              )}
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
        <p className="text-xs text-muted-foreground mt-3">
          * A etapa 1 (Raio-X) é gratuita. As etapas seguintes possuem investimento acessível e facilitado para implantar sua primeira experiência.
        </p>
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
    </div>
  );
}
