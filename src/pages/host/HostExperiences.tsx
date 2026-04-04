import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, MoreVertical, MapPin, Users, Star, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHostExperiences, useDeleteExperience, getPhotoUrl } from "@/hooks/useExperiences";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Status = Database["public"]["Enums"]["experience_status"];

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: { label: "Ativa", className: "bg-primary/10 text-primary border-primary/20" },
  pending: { label: "Em Análise", className: "bg-accent/10 text-accent border-accent/20" },
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground border-border" },
  inactive: { label: "Inativa", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function HostExperiences() {
  const { data: experiences, isLoading } = useHostExperiences();
  const deleteExperience = useDeleteExperience();
  const { toast } = useToast();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) return;
    try {
      await deleteExperience.mutateAsync(id);
      toast({ title: "Experiência excluída", description: `"${title}" foi removida.` });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Minhas Experiências
          </h2>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe suas experiências cadastradas.
          </p>
        </div>
        <Link to="/hospedeiro/nova">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Experiência
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {experiences?.map((exp) => {
          const status = statusConfig[exp.status];
          const coverPhoto = exp.experience_photos?.sort((a, b) => a.position - b.position)[0];
          const coverUrl = coverPhoto ? getPhotoUrl(coverPhoto.storage_path) : "/placeholder.svg";

          return (
            <Card key={exp.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 lg:w-56 h-40 sm:h-auto shrink-0">
                    <img
                      src={coverUrl}
                      alt={exp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-4 lg:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display text-lg font-semibold text-foreground">
                              {exp.title}
                            </h3>
                            <Badge variant="outline" className={status.className}>
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {exp.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              Até {exp.capacity}
                            </span>
                            {exp.rating && Number(exp.rating) > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                {exp.rating}
                              </span>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(exp.id, exp.title)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-3 pt-3 border-t border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Preço: </span>
                        <span className="font-semibold text-foreground">
                          R$ {Number(exp.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Categoria: </span>
                        <span className="font-semibold text-foreground">{exp.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(!experiences || experiences.length === 0) && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            Você ainda não cadastrou nenhuma experiência.
          </p>
          <Link to="/hospedeiro/nova">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Cadastrar primeira experiência
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
