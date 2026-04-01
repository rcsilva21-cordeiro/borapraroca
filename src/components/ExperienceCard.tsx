import { MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExperienceCardProps {
  image: string;
  title: string;
  location: string;
  category: string;
  rating: number;
  price: number;
  capacity: number;
}

const ExperienceCard = ({
  image,
  title,
  location,
  category,
  rating,
  price,
  capacity,
}: ExperienceCardProps) => {
  return (
    <article className="group rounded-xl overflow-hidden bg-card border border-border/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 text-xs">
          {category}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-earth-gold fill-earth-gold" />
              {rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              até {capacity}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">a partir de</span>
            <p className="font-display font-bold text-lg text-primary">
              R$ {price}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;
