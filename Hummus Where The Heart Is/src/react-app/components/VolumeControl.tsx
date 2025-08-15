import { useState } from 'react';
import { useGameAudio } from '@/react-app/components/AudioProvider';
import { Volume2, VolumeX, Settings } from 'lucide-react';

interface VolumeControlProps {
  showLabel?: boolean;
  className?: string;
}

export default function VolumeControl({ showLabel = true, className = '' }: VolumeControlProps) {
  const { volume, isMuted, setVolume, toggleMute, isPlaying } = useGameAudio();
  const [showSlider, setShowSlider] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleSlider = () => {
    setShowSlider(!showSlider);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className="text-white pixel-text text-sm">
          🎵 Music: {isPlaying ? 'Playing' : 'Paused'}
        </span>
      )}
      
      <div className="flex items-center gap-2">
        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="bg-purple-600 hover:bg-purple-500 border-2 border-purple-800 text-white p-2 rounded transition-colors pixel-button"
          title={isMuted ? 'Unmute Music' : 'Mute Music'}
        >
          {isMuted ? (
            <VolumeX size={16} className="pixel-text" />
          ) : (
            <Volume2 size={16} className="pixel-text" />
          )}
        </button>

        {/* Volume Slider Toggle */}
        <button
          onClick={toggleSlider}
          className="bg-purple-600 hover:bg-purple-500 border-2 border-purple-800 text-white p-2 rounded transition-colors pixel-button"
          title="Volume Settings"
        >
          <Settings size={16} className="pixel-text" />
        </button>
      </div>

      {/* Volume Slider (expandable) */}
      {showSlider && (
        <div className="bg-purple-900 border-2 border-purple-700 rounded-lg p-3 pixel-shadow">
          <div className="flex items-center gap-3">
            <span className="text-purple-200 pixel-text text-xs min-w-[40px]">
              Vol:
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              disabled={isMuted}
              className="w-20 h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(isMuted ? 0 : volume) * 100}%, #4c1d95 ${(isMuted ? 0 : volume) * 100}%, #4c1d95 100%)`
              }}
            />
            <span className="text-purple-200 pixel-text text-xs min-w-[25px]">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
          
          {isMuted && (
            <p className="text-purple-300 pixel-text text-xs mt-2 text-center">
              Music is muted
            </p>
          )}
        </div>
      )}
    </div>
  );
}
