import { useState, useMemo } from "react";
import {
  Home,
  Mountain,
  UtensilsCrossed,
  Bike,
  TreePine,
  Tent,
  Footprints,
  Compass,
  Sprout,
  Heart,
  Fish,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import ExperienceCard from "@/components/ExperienceCard";
import HowItWorks from "@/components/HowItWorks";
import HostCTA from "@/components/HostCTA";
import Footer from "@/components/Footer";
import { experiences as staticExperiences, categories, type Category } from "@/data/experiences";
import { useActiveExperiences, getPhotoUrl } from "@/hooks/useExperiences";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons: Record<string, React.ReactNode> = {
  Hospedagem: <Home className="h-7 w-7" />,
  Trilhas: <Mountain className="h-7 w-7" />,
  Gastronomia: <UtensilsCrossed className="h-7 w-7" />,
  "Bike Tour": <Bike className="h-7 w-7" />,
  Ecoturismo: <TreePine className="h-7 w-7" />,
  Camping: <Tent className="h-7 w-7" />,
  Cavalgada: <Footprints className="h-7 w-7" />,
  Aventura: <Compass className="h-7 w-7" />,
  Agroturismo: <Sprout className="h-7 w-7" />,
  "Retiro/Bem-estar": <Heart className="h-7 w-7" />,
  "Pesca Esportiva": <Fish className="h-7 w-7" />,
};

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("Todas");
  const { data: dbExperiences, isLoading } = useActiveExperiences();

  const realExperiences = useMemo(
    () =>
      (dbExperiences ?? []).map((exp) => {
        const coverPhoto = exp.experience_photos?.sort(
          (a, b) => a.position - b.position
        )[0];
        return {
          id: exp.id,
          image: coverPhoto
            ? getPhotoUrl(coverPhoto.storage_path)
            : "/placeholder.svg",
          title: exp.title,
          location: exp.location,
          category: exp.category as Category,
          rating: exp.rating ?? 0,
          price: Number(exp.price),
          capacity: exp.capacity,
        };
      }),
    [dbExperiences]
  );

  // Use real experiences if available, otherwise fall back to static
  const experiences = realExperiences.length > 0 ? realExperiences : staticExperiences;

  const filtered =
    activeCategory === "Todas"
      ? experiences
      : experiences.filter((e) => e.category === activeCategory);

  const categoryCounts = categories
    .filter((c) => c !== "Todas")
    .map((c) => ({
      name: c,
      count: experiences.filter((e) => e.category === c).length,
    }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Categories */}
      <section id="categorias" className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Explore por categoria
            </h2>
            <p className="text-muted-foreground">
              Encontre a experiência perfeita para o seu estilo
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categoryCounts.map((cat) => (
              <div key={cat.name} onClick={() => setActiveCategory(cat.name as Category)}>
                <CategoryCard
                  icon={categoryIcons[cat.name]}
                  title={cat.name}
                  count={cat.count}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section id="experiencias" className="pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              {activeCategory === "Todas"
                ? "Experiências em destaque"
                : activeCategory}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-card border border-border/50">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((exp) => (
                <ExperienceCard key={exp.id} {...exp} />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Nenhuma experiência encontrada nesta categoria.
            </p>
          )}
        </div>
      </section>

      <HowItWorks />
      <HostCTA />
      <Footer />
    </div>
  );
};

export default Index;
