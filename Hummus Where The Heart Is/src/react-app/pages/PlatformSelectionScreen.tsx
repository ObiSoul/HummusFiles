import VolumeControl from '@/react-app/components/VolumeControl';

interface PlatformSelectionScreenProps {
  onPlatformSelected: (platform: 'desktop' | 'mobile') => void;
}

export default function PlatformSelectionScreen({ onPlatformSelected }: PlatformSelectionScreenProps) {
  const handlePlatformSelect = (platform: 'desktop' | 'mobile') => {
    localStorage.setItem('platform_preference', platform);
    onPlatformSelected(platform);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-700 to-indigo-900 flex items-center justify-center pixel-art">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight pixel-text">
          Welcome!
        </h1>
        
        <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-8 pixel-shadow max-w-lg mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 pixel-text">
            Choose Your Platform
          </h2>
          
          {/* Volume Control */}
          <div className="mb-6">
            <VolumeControl showLabel={true} className="justify-center" />
          </div>
          
          <p className="text-amber-200 text-sm pixel-text mb-8 leading-relaxed">
            Select your device type for the best gaming experience!
          </p>
          
          <div className="space-y-6">
            <div className="bg-green-800 border-4 border-green-700 rounded-lg p-6 hover:bg-green-700 transition-colors">
              <h3 className="text-white font-bold text-lg pixel-text mb-3">🖥️ Desktop</h3>
              <p className="text-green-200 text-xs pixel-text mb-4 leading-relaxed">
                Enhanced with drag & drop controls! Click and drag items between inventory, fridge, kitchen, and battle platter. Perfect for mouse users.
              </p>
              <button
                onClick={() => handlePlatformSelect('desktop')}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text border-4 border-green-800"
              >
                Play on Desktop
              </button>
            </div>
            
            <div className="bg-blue-800 border-4 border-blue-700 rounded-lg p-6 hover:bg-blue-700 transition-colors">
              <h3 className="text-white font-bold text-lg pixel-text mb-3">📱 Mobile</h3>
              <p className="text-blue-200 text-xs pixel-text mb-4 leading-relaxed">
                Optimized touch controls! Tap items to open action menus, select slots, and move items easily. Perfect for phones and tablets.
              </p>
              <button
                onClick={() => handlePlatformSelect('mobile')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text border-4 border-blue-800"
              >
                Play on Mobile
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t-2 border-amber-700">
            <p className="text-amber-300 text-xs pixel-text opacity-80">
              Don't worry - you can change this later in game settings!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
