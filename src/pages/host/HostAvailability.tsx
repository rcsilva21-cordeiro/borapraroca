import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useHostExperiences } from "@/hooks/useExperiences";
import { useAvailability, useUpsertAvailability, useDeleteAvailability } from "@/hooks/useAvailability";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function HostAvailability() {
  const { data: experiences, isLoading: loadingExp } = useHostExperiences();
  const [selectedExpId, setSelectedExpId] = useState<string>("");
  const { data: availability, isLoading: loadingAvail } = useAvailability(selectedExpId || undefined);
  const upsert = useUpsertAvailability();
  const remove = useDeleteAvailability();

  const availMap = new Map<string, { id: string; blocked: boolean; available_slots: number }>();
  availability?.forEach((a) => {
    availMap.set(a.date, { id: a.id, blocked: a.blocked, available_slots: a.available_slots });
  });

  const handleDayClick = async (date: Date) => {
    if (!selectedExpId) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = availMap.get(dateStr);

    try {
      if (!existing) {
        // First click: mark available
        await upsert.mutateAsync({
          experience_id: selectedExpId,
          date: dateStr,
          available_slots: 1,
          blocked: false,
        });
        toast.success("Data marcada como disponível");
      } else if (!existing.blocked) {
        // Second click: block
        await upsert.mutateAsync({
          experience_id: selectedExpId,
          date: dateStr,
          available_slots: 0,
          blocked: true,
        });
        toast.success("Data bloqueada");
      } else {
        // Third click: remove
        await remove.mutateAsync({ id: existing.id, experienceId: selectedExpId });
        toast.success("Data resetada");
      }
    } catch {
      toast.error("Erro ao atualizar disponibilidade");
    }
  };

  const modifiers = {
    available: availability?.filter((a) => !a.blocked).map((a) => new Date(a.date + "T12:00:00")) ?? [],
    blocked: availability?.filter((a) => a.blocked).map((a) => new Date(a.date + "T12:00:00")) ?? [],
  };

  const modifiersClassNames = {
    available: "!bg-emerald-200 !text-emerald-900 hover:!bg-emerald-300",
    blocked: "!bg-red-200 !text-red-900 hover:!bg-red-300",
  };

  if (loadingExp) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Disponibilidade
        </h2>
        <p className="text-muted-foreground mt-1">
          Clique nas datas para alternar: disponível (verde) → bloqueada (vermelho) → sem configuração.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selecione a Experiência</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedExpId} onValueChange={setSelectedExpId}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Escolha uma experiência" />
            </SelectTrigger>
            <SelectContent>
              {experiences?.map((exp) => (
                <SelectItem key={exp.id} value={exp.id}>
                  {exp.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedExpId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAvail ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                  onDayClick={handleDayClick}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  disabled={{ before: new Date() }}
                />
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-200 border border-emerald-300" />
                    <span className="text-muted-foreground">Disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-200 border border-red-300" />
                    <span className="text-muted-foreground">Bloqueada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted border border-border" />
                    <span className="text-muted-foreground">Sem configuração</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
