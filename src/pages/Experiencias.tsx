import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExperienceCard from "@/components/ExperienceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveExperiences, getPhotoUrl } from "@/hooks/useExperiences";
import { experiences as staticExperiences, categories, type Category } from "@/data/experiences";

const Experiencias = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";

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
          description: exp.description,
          location: exp.location,
          category: exp.category as Category,
          rating: exp.rating ?? 0,
          price: Number(exp.price),
          capacity: exp.capacity,
        };
      }),
    [dbExperiences]
  );

  const allExperiences = useMemo(() => {
    if (realExperiences.length >= 12) return realExperiences;
    const coveredCategories = new Set(realExperiences.map((r) => r.category));
    const seen = new Set<string>();
    const uncoveredFakes = (staticExperiences as any[]).filter((s) => {
      if (coveredCategories.has(s.category) || seen.has(s.category)) return false;
      seen.add(s.category);
      return true;
    });
    return [...realExperiences, ...uncoveredFakes];
  }, [realExperiences]);

  const filtered = useMemo(() => {
    let list = allExperiences;
    if (categoryFilter) {
      list = list.filter((e) => e.category === categoryFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          e.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allExperiences, searchQuery, categoryFilter]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 lg:px-8 pt-28 pb-20">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Experiências
        </h1>
        {searchQuery && (
          <p className="text-muted-foreground mb-6">
            Resultados para "<span className="text-foreground font-medium">{searchQuery}</span>"
          </p>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => {
            const isActive =
              (cat === "Todas" && !categoryFilter) || cat === categoryFilter;
            return (
              <button
                key={cat}
                onClick={() => setFilter("category", cat === "Todas" ? "" : cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-card border border-border/50"
              >
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
            Nenhuma experiência encontrada com esses filtros.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Experiencias;
