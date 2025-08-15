import { useState } from 'react';
import VolumeControl from '@/react-app/components/VolumeControl';

interface StartScreenProps {
  onStartGame: () => void;
  hasSaveFile?: boolean;
  onLoadGame?: () => void;
  hasNewGamePlusUnlocked?: boolean;
  onStartNewGamePlus?: () => void;
}

export default function StartScreen({ onStartGame, hasSaveFile, onLoadGame, hasNewGamePlusUnlocked, onStartNewGamePlus }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [showNameEntry, setShowNameEntry] = useState(false);
  
  

  const handleStartNewJourney = () => {
    setShowNameEntry(true);
  };

  const handleContinueJourney = () => {
    if (onLoadGame) {
      onLoadGame();
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      // Store the player name (could be passed to game state later)
      localStorage.setItem('playerName', playerName.trim());
      onStartGame();
    }
  };

  const handleBackToMenu = () => {
    setShowNameEntry(false);
    setPlayerName('');
  };

  if (showNameEntry) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-800 via-green-700 to-green-900 flex items-center justify-center pixel-art">
        <div className="text-center">
          <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-8 pixel-shadow max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pixel-text">
              Enter Your Name
            </h2>
            
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Chef's Name..."
                  maxLength={20}
                  className="w-full px-4 py-3 text-lg font-bold bg-amber-100 border-4 border-amber-600 rounded text-amber-900 placeholder-amber-600 pixel-text focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoFocus
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!playerName.trim()}
                  className={`w-full font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text border-4 ${
                    playerName.trim()
                      ? 'bg-green-600 hover:bg-green-500 border-green-800 text-white'
                      : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Begin Adventure!
                </button>
                
                <button
                  type="button"
                  onClick={handleBackToMenu}
                  className="w-full bg-red-600 hover:bg-red-500 border-4 border-red-800 text-white font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 via-green-700 to-green-900 flex items-center justify-center pixel-art">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight pixel-text">
          Hummus<br/>
          Where The<br/>
          Heart Is
        </h1>
        
        <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-6 pixel-shadow max-w-md mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 pixel-text">
            Welcome, Chef!
          </h2>
          
          {/* Volume Control */}
          <div className="mb-6">
            <VolumeControl showLabel={true} className="justify-center" />
          </div>
          
          <div className="space-y-4">
            {hasSaveFile && (
              <button
                onClick={handleContinueJourney}
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text border-4 border-blue-800"
              >
                💾 Continue Saved Game
              </button>
            )}
            
            <button
              onClick={handleStartNewJourney}
              className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text border-4 border-green-800"
            >
              Start New Journey
            </button>
            
            {hasNewGamePlusUnlocked && (
              <button
                onClick={onStartNewGamePlus}
                className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text border-4 border-purple-800"
              >
                🚀 New Game+ (Keep Recipes)
              </button>
            )}
            
            
            
            <div className="pt-4 border-t-2 border-amber-700">
              <p className="text-amber-200 text-sm pixel-text mb-3">
                A charming farming adventure awaits!
              </p>
              <p className="text-amber-300 text-xs pixel-text">
                Grow crops, cook recipes, and battle in the arena
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
