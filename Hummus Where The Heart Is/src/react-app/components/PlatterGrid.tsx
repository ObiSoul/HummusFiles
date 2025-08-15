interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number;
  dayObtained?: number;
  sourceLocation?: 'inventory' | 'fridge'; // Track where item came from
  sourceIndex?: number; // Track specific slot it came from
}

interface PlatterGridProps {
  platterItems: (InventoryItem | null)[];
  upgradedSlots?: number[];
  unlockedSlots?: number;
  selectedSlotIndex?: number | null;
  onItemClick?: (item: InventoryItem | null, index: number) => void;
  onItemHold?: (item: InventoryItem | null, index: number, event: React.MouseEvent) => void;
  onRandomUpgrade?: () => void;
  onUnlockSlot?: () => void;
  onFindChef?: () => void;
  gold?: number;
  showUpgrade?: boolean;
  platformType?: 'desktop' | 'mobile';
  onDrop?: (dragData: any, targetIndex: number) => void;
  inventoryItems?: (InventoryItem | null)[];
  fridgeItems?: (InventoryItem | null)[];
  onPlaceItem?: (sourceLocation: 'inventory' | 'fridge', sourceIndex: number, targetPlatterIndex: number) => void;
  onReturnItem?: (platterIndex: number) => void;
}

import InfoButton from './InfoButton';
import { useState, useRef } from 'react';

