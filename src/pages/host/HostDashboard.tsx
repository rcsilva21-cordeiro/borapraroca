import { PlusCircle, Eye, Star, Calendar, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useHostBookings } from "@/hooks/useBookings";
import { useHostDashboardStats } from "@/hooks/useHostDashboardStats";
import { format } from "date-fns";

export default function HostDashboard() {
  const { data: bookings, isLoading: loadingBook } = useHostBookings();
  const { data: stats, isLoading: loadingStats } = useHostDashboardStats();

  const recentBookings = (bookings ?? []).slice(0, 5);
  const isLoading = loadingBook || loadingStats;

  const statCards = [
    {
      label: "Reservas Confirmadas",
      value: stats ? String(stats.confirmedBookings) : null,
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Faturamento Total",
      value: stats ? `R$ ${stats.totalRevenue.toFixed(2)}` : null,
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      label: "Avaliação Média",
      value: stats
        ? stats.avgRating !== null
          ? stats.avgRating.toFixed(1)
          : "—"
        : null,
      icon: Star,
      color: "text-accent",
    },
    {
      label: "Experiências Ativas",
      value: stats ? String(stats.activeExperiences) : null,
      icon: Eye,
      color: "text-primary",
    },
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
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
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
          {(bookings?.length ?? 0) > 0 && (
            <Link to="/hospedeiro/reservas">
              <Button variant="ghost" size="sm" className="text-primary">Ver todas</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {loadingBook ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
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
