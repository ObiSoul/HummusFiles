interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number; // 0 = fresh, 1 = spoiling (green hue), 2 = rotten
  dayObtained?: number; // Track when item was obtained for spoilage
}

interface InventoryGridProps {
  items: (InventoryItem | null)[];
  onItemClick?: (item: InventoryItem | null, index: number) => void;
  onItemHold?: (item: InventoryItem | null, index: number, event: React.MouseEvent) => void;
  platformType?: 'desktop' | 'mobile';
  onDragStart?: (item: InventoryItem, index: number) => void;
}

import InfoButton from './InfoButton';
import { useState, useRef } from 'react';

export default function InventoryGrid({ items, onItemClick, onItemHold, platformType = 'mobile', onDragStart }: InventoryGridProps) {
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const holdStartTime = useRef<number>(0);
  
  const handleEmptySlotHold = (_index: number, event: React.MouseEvent) => {
    event.preventDefault();
    const tooltip = "Empty Inventory Slot - This is where you store all your items! Items here can spoil after 1-2 days (except seeds which never spoil). Move perishables to the fridge to prevent spoilage.";
    alert(tooltip);
  };

  const handleMouseDown = (item: InventoryItem | null, index: number, event: React.MouseEvent) => {
    // Only use hold functionality on desktop
    if (platformType === 'desktop') {
      holdStartTime.current = Date.now();
      const timer = setTimeout(() => {
        if (item) {
          onItemHold?.(item, index, event);
        } else {
          handleEmptySlotHold(index, event);
        }
      }, 500); // 500ms hold time
      setHoldTimer(timer);
    }
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

  const handleClick = (item: InventoryItem | null, index: number) => {
    // On mobile, always trigger click immediately
    if (platformType === 'mobile') {
      onItemClick?.(item, index);
    } else {
      // On desktop, only trigger click if it wasn't a long hold
      const holdDuration = Date.now() - holdStartTime.current;
      if (holdDuration < 500) {
        onItemClick?.(item, index);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, item: InventoryItem, index: number) => {
    if (platformType === 'desktop' && item) {
      e.dataTransfer.setData('application/json', JSON.stringify({
        item,
        sourceType: 'inventory',
        sourceIndex: index
      }));
      e.dataTransfer.effectAllowed = 'move';
      onDragStart?.(item, index);
    }
  };

  const handleRightClick = (e: React.MouseEvent, item: InventoryItem | null, index: number) => {
    if (platformType === 'desktop' && item) {
      e.preventDefault();
      onItemHold?.(item, index, e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, item: InventoryItem | null, index: number) => {
    if (platformType === 'desktop' && item) {
      onItemHold?.(item, index, e);
    }
  };

  const handleMouseLeaveTooltip = () => {
    if (platformType === 'desktop') {
      handleMouseLeave();
      // Hide tooltip by calling onItemHold with null
      onItemHold?.(null, -1, {} as React.MouseEvent);
    }
  };
  // Create a 5x5 grid (25 slots)
  const gridSlots = Array.from({ length: 25 }, (_, index) => items[index] || null);

  return (
    <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-4 pixel-shadow relative">
      <InfoButton
        title="Inventory"
        description="Your personal storage space for all items you own. Be careful, items spoil after two days! Seeds never spoil. Click items to move them to the fridge or plant seeds on empty farm plots."
      />
      <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Inventory</h2>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {gridSlots.map((item, index) => (
          <div
            key={index}
            className="aspect-square bg-amber-700 border-2 border-amber-600 rounded cursor-pointer hover:bg-amber-600 transition-colors flex items-center justify-center pixel-slot"
            onClick={() => handleClick(item, index)}
            onMouseDown={(e) => handleMouseDown(item, index, e)}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => handleRightClick(e, item, index)}
            onMouseEnter={(e) => platformType === 'desktop' ? handleMouseEnter(e, item, index) : undefined}
            onMouseLeave={handleMouseLeaveTooltip}
            draggable={platformType === 'desktop' && item !== null}
            onDragStart={(e) => item && handleDragStart(e, item, index)}
          >
            {item && (
              <div className="relative w-full h-full">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded pixel-item"
                />
                {item.quantity > 1 && (
                  <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center pixel-quantity">
                    {item.quantity}
                  </div>
                )}
                {/* Spoilage overlay */}
                {item.spoilageLevel === 1 && (
                  <div className="absolute inset-0 bg-green-400 opacity-20 rounded pointer-events-none pixel-spoiling"></div>
                )}
                {item.spoilageLevel === 2 && (
                  <div className="absolute inset-0 bg-red-900 opacity-40 rounded pointer-events-none pixel-rotten flex items-center justify-center">
                    <span className="text-red-200 text-lg">💀</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
