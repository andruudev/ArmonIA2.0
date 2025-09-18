import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
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

const CATEGORY_ICONS = {
  nature: TreePine,
  ambient: Music,
  meditation: Brain,
  'white-noise': Zap
} as const;

const CATEGORY_NAMES = {
  nature: 'Naturaleza',
  ambient: 'Ambiente',
  meditation: 'Meditación',
  'white-noise': 'Ruido Blanco'
} as const;

interface TrackItemProps {
  track: any;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  onPlay: (track: any) => void;
}

const TrackItem = memo<TrackItemProps>(({ track, isCurrentTrack, isPlaying, onPlay }) => {
  const handlePlay = useCallback(() => {
    onPlay(track);
  }, [track, onPlay]);

  const IconComponent = CATEGORY_ICONS[track.category as keyof typeof CATEGORY_ICONS] || Music;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isCurrentTrack ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={handlePlay}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${isCurrentTrack ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <IconComponent className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{track.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{track.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {track.duration}
            </Badge>
            {isCurrentTrack && (
              <div className="flex items-center">
                {isPlaying ? (
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-primary animate-pulse"></div>
                    <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <Pause className="h-3 w-3 text-primary" />
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

TrackItem.displayName = 'TrackItem';

interface ControlsProps {
  isPlaying: boolean;
  currentTrack: any;
  volume: number;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Controls = memo<ControlsProps>(({
  isPlaying,
  currentTrack,
  volume,
  currentTime,
  duration,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  onSeek,
  onPrevious,
  onNext
}) => {
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    onVolumeChange(value[0]);
  }, [onVolumeChange]);

  const handleSeek = useCallback((value: number[]) => {
    onSeek(value[0]);
  }, [onSeek]);

  const progress = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  if (!currentTrack) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Selecciona una pista para comenzar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Track Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="sm" onClick={onPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {isPlaying ? (
              <Button onClick={onPause} size="lg" className="rounded-full">
                <Pause className="h-6 w-6" />
              </Button>
            ) : (
              <Button onClick={onPlay} size="lg" className="rounded-full">
                <Play className="h-6 w-6" />
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={onStop}>
              <Square className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={onNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            {volume === 0 ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            )}
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">{volume}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

Controls.displayName = 'Controls';

export const AudioPlayer = memo(() => {
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
    seek,
    nextTrack,
    previousTrack,
    playTrack
  } = useAudio();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(audioTracks.map(track => track.category)));
    return ['all', ...cats];
  }, [audioTracks]);

  const filteredTracks = useMemo(() => {
    if (selectedCategory === 'all') return audioTracks;
    return audioTracks.filter(track => track.category === selectedCategory);
  }, [audioTracks, selectedCategory]);

  const handleTrackPlay = useCallback((track: any) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      playTrack(track);
    }
  }, [currentTrack?.id, isPlaying, pause, play, playTrack]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="space-y-6">
      {/* Audio Controls */}
      <Controls
        isPlaying={isPlaying}
        currentTrack={currentTrack}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        onPlay={play}
        onPause={pause}
        onStop={stop}
        onVolumeChange={setVolume}
        onSeek={seek}
        onPrevious={previousTrack}
        onNext={nextTrack}
      />

      {/* Track Library */}
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Audio</CardTitle>
          <CardDescription>
            Selecciona sonidos relajantes para mejorar tu bienestar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {categories.slice(1).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES] || category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="mt-6">
              <div className="grid gap-3">
                {filteredTracks.map((track) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    isCurrentTrack={currentTrack?.id === track.id}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    onPlay={handleTrackPlay}
                  />
                ))}
              </div>
              
              {filteredTracks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay pistas disponibles en esta categoría</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';
