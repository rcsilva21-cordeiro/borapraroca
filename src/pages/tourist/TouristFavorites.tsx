import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { useActiveExperiences, getPhotoUrl } from "@/hooks/useExperiences";

export default function TouristFavorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const { data: experiences, isLoading } = useActiveExperiences();

  const favoriteExps = experiences?.filter((e) => favorites.includes(e.id)) ?? [];

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Favoritos</h2>
        <p className="text-muted-foreground mt-1">Experiências que você curtiu</p>
      </div>

      {favoriteExps.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">Nenhum favorito</h3>
          <p className="text-muted-foreground mb-6">Favorite experiências para encontrá-las aqui</p>
          <Link to="/experiencias"><Button>Explorar experiências</Button></Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favoriteExps.map((exp) => {
            const photo = exp.experience_photos?.[0];
            const imageUrl = photo ? getPhotoUrl(photo.storage_path) : "/placeholder.svg";
            return (
              <Card key={exp.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img src={imageUrl} alt={exp.title} className="w-full h-full object-cover" />
                  <button onClick={() => toggleFavorite(exp.id)} className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background">
                    <Heart className="h-4 w-4 text-destructive fill-destructive" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5" />{exp.location}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-display font-bold text-primary">R$ {Number(exp.price).toFixed(2)}</span>
                    <Link to={`/experiencia/${exp.id}`}><Button size="sm" variant="outline">Ver detalhes</Button></Link>
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
