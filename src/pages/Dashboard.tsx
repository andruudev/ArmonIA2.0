import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MoodSlider, MoodType, moods } from '@/components/MoodSlider';
import { MoodChart } from '@/components/MoodChart';
import { GamificationPanel } from '@/components/GamificationPanel';
import { useMoods } from '@/hooks/useMoods';
import { useAuth } from '@/hooks/useAuth';
import { CalendarDays, TrendingUp, Brain, Sparkles, Plus, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { entries, addMoodEntry, getMoodStats, getChartData } = useMoods();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [journal, setJournal] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddEntry, setShowAddEntry] = useState(false);

  const stats = getMoodStats();
  const chartData = getChartData();

  const handleSubmitEntry = () => {
    if (!selectedMood) {
      toast.error('Por favor selecciona tu estado de ánimo');
      return;
    }

    addMoodEntry(selectedMood, journal, selectedDate);
    toast.success('¡Entrada guardada exitosamente!');
    
    // Reset form
    setSelectedMood(null);
    setJournal('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setShowAddEntry(false);
  };

  const handleRecommendationAction = () => {
    if (!recommendation) return;
    
    if (recommendation.action === 'Explorar Chat' || recommendation.action === 'Chat con IA') {
      navigate('/chat');
    } else if (recommendation.action === 'Ir a Actividades') {
      navigate('/activities');
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-success';
      case 'declining': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving': return 'Mejorando 📈';
      case 'declining': return 'Necesita atención 📉';
      default: return 'Estable 📊';
    }
  };

  const getRecommendation = () => {
    if (!stats) return null;

    if (stats.averageMood < 2.5) {
      return {
        title: 'Cuidemos tu bienestar',
        message: 'Parece que has tenido días difíciles. ¿Qué tal si pruebas nuestros ejercicios de respiración?',
        action: 'Ir a Actividades',
        variant: 'warning' as const
      };
    } else if (stats.averageMood > 4) {
      return {
        title: '¡Excelente trabajo! ✨',
        message: 'Tu estado de ánimo ha sido muy positivo. ¡Sigue así y comparte tu energía!',
        action: 'Chat con IA',
        variant: 'success' as const
      };
    } else {
      return {
        title: 'Buen equilibrio',
        message: 'Mantenes un estado emocional estable. ¿Te gustaría explorar técnicas para potenciar tu bienestar?',
        action: 'Explorar Chat',
        variant: 'default' as const
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            ¿Cómo te sientes hoy? Registra tu estado emocional y obtén insights personalizados.
          </p>
        </div>
        <Button 
          onClick={() => setShowAddEntry(!showAddEntry)}
          className="btn-hero"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Entrada
        </Button>
      </div>

      {/* Quick Add Entry */}
      {showAddEntry && (
        <Card className="shadow-mood border-primary/20 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Registrar Estado de Ánimo
            </CardTitle>
            <CardDescription>
              Comparte cómo te sientes y cualquier reflexión del día
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>¿Cómo te sientes?</Label>
              <div className="mt-2">
                <MoodSlider 
                  onMoodSelect={setSelectedMood}
                  selectedMood={selectedMood}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="journal">Reflexiones del día (opcional)</Label>
              <Textarea
                id="journal"
                placeholder="¿Qué te ha pasado hoy? ¿Cómo te sientes? Comparte tus pensamientos..."
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitEntry} className="btn-hero">
                Guardar Entrada
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddEntry(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado Promedio</p>
                  <p className="text-2xl font-bold">
                    {moods.find(m => Math.round(stats.averageMood) === m.value)?.emoji || '😊'}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entradas Totales</p>
                  <p className="text-2xl font-bold">{stats.totalEntries}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Últimos 7 días</p>
                  <p className="text-2xl font-bold">{stats.last7Days}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tendencia</p>
                  <p className={`text-lg font-bold ${getTrendColor(stats.trend)}`}>
                    {getTrendText(stats.trend)}
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendation Card */}
      {recommendation && (
        <Card className="shadow-soft border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{recommendation.title}</h3>
                <p className="text-muted-foreground mb-4">{recommendation.message}</p>
                <Button 
                  variant="outline" 
                  className="hover-lift"
                  onClick={handleRecommendationAction}
                >
                  {recommendation.action}
                </Button>
              </div>
              <Brain className="h-12 w-12 text-primary/40 ml-4" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gamification Panel */}
      <Card className="shadow-soft border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Tu Progreso
          </CardTitle>
          <CardDescription>
            Desbloquea logros y sube de nivel mientras mejoras tu bienestar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GamificationPanel />
        </CardContent>
      </Card>

      {/* Chart and Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodChart data={chartData} />

        <Card>
          <CardHeader>
            <CardTitle>Entradas Recientes</CardTitle>
            <CardDescription>
              Tus últimos registros emocionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aún no tienes entradas registradas.</p>
                <p className="text-sm mt-2">¡Comienza registrando tu primer estado de ánimo!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {entries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl">{entry.mood.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {entry.mood.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      {entry.journal && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.journal}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};