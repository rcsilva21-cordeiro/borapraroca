import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Users, Clock, Calendar, Heart, Share2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { experiences } from "@/data/experiences";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking } from "@/hooks/useBookings";

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const createBooking = useCreateBooking();
  const [isFav, setIsFav] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [guests, setGuests] = useState(1);

  const exp = experiences.find((e) => e.id === Number(id));

  if (!exp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Experiência não encontrada</h2>
          <Button onClick={() => navigate("/")}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const highlights = [
    { icon: <Users className="h-5 w-5" />, label: "Capacidade", value: `Até ${exp.capacity} pessoas` },
    { icon: <Clock className="h-5 w-5" />, label: "Duração", value: exp.category === "Hospedagem" ? "Diária" : "Meio dia" },
    { icon: <Calendar className="h-5 w-5" />, label: "Disponibilidade", value: "Todos os dias" },
    { icon: <Star className="h-5 w-5 text-accent fill-accent" />, label: "Avaliação", value: `${exp.rating.toFixed(1)} (${Math.floor(Math.random() * 80 + 20)} avaliações)` },
  ];

  const included = exp.category === "Hospedagem"
    ? ["Café da manhã colonial", "Estacionamento", "Wi-Fi", "Piscina natural", "Trilha guiada"]
    : ["Equipamento incluso", "Guia especializado", "Seguro atividade", "Lanche e hidratação", "Fotos da experiência"];

  const totalPrice = exp.price * guests;

  const handleReserve = async () => {
    if (!user) {
      toast({
        title: "Faça login primeiro",
        description: "Você precisa estar logado para reservar.",
      });
      navigate("/entrar");
      return;
    }

    if (!bookingDate) {
      toast({
        title: "Selecione uma data",
        description: "Escolha a data desejada para a experiência.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createBooking.mutateAsync({
        experience_id: String(exp.id),
        booking_date: bookingDate,
        guests,
        total_price: totalPrice,
        status: "pending",
      });
      toast({
        title: "Reserva solicitada! 🎉",
        description: "O hospedeiro irá confirmar sua reserva em breve.",
      });
      navigate("/minhas-reservas");
    } catch (error: any) {
      toast({
        title: "Erro ao reservar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
            <span>/</span>
            <Link to="/#experiencias" className="hover:text-foreground transition-colors">Experiências</Link>
            <span>/</span>
            <span className="text-foreground">{exp.title}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="container mx-auto px-4 lg:px-8 mb-8">
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
            <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-hero" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <Badge className="bg-primary/90 text-primary-foreground border-0 mb-3">{exp.category}</Badge>
                <h1 className="font-display text-3xl lg:text-5xl font-bold text-white mb-2">{exp.title}</h1>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span>{exp.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                  onClick={() => {
                    setIsFav(!isFav);
                    toast({ title: isFav ? "Removido dos favoritos" : "Adicionado aos favoritos ❤️" });
                  }}
                >
                  <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: "Link copiado! 📋" });
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {highlights.map((h) => (
                  <div key={h.label} className="bg-card rounded-xl p-4 border border-border/50 text-center">
                    <div className="flex justify-center text-primary mb-2">{h.icon}</div>
                    <p className="text-xs text-muted-foreground mb-1">{h.label}</p>
                    <p className="font-semibold text-sm text-foreground">{h.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Sobre a experiência</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {exp.description || `Venha viver uma experiência única em ${exp.location}. ${exp.title} oferece uma imersão completa na vida rural brasileira, com todo o conforto e autenticidade que você merece.`}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Uma oportunidade de se reconectar com a natureza, saborear a culinária regional e criar memórias inesquecíveis com sua família e amigos.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">O que está incluso</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {included.map((item) => (
                    <div key={item} className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border/50">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Sobre o Hospedeiro</h2>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display text-xl font-bold text-primary">
                      {exp.title.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Hospedeiro verificado</p>
                    <p className="text-sm text-muted-foreground">Membro desde 2024 · Responde em até 1h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar — booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl p-6 border border-border/50 shadow-lg space-y-6">
                <div>
                  <span className="text-sm text-muted-foreground">A partir de</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-primary">R$ {exp.price}</span>
                    <span className="text-muted-foreground text-sm">
                      / {exp.category === "Hospedagem" ? "noite" : "pessoa"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <label className="text-xs text-muted-foreground block mb-1">Data</label>
                    <input
                      type="date"
                      min={minDate}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-transparent text-foreground text-sm outline-none"
                    />
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <label className="text-xs text-muted-foreground block mb-1">Participantes</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-transparent text-foreground text-sm outline-none"
                    >
                      {Array.from({ length: exp.capacity }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "pessoa" : "pessoas"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price summary */}
                {bookingDate && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        R$ {exp.price} × {guests} {guests === 1 ? "pessoa" : "pessoas"}
                      </span>
                      <span className="text-foreground">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary font-display text-lg">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleReserve}
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {createBooking.isPending ? "Reservando..." : "Reservar agora"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Você não será cobrado ainda. A confirmação é feita pelo hospedeiro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExperienceDetail;
