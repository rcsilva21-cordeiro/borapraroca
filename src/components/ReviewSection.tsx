import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews, useMyReview, useCreateReview, useReviewStats } from "@/hooks/useReviews";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReviewSectionProps {
  experienceId: string;
  isRealExperience: boolean;
}

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"}`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hover || value) ? "text-accent fill-accent" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ experienceId, isRealExperience }: ReviewSectionProps) {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("full_name").eq("user_id", user!.id).single();
      return data;
    },
  });
  const { data: reviews = [] } = useReviews(isRealExperience ? experienceId : undefined);
  const { data: myReview } = useMyReview(isRealExperience ? experienceId : undefined);
  const { average, count, hasReviews } = useReviewStats(isRealExperience ? experienceId : undefined);
  const createReview = useCreateReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!user) return;
    if (!comment.trim()) {
      toast.error("Escreva um comentário");
      return;
    }
    try {
      await createReview.mutateAsync({
        experience_id: experienceId,
        tourist_id: user.id,
        tourist_name: profile?.full_name || "Turista",
        rating,
        comment: comment.trim(),
      });
      toast.success("Avaliação enviada! ⭐");
      setComment("");
      setRating(5);
    } catch (e: any) {
      if (e.message?.includes("duplicate")) {
        toast.error("Você já avaliou esta experiência");
      } else {
        toast.error("Erro ao enviar avaliação");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="font-display text-2xl font-bold text-foreground">Avaliações</h2>
         {hasReviews && (
           <div className="flex items-center gap-2">
             <StarRating value={Math.round(average)} readonly />
             <span className="font-semibold text-foreground">{average.toFixed(1)}</span>
             <span className="text-sm text-muted-foreground">({count})</span>
           </div>
         )}
      </div>

      {!hasReviews && (
        <div className="bg-card rounded-xl p-6 border border-border/50 text-center">
          <div className="flex justify-center mb-2">
            <StarRating value={5} readonly />
          </div>
          <p className="text-muted-foreground">Seja o primeiro a avaliar!</p>
        </div>
      )}

      {/* Review form */}
      {user && !myReview && isRealExperience && (
        <div className="bg-card rounded-xl p-6 border border-border/50 space-y-4">
          <h3 className="font-display font-semibold text-foreground">Deixe sua avaliação</h3>
          <StarRating value={rating} onChange={setRating} />
          <Textarea
            placeholder="Conte como foi sua experiência..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            className="resize-none"
          />
          <Button onClick={handleSubmit} disabled={createReview.isPending} className="gap-2">
            <Send className="h-4 w-4" />
            Enviar avaliação
          </Button>
        </div>
      )}

      {!user && isRealExperience && (
        <p className="text-sm text-muted-foreground">Faça login para deixar sua avaliação.</p>
      )}

      {myReview && (
        <p className="text-sm text-primary">✅ Você já avaliou esta experiência.</p>
      )}

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{review.tourist_name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{review.tourist_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} readonly />
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
