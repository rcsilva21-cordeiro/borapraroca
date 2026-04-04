import { PlusCircle, Eye, Star, Calendar, CalendarCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useHostExperiences } from "@/hooks/useExperiences";
import { useHostBookings } from "@/hooks/useBookings";
import { format } from "date-fns";

export default function HostDashboard() {
  const { data: experiences, isLoading: loadingExp } = useHostExperiences();
  const { data: bookings, isLoading: loadingBook } = useHostBookings();

  const activeCount = experiences?.filter((e) => e.status === "active").length ?? 0;
  const pendingBookings = bookings?.filter((b) => b.status === "pending").length ?? 0;
  const totalBookings = bookings?.length ?? 0;
  const avgRating = experiences && experiences.length > 0
    ? (experiences.reduce((sum, e) => sum + (e.rating ?? 0), 0) / experiences.length).toFixed(1)
    : "—";

  const recentBookings = (bookings ?? []).slice(0, 5);
  const isLoading = loadingExp || loadingBook;

  const stats = [
    { label: "Experiências Ativas", value: String(activeCount), icon: Eye, color: "text-primary" },
    { label: "Reservas Pendentes", value: String(pendingBookings), icon: CalendarCheck, color: "text-amber-600" },
    { label: "Total de Reservas", value: String(totalBookings), icon: Calendar, color: "text-sky-600" },
    { label: "Avaliação Média", value: avgRating, icon: Star, color: "text-earth-gold" },
  ];

  const statusLabels: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendente", className: "bg-amber-100 text-amber-800" },
    confirmed: { label: "Confirmada", className: "bg-emerald-100 text-emerald-800" },
    cancelled: { label: "Cancelada", className: "bg-red-100 text-red-800" },
    completed: { label: "Concluída", className: "bg-blue-100 text-blue-800" },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Bem-vindo, Hospedeiro! 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Gerencie suas experiências e acompanhe suas reservas.
          </p>
        </div>
        <Link to="/hospedeiro/nova">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Experiência
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <p className="font-display text-2xl font-bold">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Reservas Recentes</CardTitle>
          {totalBookings > 0 && (
            <Link to="/hospedeiro/reservas">
              <Button variant="ghost" size="sm" className="text-primary">Ver todas</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => {
                const st = statusLabels[booking.status] ?? statusLabels.pending;
                return (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{booking.experiences.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.guests} {booking.guests === 1 ? "pessoa" : "pessoas"} · R$ {Number(booking.total_price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(booking.booking_date), "dd/MM/yyyy")}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.className}`}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma reserva recebida ainda. Cadastre experiências para começar!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}