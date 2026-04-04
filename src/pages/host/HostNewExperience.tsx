import { useState, useRef } from "react";
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
import { useCreateExperience } from "@/hooks/useExperiences";
import { useInsertAgeRanges, type AgeRangeInput } from "@/hooks/useAgeRanges";
import AgeRangesEditor, { getDefaultRanges } from "@/components/host/AgeRangesEditor";
import { ImagePlus, Save, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Enums"]["experience_category"];
type Duration = Database["public"]["Enums"]["experience_duration"];

const categoryOptions: Category[] = [
  "Hospedagem", "Trilhas", "Gastronomia", "Bike Tour", "Ecoturismo", "Camping", "Cavalgada",
];

const durationOptions: { value: Duration; label: string }[] = [
  { value: "meio-dia", label: "Meio dia" },
  { value: "dia-inteiro", label: "Dia inteiro" },
  { value: "diaria", label: "Diária" },
  { value: "fim-de-semana", label: "Fim de semana" },
  { value: "personalizado", label: "Personalizado" },
];

export default function HostNewExperience() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createExperience = useCreateExperience();
  const insertAgeRanges = useInsertAgeRanges();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    category: "" as Category | "",
    location: "",
    description: "",
    price: "",
    capacity: "",
    duration: "" as Duration | "",
    includes: "",
  });
  const [ageRanges, setAgeRanges] = useState<AgeRangeInput[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // When price changes, auto-populate default ranges if empty
  const handlePriceChange = (value: string) => {
    setForm({ ...form, price: value });
    const price = parseFloat(value);
    if (price > 0 && ageRanges.length === 0) {
      setAgeRanges(getDefaultRanges(price));
    }
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);
    setPhotos((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.duration) return;

    try {
      const exp = await createExperience.mutateAsync({
        title: form.title,
        category: form.category as Category,
        location: form.location,
        description: form.description,
        price: parseFloat(form.price),
        capacity: parseInt(form.capacity),
        duration: form.duration as Duration,
        includes: form.includes.split("\n").filter(Boolean),
        status: "pending",
        photos,
      });

      // Save age ranges
      if (ageRanges.length > 0) {
        await insertAgeRanges.mutateAsync({
          experienceId: exp.id,
          ranges: ageRanges,
        });
      }

      toast({
        title: "Experiência enviada! 🎉",
        description: "Sua experiência foi enviada para análise da plataforma.",
      });
      navigate("/hospedeiro/experiencias");
    } catch (error: any) {
      toast({
        title: "Erro ao criar experiência",
        description: error.message,
        variant: "destructive",
      });
    }
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
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v as Category })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
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
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço base / adulto (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                  required
                  value={form.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="500"
                  placeholder="12"
                  required
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Duração *</Label>
                <Select
                  value={form.duration}
                  onValueChange={(v) => setForm({ ...form, duration: v as Duration })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="includes">O que está incluído</Label>
              <Textarea
                id="includes"
                placeholder="Ex: Café da manhã, Piscina natural, Wi-Fi (um por linha)"
                rows={3}
                maxLength={1000}
                value={form.includes}
                onChange={(e) => setForm({ ...form, includes: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Insira um item por linha</p>
            </div>
          </CardContent>
        </Card>

        {/* Age Ranges */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Crianças e Faixas Etárias</CardTitle>
          </CardHeader>
          <CardContent>
            <AgeRangesEditor ranges={ageRanges} onChange={setAgeRanges} />
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Fotos</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handlePhotos}
            />

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 5 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                <ImagePlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">Clique para enviar fotos</p>
                <p className="text-sm text-muted-foreground mt-1">
                  JPG, PNG ou WebP • Máximo 5 fotos • Até 5MB cada ({photos.length}/5)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/hospedeiro/experiencias")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={createExperience.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {createExperience.isPending ? "Enviando..." : "Enviar para Curadoria"}
          </Button>
        </div>
      </form>
    </div>
  );
}
