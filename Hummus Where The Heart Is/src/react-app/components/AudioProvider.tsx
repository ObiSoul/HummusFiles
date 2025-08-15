import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAudio } from '@/react-app/hooks/useAudio';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  play: () => Promise<void>;
  pause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

const INTRO_MUSIC_URL = 'https://raw.githubusercontent.com/ObiSoul/SongBase/main/Hummus%20Where%20The%20Heart%20Is%20(Intro).mp3';

export function AudioProvider({ children }: AudioProviderProps) {
  const audio = useAudio(INTRO_MUSIC_URL);

  // Auto-start music when component mounts (with user interaction handling)
  useEffect(() => {
    const startAudio = async () => {
      // Only try to play if not muted and volume > 0
      if (!audio.isMuted && audio.volume > 0) {
        try {
          await audio.play();
        } catch (error) {
          // Modern browsers require user interaction first
          console.log('Audio autoplay blocked - waiting for user interaction');
          
          // Add click listener to start audio on first user interaction
          const handleFirstInteraction = async () => {
            try {
              await audio.play();
              document.removeEventListener('click', handleFirstInteraction);
              document.removeEventListener('keydown', handleFirstInteraction);
            } catch (e) {
              console.warn('Failed to start audio:', e);
            }
          };

          document.addEventListener('click', handleFirstInteraction);
          document.addEventListener('keydown', handleFirstInteraction);
        }
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(startAudio, 100);
    return () => clearTimeout(timer);
  }, [audio.play, audio.isMuted, audio.volume]);

  const contextValue: AudioContextType = {
    isPlaying: audio.isPlaying,
    volume: audio.volume,
    isMuted: audio.isMuted,
    play: audio.play,
    pause: audio.pause,
    setVolume: audio.setVolume,
    toggleMute: audio.toggleMute
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

export function useGameAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useGameAudio must be used within an AudioProvider');
  }
  return context;
}
