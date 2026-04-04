import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHostBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { Loader2, CheckCircle, XCircle, Calendar, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const statusMap: Record<string, { label: string; variant: string }> = {
  pending: { label: "Pendente", variant: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmada", variant: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelada", variant: "bg-red-100 text-red-800" },
  completed: { label: "Concluída", variant: "bg-blue-100 text-blue-800" },
};

export default function HostBookings() {
  const { data: bookings, isLoading } = useHostBookings();
  const updateStatus = useUpdateBookingStatus();
  const { toast } = useToast();

  const handleAction = async (id: string, status: "confirmed" | "cancelled") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast({
        title: status === "confirmed" ? "Reserva confirmada! ✅" : "Reserva recusada",
        description: status === "confirmed"
          ? "O turista será notificado da confirmação."
          : "A reserva foi recusada.",
      });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pending = bookings?.filter((b) => b.status === "pending") ?? [];
  const others = bookings?.filter((b) => b.status !== "pending") ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Reservas Recebidas
        </h2>
        <p className="text-muted-foreground mt-1">
          Gerencie as solicitações de reserva das suas experiências.
        </p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Aguardando sua confirmação ({pending.length})
          </h3>
          {pending.map((booking) => (
            <Card key={booking.id} className="border-amber-200">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="font-display font-semibold text-lg text-foreground">
                      {booking.experiences.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(booking.booking_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {booking.guests} {booking.guests === 1 ? "pessoa" : "pessoas"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.experiences.location}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.message && <span>Mensagem: "{booking.message}" · </span>}
                      Total: <span className="font-semibold text-primary">R$ {Number(booking.total_price).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleAction(booking.id, "confirmed")}
                      disabled={updateStatus.isPending}
                      className="gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(booking.id, "cancelled")}
                      disabled={updateStatus.isPending}
                      className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4" />
                      Recusar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Histórico de reservas
          </h3>
          {others.map((booking) => {
            const st = statusMap[booking.status] || statusMap.pending;
            return (
              <Card key={booking.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{booking.experiences.title}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(booking.booking_date), "dd/MM/yyyy")}
                        </span>
                        <span>{booking.guests} {booking.guests === 1 ? "pessoa" : "pessoas"}</span>
                        <span className="font-medium">R$ {Number(booking.total_price).toFixed(2)}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.variant}`}>
                      {st.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {(!bookings || bookings.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="font-display text-lg font-semibold text-foreground mb-1">
              Nenhuma reserva ainda
            </p>
            <p className="text-muted-foreground text-sm">
              Quando turistas reservarem suas experiências, elas aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
