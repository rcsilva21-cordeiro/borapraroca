import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUserTransactions, type Transaction } from "@/hooks/useTransactions";

export default function TouristFinancial() {
  const { t } = useTranslation("tourist");
  const { data: transactions, isLoading } = useUserTransactions();

  const totalSpent = transactions
    ?.filter((t) => t.type === "payment" && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount), 0) ?? 0;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">{t("financial.title")}</h2>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("financial.totalSpent")}</CardTitle></CardHeader>
        <CardContent><p className="font-display text-2xl font-bold text-primary">R$ {totalSpent.toFixed(2)}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-display text-lg">{t("financial.history")}</CardTitle></CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("financial.empty")}</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t2) => (
                <div key={t2.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{t2.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t2.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={t2.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                      {t2.status === "completed" ? t("financial.paid") : t("financial.pending")}
                    </Badge>
                    <span className="font-display font-bold text-sm">R$ {Number(t2.amount).toFixed(2)}</span>
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
