import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("experience_id")
        .eq("tourist_id", user!.id);
      if (error) throw error;
      return data.map((f) => f.experience_id);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (experienceId: string) => {
      if (!user) throw new Error("Não autenticado");
      const isFav = favorites.includes(experienceId);
      if (isFav) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("tourist_id", user.id)
          .eq("experience_id", experienceId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ tourist_id: user.id, experience_id: experienceId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites", user?.id] });
    },
  });

  const toggleFavorite = (id: string) => toggleMutation.mutate(id);
  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}
