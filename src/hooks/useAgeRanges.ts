import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AgeRange = {
  id: string;
  experience_id: string;
  label: string;
  min_age: number;
  max_age: number;
  price: number;
  position: number;
  created_at: string;
};

export type AgeRangeInput = {
  label: string;
  min_age: number;
  max_age: number;
  price: number;
  position: number;
};

export function useExperienceAgeRanges(experienceId: string | undefined) {
  return useQuery({
    queryKey: ["age-ranges", experienceId],
    enabled: !!experienceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience_age_ranges")
        .select("*")
        .eq("experience_id", experienceId!)
        .order("position");
      if (error) throw error;
      return data as AgeRange[];
    },
  });
}

export function useInsertAgeRanges() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      experienceId,
      ranges,
    }: {
      experienceId: string;
      ranges: AgeRangeInput[];
    }) => {
      if (ranges.length === 0) return;
      const rows = ranges.map((r, i) => ({
        experience_id: experienceId,
        label: r.label,
        min_age: r.min_age,
        max_age: r.max_age,
        price: r.price,
        position: i,
      }));
      const { error } = await supabase.from("experience_age_ranges").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["age-ranges"] });
    },
  });
}

export function useInsertBookingGuests() {
  return useMutation({
    mutationFn: async ({
      bookingId,
      guests,
    }: {
      bookingId: string;
      guests: { age_range_id: string; label: string; quantity: number; unit_price: number }[];
    }) => {
      if (guests.length === 0) return;
      const rows = guests.map((g) => ({
        booking_id: bookingId,
        age_range_id: g.age_range_id,
        label: g.label,
        quantity: g.quantity,
        unit_price: g.unit_price,
      }));
      const { error } = await supabase.from("booking_guests").insert(rows);
      if (error) throw error;
    },
  });
}
