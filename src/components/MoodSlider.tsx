import React, { useState, memo, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface MoodType {
  id: string;
  name: string;
  emoji: string;
  value: number;
  color: string;
}

const MOODS: readonly MoodType[] = [
  { id: 'down', name: 'Triste', emoji: '😔', value: 1, color: 'mood-down' },
  { id: 'content', name: 'Content@', emoji: '😊', value: 2, color: 'mood-content' },
  { id: 'peaceful', name: 'Tranquil@', emoji: '😌', value: 3, color: 'mood-peaceful' },
  { id: 'happy', name: 'Feliz', emoji: '🤗', value: 4, color: 'mood-happy' },
  { id: 'excited', name: 'Emocionad@', emoji: '✨', value: 5, color: 'mood-excited' },
] as const;

interface MoodSliderProps {
  onMoodSelect?: (mood: MoodType) => void;
  selectedMood?: MoodType | null;
  variant?: 'interactive' | 'display';
  disabled?: boolean;
}

interface MoodButtonProps {
  mood: MoodType;
  isSelected: boolean;
  variant: 'interactive' | 'display';
  disabled?: boolean;
  onClick: (mood: MoodType) => void;
}

const MoodButton = memo<MoodButtonProps>(({ mood, isSelected, variant, disabled, onClick }) => {
  const handleClick = useCallback(() => {
    if (variant === 'interactive' && !disabled) {
      onClick(mood);
    }
  }, [mood, variant, disabled, onClick]);

  const buttonClassName = useMemo(() => {
    const baseClasses = 'btn-mood relative group min-h-16 sm:min-h-20 flex-1 sm:max-w-24 transition-all duration-200';
    const selectedClasses = isSelected ? `${mood.color} scale-105 sm:scale-110 shadow-lg` : '';
    const interactiveClasses = variant === 'interactive' && !disabled ? 'cursor-pointer hover:scale-105' : 'cursor-default';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    return `${baseClasses} ${selectedClasses} ${interactiveClasses} ${disabledClasses}`.trim();
  }, [mood.color, isSelected, variant, disabled]);

  return (
    <Button
      key={mood.id}
      variant="ghost"
      className={buttonClassName}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Seleccionar estado de ánimo: ${mood.name}`}
      aria-pressed={isSelected}
    >
      <div className="flex flex-col items-center gap-1 sm:gap-2">
        <span 
          className="text-2xl sm:text-3xl transition-transform duration-200 group-hover:scale-110"
          role="img"
          aria-label={mood.name}
        >
          {mood.emoji}
        </span>
        <span className="text-xs sm:text-sm font-medium text-center leading-tight">
          {mood.name}
        </span>
        {isSelected && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
        )}
      </div>
    </Button>
  );
});

MoodButton.displayName = 'MoodButton';

export const MoodSlider = memo<MoodSliderProps>(({ 
  onMoodSelect, 
  selectedMood,
  variant = 'interactive',
  disabled = false
}) => {
  const [currentMood, setCurrentMood] = useState<MoodType | null>(selectedMood || null);

  const handleMoodClick = useCallback((mood: MoodType) => {
    if (disabled) return;
    
    setCurrentMood(mood);
    onMoodSelect?.(mood);
  }, [onMoodSelect, disabled]);

  const selectedMoodId = useMemo(() => {
    return currentMood?.id || selectedMood?.id;
  }, [currentMood?.id, selectedMood?.id]);

  return (
    <div className="w-full" role="radiogroup" aria-label="Selector de estado de ánimo">
      {/* Mobile: 2-column grid, Desktop: horizontal row */}
      <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 justify-center items-center">
        {MOODS.map((mood) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selectedMoodId === mood.id}
            variant={variant}
            disabled={disabled}
            onClick={handleMoodClick}
          />
        ))}
      </div>
      
      {currentMood && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Estado actual: <span className="font-medium text-foreground">{currentMood.name}</span>
          </p>
        </div>
      )}
    </div>
  );
});

MoodSlider.displayName = 'MoodSlider';

// Export moods for use in other components
export const moods = MOODS;