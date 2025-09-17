import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudio } from '@/hooks/useAudio';
import { toast } from 'sonner';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight,
  Music,
  Wind,
  TreePine,
  Zap,
  Heart,
  Brain
} from 'lucide-react';

const categoryIcons = {
  nature: TreePine,
  ambient: Music,
  meditation: Brain,
  'white-noise': Zap
};

const categoryNames = {
  nature: 'Naturaleza',
  ambient: 'Ambiente',
  meditation: 'Meditación',
  'white-noise': 'Ruido Blanco'
};

export const AudioPlayer: React.FC = () => {
  const {
    isPlaying,
    currentTrack,
    volume,
    currentTime,
    duration,
    audioTracks,
    play,
    pause,
    stop,
    setVolume,
    setAudioTime,
    getRecommendedTracks
  } = useAudio();

  const [activeTab, setActiveTab] = useState('all');
  const [isMuted, setIsMuted] = useState(false);

  // No need for audio event listeners with synthetic audio

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.5);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const filteredTracks = activeTab === 'all' 
    ? audioTracks 
    : audioTracks.filter(track => track.category === activeTab);

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons];
    return Icon ? <Icon className="h-4 w-4" /> : <Music className="h-4 w-4" />;
  };

  const handlePlay = (track: any) => {
    play(track);
    toast.success(`🎵 Reproduciendo: ${track.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            Reproductor de Audio
          </CardTitle>
          <CardDescription>
            Sonidos relajantes para mejorar tu bienestar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentTrack ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(currentTrack.category)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{currentTrack.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
                </div>
                <Badge variant="secondary">
                  {categoryNames[currentTrack.category as keyof typeof categoryNames]}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={(value) => setAudioTime(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAudioTime(Math.max(0, currentTime - 10))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={isPlaying ? pause : () => currentTrack && handlePlay(currentTrack)}
                    size="sm"
                    className="btn-peaceful"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stop}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAudioTime(Math.min(duration, currentTime + 10))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1 sm:w-20">
                    <Slider
                      value={[volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecciona una pista para comenzar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Track Library */}
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Sonidos</CardTitle>
          <CardDescription>
            Explora nuestra colección de sonidos relajantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
              <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
              <TabsTrigger value="nature" className="text-xs">Naturaleza</TabsTrigger>
              <TabsTrigger value="ambient" className="text-xs">Ambiente</TabsTrigger>
              <TabsTrigger value="meditation" className="text-xs">Meditación</TabsTrigger>
              <TabsTrigger value="white-noise" className="text-xs">Ruido Blanco</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredTracks.map((track) => (
                  <Card 
                    key={track.id} 
                    className={`cursor-pointer hover-lift transition-all ${
                      currentTrack?.id === track.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => play(track)}
                  >
                    <CardContent className="p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(track.category)}
                        </div>
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <h4 className="font-semibold text-sm truncate">{track.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{track.description}</p>
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {categoryNames[track.category as keyof typeof categoryNames]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(track.duration / 60)} min
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={currentTrack?.id === track.id ? "default" : "outline"}
                          className="flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentTrack?.id === track.id) {
                              isPlaying ? pause() : handlePlay(track);
                            } else {
                              handlePlay(track);
                            }
                          }}
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* No hidden audio element needed for synthetic audio */}
    </div>
  );
};
