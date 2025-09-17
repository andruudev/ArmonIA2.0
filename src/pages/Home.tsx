import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoodSlider } from "@/components/MoodSlider";
import { PublicStats } from "@/components/PublicStats";
import {
  Brain,
  Shield,
  Clock,
  BookOpen,
  Activity,
  Star,
  Sparkles,
  Users,
  ArrowRight,
  Heart,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

const benefits = [
  {
    icon: Clock,
    title: "Soporte 24/7",
    description:
      "Tu compañero IA siempre disponible para escucharte y ofrecerte apoyo cuando lo necesites.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    title: "Insights Inteligentes",
    description:
      "Análisis avanzado de patrones emocionales para ayudarte a entender mejor tu bienestar mental.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Privado y Seguro",
    description:
      "Tus datos están protegidos con encriptación de nivel empresarial. Tu privacidad es nuestra prioridad.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BookOpen,
    title: "Basado en Evidencia",
    description:
      "Recomendaciones fundamentadas en técnicas terapéuticas probadas y ciencia del comportamiento.",
    color: "from-orange-500 to-red-500",
  },
];

const stats = [
  { icon: Users, value: "10K+", label: "Usuarios Activos" },
  { icon: Heart, value: "95%", label: "Satisfacción" },
  { icon: Zap, value: "24/7", label: "Disponibilidad" },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMoodSelect = () => {
    if (!user) {
      navigate("/signup");
    } else {
      navigate("/dashboard");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <header className="relative border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 animate-slide-in-left">
            <div className="relative">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gradient">ArmonIA</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3 animate-slide-in-right">
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" className="hover-scale">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover-scale">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-hero hover-scale">
                    Comenzar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg animate-fade-in-up">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {user ? (
                <Link to="/dashboard" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <Button className="btn-hero w-full justify-start">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Comenzar Gratis
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Minimalist & Elegant */}
      <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 bg-gradient-to-br from-background via-background to-secondary/20">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 opacity-60"></div>
        
        <div className="container mx-auto text-center max-w-6xl relative z-10 w-full">
          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
            {/* Premium Badge */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="whitespace-nowrap">Bienestar Mental con IA</span>
              </span>
            </div>
            
            {/* Hero Title */}
            <div className="animate-fade-in-up space-y-2 sm:space-y-3 md:space-y-4" style={{ animationDelay: "0.2s" }}>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
                <span className="block text-gradient">ArmonIA</span>
              </h1>
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-5xl mx-auto leading-relaxed px-2 sm:px-4">
                Tu compañero de <span className="text-primary font-medium whitespace-nowrap">salud mental</span> disponible 24/7
              </p>
            </div>

            {/* Value Proposition */}
            <div className="animate-fade-in-up max-w-4xl mx-auto px-2 sm:px-4" style={{ animationDelay: "0.4s" }}>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground/80 leading-relaxed">
                Soporte emocional inteligente que te escucha, entiende y guía hacia tu bienestar
              </p>
            </div>

            {/* Interactive Demo */}
            <div className="animate-fade-in-up px-2 sm:px-4" style={{ animationDelay: "0.6s" }}>
              <Card className="max-w-xl mx-auto bg-background/60 backdrop-blur-md border-primary/20 shadow-2xl">
                <CardContent className="p-3 xs:p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 md:mb-4">¿Cómo te sientes hoy?</p>
                  <div className="w-full">
                    <MoodSlider onMoodSelect={handleMoodSelect} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="animate-fade-in-up space-y-3 sm:space-y-4 px-2 sm:px-4" style={{ animationDelay: "0.8s" }}>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
                {!user && (
                  <>
                    <Link to="/signup" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="whitespace-nowrap">Comenzar gratis</span>
                        <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      </Button>
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="ghost"
                        className="w-full sm:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-medium rounded-full hover:bg-primary/10 transition-all duration-300"
                      >
                        <span className="whitespace-nowrap">Iniciar sesión</span>
                      </Button>
                    </Link>
                  </>
                )}
                {user && (
                  <Link to="/dashboard" className="w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="whitespace-nowrap">Ir al Dashboard</span>
                      <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-col xs:flex-row items-center justify-center gap-2 xs:gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground/60 pt-1 sm:pt-2 md:pt-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">10K+ usuarios</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">100% privado</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">24/7 disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Por qué elegir <span className="text-gradient">ArmonIA</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Una plataforma integral diseñada para apoyar tu bienestar
              emocional con tecnología de vanguardia y un enfoque humano
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="hover-lift hover-glow shadow-soft animate-fade-in-up h-full group cursor-pointer border-0 bg-gradient-to-br from-background to-background/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <benefit.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center text-base leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Public Stats Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <PublicStats />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl text-center">
          <Card className="shadow-2xl border-primary/20 bg-gradient-to-br from-background via-background/95 to-primary/5 hover-lift">
            <CardContent className="p-12 md:p-16">
              <div className="flex justify-center mb-8 animate-scale-in">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-8 w-8 text-yellow-400 fill-current mx-1"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground mb-10 leading-relaxed animate-fade-in-up">
                "ArmonIA me ha ayudado a entender mejor mis patrones emocionales
                y a desarrollar técnicas efectivas para manejar el estrés. Es
                como tener un <span className="text-primary font-bold">terapeuta disponible 24/7</span>."
              </blockquote>
              <cite className="text-primary font-bold text-xl animate-slide-in-left">
                — María González, Usuaria Beta
              </cite>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur-sm py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6 animate-scale-in">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient">ArmonIA</span>
          </div>
          <p className="text-muted-foreground mb-4 text-lg">
            Bootcamp FullStack La Fábrica - Jeniffer Huera, David Guanoluisa &
            Jeyson Mueses
          </p>
          <p className="text-xl">From 🇪🇨 With 💙 to the 🌍</p>
        </div>
      </footer>
    </div>
  );
};
