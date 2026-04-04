import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
type ExperienceInsert = Database["public"]["Tables"]["experiences"]["Insert"];
type ExperienceUpdate = Database["public"]["Tables"]["experiences"]["Update"];
type PhotoRow = Database["public"]["Tables"]["experience_photos"]["Row"];

export type ExperienceWithPhotos = ExperienceRow & { experience_photos: PhotoRow[] };

export function useHostExperiences() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["host-experiences", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*, experience_photos(*)")
        .eq("host_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ExperienceWithPhotos[];
    },
  });
}

export function useActiveExperiences() {
  return useQuery({
    queryKey: ["active-experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*, experience_photos(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ExperienceWithPhotos[];
    },
  });
}

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<ExperienceInsert, "host_id"> & { photos: File[] }) => {
      const { photos, ...experienceData } = input;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Insert experience
      const { data: exp, error } = await supabase
        .from("experiences")
        .insert({ ...experienceData, host_id: user.id })
        .select()
        .single();
      if (error) throw error;

      // Upload photos
      if (photos.length > 0) {
        await Promise.all(
          photos.map(async (file, i) => {
            const ext = file.name.split(".").pop();
            const path = `${user.id}/${exp.id}/${i}-${Date.now()}.${ext}`;

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

      return exp;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["host-experiences"] });
    },
  });
}

export function useUpdateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: ExperienceUpdate & { id: string }) => {
      const { error } = await supabase
        .from("experiences")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["host-experiences"] });
    },
  });
}

export function useDeleteExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Delete photos from storage first
      const { data: photos } = await supabase
        .from("experience_photos")
        .select("storage_path")
        .eq("experience_id", id);

      if (photos && photos.length > 0) {
        await supabase.storage
          .from("experience-photos")
          .remove(photos.map((p) => p.storage_path));
      }

      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["host-experiences"] });
    },
  });
}

export function getPhotoUrl(storagePath: string) {
  const { data } = supabase.storage.from("experience-photos").getPublicUrl(storagePath);
  return data.publicUrl;
}
