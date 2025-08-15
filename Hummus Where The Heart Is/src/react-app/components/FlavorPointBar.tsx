interface FlavorPointBarProps {
  currentPoints: number;
  maxPoints: number;
  isOpponent?: boolean;
  label: string;
}

export default function FlavorPointBar({ currentPoints, maxPoints, isOpponent = false, label }: FlavorPointBarProps) {
  const percentage = (currentPoints / maxPoints) * 100;
  const barColor = isOpponent ? 'from-red-500 to-red-600' : 'from-yellow-400 to-yellow-500';
  const bgColor = isOpponent ? 'bg-red-900' : 'bg-yellow-900';
  const borderColor = isOpponent ? 'border-red-700' : 'border-yellow-700';

  return (
    <div className={`${bgColor} ${borderColor} border-4 rounded-lg p-4 pixel-shadow`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-bold text-sm pixel-text">{label}</h3>
        <span className="text-white font-bold text-sm pixel-text">{currentPoints}/100</span>
      </div>
      
      <div className={`w-full ${bgColor} border-2 ${borderColor} rounded-lg h-6 overflow-hidden pixel-shadow-inner`}>
        <div 
          className={`h-full bg-gradient-to-r ${barColor} transition-all duration-500 ease-out pixel-glow`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-gradient-to-t from-transparent via-white to-transparent opacity-20"></div>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <span className="text-white text-xs pixel-text opacity-80">Flavor Points</span>
      </div>
    </div>
  );
}
