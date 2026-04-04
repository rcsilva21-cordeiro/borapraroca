import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  booking_id: string | null;
  user_id: string;
  type: "payment" | "commission" | "payout";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export function useUserTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-transactions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions" as any)
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Transaction[];
    },
  });
}

export function useAllTransactions() {
  return useQuery({
    queryKey: ["all-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Transaction[];
    },
  });
}
