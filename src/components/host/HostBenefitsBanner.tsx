import { useHostFreeStatus } from "@/hooks/useHostBenefits";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function HostBenefitsBanner() {
  const { isLoading, isFree, daysLeft, freeUntil, expiringSoon } = useHostFreeStatus();

  if (isLoading || !isFree || !freeUntil) return null;

  if (expiringSoon) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
        <p className="font-medium">
          ⚠️ Seu período gratuito expira em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}. Aproveite!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
      <p className="font-medium">
        🎉 Bem-vindo ao Bora pra Roça! Você tem taxa zero pelos primeiros 3 meses. Seu período gratuito vai até{" "}
        {format(freeUntil, "dd/MM/yyyy", { locale: ptBR })}.
      </p>
    </div>
  );
}
