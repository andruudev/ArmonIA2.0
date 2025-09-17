import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Wind, 
  Calendar,
  Star,
  Zap,
  Earth,
  Shield,
  Clock,
  Target
} from 'lucide-react';

interface PublicStats {
  totalUsers: number;
  totalMoodEntries: number;
  totalBreathingSessions: number;
  totalChatMessages: number;
  averageMoodImprovement: number;
  activeUsersToday: number;
  streakRecord: number;
  communityWellness: number;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    improvement: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    count: number;
    icon: string;
  }>;
}

export const PublicStats: React.FC = () => {
  const [stats, setStats] = useState<PublicStats>({
    totalUsers: 0,
    totalMoodEntries: 0,
    totalBreathingSessions: 0,
    totalChatMessages: 0,
    averageMoodImprovement: 0,
    activeUsersToday: 0,
    streakRecord: 0,
    communityWellness: 0,
    testimonials: [],
    achievements: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and generate demo stats
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalMoodEntries: 15632,
        totalBreathingSessions: 8934,
        totalChatMessages: 45231,
        averageMoodImprovement: 1.8,
        activeUsersToday: 89,
        streakRecord: 127,
        communityWellness: 87,
        testimonials: [
          {
            id: '1',
            name: 'María González',
            role: 'Usuaria desde hace 3 meses',
            content: 'ArmonIA me ha ayudado a entender mejor mis patrones emocionales y a desarrollar técnicas efectivas para manejar el estrés. Es como tener un terapeuta disponible 24/7.',
            rating: 5,
            improvement: '+2.3 puntos de bienestar'
          },
          {
            id: '2',
            name: 'Carlos Ruiz',
            role: 'Estudiante universitario',
            content: 'Los ejercicios de respiración han sido un cambio total. Antes tenía ataques de ansiedad, ahora puedo controlarlos con las técnicas que aprendí aquí.',
            rating: 5,
            improvement: '+1.8 puntos de bienestar'
          },
          {
            id: '3',
            name: 'Ana Martínez',
            role: 'Profesional de la salud',
            content: 'Como profesional, recomiendo ArmonIA a mis pacientes. La IA es increíblemente empática y las herramientas son muy efectivas.',
            rating: 5,
            improvement: '+2.1 puntos de bienestar'
          }
        ],
        achievements: [
          {
            id: '1',
            title: 'Comunidad Activa',
            description: 'Usuarios activos esta semana',
            count: 234,
            icon: '👥'
          },
          {
            id: '2',
            title: 'Días de Bienestar',
            description: 'Días consecutivos de mejora comunitaria',
            count: 45,
            icon: '📅'
          },
          {
            id: '3',
            title: 'Logros Desbloqueados',
            description: 'Logros conseguidos por la comunidad',
            count: 1256,
            icon: '🏆'
          },
          {
            id: '4',
            title: 'Sesiones Completadas',
            description: 'Ejercicios de respiración esta semana',
            count: 892,
            icon: '🫁'
          }
        ]
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando estadísticas de la comunidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Impacto de la Comunidad</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Únete a miles de personas que están transformando su bienestar mental con ArmonIA
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center hover-lift">
          <CardContent className="p-6">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold">{formatNumber(stats.totalUsers)}</p>
            <p className="text-sm text-muted-foreground">Usuarios Activos</p>
            <Badge variant="secondary" className="mt-2">
              +12% este mes
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center hover-lift">
          <CardContent className="p-6">
            <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{formatNumber(stats.totalMoodEntries)}</p>
            <p className="text-sm text-muted-foreground">Estados Registrados</p>
            <Badge variant="secondary" className="mt-2">
              +23% esta semana
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center hover-lift">
          <CardContent className="p-6">
            <Wind className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{formatNumber(stats.totalBreathingSessions)}</p>
            <p className="text-sm text-muted-foreground">Sesiones de Respiración</p>
            <Badge variant="secondary" className="mt-2">
              +18% esta semana
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center hover-lift">
          <CardContent className="p-6">
            <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{formatNumber(stats.totalChatMessages)}</p>
            <p className="text-sm text-muted-foreground">Conversaciones con IA</p>
            <Badge variant="secondary" className="mt-2">
              +31% esta semana
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Community Wellness */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Earth className="h-6 w-6 text-primary" />
            Bienestar de la Comunidad
          </CardTitle>
          <CardDescription>
            Nivel promedio de bienestar mental de todos nuestros usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{stats.communityWellness}%</span>
              <Badge className="bg-green-500 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% este mes
              </Badge>
            </div>
            <Progress value={stats.communityWellness} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-500">+{stats.averageMoodImprovement}</p>
                <p className="text-xs text-muted-foreground">Mejora Promedio</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{stats.activeUsersToday}</p>
                <p className="text-xs text-muted-foreground">Activos Hoy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-500">{stats.streakRecord}</p>
                <p className="text-xs text-muted-foreground">Racha Máxima</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Achievements */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">Logros de la Comunidad</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.achievements.map((achievement) => (
            <Card key={achievement.id} className="text-center hover-lift">
              <CardContent className="p-4">
                <span className="text-3xl mb-2 block">{achievement.icon}</span>
                <p className="text-2xl font-bold">{formatNumber(achievement.count)}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">Lo que dice nuestra comunidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-muted-foreground mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.improvement}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-6 text-center">
          <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-semibold mb-2">Tu Privacidad es Importante</h4>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Todas las estadísticas son completamente anónimas. Nunca compartimos información personal 
            y todos los datos están encriptados con tecnología de nivel empresarial.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
