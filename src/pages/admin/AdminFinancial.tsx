import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign } from "lucide-react";
import { useAllTransactions, type Transaction } from "@/hooks/useTransactions";

const typeLabels: Record<string, { label: string; className: string }> = {
  payment: { label: "Pagamento", className: "bg-sky-100 text-sky-800" },
  commission: { label: "Comissão", className: "bg-purple-100 text-purple-800" },
  payout: { label: "Repasse", className: "bg-emerald-100 text-emerald-800" },
};

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-amber-100 text-amber-800" },
  completed: { label: "Concluído", className: "bg-emerald-100 text-emerald-800" },
  failed: { label: "Falhou", className: "bg-red-100 text-red-800" },
};

export default function AdminFinancial() {
  const { data: transactions, isLoading } = useAllTransactions();

  const totalCommissions = transactions
    ?.filter((t) => t.type === "commission" && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalPayouts = transactions
    ?.filter((t) => t.type === "payout")
    .reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const pendingPayouts = transactions
    ?.filter((t) => t.type === "payout" && t.status === "pending")
    .reduce((s, t) => s + Number(t.amount), 0) ?? 0;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Financeiro da Plataforma</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Comissões (15%)</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-bold text-primary">R$ {totalCommissions.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Repasses Totais</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-bold">R$ {totalPayouts.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Repasses Pendentes</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-bold text-amber-600">R$ {pendingPayouts.toFixed(2)}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-display text-lg">Transações</CardTitle></CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma transação registrada.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => {
                const tp = typeLabels[t.type] ?? typeLabels.payment;
                const st = statusLabels[t.status] ?? statusLabels.pending;
                return (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{t.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(t.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={tp.className}>{tp.label}</Badge>
                      <Badge variant="outline" className={st.className}>{st.label}</Badge>
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
