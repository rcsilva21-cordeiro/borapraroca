import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAllProfiles } from "@/hooks/useAdmin";
import { useInsertAgeRanges, type AgeRangeInput } from "@/hooks/useAgeRanges";
import AgeRangesEditor, { getDefaultRanges } from "@/components/host/AgeRangesEditor";
import { ImagePlus, Save, X, UserPlus, Users as UsersIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

export default function AdminNewExperience() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profiles } = useAllProfiles();
  const insertAgeRanges = useInsertAgeRanges();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hostMode, setHostMode] = useState<"existing" | "new">("existing");
  const [selectedHostId, setSelectedHostId] = useState("");
  const [newHost, setNewHost] = useState({ full_name: "", email: "", phone: "" });

  const [form, setForm] = useState({
    title: "", category: "" as Category | "", location: "", description: "",
    price: "", capacity: "", duration: "" as Duration | "", includes: "",
  });
  const [ageRanges, setAgeRanges] = useState<AgeRangeInput[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    const hostValid = hostMode === "existing" ? !!selectedHostId : (!!newHost.full_name && !!newHost.email);
    return (
      hostValid &&
      form.title.length >= 10 &&
      form.description.length >= 50 &&
      parseFloat(form.price) > 0 &&
      photos.length >= 1 &&
      !!form.category &&
      !!form.location &&
      !!form.capacity &&
      parseInt(form.capacity) > 0 &&
      !!form.duration
    );
  }, [form, photos, hostMode, selectedHostId, newHost]);

  const handlePriceChange = (value: string) => {
    setForm({ ...form, price: value });
    const price = parseFloat(value);
    if (price > 0 && ageRanges.length === 0) {
      setAgeRanges(getDefaultRanges(price));
    }
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 15 - photos.length;
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
    if (!isFormValid || !form.category || !form.duration) return;
    setSubmitting(true);

    try {
      let hostId = selectedHostId;

      // If new host, call edge function
      if (hostMode === "new") {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await supabase.functions.invoke("admin-create-host", {
          body: { full_name: newHost.full_name, email: newHost.email, phone: newHost.phone },
        });
        if (res.error) throw new Error(res.error.message);
        if (res.data?.error) throw new Error(res.data.error);
        hostId = res.data.host_id;
      }

      // Insert experience as admin
      const { data: exp, error } = await supabase
        .from("experiences")
        .insert({
          title: form.title,
          category: form.category as Category,
          location: form.location,
          description: form.description,
          price: parseFloat(form.price),
          capacity: parseInt(form.capacity),
          duration: form.duration as Duration,
          includes: form.includes.split("\n").filter(Boolean),
          status: "active" as any,
          host_id: hostId,
        })
        .select()
        .single();
      if (error) throw error;

      // Upload photos
      if (photos.length > 0) {
        await Promise.all(
          photos.map(async (file, i) => {
            const ext = file.name.split(".").pop();
            const path = `${hostId}/${exp.id}/${i}-${Date.now()}.${ext}`;
            const { error: uploadErr } = await supabase.storage
              .from("experience-photos")
              .upload(path, file);
            if (uploadErr) throw uploadErr;
            await supabase.from("experience_photos").insert({
              experience_id: exp.id,
              storage_path: path,
              position: i,
            });
          })
        );
      }

      // Age ranges
      if (ageRanges.length > 0) {
        await insertAgeRanges.mutateAsync({ experienceId: exp.id, ranges: ageRanges });
      }

      toast({
        title: "Experiência criada! 🎉",
        description: hostMode === "new"
          ? `Experiência criada e conta do hospedeiro ${newHost.email} foi gerada.`
          : "Experiência criada e já está ativa.",
      });
      navigate("/admin/experiencias");
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Criar Experiência (Admin)
        </h2>
        <p className="text-muted-foreground mt-1">
          Crie uma experiência em nome de um hospedeiro existente ou cadastre um novo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Host Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Hospedeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={hostMode} onValueChange={(v) => setHostMode(v as any)} className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="flex items-center gap-1 cursor-pointer">
                  <UsersIcon className="h-4 w-4" /> Usuário existente
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="flex items-center gap-1 cursor-pointer">
                  <UserPlus className="h-4 w-4" /> Novo hospedeiro
                </Label>
              </div>
            </RadioGroup>

            {hostMode === "existing" ? (
              <div className="space-y-2">
                <Label>Selecione o hospedeiro</Label>
                <Select value={selectedHostId} onValueChange={setSelectedHostId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Buscar usuário..." />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles?.map((p) => (
                      <SelectItem key={p.user_id} value={p.user_id}>
                        {p.full_name || "Sem nome"} ({p.phone || "sem telefone"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome completo *</Label>
                  <Input
                    placeholder="Maria da Silva"
                    required
                    value={newHost.full_name}
                    onChange={(e) => setNewHost({ ...newHost, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="maria@email.com"
                    required
                    value={newHost.email}
                    onChange={(e) => setNewHost({ ...newHost, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Telefone</Label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={newHost.phone}
                    onChange={(e) => setNewHost({ ...newHost, phone: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  Uma conta será criada automaticamente. O hospedeiro poderá acessar usando "Esqueci minha senha".
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nome da Experiência *</Label>
              <Input id="title" placeholder="Ex: Sítio Recanto das Águas" required maxLength={100}
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <p className="text-xs text-muted-foreground">{form.title.length}/100 (mín. 10)</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input id="location" placeholder="Ex: Cunha, SP" required maxLength={100}
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea id="description" placeholder="Descreva a experiência em detalhes..." rows={5}
                required maxLength={2000} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <p className="text-xs text-muted-foreground">{form.description.length}/2000 (mín. 50)</p>
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
                <Label htmlFor="price">Preço base / adulto (R$) *</Label>
                <Input id="price" type="number" min="0" step="0.01" placeholder="150.00" required
                  value={form.price} onChange={(e) => handlePriceChange(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade *</Label>
                <Input id="capacity" type="number" min="1" max="500" placeholder="12" required
                  value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Duração *</Label>
                <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v as Duration })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
              <Textarea id="includes" placeholder="Ex: Café da manhã, Piscina natural (um por linha)" rows={3}
                maxLength={1000} value={form.includes}
                onChange={(e) => setForm({ ...form, includes: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {/* Age Ranges */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Faixas Etárias</CardTitle>
          </CardHeader>
          <CardContent>
            <AgeRangesEditor ranges={ageRanges} onChange={setAgeRanges} />
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Fotos *</CardTitle>
          </CardHeader>
          <CardContent>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple
              className="hidden" onChange={handlePhotos} />
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={src} alt="" className="w-full h-full object-cover object-center" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photos.length < 15 && (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <ImagePlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">Clique para enviar fotos</p>
                <p className="text-sm text-muted-foreground mt-1">
                  JPG, PNG ou WebP • Máximo 15 fotos ({photos.length}/15)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/experiencias")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isFormValid || submitting} className="gap-2">
            <Save className="h-4 w-4" />
            {submitting ? "Criando..." : "Criar Experiência"}
          </Button>
        </div>
      </form>
    </div>
  );
}
