interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number;
  dayObtained?: number;
}

interface FridgeGridProps {
  items: (InventoryItem | null)[];
  unlockedSlots: number;
  selectedSlotIndex?: number | null;
  onItemClick?: (item: InventoryItem | null, index: number) => void;
  onItemHold?: (item: InventoryItem | null, index: number, event: React.MouseEvent) => void;
  onUnlockSlot?: () => void;
  gold: number;
  platformType?: 'desktop' | 'mobile';
  onDrop?: (dragData: any, targetIndex: number) => void;
}

import InfoButton from './InfoButton';
import { useState, useRef } from 'react';

export default function FridgeGrid({ items, unlockedSlots, selectedSlotIndex, onItemClick, onItemHold, onUnlockSlot, gold, platformType = 'mobile', onDrop }: FridgeGridProps) {
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const holdStartTime = useRef<number>(0);
  
  const handleEmptySlotHold = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (index < unlockedSlots) {
      const tooltip = "Empty Fridge Slot - Store items here to prevent spoilage! Items in the fridge stay fresh forever. Click items in your inventory to move them here for safe storage.";
      alert(tooltip);
    } else if (index === unlockedSlots && gold >= 5) {
      const tooltip = "Purchasable Fridge Slot - Click to buy this slot for 5 gold. Fridge slots prevent items from spoiling and give you more storage space!";
      alert(tooltip);
    } else if (index === unlockedSlots) {
      const tooltip = "Purchasable Fridge Slot - You need 5 gold to buy this slot. Fridge slots prevent items from spoiling!";
      alert(tooltip);
    }
  };

  const handleMouseDown = (slot: any, index: number, event: React.MouseEvent) => {
    holdStartTime.current = Date.now();
    const timer = setTimeout(() => {
      if (typeof slot !== 'string') {
        if (slot) {
          onItemHold?.(slot, index, event);
        } else {
          handleEmptySlotHold(index, event);
        }
      }
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

  const handleClick = (slot: any, index: number) => {
    // Only trigger click if it wasn't a long hold
    const holdDuration = Date.now() - holdStartTime.current;
    if (holdDuration < 500) {
      if (slot === 'purchasable' && gold >= slotCost && onUnlockSlot) {
        onUnlockSlot();
      } else if (typeof slot !== 'string') {
        onItemClick?.(slot, index);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (platformType === 'desktop' && index < unlockedSlots) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (platformType === 'desktop' && index < unlockedSlots) {
      e.preventDefault();
      try {
        const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
        onDrop?.(dragData, index);
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, item: InventoryItem, index: number) => {
    if (platformType === 'desktop' && item) {
      e.dataTransfer.setData('application/json', JSON.stringify({
        item,
        sourceType: 'fridge',
        sourceIndex: index
      }));
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleRightClick = (e: React.MouseEvent, slot: any, index: number) => {
    if (platformType === 'desktop' && slot && typeof slot !== 'string') {
      e.preventDefault();
      onItemHold?.(slot, index, e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, slot: any, index: number) => {
    if (platformType === 'desktop' && slot && typeof slot !== 'string') {
      onItemHold?.(slot, index, e);
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
  const gridSlots = Array.from({ length: 25 }, (_, index) => {
    if (index >= unlockedSlots && index !== unlockedSlots) {
      return 'locked';
    } else if (index === unlockedSlots && index < 25) {
      return 'purchasable';
    } else {
      return items[index] || null;
    }
  });

  const slotCost = 5;

  return (
    <div className="bg-blue-900 border-4 border-blue-800 rounded-lg p-4 pixel-shadow relative">
      <InfoButton
        title="Fridge"
        description="A cold storage space that keeps your items fresh forever! Items stored in the fridge never spoil. You start with 1 slot and can buy additional slots for 5 gold each. Click items to move them back to your inventory."
      />
      <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Fridge</h2>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {gridSlots.map((slot, index) => (
          <div
            key={index}
            className={`aspect-square bg-blue-700 border-2 rounded transition-colors flex items-center justify-center pixel-slot ${
              slot === 'locked' 
                ? 'border-gray-600 bg-gray-700 cursor-not-allowed pixel-locked-slot'
                : slot === 'purchasable'
                  ? `border-blue-600 hover:bg-blue-600 cursor-pointer ${gold >= slotCost ? 'bg-blue-800' : 'bg-gray-600 cursor-not-allowed'}`
                  : selectedSlotIndex === index && !slot
                    ? 'border-yellow-400 border-4 bg-yellow-100 cursor-pointer'
                    : 'border-blue-600 hover:bg-blue-600 cursor-pointer'
            }`}
            onClick={() => handleClick(slot, index)}
            onMouseDown={(e) => handleMouseDown(slot, index, e)}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => handleRightClick(e, slot, index)}
            onMouseEnter={(e) => handleMouseEnter(e, slot, index)}
            onMouseLeave={handleMouseLeaveTooltip}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            draggable={platformType === 'desktop' && slot && typeof slot !== 'string' ? true : false}
            onDragStart={(e) => slot && typeof slot !== 'string' && handleDragStart(e, slot, index)}
          >
            {slot === 'purchasable' ? (
              <div className="text-center">
                <div className="w-4 h-4 pixel-coin mx-auto mb-1"></div>
                <span className="text-white text-xs pixel-text">{slotCost}</span>
              </div>
            ) : slot === 'locked' ? (
              <div className="text-gray-500 text-lg">🔒</div>
            ) : slot && typeof slot !== 'string' ? (
              <div className="relative w-full h-full">
                <img
                  src={slot.image}
                  alt={slot.name}
                  className="w-full h-full object-cover rounded pixel-item"
                />
                {slot.quantity > 1 && (
                  <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center pixel-quantity">
                    {slot.quantity}
                  </div>
                )}
                {/* Items in fridge have a blue glow to indicate they don't spoil */}
                <div className="absolute inset-0 bg-blue-400 opacity-10 rounded pointer-events-none"></div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <p className="text-blue-200 text-xs pixel-text mt-2 text-center opacity-80">
        Items stored in the fridge don't spoil • Buy more slots for 5 gold each
      </p>
    </div>
  );
}
