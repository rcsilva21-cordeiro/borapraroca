import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function BookingRealtimeListener() {
  const { user } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("host-bookings-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
        },
        async (payload) => {
          const booking = payload.new as any;

          // Check if this booking is for one of the host's experiences
          const { data: exp } = await supabase
            .from("experiences")
            .select("title, host_id")
            .eq("id", booking.experience_id)
            .single();

          if (exp && exp.host_id === user.id) {
            // Get tourist name
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("user_id", booking.tourist_id)
              .single();

            const touristName = profile?.full_name || "Um turista";

            toast.success(`Nova reserva recebida! ${touristName} reservou ${exp.title}`, {
              duration: 6000,
            });

            qc.invalidateQueries({ queryKey: ["host-bookings"] });
            qc.invalidateQueries({ queryKey: ["host-dashboard-stats"] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);

  return null;
}
