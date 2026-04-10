import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AvailabilityRow {
  id: string;
  experience_id: string;
  date: string;
  available_slots: number;
  blocked: boolean;
  created_at: string;
}

export function useAvailability(experienceId: string | undefined) {
  return useQuery({
    queryKey: ["availability", experienceId],
    enabled: !!experienceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience_availability")
        .select("*")
        .eq("experience_id", experienceId!)
        .order("date", { ascending: true });
      if (error) throw error;
      return data as AvailabilityRow[];
    },
  });
}

export function useUpsertAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      experience_id: string;
      date: string;
      available_slots: number;
      blocked: boolean;
    }) => {
      const { data, error } = await supabase
        .from("experience_availability")
        .upsert(
          {
            experience_id: input.experience_id,
            date: input.date,
            available_slots: input.available_slots,
            blocked: input.blocked,
          },
          { onConflict: "experience_id,date" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["availability", vars.experience_id] });
    },
  });
}

export function useDeleteAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, experienceId }: { id: string; experienceId: string }) => {
      const { error } = await supabase
        .from("experience_availability")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return experienceId;
    },
    onSuccess: (experienceId) => {
      qc.invalidateQueries({ queryKey: ["availability", experienceId] });
    },
  });
}
