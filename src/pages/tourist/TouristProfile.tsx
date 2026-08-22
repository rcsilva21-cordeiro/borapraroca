import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function TouristProfile() {
  const { t } = useTranslation("tourist");
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: t("profile.saveErrorToast"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("profile.updatedToast"), description: t("profile.updatedToastDesc") });
    }
  };

  const initial = (fullName || user?.email || "T").charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">{t("profile.title")}</h2>
        <p className="text-muted-foreground mt-1">{t("profile.subtitle")}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl font-display bg-primary/10 text-primary">{initial}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{fullName || t("profile.defaultName")}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-lg">{t("profile.personalData")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("profile.fullName")}</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("profile.phone")}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder={t("profile.phonePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("profile.email")}</Label>
              <Input id="email" type="email" value={user?.email || ""} disabled />
              <p className="text-xs text-muted-foreground">{t("profile.emailHint")}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? t("profile.saving") : t("profile.saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
}
