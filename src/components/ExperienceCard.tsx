import { MapPin, Star, Users, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ExperienceCardProps {
  id: string | number;
  image: string;
  title: string;
  location: string;
  category: string;
  rating: number;
  price: number;
  capacity: number;
}

const ExperienceCard = ({ id, image, title, location, category, rating, price, capacity }: ExperienceCardProps) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const isUUID = typeof id === "string" && /^[0-9a-f]{8}-/.test(id);
  const isFav = isUUID ? isFavorite(String(id)) : false;

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.info("Faça login para favoritar"); return; }
    if (!isUUID) { toast.info("Disponível para experiências reais"); return; }
    toggleFavorite(String(id));
    toast.success(isFav ? "Removido dos favoritos" : "Adicionado aos favoritos ❤️");
  };

  return (
    <Link to={`/experiencia/${id}`} className="block">
      <article className="group rounded-xl overflow-hidden bg-card border border-border/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img src={image} alt={title} loading="lazy" width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 text-xs">{category}</Badge>
          <button
            onClick={handleFav}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        </div>
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-earth-gold fill-earth-gold" />
                {(rating ?? 0).toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                até {capacity}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">a partir de</span>
              <p className="font-display font-bold text-lg text-primary">R$ {price}</p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ExperienceCard;
