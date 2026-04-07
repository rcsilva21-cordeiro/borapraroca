import { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { categories, type Category } from "@/data/experiences";

const HeroSection = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    navigate(`/experiencias?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-end pb-20 lg:pb-28">
      <img
        src={heroBg}
        alt="Paisagem rural brasileira com fazenda ao pôr do sol"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 animate-fade-up">
            Viva experiências <br />
            <span className="italic text-earth-gold">autênticas no campo</span>
          </h1>
          <p
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-fade-up font-light"
            style={{ animationDelay: "0.2s" }}
          >
            Descubra sítios, fazendas, trilhas, gastronomia rural e muito mais.
            Conecte-se com a natureza e com quem vive dela.
          </p>

          <div
            className="bg-background/95 backdrop-blur-sm rounded-xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl shadow-xl animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Para onde você quer ir?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-2"
              />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category | "")}
                className="appearance-none bg-secondary text-foreground text-sm rounded-lg px-4 py-2 pr-8 outline-none cursor-pointer h-full"
              >
                <option value="">Todas categorias</option>
                {categories
                  .filter((c) => c !== "Todas")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <Button className="gap-2 px-6" onClick={handleSearch}>
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
