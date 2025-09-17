import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Music } from 'lucide-react';

export const Audio: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient flex items-center justify-center gap-2">
          <Music className="h-8 w-8 text-primary" />
          Sonidos Relajantes
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explora nuestra biblioteca de sonidos terapéuticos diseñados para mejorar tu bienestar mental
        </p>
      </div>

      <AudioPlayer />
    </div>
  );
};
