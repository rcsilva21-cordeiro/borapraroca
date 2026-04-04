import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Loader2, TreePine } from "lucide-react";
import { Link } from "react-router-dom";
import { useTouristBookings, useCancelBooking } from "@/hooks/useBookings";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type BookingStatus = Database["public"]["Enums"]["booking_status"];

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-accent/10 text-accent border-accent/20" },
  confirmed: { label: "Confirmada", className: "bg-primary/10 text-primary border-primary/20" },
  cancelled: { label: "Cancelada", className: "bg-destructive/10 text-destructive border-destructive/20" },
  completed: { label: "Concluída", className: "bg-muted text-muted-foreground border-border" },
};

export default function TouristBookings() {
  const { data: bookings, isLoading } = useTouristBookings();
  const cancelBooking = useCancelBooking();
  const { toast } = useToast();

  const handleCancel = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;
    try {
      await cancelBooking.mutateAsync(id);
      toast({ title: "Reserva cancelada" });
    } catch {
      toast({ title: "Erro ao cancelar", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Minhas Reservas</h2>
        <p className="text-muted-foreground mt-1">Acompanhe suas experiências reservadas</p>
      </div>

      {!bookings || bookings.length === 0 ? (
        <Card className="p-12 text-center">
          <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">Nenhuma reserva ainda</h3>
          <p className="text-muted-foreground mb-6">Explore nossas experiências!</p>
          <Link to="/#experiencias"><Button>Ver experiências</Button></Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => {
            const status = statusConfig[b.status];
            const exp = b.experiences;
            return (
              <Card key={b.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold">{exp.title}</h3>
                        <Badge variant="outline" className={status.className}>{status.label}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{exp.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(b.booking_date).toLocaleDateString("pt-BR")}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{b.guests} pessoa(s)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-display text-xl font-bold text-primary">R$ {Number(b.total_price).toFixed(2)}</p>
                      {b.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => handleCancel(b.id)} disabled={cancelBooking.isPending}>Cancelar</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
