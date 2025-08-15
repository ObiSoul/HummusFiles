interface ResourceBarProps {
  lives: number;
  stamina: number;
  maxStamina?: number;
  gold: number;
  currentDay: number;
  onSleep?: () => void;
  onWorkshopClick?: () => void;
  isWorkshopOpen?: boolean;
  isBattleDay?: boolean;
  hasBattledToday?: boolean;
}

// Helper function to convert day number to season and day
function getDayDisplay(day: number): string {
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const seasonIndex = Math.floor((day - 1) / 7);
  const dayInSeason = ((day - 1) % 7) + 1;
  
  if (seasonIndex >= 4 || day > 28) {
    return 'Game Complete';
  }
  
  return `${seasons[seasonIndex]} ${dayInSeason}`;
}

export default function ResourceBar({ lives, stamina, maxStamina, gold, currentDay, onSleep, onWorkshopClick, isWorkshopOpen, isBattleDay, hasBattledToday }: ResourceBarProps) {
  return (
    <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-4 pixel-shadow mb-6">
      {/* Top Row - Day and Resources */}
      <div className="flex items-center justify-between mb-4">
        {/* Day Display - Left */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-600 border-2 border-yellow-800 rounded pixel-sun"></div>
          <span className="text-white font-bold text-base md:text-lg pixel-text">{getDayDisplay(currentDay)}</span>
        </div>

        {/* Resources - Right */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 border-2 border-red-800 rounded pixel-heart"></div>
            <span className="text-white font-bold text-base md:text-lg pixel-text">{lives}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded pixel-stamina"></div>
            <span className="text-white font-bold text-base md:text-lg pixel-text">
              {stamina}{maxStamina && maxStamina !== 12 ? `/${maxStamina}` : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 pixel-coin"></div>
            <span className="text-white font-bold text-base md:text-lg pixel-text">{gold}</span>
          </div>
        </div>
      </div>

      {/* Bottom Row - Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        {onWorkshopClick && (
          <button
            onClick={onWorkshopClick}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors pixel-button border-2 ${
              isWorkshopOpen
                ? 'bg-purple-600 border-purple-800 text-white'
                : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
            }`}
            title="Workshop - Battle Platter"
          >
            <span className="text-lg">⚔️</span>
            <span className="text-white font-bold text-xs md:text-sm pixel-text">Workshop</span>
          </button>
        )}

        {onSleep && currentDay <= 28 && (
          <button
            onClick={onSleep}
            disabled={isBattleDay && !hasBattledToday}
            className={`font-bold text-xs md:text-sm px-3 md:px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
              isBattleDay && !hasBattledToday
                ? 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-800 text-white cursor-pointer'
            }`}
            title={isBattleDay && !hasBattledToday ? "You must battle before sleeping on battle days!" : "Sleep to end the day"}
          >
            💤 Sleep {isBattleDay && !hasBattledToday ? '(Battle Required)' : ''}
          </button>
        )}
      </div>
    </div>
  );
}
