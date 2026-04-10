import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Review {
  id: string;
  experience_id: string;
  tourist_id: string;
  tourist_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function useReviews(experienceId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", experienceId],
    enabled: !!experienceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("experience_id", experienceId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });
}

export function useMyReview(experienceId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-review", experienceId, user?.id],
    enabled: !!experienceId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("experience_id", experienceId!)
        .eq("tourist_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Review | null;
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { experience_id: string; tourist_id: string; tourist_name: string; rating: number; comment: string }) => {
      const { data, error } = await supabase.from("reviews").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["reviews", vars.experience_id] });
      qc.invalidateQueries({ queryKey: ["my-review", vars.experience_id] });
    },
  });
}

export function useReviewStats(experienceId: string | undefined) {
  const { data: reviews } = useReviews(experienceId);
  if (!reviews || reviews.length === 0) {
    return { average: 5, count: 0, hasReviews: false };
  }
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { average, count: reviews.length, hasReviews: true };
}
