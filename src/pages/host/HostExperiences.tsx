import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Eye, MoreVertical, MapPin, Users, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { experiences } from "@/data/experiences";

type Status = "active" | "pending" | "draft";

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: { label: "Ativa", className: "bg-primary/10 text-primary border-primary/20" },
  pending: { label: "Em Análise", className: "bg-accent/10 text-accent border-accent/20" },
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground border-border" },
};

// Simulated host experiences with status
const hostExperiences = experiences.slice(0, 4).map((exp, i) => ({
  ...exp,
  status: (["active", "pending", "active", "draft"] as Status[])[i],
  views: [124, 87, 198, 12][i],
  bookings: [8, 3, 15, 0][i],
}));

export default function HostExperiences() {
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
        {hostExperiences.map((exp) => {
          const status = statusConfig[exp.status];
          return (
            <Card key={exp.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 lg:w-56 h-40 sm:h-auto shrink-0">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
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
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-earth-gold text-earth-gold" />
                              {exp.rating}
                            </span>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> Visualizar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-3 pt-3 border-t border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Preço: </span>
                        <span className="font-semibold text-foreground">
                          R$ {exp.price}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Visualizações: </span>
                        <span className="font-semibold text-foreground">{exp.views}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Reservas: </span>
                        <span className="font-semibold text-foreground">{exp.bookings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hostExperiences.length === 0 && (
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
