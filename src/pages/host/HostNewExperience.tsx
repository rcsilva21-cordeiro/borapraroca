import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/experiences";
import { ImagePlus, Save } from "lucide-react";

const categoryOptions = categories.filter((c) => c !== "Todas");

export default function HostNewExperience() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Experiência enviada!",
        description: "Sua experiência foi enviada para análise da plataforma.",
      });
      navigate("/hospedeiro/experiencias");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Nova Experiência
        </h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados da sua experiência. Após o envio, ela passará pela curadoria da plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nome da Experiência *</Label>
              <Input
                id="title"
                placeholder="Ex: Sítio Recanto das Águas"
                required
                maxLength={100}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  placeholder="Ex: Cunha, SP"
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                placeholder="Descreva sua experiência em detalhes..."
                rows={5}
                required
                maxLength={2000}
              />
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade (pessoas) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="500"
                  placeholder="12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meio-dia">Meio dia</SelectItem>
                    <SelectItem value="dia-inteiro">Dia inteiro</SelectItem>
                    <SelectItem value="diaria">Diária</SelectItem>
                    <SelectItem value="fim-de-semana">Fim de semana</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="includes">O que está incluído</Label>
              <Textarea
                id="includes"
                placeholder="Ex: Café da manhã, Piscina natural, Wi-Fi, Trilha guiada (um por linha)"
                rows={3}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                Insira um item por linha
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Fotos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <ImagePlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">Clique para enviar fotos</p>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG ou WebP • Máximo 5 fotos • Até 5MB cada
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/hospedeiro/experiencias")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" />
            {isSubmitting ? "Enviando..." : "Enviar para Curadoria"}
          </Button>
        </div>
      </form>
    </div>
  );
}
