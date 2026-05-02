import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PhotoGalleryProps {
  photos: string[];
  alt: string;
  category?: string;
}

const categoryPlaceholders: Record<string, string> = {
  Hospedagem: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800",
  Trilhas: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
  Gastronomia: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  "Bike Tour": "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800",
  Ecoturismo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  Camping: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
  Cavalgada: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800",
  Aventura: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
  Agroturismo: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
  "Retiro/Bem-estar": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  "Pesca Esportiva": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
};

export function getPlaceholderForCategory(category: string) {
  return categoryPlaceholders[category] || "/placeholder.svg";
}

export default function PhotoGallery({ photos, alt, category }: PhotoGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (photos.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main photo */}
      <div className="relative rounded-2xl overflow-hidden w-full bg-black/5" style={{ height: 450 }}>
        <img src={photos[selected]} alt={alt} className="w-full h-full object-contain object-center" />
        {category && (
          <Badge className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground border-0">{category}</Badge>
        )}
        {photos.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
              onClick={() => setSelected((p) => (p === 0 ? photos.length - 1 : p - 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
              onClick={() => setSelected((p) => (p === photos.length - 1 ? 0 : p + 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                i === selected ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={url} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
