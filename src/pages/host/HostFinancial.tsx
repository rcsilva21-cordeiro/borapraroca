import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign } from "lucide-react";
import { useUserTransactions, type Transaction } from "@/hooks/useTransactions";

const typeLabels: Record<string, { label: string; className: string }> = {
  payout: { label: "Repasse", className: "bg-emerald-100 text-emerald-800" },
  commission: { label: "Comissão", className: "bg-purple-100 text-purple-800" },
};

export default function HostFinancial() {
  const { data: transactions, isLoading } = useUserTransactions();

  const hostTransactions = transactions?.filter((t) => t.type === "payout" || t.type === "commission") ?? [];
  const totalPayout = hostTransactions
    .filter((t) => t.type === "payout")
    .reduce((s, t) => s + Number(t.amount), 0);
  const pendingPayout = hostTransactions
    .filter((t) => t.type === "payout" && t.status === "pending")
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalCommission = hostTransactions
    .filter((t) => t.type === "commission")
    .reduce((s, t) => s + Number(t.amount), 0);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Meu Financeiro</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Repasses Totais</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-bold text-primary">R$ {totalPayout.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Repasses Pendentes</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-bold text-amber-600">R$ {pendingPayout.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Comissão Plataforma</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-bold text-muted-foreground">R$ {totalCommission.toFixed(2)}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-display text-lg">Histórico</CardTitle></CardHeader>
        <CardContent>
          {hostTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma transação. Confirme reservas para gerar repasses!</p>
          ) : (
            <div className="space-y-3">
              {hostTransactions.map((t) => {
                const tp = typeLabels[t.type] ?? typeLabels.payout;
                return (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={tp.className}>{tp.label}</Badge>
                      <Badge variant="outline" className={t.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                        {t.status === "completed" ? "Concluído" : "Pendente"}
                      </Badge>
                      <span className="font-display font-bold text-sm">R$ {Number(t.amount).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
