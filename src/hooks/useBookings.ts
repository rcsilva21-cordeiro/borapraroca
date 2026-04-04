import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

export type BookingWithExperience = BookingRow & {
  experiences: {
    id: string;
    title: string;
    location: string;
    category: Database["public"]["Enums"]["experience_category"];
    price: number;
  };
};

export function useTouristBookings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tourist-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, experiences(id, title, location, category, price)")
        .eq("tourist_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BookingWithExperience[];
    },
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<BookingInsert, "tourist_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Faça login para reservar");

      const { data, error } = await supabase
        .from("bookings")
        .insert({ ...input, tourist_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tourist-bookings"] });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tourist-bookings"] });
    },
  });
}

export function useHostBookings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["host-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // Get host's experience IDs first
      const { data: exps } = await supabase
        .from("experiences")
        .select("id")
        .eq("host_id", user!.id);
      if (!exps || exps.length === 0) return [];

      const ids = exps.map((e) => e.id);
      const { data, error } = await supabase
        .from("bookings")
        .select("*, experiences(id, title, location, category, price)")
        .in("experience_id", ids)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BookingWithExperience[];
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Database["public"]["Enums"]["booking_status"] }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["host-bookings"] });
      qc.invalidateQueries({ queryKey: ["tourist-bookings"] });
    },
  });
}
