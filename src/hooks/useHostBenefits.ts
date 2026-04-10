import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface HostBenefit {
  id: string;
  host_id: string;
  free_until: string;
  created_at: string;
}

export function useHostBenefits() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["host-benefits", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("host_benefits")
        .select("*")
        .eq("host_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as HostBenefit | null;
    },
  });
}

export function useHostFreeStatus() {
  const { data: benefit, isLoading } = useHostBenefits();

  if (isLoading || !benefit) {
    return { isLoading, isFree: false, daysLeft: 0, freeUntil: null, expiringSoon: false };
  }

  const now = new Date();
  const freeUntil = new Date(benefit.free_until);
  const diffMs = freeUntil.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isFree = daysLeft > 0;
  const expiringSoon = isFree && daysLeft <= 7;

  return { isLoading, isFree, daysLeft, freeUntil, expiringSoon };
}
