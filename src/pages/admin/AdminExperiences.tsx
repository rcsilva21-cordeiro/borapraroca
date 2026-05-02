import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Pencil } from "lucide-react";
import { useAllExperiences, useApproveExperience } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getPhotoUrl } from "@/hooks/useExperiences";

const statusLabels: Record<string, { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  pending: { label: "Pendente", className: "bg-amber-100 text-amber-800" },
  active: { label: "Ativa", className: "bg-emerald-100 text-emerald-800" },
  inactive: { label: "Inativa", className: "bg-red-100 text-red-800" },
};

export default function AdminExperiences() {
  const { data: experiences, isLoading } = useAllExperiences();
  const approve = useApproveExperience();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = async (id: string, status: "active" | "inactive") => {
    try {
      await approve.mutateAsync({ id, status });
      toast({ title: status === "active" ? "Experiência aprovada!" : "Experiência desativada" });
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Gerenciar Experiências</h2>
        <p className="text-muted-foreground mt-1">Aprove ou desative experiências cadastradas</p>
      </div>

      {!experiences || experiences.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Nenhuma experiência cadastrada.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp: any) => {
            const st = statusLabels[exp.status] ?? statusLabels.draft;
            return (
              <Card key={exp.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      {exp.experience_photos && exp.experience_photos.length > 0 ? (
                        <img
                          src={getPhotoUrl(exp.experience_photos.sort((a: any, b: any) => a.position - b.position)[0].storage_path)}
                          alt={exp.title}
                          className="w-20 h-14 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <span className="text-xs text-muted-foreground">Sem foto</span>
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-semibold">{exp.title}</h3>
                          <Badge variant="outline" className={st.className}>{st.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {exp.location} · {exp.category} · R$ {Number(exp.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{exp.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/experiencia/${exp.id}`)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      {exp.status !== "active" && (
                        <Button size="sm" onClick={() => handleAction(exp.id, "active")} disabled={approve.isPending}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                      )}
                      {exp.status !== "inactive" && (
                        <Button size="sm" variant="outline" onClick={() => handleAction(exp.id, "inactive")} disabled={approve.isPending}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Desativar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
