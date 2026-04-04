import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User } from "lucide-react";
import { useAllProfiles, useAllRoles } from "@/hooks/useAdmin";

export default function AdminUsers() {
  const { data: profiles, isLoading: lp } = useAllProfiles();
  const { data: roles, isLoading: lr } = useAllRoles();

  const isLoading = lp || lr;

  const getUserRoles = (userId: string) =>
    roles?.filter((r) => r.user_id === userId).map((r) => r.role) ?? [];

  const roleColors: Record<string, string> = {
    turista: "bg-sky-100 text-sky-800",
    hospedeiro: "bg-emerald-100 text-emerald-800",
    admin: "bg-purple-100 text-purple-800",
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
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{p.full_name || "Sem nome"}</p>
                    <p className="text-sm text-muted-foreground">{p.phone || "—"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {userRoles.map((role) => (
                    <Badge key={role} variant="outline" className={roleColors[role] ?? ""}>
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
