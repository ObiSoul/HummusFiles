import VolumeControl from '@/react-app/components/VolumeControl';

interface MainMenuProps {
  onResumeGame: () => void;
  onNewGame: () => void;
  onTutorial: () => void;
  onCloseGame: () => void;
  isGameInProgress: boolean;
}

export default function MainMenu({ onResumeGame, onNewGame, onTutorial, onCloseGame, isGameInProgress }: MainMenuProps) {
  const handleResumeClick = () => {
    console.log('Resume clicked!');
    onResumeGame();
  };

  const handleNewGameClick = () => {
    console.log('New Game clicked!');
    onNewGame();
  };

  const handleTutorialClick = () => {
    console.log('Tutorial clicked!');
    onTutorial();
  };

  const handleCloseClick = () => {
    console.log('Close clicked!');
    onCloseGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 via-green-700 to-green-900 flex items-center justify-center pixel-art">
      <div className="text-center">
        <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-4 md:p-8 pixel-shadow max-w-xs md:max-w-md mx-auto">
          <h1 className="text-xl md:text-4xl font-bold text-white mb-4 md:mb-6 pixel-text leading-tight">
            Main Menu
          </h1>
          
          {/* Volume Control */}
          <div className="mb-6">
            <VolumeControl showLabel={true} className="justify-center" />
          </div>
          
          <div className="flex flex-col gap-2 md:gap-4">
            {isGameInProgress && (
              <button
                onClick={handleResumeClick}
                onMouseDown={(e) => e.preventDefault()}
                className="bg-green-600 hover:bg-green-500 border-4 border-green-800 text-white font-bold text-xs md:text-lg px-3 md:px-6 py-1.5 md:py-3 rounded transition-colors pixel-button pixel-text cursor-pointer select-none"
                style={{ 
                  position: 'relative',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                  userSelect: 'none'
                }}
              >
                Resume Game
              </button>
            )}
            
            <button
              onClick={handleNewGameClick}
              onMouseDown={(e) => e.preventDefault()}
              className="bg-blue-600 hover:bg-blue-500 border-4 border-blue-800 text-white font-bold text-xs md:text-lg px-3 md:px-6 py-1.5 md:py-3 rounded transition-colors pixel-button pixel-text cursor-pointer select-none"
              style={{ 
                position: 'relative',
                zIndex: 9999,
                pointerEvents: 'auto',
                userSelect: 'none'
              }}
            >
              {isGameInProgress ? 'New Game' : 'Start Game'}
            </button>
            
            <button
              onClick={handleTutorialClick}
              onMouseDown={(e) => e.preventDefault()}
              className="bg-purple-600 hover:bg-purple-500 border-4 border-purple-800 text-white font-bold text-xs md:text-lg px-3 md:px-6 py-1.5 md:py-3 rounded transition-colors pixel-button pixel-text cursor-pointer select-none"
              style={{ 
                position: 'relative',
                zIndex: 9999,
                pointerEvents: 'auto',
                userSelect: 'none'
              }}
            >
              Tutorial
            </button>
            
            <button
              onClick={handleCloseClick}
              onMouseDown={(e) => e.preventDefault()}
              className="bg-red-600 hover:bg-red-500 border-4 border-red-800 text-white font-bold text-xs md:text-lg px-3 md:px-6 py-1.5 md:py-3 rounded transition-colors pixel-button pixel-text cursor-pointer select-none"
              style={{ 
                position: 'relative',
                zIndex: 9999,
                pointerEvents: 'auto',
                userSelect: 'none'
              }}
            >
              Close Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
