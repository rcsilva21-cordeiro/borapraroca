import { useState } from "react";
import { TreePine, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isLogin ? "Bem-vindo de volta! 🌿" : "Conta criada com sucesso! 🎉",
      description: isLogin
        ? "Redirecionando para as experiências..."
        : "Agora você pode explorar todas as experiências rurais.",
    });
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-warm items-center justify-center">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="relative z-10 text-center px-12 max-w-lg">
          <TreePine className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Sua próxima aventura rural começa aqui
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Descubra sítios, fazendas, trilhas e experiências gastronômicas autênticas por todo o Brasil.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary">200+</p>
              <p>Experiências</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary">50+</p>
              <p>Cidades</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary">4.8</p>
              <p>Avaliação</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </button>

          <a href="/" className="flex items-center gap-2 mb-8">
            <TreePine className="h-7 w-7 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">
              Bora<span className="text-primary">PraRoça</span>
            </span>
          </a>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {isLogin ? "Entrar na sua conta" : "Criar sua conta"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin
              ? "Acesse suas experiências e reservas"
              : "Cadastre-se e comece a explorar o campo"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Não tem conta?" : "Já tem uma conta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Cadastre-se grátis" : "Faça login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