export default function PlatterGrid({ platterItems, upgradedSlots = Array(12).fill(0), unlockedSlots = 4, selectedSlotIndex, onItemClick, onItemHold, onRandomUpgrade, onUnlockSlot, onFindChef, gold = 0, showUpgrade = false, platformType = 'mobile', onDrop, inventoryItems = [], fridgeItems = [], onPlaceItem, onReturnItem }: PlatterGridProps) {
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const holdStartTime = useRef<number>(0);
  const [showItemSelector, setShowItemSelector] = useState<{ visible: boolean; slotIndex: number }>({
    visible: false,
    slotIndex: -1
  });
  
  const handleEmptySlotHold = (_index: number, event: React.MouseEvent) => {
    event.preventDefault();
    // Show tooltip for empty platter slot
    const tooltip = "Battle Platter Slot - Place foods and spices here to prepare for PvP battles. Only seeds not allowed. Upgraded slots boost items placed in them.";
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
    // Check if this is a purchase slot
    if (index === unlockedSlots && index < 12 && gold >= 20 && onUnlockSlot) {
      onUnlockSlot();
      return;
    }
    
    // If there's an item on the platter, return it to its source
    if (item && onReturnItem) {
      onReturnItem(index);
      return;
    }
    
    // If it's an empty slot, show item selector
    if (!item && index < unlockedSlots) {
      setShowItemSelector({ visible: true, slotIndex: index });
      return;
    }
    
    // On mobile, always trigger click immediately for other cases
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

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (platformType === 'desktop' && index < unlockedSlots) {
      e.preventDefault();
      // Check if dragged item is valid for platter (only seeds can't go on platter)
      try {
        const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
        const isValidForPlatter = !dragData.item.id.endsWith('-seeds');
        if (isValidForPlatter) {
          e.dataTransfer.dropEffect = 'move';
        } else {
          e.dataTransfer.dropEffect = 'none';
        }
      } catch {
        e.dataTransfer.dropEffect = 'move';
      }
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (platformType === 'desktop' && index < unlockedSlots) {
      e.preventDefault();
      try {
        const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
        // Validate that only seeds can't go on platter (spices are now allowed)
        const isValidForPlatter = !dragData.item.id.endsWith('-seeds');
        if (isValidForPlatter) {
          onDrop?.(dragData, index);
        }
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, item: InventoryItem, index: number) => {
    if (platformType === 'desktop' && item) {
      e.dataTransfer.setData('application/json', JSON.stringify({
        item,
        sourceType: 'platter',
        sourceIndex: index
      }));
      e.dataTransfer.effectAllowed = 'move';
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

  // Get available items that can be placed on platter (no seeds)
  const getAvailableItems = () => {
    const items: Array<{ item: InventoryItem; source: 'inventory' | 'fridge'; sourceIndex: number }> = [];
    
    // Add inventory items
    inventoryItems.forEach((item, index) => {
      if (item && !item.id.endsWith('-seeds')) {
        items.push({ item, source: 'inventory', sourceIndex: index });
      }
    });
    
    // Add fridge items
    fridgeItems.forEach((item, index) => {
      if (item && !item.id.endsWith('-seeds')) {
        items.push({ item, source: 'fridge', sourceIndex: index });
      }
    });
    
    return items;
  };

  const handleSelectItem = (sourceLocation: 'inventory' | 'fridge', sourceIndex: number) => {
    if (onPlaceItem && showItemSelector.visible) {
      onPlaceItem(sourceLocation, sourceIndex, showItemSelector.slotIndex);
      setShowItemSelector({ visible: false, slotIndex: -1 });
    }
  };

  const handleCloseSelector = () => {
    setShowItemSelector({ visible: false, slotIndex: -1 });
  };
  return (
    <div className="bg-indigo-900 border-4 border-indigo-800 rounded-lg p-4 pixel-shadow relative">
      <InfoButton
        title="Battle Platter"
        description="Arrange your foods and spices on this platter to prepare for PvP battles! Only seeds cannot be placed here. Click items to move them back to inventory or click empty slots to select them for food placement."
      />
      <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Battle Platter</h2>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {platterItems.slice(0, Math.max(unlockedSlots, 12)).map((item, index) => {
            const upgradeLevel = upgradedSlots[index];
            const getSlotStyle = (level: number) => {
              if (level === 0) return 'bg-indigo-700 hover:bg-indigo-600 border-indigo-600';
              if (level === 1) return 'bg-gradient-to-br from-yellow-600 to-orange-700 hover:from-yellow-500 hover:to-orange-600 border-yellow-400';
              if (level === 2) return 'bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 border-orange-400';
              if (level >= 3) return 'bg-gradient-to-br from-red-600 to-purple-700 hover:from-red-500 hover:to-purple-600 border-red-400';
              return 'bg-indigo-700 hover:bg-indigo-600 border-indigo-600';
            };
            
            // Check if this slot is locked
            if (index >= unlockedSlots && index !== unlockedSlots) {
              return (
                <div
                  key={index}
                  className="aspect-square w-16 h-16 md:w-20 md:h-20 bg-gray-700 border-2 border-gray-600 rounded cursor-not-allowed transition-colors flex items-center justify-center pixel-slot opacity-50"
                >
                  <div className="text-gray-500 text-lg">🔒</div>
                </div>
              );
            }
            
            // Check if this is the purchasable slot
            if (index === unlockedSlots && index < 12) {
              const slotCost = 20; // Each platter slot costs 20 gold
              return (
                <div
                  key={index}
                  className={`aspect-square w-16 h-16 md:w-20 md:h-20 border-2 rounded transition-colors flex items-center justify-center pixel-slot cursor-pointer ${
                    gold >= slotCost
                      ? 'bg-indigo-800 border-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-600 border-gray-700 cursor-not-allowed'
                  }`}
                  onClick={() => handleClick(null, index)}
                  onMouseDown={(e) => handleMouseDown(null, index, e)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="text-center">
                    <div className="w-4 h-4 pixel-coin mx-auto mb-1"></div>
                    <span className="text-white text-xs pixel-text">{slotCost}</span>
                  </div>
                </div>
              );
            }
            
            return (
              <div
                key={index}
                className={`aspect-square w-16 h-16 md:w-20 md:h-20 border-2 rounded cursor-pointer transition-colors flex items-center justify-center pixel-slot relative ${
                  getSlotStyle(upgradeLevel)
                } ${
                  selectedSlotIndex === index && !item
                    ? 'border-yellow-400 border-4 bg-yellow-100'
                    : ''
                }`}
                onClick={() => handleClick(item, index)}
                onMouseDown={(e) => handleMouseDown(item, index, e)}
                onMouseUp={handleMouseUp}
                onContextMenu={(e) => handleRightClick(e, item, index)}
                onMouseEnter={(e) => platformType === 'desktop' ? handleMouseEnter(e, item, index) : undefined}
                onMouseLeave={handleMouseLeaveTooltip}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
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
              
              {/* Upgrade indicator for upgraded slots */}
              {upgradeLevel > 0 && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 border border-yellow-600 rounded-full w-5 h-5 flex items-center justify-center">
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

      {/* Action Buttons */}
      {showUpgrade && (onRandomUpgrade || onFindChef) && (
        <div className="flex justify-center gap-4 mt-4">
          {onRandomUpgrade && (
            <button
              onClick={onRandomUpgrade}
              disabled={gold < 15}
              className={`px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                gold >= 15
                  ? 'bg-yellow-600 hover:bg-yellow-500 border-yellow-800 text-white cursor-pointer'
                  : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
              }`}
              title="Randomly upgrade one of your platter slots for 15 gold"
            >
              🎲 Random Upgrade (15 gold)
            </button>
          )}
          
          {onFindChef && (
            <button
              onClick={onFindChef}
              className="bg-red-600 hover:bg-red-500 border-2 border-red-800 text-white font-bold text-sm px-6 py-2 rounded transition-colors pixel-button pixel-text"
              title="Enter the Arena to battle other chefs!"
            >
              ⚔️ Find Chef
            </button>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-indigo-200 text-xs pixel-text opacity-80 leading-relaxed">
          Click empty slots to select items • Click placed items to return them • No seeds allowed
        </p>
        {showUpgrade && (
          <p className="text-yellow-300 text-xs pixel-text opacity-90 mt-1">
            🎲 Random Upgrade randomly boosts a slot • Multiple upgrades on same slot stack • ⚡ Lv1 🔥 Lv2 💎 Lv3+
          </p>
        )}
        <p className="text-indigo-300 text-xs pixel-text opacity-60 mt-1">
          Your platter will face off against other players' platters in battle! • Spices support nearby foods • Buy more slots for 20 gold each ({unlockedSlots}/12 unlocked)
        </p>
      </div>

      {/* Item Selector Modal */}
      {showItemSelector.visible && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCloseSelector}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-indigo-900 border-4 border-indigo-800 rounded-lg p-6 pixel-shadow max-w-md mx-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg pixel-text">
                  Select Item for Platter
                </h3>
                <button
                  onClick={handleCloseSelector}
                  className="text-indigo-300 hover:text-white text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getAvailableItems().length === 0 ? (
                  <p className="text-indigo-300 text-sm pixel-text text-center py-4">
                    No items available. Only foods and spices can be placed on the platter.
                  </p>
                ) : (
                  getAvailableItems().map(({ item, source, sourceIndex }, index) => (
                    <button
                      key={`${source}-${sourceIndex}-${index}`}
                      onClick={() => handleSelectItem(source, sourceIndex)}
                      className="w-full flex items-center gap-3 p-3 bg-indigo-700 hover:bg-indigo-600 border-2 border-indigo-600 rounded transition-colors pixel-button"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 pixel-item"
                      />
                      <div className="flex-1 text-left">
                        <div className="text-white font-bold text-sm pixel-text">
                          {item.name}
                        </div>
                        <div className="text-indigo-200 text-xs pixel-text">
                          {source === 'inventory' ? 'Inventory' : 'Fridge'} • Qty: {item.quantity}
                        </div>
                      </div>
                      {/* Spoilage indicator */}
                      {item.spoilageLevel === 1 && (
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      )}
                      {item.spoilageLevel === 2 && (
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={handleCloseSelector}
                  className="bg-gray-600 hover:bg-gray-500 border-2 border-gray-800 text-white font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
