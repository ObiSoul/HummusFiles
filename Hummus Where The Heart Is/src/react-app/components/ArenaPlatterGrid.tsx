interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number;
  dayObtained?: number;
}

interface ShakeEffect {
  itemIndex: number;
  isOpponent: boolean;
  endTime: number;
}

interface ArenaPlatterGridProps {
  platterItems: (InventoryItem | null)[];
  upgradedSlots?: number[];
  isOpponent?: boolean;
  title: string;
  shakeEffects?: ShakeEffect[];
  onItemHold?: (item: InventoryItem | null, index: number, event: React.MouseEvent) => void;
}

import { useState, useRef } from 'react';

export default function ArenaPlatterGrid({ platterItems, upgradedSlots = Array(4).fill(0), isOpponent = false, title, shakeEffects = [], onItemHold }: ArenaPlatterGridProps) {
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const holdStartTime = useRef<number>(0);

  const handleMouseDown = (item: InventoryItem | null, index: number, event: React.MouseEvent) => {
    if (!item || !onItemHold) return;
    
    holdStartTime.current = Date.now();
    const timer = setTimeout(() => {
      onItemHold(item, index, event);
    }, 500); // 500ms hold time
    setHoldTimer(timer);
  };

  const handleMouseUp = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  const handleMouseLeave = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  
  const getSlotStyle = (level: number) => {
    if (level === 0) return isOpponent ? 'bg-red-700 border-red-600' : 'bg-indigo-700 border-indigo-600';
    if (level === 1) return 'bg-gradient-to-br from-yellow-600 to-orange-700 border-yellow-400';
    if (level === 2) return 'bg-gradient-to-br from-orange-600 to-red-700 border-orange-400';
    if (level >= 3) return 'bg-gradient-to-br from-red-600 to-purple-700 border-red-400';
    return isOpponent ? 'bg-red-700 border-red-600' : 'bg-indigo-700 border-indigo-600';
  };

  return (
    <div className={`${isOpponent ? 'bg-red-900 border-red-800' : 'bg-indigo-900 border-indigo-800'} border-4 rounded-lg p-4 pixel-shadow`}>
      <h3 className="text-white font-bold text-lg pixel-text mb-4 text-center">{title}</h3>
      
      <div className="flex justify-center">
        <div className={`grid gap-3 md:gap-4 ${
          platterItems.length <= 4 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' :
          platterItems.length <= 6 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6' :
          platterItems.length <= 9 ? 'grid-cols-3 md:grid-cols-3' :
          'grid-cols-3 md:grid-cols-4'
        }`}>
          {platterItems.map((item, index) => {
            const upgradeLevel = upgradedSlots[index];
            
            // Check if this item should be shaking
            const shouldShake = shakeEffects.some(shake => 
              shake.itemIndex === index && 
              shake.isOpponent === isOpponent && 
              shake.endTime > Date.now()
            );
            
            return (
              <div
                key={index}
                className={`aspect-square w-16 h-16 md:w-20 md:h-20 border-2 rounded flex items-center justify-center pixel-slot ${getSlotStyle(upgradeLevel)} ${shouldShake ? 'arena-item-pop' : ''}`}
                onMouseDown={(e) => handleMouseDown(item, index, e)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {item && (
                  <div className="relative w-full h-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded pixel-item"
                    />
                    {item.quantity > 1 && (
                      <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center pixel-quantity">
                        {item.quantity}
                      </div>
                    )}
                    {/* Spoilage overlay */}
                    {item.spoilageLevel === 1 && (
                      <div className="absolute inset-0 bg-green-400 opacity-20 rounded pointer-events-none pixel-spoiling"></div>
                    )}
                    {item.spoilageLevel === 2 && (
                      <div className="absolute inset-0 bg-red-900 opacity-40 rounded pointer-events-none pixel-rotten flex items-center justify-center">
                        <span className="text-red-200 text-sm">💀</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Upgrade indicator for upgraded slots */}
                {upgradeLevel > 0 && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 border border-yellow-600 rounded-full w-4 h-4 flex items-center justify-center">
                    <span className="text-yellow-900 text-xs font-bold">
                      {upgradeLevel === 1 ? '⚡' : upgradeLevel === 2 ? '🔥' : upgradeLevel >= 3 ? '💎' : '⚡'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
