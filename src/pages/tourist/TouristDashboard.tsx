import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarCheck, Heart, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useTouristBookings } from "@/hooks/useBookings";
import { useUserTransactions } from "@/hooks/useTransactions";

export default function TouristDashboard() {
  const { data: bookings, isLoading: lb } = useTouristBookings();
  const { data: transactions, isLoading: lt } = useUserTransactions();

  const isLoading = lb || lt;
  const totalBookings = bookings?.length ?? 0;
  const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length ?? 0;
  const totalSpent = transactions
    ?.filter((t) => t.type === "payment" && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount), 0) ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Minha Área 🌿
        </h2>
        <p className="text-muted-foreground mt-1">Suas reservas e experiências favoritas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Reservas</CardTitle>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <p className="font-display text-2xl font-bold">{totalBookings}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Confirmadas</CardTitle>
            <CalendarCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <p className="font-display text-2xl font-bold">{confirmedBookings}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Gasto</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <p className="font-display text-2xl font-bold">R$ {totalSpent.toFixed(2)}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Link to="/turista/reservas"><Button>Ver Reservas</Button></Link>
        <Link to="/turista/favoritos"><Button variant="outline"><Heart className="h-4 w-4 mr-2" />Favoritos</Button></Link>
      </div>
    </div>
  );
}
