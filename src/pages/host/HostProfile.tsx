import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Save, Camera } from "lucide-react";
import { useState } from "react";

export default function HostProfile() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Meu Perfil
        </h2>
        <p className="text-muted-foreground mt-1">
          Mantenha seus dados atualizados para os turistas.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl font-display bg-primary/10 text-primary">
                    H
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="font-medium text-foreground">Foto de perfil</p>
                <p className="text-sm text-muted-foreground">JPG ou PNG, até 2MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input id="name" defaultValue="João da Silva" required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input id="phone" defaultValue="(11) 99999-0000" required maxLength={20} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" defaultValue="joao@email.com" disabled />
              <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
            </div>
          </CardContent>
        </Card>

        {/* Property */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Sobre a Propriedade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property-name">Nome da propriedade</Label>
              <Input id="property-name" placeholder="Ex: Fazenda Boa Vista" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço completo</Label>
              <Input id="address" placeholder="Rua, número, bairro, cidade, estado" maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Sobre você / sua propriedade</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre sua história e o que oferece..."
                rows={4}
                maxLength={1000}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
