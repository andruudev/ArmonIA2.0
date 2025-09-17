import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Wind, Play, Pause, RotateCcw, CheckCircle, Music } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface BreathingSession {
  id: string;
  completedAt: string;
  duration: number;
  cycles: number;
}

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const { user } = useAuth();

  const phases = {
    inhale: { duration: 4, text: 'Inhala profundamente', color: 'from-blue-400 to-cyan-400' },
    hold: { duration: 4, text: 'Mantén la respiración', color: 'from-purple-400 to-indigo-400' },
    exhale: { duration: 6, text: 'Exhala lentamente', color: 'from-green-400 to-emerald-400' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(phases.hold.duration);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(phases.exhale.duration);
      } else if (phase === 'exhale') {
        setCycle(cycle + 1);
        if (cycle + 1 >= totalCycles) {
          // Exercise completed
          completeSession();
          return;
        }
        setPhase('inhale');
        setTimeLeft(phases.inhale.duration);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, cycle, totalCycles]);

  const completeSession = () => {
    setIsActive(false);
    
    if (user) {
      // Save session
      const session: BreathingSession = {
        id: Date.now().toString(),
        completedAt: new Date().toISOString(),
        duration: totalCycles * (phases.inhale.duration + phases.hold.duration + phases.exhale.duration),
        cycles: totalCycles
      };

      const key = `armonia_breathing_${user.id}`;
      const sessions = JSON.parse(localStorage.getItem(key) || '[]');
      sessions.unshift(session);
      localStorage.setItem(key, JSON.stringify(sessions));
    }

    toast.success('¡Ejercicio completado! Te sientes más relajado.');
    reset();
  };

  const start = () => {
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(phases.inhale.duration);
    setCycle(0);
  };

  const currentPhase = phases[phase];
  const progress = ((totalCycles * (phases.inhale.duration + phases.hold.duration + phases.exhale.duration) - 
    (totalCycles - cycle - 1) * (phases.inhale.duration + phases.hold.duration + phases.exhale.duration) - timeLeft) / 
    (totalCycles * (phases.inhale.duration + phases.hold.duration + phases.exhale.duration))) * 100;

  return (
    <Card className="shadow-mood border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wind className="h-6 w-6 text-primary" />
          Respiración Guiada 4-4-6
        </CardTitle>
        <CardDescription>
          Técnica de respiración para reducir el estrés y la ansiedad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Breathing Circle */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              className={`
                w-32 h-32 rounded-full bg-gradient-to-br ${currentPhase.color}
                flex items-center justify-center text-white font-bold text-xl
                transition-all duration-1000 ease-in-out
                ${isActive ? 'animate-breath' : ''}
                ${phase === 'inhale' ? 'scale-110' : phase === 'exhale' ? 'scale-90' : 'scale-100'}
              `}
            >
              {timeLeft}
            </div>
            {isActive && (
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse" />
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">{currentPhase.text}</h3>
          <p className="text-muted-foreground">
            Ciclo {cycle + 1} de {totalCycles}
          </p>
          <Progress value={progress} className="w-full max-w-xs mx-auto" />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isActive ? (
            <Button onClick={start} className="btn-peaceful">
              <Play className="h-4 w-4 mr-2" />
              {cycle === 0 ? 'Comenzar' : 'Continuar'}
            </Button>
          ) : (
            <Button onClick={pause} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
          )}
          
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        {/* Cycle Selector */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Número de ciclos:</p>
          <div className="flex justify-center gap-2">
            {[3, 5, 8, 10].map(num => (
              <Button
                key={num}
                variant={totalCycles === num ? "default" : "outline"}
                size="sm"
                onClick={() => setTotalCycles(num)}
                disabled={isActive}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="font-medium">Cómo funciona:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Inhala</strong> por 4 segundos</li>
            <li>• <strong>Mantén</strong> la respiración por 4 segundos</li>
            <li>• <strong>Exhala</strong> lentamente por 6 segundos</li>
            <li>• Repite el ciclo para máximo beneficio</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export const Activities: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<BreathingSession[]>([]);

  useEffect(() => {
    if (user) {
      const key = `armonia_breathing_${user.id}`;
      const storedSessions = JSON.parse(localStorage.getItem(key) || '[]');
      setSessions(storedSessions);
    }
  }, [user]);

  const totalSessions = sessions.length;
  const totalMinutes = Math.round(sessions.reduce((sum, session) => sum + session.duration, 0) / 60);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient">
          Actividades de Bienestar
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explora ejercicios interactivos diseñados para mejorar tu bienestar mental y reducir el estrés.
        </p>
      </div>

      {/* Stats */}
      {totalSessions > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-6">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalSessions}</p>
              <p className="text-sm text-muted-foreground">Sesiones completadas</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Wind className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalMinutes}</p>
              <p className="text-sm text-muted-foreground">Minutos practicados</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Badge variant="secondary" className="mb-2">
                {totalSessions < 5 ? 'Principiante' : totalSessions < 15 ? 'Intermedio' : 'Avanzado'}
              </Badge>
              <p className="text-sm text-muted-foreground">Nivel actual</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BreathingExercise />

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Sesiones</CardTitle>
            <CardDescription>
              Tus ejercicios recientes de respiración
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wind className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aún no has completado ninguna sesión.</p>
                <p className="text-sm mt-2">¡Comienza tu primera sesión de respiración!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {sessions.slice(0, 8).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {session.cycles} ciclos completados
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(session.duration / 60)} minutos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.completedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audio Player Section */}
      <Card className="shadow-soft border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            Sonidos Relajantes
          </CardTitle>
          <CardDescription>
            Explora nuestra biblioteca de sonidos para mejorar tu bienestar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AudioPlayer />
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="border-dashed border-2 border-muted-foreground/30">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold text-muted-foreground">Próximamente</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium mb-2">🧘‍♀️ Meditación Guiada</p>
              <p>Sesiones de meditación con diferentes duraciones</p>
            </div>
            <div>
              <p className="font-medium mb-2">🎵 Sonidos Relajantes</p>
              <p>Biblioteca de sonidos para relajación</p>
            </div>
            <div>
              <p className="font-medium mb-2">📝 Diario Emocional</p>
              <p>Ejercicios de escritura terapéutica</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};