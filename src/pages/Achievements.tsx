import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GamificationPanel } from '@/components/GamificationPanel';
import { Trophy } from 'lucide-react';

export const Achievements: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Logros y Progreso
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Desbloquea logros, sube de nivel y celebra tu crecimiento personal en el camino del bienestar
        </p>
      </div>

      <GamificationPanel />
    </div>
  );
};
