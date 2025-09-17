import { useState, useRef, useEffect } from 'react';

export interface AudioTrack {
  id: string;
  name: string;
  category: 'nature' | 'ambient' | 'meditation' | 'white-noise';
  duration: number;
  description: string;
  mood: string[];
  frequency?: number;
  type?: 'sine' | 'square' | 'sawtooth' | 'triangle' | 'white-noise';
}

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const audioTracks: AudioTrack[] = [
    {
      id: 'rain',
      name: 'Lluvia Relajante',
      category: 'nature',
      duration: 600,
      description: 'Sonido de lluvia suave para relajación',
      mood: ['triste', 'estresado', 'ansioso'],
      frequency: 200,
      type: 'white-noise'
    },
    {
      id: 'ocean',
      name: 'Olas del Océano',
      category: 'nature',
      duration: 480,
      description: 'Sonido de olas para meditación',
      mood: ['tranquilo', 'feliz', 'contento'],
      frequency: 150,
      type: 'sine'
    },
    {
      id: 'forest',
      name: 'Bosque Sereno',
      category: 'nature',
      duration: 720,
      description: 'Sonidos del bosque con pájaros',
      mood: ['feliz', 'emocionado', 'contento'],
      frequency: 300,
      type: 'sine'
    },
    {
      id: 'ambient-1',
      name: 'Ambiente Espacial',
      category: 'ambient',
      duration: 900,
      description: 'Música ambiente para concentración',
      mood: ['tranquilo', 'contento'],
      frequency: 100,
      type: 'triangle'
    },
    {
      id: 'meditation',
      name: 'Meditación Guiada',
      category: 'meditation',
      duration: 1200,
      description: 'Música de meditación con campanas',
      mood: ['triste', 'estresado', 'ansioso'],
      frequency: 220,
      type: 'sine'
    },
    {
      id: 'white-noise',
      name: 'Ruido Blanco',
      category: 'white-noise',
      duration: 3600,
      description: 'Ruido blanco para concentración',
      mood: ['ansioso', 'estresado'],
      type: 'white-noise'
    }
  ];

  useEffect(() => {
    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  const createOscillator = (track: AudioTrack) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const filterNode = audioContextRef.current.createBiquadFilter();
    
    // Configure filter based on track type
    if (track.type === 'white-noise') {
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1000, audioContextRef.current.currentTime);
    } else {
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, audioContextRef.current.currentTime);
    }
    
    if (track.type === 'white-noise') {
      // Create white noise using buffer
      const bufferSize = audioContextRef.current.sampleRate * 2;
      const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = audioContextRef.current.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;
      whiteNoise.connect(filterNode);
      filterNode.connect(gainNode);
      whiteNoise.start();
      
      oscillatorRef.current = whiteNoise as any;
    } else {
      oscillator.type = track.type || 'sine';
      oscillator.frequency.setValueAtTime(track.frequency || 440, audioContextRef.current.currentTime);
      
      // Add some modulation for more interesting sounds
      if (track.category === 'nature') {
        const lfo = audioContextRef.current.createOscillator();
        const lfoGain = audioContextRef.current.createGain();
        lfo.frequency.setValueAtTime(0.5, audioContextRef.current.currentTime);
        lfoGain.gain.setValueAtTime(50, audioContextRef.current.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start();
      }
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      oscillator.start();
      
      oscillatorRef.current = oscillator;
    }
    
    gainNode.connect(audioContextRef.current.destination);
    gainNode.gain.value = volume * 0.3; // Lower volume for synthetic audio
    gainNodeRef.current = gainNode;
  };

  const play = (track: AudioTrack) => {
    if (isPlaying) {
      stop();
    }
    
    setCurrentTrack(track);
    setDuration(track.duration);
    setCurrentTime(0);
    setIsPlaying(true);
    
    // Show notification
    console.log(`🎵 Reproduciendo: ${track.name}`);
    
    createOscillator(track);
    
    // Start timer
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        if (newTime >= track.duration) {
          stop();
          return track.duration;
        }
        return newTime;
      });
    }, 1000);
  };

  const pause = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const stop = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const setAudioTime = (time: number) => {
    setCurrentTime(time);
    // For synthetic audio, we can't seek to specific time
    // This is a limitation of the current implementation
  };

  const getRecommendedTracks = (mood: string) => {
    return audioTracks.filter(track => 
      track.mood.includes(mood.toLowerCase())
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
    };
  }, []);

  return {
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
  };
};
