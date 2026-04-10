import { useState } from "react";
import { Share2, Copy, MessageCircle, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  className?: string;
}

export default function ShareButton({ title, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const url = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado! 📋");
    setOpen(false);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Olha essa experiência no Bora pra Roça: ${title} - ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setOpen(false);
  };

  const shareInstagram = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado! Cole no Instagram 📸");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={className || "rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="end">
        <div className="space-y-1">
          <button onClick={copyLink} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
            <Copy className="h-4 w-4" /> Copiar link
          </button>
          <button onClick={shareWhatsApp} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
          <button onClick={shareInstagram} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
            <Link2 className="h-4 w-4" /> Instagram
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
