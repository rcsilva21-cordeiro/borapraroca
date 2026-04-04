import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, TreePine, CalendarCheck, DollarSign } from "lucide-react";
import { useAllExperiences, useAllProfiles, useAllBookings } from "@/hooks/useAdmin";
import { useAllTransactions } from "@/hooks/useTransactions";

export default function AdminDashboard() {
  const { data: experiences, isLoading: le } = useAllExperiences();
  const { data: profiles, isLoading: lp } = useAllProfiles();
  const { data: bookings, isLoading: lb } = useAllBookings();
  const { data: transactions, isLoading: lt } = useAllTransactions();

  const isLoading = le || lp || lb || lt;

  const pendingExps = experiences?.filter((e) => e.status === "pending").length ?? 0;
  const activeExps = experiences?.filter((e) => e.status === "active").length ?? 0;
  const totalUsers = profiles?.length ?? 0;
  const totalBookings = bookings?.length ?? 0;
  const totalRevenue = transactions
    ?.filter((t) => t.type === "commission" && t.status === "completed")
    .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;

  const stats = [
    { label: "Usuários", value: totalUsers, icon: Users, color: "text-primary" },
    { label: "Experiências Ativas", value: activeExps, icon: TreePine, color: "text-emerald-600" },
    { label: "Pendentes Aprovação", value: pendingExps, icon: TreePine, color: "text-amber-600" },
    { label: "Total Reservas", value: totalBookings, icon: CalendarCheck, color: "text-sky-600" },
    { label: "Receita (comissões)", value: `R$ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Painel Administrativo 🏛️
        </h2>
        <p className="text-muted-foreground mt-1">
          Visão geral da plataforma BoraPraRoça
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* Recent bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Reservas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          ) : !bookings || bookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma reserva ainda.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 10).map((b: any) => (
                <div key={b.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{b.experiences?.title ?? "—"}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.guests} pessoa(s) · R$ {Number(b.total_price).toFixed(2)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    b.status === "confirmed" ? "bg-emerald-100 text-emerald-800" :
                    b.status === "pending" ? "bg-amber-100 text-amber-800" :
                    b.status === "cancelled" ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {b.status === "confirmed" ? "Confirmada" : b.status === "pending" ? "Pendente" : b.status === "cancelled" ? "Cancelada" : "Concluída"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
