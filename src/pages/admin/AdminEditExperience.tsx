import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useExperienceById, getPhotoUrl } from "@/hooks/useExperiences";
import { useExperienceAgeRanges, useInsertAgeRanges, type AgeRangeInput } from "@/hooks/useAgeRanges";
import AgeRangesEditor from "@/components/host/AgeRangesEditor";
import { ImagePlus, Save, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useQueryClient } from "@tanstack/react-query";

type Category = Database["public"]["Enums"]["experience_category"];
type Duration = Database["public"]["Enums"]["experience_duration"];
type Status = Database["public"]["Enums"]["experience_status"];

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

const statusOptions: { value: Status; label: string }[] = [
  { value: "draft", label: "Rascunho" },
  { value: "pending", label: "Pendente" },
  { value: "active", label: "Ativa" },
  { value: "inactive", label: "Inativa" },
];

export default function AdminEditExperience() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: experience, isLoading } = useExperienceById(id);
  const { data: existingAgeRanges } = useAgeRanges(id);
  const insertAgeRanges = useInsertAgeRanges();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", category: "" as Category | "", location: "", description: "",
    price: "", capacity: "", duration: "" as Duration | "", includes: "",
    status: "" as Status | "",
  });
  const [ageRanges, setAgeRanges] = useState<AgeRangeInput[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ id: string; storage_path: string; position: number }[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (experience && !loaded) {
      setForm({
        title: experience.title,
        category: experience.category,
        location: experience.location,
        description: experience.description,
        price: String(experience.price),
        capacity: String(experience.capacity),
        duration: experience.duration,
        includes: (experience.includes || []).join("\n"),
        status: experience.status,
      });
      setExistingPhotos(
        (experience.experience_photos || [])
          .sort((a, b) => a.position - b.position)
          .map((p) => ({ id: p.id, storage_path: p.storage_path, position: p.position }))
      );
      setLoaded(true);
    }
  }, [experience, loaded]);

  useEffect(() => {
    if (existingAgeRanges && existingAgeRanges.length > 0 && ageRanges.length === 0 && loaded) {
      setAgeRanges(
        existingAgeRanges.map((r) => ({
          label: r.label,
          min_age: r.min_age,
          max_age: r.max_age,
          price: r.price,
        }))
      );
    }
  }, [existingAgeRanges, loaded]);

  const totalPhotos = existingPhotos.filter((p) => !photosToDelete.includes(p.id)).length + newPhotos.length;

  const isFormValid = useMemo(() => {
    return (
      form.title.length >= 10 &&
      form.description.length >= 50 &&
      parseFloat(form.price) > 0 &&
      !!form.category &&
      !!form.location &&
      !!form.capacity &&
      parseInt(form.capacity) > 0 &&
      !!form.duration &&
      !!form.status
    );
  }, [form]);

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - totalPhotos;
    const toAdd = files.slice(0, remaining);
    setNewPhotos((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeNewPhoto = (idx: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingPhoto = (photoId: string) => {
    setPhotosToDelete((prev) => [...prev, photoId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !id || !form.category || !form.duration || !form.status) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("experiences")
        .update({
          title: form.title,
          category: form.category as Category,
          location: form.location,
          description: form.description,
          price: parseFloat(form.price),
          capacity: parseInt(form.capacity),
          duration: form.duration as Duration,
          includes: form.includes.split("\n").filter(Boolean),
          status: form.status as Status,
        })
        .eq("id", id);
      if (error) throw error;

      if (photosToDelete.length > 0) {
        const toRemove = existingPhotos.filter((p) => photosToDelete.includes(p.id));
        if (toRemove.length > 0) {
          await supabase.storage
            .from("experience-photos")
            .remove(toRemove.map((p) => p.storage_path));
          await supabase
            .from("experience_photos")
            .delete()
            .in("id", photosToDelete);
        }
      }

      if (newPhotos.length > 0) {
        const startPosition = existingPhotos.filter((p) => !photosToDelete.includes(p.id)).length;
        await Promise.all(
          newPhotos.map(async (file, i) => {
            const ext = file.name.split(".").pop();
            const path = `${experience?.host_id}/${id}/${startPosition + i}-${Date.now()}.${ext}`;
            const { error: uploadErr } = await supabase.storage
              .from("experience-photos")
              .upload(path, file);
            if (uploadErr) throw uploadErr;
            await supabase.from("experience_photos").insert({
              experience_id: id,
              storage_path: path,
              position: startPosition + i,
            });
          })
        );
      }

      if (ageRanges.length > 0) {
        await supabase.from("experience_age_ranges").delete().eq("experience_id", id);
        await insertAgeRanges.mutateAsync({ experienceId: id, ranges: ageRanges });
      }

      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experience", id] });

      toast({ title: "Experiência atualizada! ✅" });
      navigate("/admin/experiencias");
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Experiência não encontrada.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/experiencias")}>
          Voltar
        </Button>
      </div>
    );
  }

  const visibleExistingPhotos = existingPhotos.filter((p) => !photosToDelete.includes(p.id));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Editar Experiência
        </h2>
        <p className="text-muted-foreground mt-1">
          Edite todos os campos da experiência.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nome da Experiência *</Label>
              <Input id="title" maxLength={100} required
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
                <Input id="location" maxLength={100} required
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea id="description" rows={5} required maxLength={2000}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <p className="text-xs text-muted-foreground">{form.description.length}/2000 (mín. 50)</p>
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
                <Input id="price" type="number" min="0" step="0.01" required
                  value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade *</Label>
                <Input id="capacity" type="number" min="1" max="500" required
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
              <Textarea id="includes" placeholder="Um item por linha" rows={3}
                maxLength={1000} value={form.includes}
                onChange={(e) => setForm({ ...form, includes: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Faixas Etárias</CardTitle>
          </CardHeader>
          <CardContent>
            <AgeRangesEditor ranges={ageRanges} onChange={setAgeRanges} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Fotos ({totalPhotos}/5)</CardTitle>
          </CardHeader>
          <CardContent>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple
              className="hidden" onChange={handlePhotos} />

            {visibleExistingPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {visibleExistingPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-video rounded-lg overflow-hidden group">
                    <img src={getPhotoUrl(photo.storage_path)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingPhoto(photo.id)}
                      className="absolute top-1.5 right-1.5 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {newPreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative aspect-video rounded-lg overflow-hidden group border-2 border-primary/30">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewPhoto(i)}
                      className="absolute top-1.5 right-1.5 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalPhotos < 5 && (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <ImagePlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">Clique para enviar fotos</p>
                <p className="text-sm text-muted-foreground mt-1">
                  JPG, PNG ou WebP • Máximo 5 fotos
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
            {submitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
