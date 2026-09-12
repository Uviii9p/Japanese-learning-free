'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { japaneseVoiceEngine, PlayState } from '@/lib/audio/JapaneseVoiceEngine';
import { SpeedPreset } from '@/lib/audio/pronunciation';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

export interface JapaneseAudioButtonProps {
  text: string;
  speed?: SpeedPreset | number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  autoPlay?: boolean;
  className?: string;
  wordByWord?: boolean;
}

export function JapaneseAudioButton({
  text,
  speed = 'normal',
  showLabel = false,
  label = 'Listen',
  size = 'md',
  variant = 'secondary',
  autoPlay = false,
  className = '',
  wordByWord = false,
}: JapaneseAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = japaneseVoiceEngine.subscribeState((state, activeText) => {
      if (activeText === text || activeText?.includes(text.slice(0, 4))) {
        setIsPlaying(state === 'playing');
        setIsLoading(state === 'loading');
      } else {
        setIsPlaying(false);
        setIsLoading(false);
      }
    });

    if (autoPlay && text) {
      const timer = setTimeout(() => {
        handleClick();
      }, 400);
      return () => {
        clearTimeout(timer);
        unsubscribe();
      };
    }

    return () => unsubscribe();
  }, [text, autoPlay]);

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (isPlaying) {
      japaneseVoiceEngine.cancel();
    } else {
      if (wordByWord) {
        japaneseVoiceEngine.speakWordByWord(text, 400, { rate: speed });
      } else {
        japaneseVoiceEngine.speak(text, { rate: speed });
      }
    }
  };

  const iconSizes = { sm: 14, md: 18, lg: 24 };
  const buttonPadding = {
    sm: '0.25rem 0.6rem',
    md: '0.5rem 1rem',
    lg: '0.75rem 1.25rem'
  };

  const getVariantStyles = () => {
    if (variant === 'primary') return 'btn-primary';
    if (variant === 'ghost') return 'btn-ghost';
    if (variant === 'icon') return 'btn-ghost btn-icon';
    return 'btn-secondary';
  };

  return (
    <button
      className={`btn ${getVariantStyles()} ${className}`}
      onClick={handleClick}
      aria-label={`Play audio for ${text}`}
      style={{
        padding: variant === 'icon' ? undefined : buttonPadding[size],
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        position: 'relative',
      }}
    >
      {isLoading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : (
        <motion.div
          animate={isPlaying ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={isPlaying ? { repeat: Infinity, duration: 0.8 } : {}}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Volume2 size={iconSizes[size]} color={isPlaying ? 'var(--sakura-400)' : 'currentColor'} />
        </motion.div>
      )}

      {/* Visual Sound Wave Pulse Indicator */}
      {isPlaying && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            fontSize: '0.75rem',
            color: 'var(--sakura-400)',
            fontWeight: 800,
            letterSpacing: '0.05em',
          }}
        >
          🔊〰️
        </motion.span>
      )}

      {showLabel && (
        <span style={{ fontSize: size === 'sm' ? '0.75rem' : '0.85rem' }}>
          {isPlaying ? 'Speaking...' : label}
        </span>
      )}
    </button>
  );
}
