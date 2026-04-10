import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface HostStats {
  confirmedBookings: number;
  totalRevenue: number;
  avgRating: number | null;
  activeExperiences: number;
}

export function useHostDashboardStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["host-dashboard-stats", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<HostStats> => {
      // Get host experience IDs
      const { data: exps } = await supabase
        .from("experiences")
        .select("id, status")
        .eq("host_id", user!.id);

      if (!exps || exps.length === 0) {
        return { confirmedBookings: 0, totalRevenue: 0, avgRating: null, activeExperiences: 0 };
      }

      const expIds = exps.map((e) => e.id);
      const activeExperiences = exps.filter((e) => e.status === "active").length;

      // Confirmed bookings + revenue
      const { data: bookings } = await supabase
        .from("bookings")
        .select("total_price")
        .in("experience_id", expIds)
        .eq("status", "confirmed");

      const confirmedBookings = bookings?.length ?? 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_price), 0) ?? 0;

      // Average rating from reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .in("experience_id", expIds);

      const avgRating =
        reviews && reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : null;

      return { confirmedBookings, totalRevenue, avgRating, activeExperiences };
    },
  });
}
