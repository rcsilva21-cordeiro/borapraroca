import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Pencil, User } from "lucide-react";
import { useAllProfiles, useAllRoles } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminUsers() {
  const { data: profiles, isLoading: lp } = useAllProfiles();
  const { data: roles, isLoading: lr } = useAllRoles();
  const qc = useQueryClient();

  const [editing, setEditing] = useState<{ id: string; user_id: string; full_name: string; phone: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const isLoading = lp || lr;

  const getUserRoles = (userId: string) =>
    roles?.filter((r) => r.user_id === userId).map((r) => r.role) ?? [];

  const roleColors: Record<string, string> = {
    turista: "bg-sky-100 text-sky-800",
    hospedeiro: "bg-emerald-100 text-emerald-800",
    admin: "bg-purple-100 text-purple-800",
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editing.full_name, phone: editing.phone })
      .eq("id", editing.id);
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Cadastro atualizado!");
    qc.invalidateQueries({ queryKey: ["admin-profiles"] });
    setEditing(null);
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Gerenciar Usuários</h2>
        <p className="text-muted-foreground mt-1">{profiles?.length ?? 0} usuários cadastrados</p>
      </div>

      <div className="space-y-3">
        {profiles?.map((p) => {
          const userRoles = getUserRoles(p.user_id);
          return (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{p.full_name || "Sem nome"}</p>
                    <p className="text-sm text-muted-foreground truncate">{p.phone || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {userRoles.map((role) => (
                    <Badge key={role} variant="outline" className={roleColors[role] ?? ""}>
                      {role}
                    </Badge>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditing({
                        id: p.id,
                        user_id: p.user_id,
                        full_name: p.full_name ?? "",
                        phone: p.phone ?? "",
                      })
                    }
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cadastro</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input
                  id="full_name"
                  value={editing.full_name}
                  onChange={(e) => setEditing({ ...editing, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={editing.phone}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
