import { ArrowRight, Home, TrendingUp, Shield, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const benefits = [
  { icon: <Home className="h-5 w-5" />, text: "Cadastre sua propriedade ou atividade gratuitamente" },
  { icon: <TrendingUp className="h-5 w-5" />, text: "Aumente sua visibilidade e faturamento" },
  { icon: <Shield className="h-5 w-5" />, text: "Curadoria e suporte da plataforma" },
];

function usePlatformStats() {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const [expRes, hostRes, bookingRes] = await Promise.all([
        supabase.from("experiences").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "hospedeiro"),
        supabase.from("bookings").select("id", { count: "exact", head: true }).in("status", ["confirmed", "completed"]),
      ]);
      return {
        experiences: expRes.count ?? 0,
        hosts: hostRes.count ?? 0,
        bookings: bookingRes.count ?? 0,
      };
    },
    staleTime: 60_000,
  });
}

const HostCTA = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { data: stats, isLoading: statsLoading } = usePlatformStats();

  const handleBecomeHost = async () => {
    if (!user) {
      navigate("/entrar");
      return;
    }

    if (hasRole("hospedeiro")) {
      navigate("/hospedeiro");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc("become_host", { _user_id: user.id });
      if (error) throw error;
      toast({
        title: "Parabéns! 🎉",
        description: "Você agora é um Hospedeiro! Redirecionando para o painel...",
      });
      setTimeout(() => window.location.href = "/hospedeiro", 1000);
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const showStats = !statsLoading && stats && (stats.experiences > 0 || stats.hosts > 0 || stats.bookings > 0);

  return (
    <section id="hospedeiro" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-primary rounded-2xl p-8 md:p-14 lg:p-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Tem um sítio, fazenda ou experiência rural?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg">
              Torne-se um Hospedeiro e compartilhe o melhor do campo com turistas de todo o Brasil.
            </p>
            <div className="flex flex-col gap-4 mb-8">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 text-primary-foreground/90">
                  <div className="text-earth-gold">{b.icon}</div>
                  <span className="text-sm">{b.text}</span>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="gap-2 font-semibold"
              onClick={handleBecomeHost}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {hasRole("hospedeiro") ? "Acessar Painel" : "Quero ser Hospedeiro"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-primary-foreground/60 text-sm mt-6">
              Tem um sítio ou fazenda e não sabe como começar a sua Experiência Rural?
              <br />A gente te ajuda! Clique abaixo!
            </p>
            <Link to="/hospedeiro/construcao" className="mt-2 inline-block">
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 font-semibold"
              >
                <HelpCircle className="h-4 w-4" />
                Preciso de ajuda com minha propriedade
              </Button>
            </Link>
          </div>
          <div className="flex-1 hidden lg:block">
            <div className="bg-primary-foreground/10 rounded-xl p-8 text-center">
              {statsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-32 mx-auto bg-primary-foreground/20" />
                  <Skeleton className="h-4 w-48 mx-auto bg-primary-foreground/10" />
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 bg-primary-foreground/10 rounded-lg" />
                    <Skeleton className="h-16 bg-primary-foreground/10 rounded-lg" />
                  </div>
                </div>
              ) : showStats ? (
                <>
                  <p className="font-display text-5xl font-bold text-primary-foreground mb-2">
                    {stats!.hosts}
                  </p>
                  <p className="text-primary-foreground/70 text-sm">
                    {stats!.hosts === 1 ? "hospedeiro cadastrado" : "hospedeiros cadastrados"}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-display text-2xl font-bold text-earth-gold">
                        {stats!.experiences}
                      </p>
                      <p className="text-primary-foreground/60 text-xs">
                        {stats!.experiences === 1 ? "experiência ativa" : "experiências ativas"}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-earth-gold">
                        {stats!.bookings}
                      </p>
                      <p className="text-primary-foreground/60 text-xs">
                        {stats!.bookings === 1 ? "reserva realizada" : "reservas realizadas"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <p className="font-display text-2xl font-bold text-earth-gold mb-2">
                    Seja o primeiro!
                  </p>
                  <p className="text-primary-foreground/70 text-sm">
                    Cadastre sua experiência e comece a receber turistas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostCTA;
