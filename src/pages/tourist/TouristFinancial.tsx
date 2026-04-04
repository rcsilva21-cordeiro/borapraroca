import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign } from "lucide-react";
import { useUserTransactions, type Transaction } from "@/hooks/useTransactions";

export default function TouristFinancial() {
  const { data: transactions, isLoading } = useUserTransactions();

  const totalSpent = transactions
    ?.filter((t) => t.type === "payment" && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount), 0) ?? 0;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Meu Financeiro</h2>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Gasto</CardTitle></CardHeader>
        <CardContent><p className="font-display text-2xl font-bold text-primary">R$ {totalSpent.toFixed(2)}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-display text-lg">Histórico de Pagamentos</CardTitle></CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma transação registrada.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={t.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                      {t.status === "completed" ? "Pago" : "Pendente"}
                    </Badge>
                    <span className="font-display font-bold text-sm">R$ {Number(t.amount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
