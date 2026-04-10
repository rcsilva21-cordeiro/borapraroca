import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { AgeRangeInput } from "@/hooks/useAgeRanges";

interface Props {
  ranges: AgeRangeInput[];
  onChange: (ranges: AgeRangeInput[]) => void;
}

const DEFAULT_RANGES: AgeRangeInput[] = [
  { label: "Adulto", min_age: 12, max_age: 99, price: 0, position: 0 },
  { label: "Criança", min_age: 6, max_age: 11, price: 0, position: 1 },
  { label: "Infantil", min_age: 0, max_age: 5, price: 0, position: 2 },
];

export function getDefaultRanges(adultPrice: number): AgeRangeInput[] {
  return DEFAULT_RANGES.map((r, i) => ({
    ...r,
    price: i === 0 ? adultPrice : i === 1 ? Math.round(adultPrice * 0.5) : 0,
    position: i,
  }));
}

export default function AgeRangesEditor({ ranges, onChange }: Props) {
  const update = (idx: number, field: keyof AgeRangeInput, value: string | number) => {
    const updated = [...ranges];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  };

  const addRange = () => {
    onChange([
      ...ranges,
      { label: "", min_age: 0, max_age: 99, price: 0, position: ranges.length },
    ]);
  };

  const removeRange = (idx: number) => {
    onChange(ranges.filter((_, i) => i !== idx).map((r, i) => ({ ...r, position: i })));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Faixas Etárias e Preços</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRange} className="gap-1">
          <Plus className="h-3 w-3" /> Adicionar faixa
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Defina as faixas etárias e o preço por pessoa. Coloque R$ 0 para gratuito.
      </p>

      {ranges.map((r, idx) => (
        <div key={idx} className="grid grid-cols-[1fr_60px_60px_100px_auto] gap-2 items-end">
          <div>
            {idx === 0 && <Label className="text-xs text-muted-foreground mb-1 block">Nome</Label>}
            <Input
              placeholder="Ex: Adulto"
              value={r.label}
              onChange={(e) => update(idx, "label", e.target.value)}
            />
          </div>
          <div>
            {idx === 0 && <Label className="text-xs text-muted-foreground mb-1 block">De</Label>}
            <Input
              type="number"
              min={0}
              max={99}
              value={r.min_age}
              onChange={(e) => update(idx, "min_age", parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            {idx === 0 && <Label className="text-xs text-muted-foreground mb-1 block">Até</Label>}
            <Input
              type="number"
              min={0}
              max={99}
              value={r.max_age}
              onChange={(e) => update(idx, "max_age", parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            {idx === 0 && <Label className="text-xs text-muted-foreground mb-1 block">Preço R$</Label>}
            <Input
              type="number"
              min={0}
              step="0.01"
              value={r.price}
              onChange={(e) => update(idx, "price", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            {idx === 0 && <Label className="text-xs text-muted-foreground mb-1 block">&nbsp;</Label>}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRange(idx)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {ranges.length === 0 && (
        <p className="text-sm text-muted-foreground italic py-2">
          Nenhuma faixa etária definida. O preço base será usado para todos os participantes.
        </p>
      )}
    </div>
  );
}
