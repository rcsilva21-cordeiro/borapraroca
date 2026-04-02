import { PlusCircle, Eye, Star, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { label: "Experiências Ativas", value: "3", icon: Eye, color: "text-primary" },
  { label: "Reservas este mês", value: "12", icon: Calendar, color: "text-sky" },
  { label: "Avaliação Média", value: "4.8", icon: Star, color: "text-earth-gold" },
  { label: "Visualizações", value: "248", icon: Eye, color: "text-accent" },
];

const recentBookings = [
  { guest: "Maria Silva", experience: "Sítio Recanto das Águas", date: "15/04/2026", status: "Confirmada" },
  { guest: "João Santos", experience: "Trilha da Serra", date: "18/04/2026", status: "Pendente" },
  { guest: "Ana Costa", experience: "Sítio Recanto das Águas", date: "20/04/2026", status: "Confirmada" },
];

export default function HostDashboard() {
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
              <p className="font-display text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Reservas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium text-foreground">{booking.guest}</p>
                  <p className="text-sm text-muted-foreground">{booking.experience}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{booking.date}</span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      booking.status === "Confirmada"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
