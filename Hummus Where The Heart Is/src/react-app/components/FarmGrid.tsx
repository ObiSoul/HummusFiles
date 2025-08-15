interface FarmPlot {
  id: string;
  isUnlocked: boolean;
  crop?: {
    id: string;
    name: string;
    image: string;
    growthStage: number;
    maxStages: number;
  };
  isPlanted: boolean;
  isWatered: boolean;
  canPurchase?: boolean;
  purchaseCost?: number;
}

// Helper function to get the correct crop image based on growth stage
function getCropImage(crop: FarmPlot['crop']): string {
  if (!crop) return '';
  
  switch (crop.growthStage) {
    case 1:
      return 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tiny-sprout-dirt.png';
    case 2:
      return 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/medium-sprout-dirt.png';
    case 3:
      return 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/large-sprout-dirt.png';
    case 4:
    default:
      return crop.image; // Use the actual fruit image when fully grown
  }
}

interface FarmGridProps {
  plots: FarmPlot[];
  selectedPlotIndex?: number | null;
  onPlotClick?: (plot: FarmPlot, index: number) => void;
  onUnlockPlot?: (index: number) => void;
  platformType?: 'desktop' | 'mobile';
  onSeedDrop?: (dragData: any, plotIndex: number) => void;
}

import InfoButton from './InfoButton';
import { useState, useRef } from 'react';

export default function FarmGrid({ plots, selectedPlotIndex, onPlotClick, onUnlockPlot, platformType = 'mobile', onSeedDrop }: FarmGridProps) {
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const holdStartTime = useRef<number>(0);

  const handleMouseDown = (plot: FarmPlot, index: number, event: React.MouseEvent) => {
    holdStartTime.current = Date.now();
    const timer = setTimeout(() => {
      if (!plot.crop) {
        handleEmptyPlotHold(plot, index, event);
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

  const handleClick = (plot: FarmPlot, index: number) => {
    // Only trigger click if it wasn't a long hold
    const holdDuration = Date.now() - holdStartTime.current;
    if (holdDuration < 500) {
      onPlotClick?.(plot, index);
    }
  };

  const handleUnlockClick = (index: number) => {
    // Only trigger click if it wasn't a long hold
    const holdDuration = Date.now() - holdStartTime.current;
    if (holdDuration < 500) {
      onUnlockPlot?.(index);
    }
  };
  
  const handleEmptyPlotHold = (plot: FarmPlot, _index: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (plot.isUnlocked && !plot.isPlanted) {
      const tooltip = "Empty Farm Plot - Plant seeds here to grow crops. Select this plot first, then click seeds in your inventory to plant. Click planted crops to water them and help them grow faster.";
      alert(tooltip);
    } else if (!plot.isUnlocked && plot.canPurchase) {
      const tooltip = `Locked Farm Plot - Purchase this plot for ${plot.purchaseCost} gold to unlock it for farming. More plots become available as you expand your farm.`;
      alert(tooltip);
    } else if (!plot.isUnlocked) {
      const tooltip = "Locked Farm Plot - This plot is not yet available for purchase. Unlock other plots first to expand your farm further.";
      alert(tooltip);
    }
  };

  const handleDragOver = (e: React.DragEvent, plot: FarmPlot) => {
    if (platformType === 'desktop' && plot.isUnlocked && !plot.isPlanted) {
      e.preventDefault();
      // Check if dragged item is a seed
      try {
        const dragData = e.dataTransfer.getData('application/json');
        if (dragData) {
          const parsedData = JSON.parse(dragData);
          if (parsedData.item.id.endsWith('-seeds')) {
            e.dataTransfer.dropEffect = 'move';
          } else {
            e.dataTransfer.dropEffect = 'none';
          }
        }
      } catch {
        e.dataTransfer.dropEffect = 'none';
      }
    }
  };

  const handleDrop = (e: React.DragEvent, plotIndex: number) => {
    if (platformType === 'desktop') {
      e.preventDefault();
      try {
        const dragData = e.dataTransfer.getData('application/json');
        if (dragData) {
          const parsedData = JSON.parse(dragData);
          // Validate that only seeds can be planted
          if (parsedData.item.id.endsWith('-seeds')) {
            onSeedDrop?.(parsedData, plotIndex);
          }
        }
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  };

  const handleRightClick = (e: React.MouseEvent, plot: FarmPlot, _index: number) => {
    if (platformType === 'desktop' && plot.crop) {
      e.preventDefault();
      // Show crop information
      const tooltip = `${plot.crop.name} - Growth: ${plot.crop.growthStage}/${plot.crop.maxStages}${plot.crop.growthStage >= plot.crop.maxStages ? ' (Ready to harvest!)' : ''}`;
      alert(tooltip);
    }
  };
  return (
    <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-4 pixel-shadow relative">
      <InfoButton
        title="Farm"
        description="Your growing space for planting crops! Click empty plots to select them, then click seeds in your inventory to plant. Use the watering can to help crops grow faster. Harvest mature crops by clicking them. Unlock new plots with gold."
      />
      <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Farm</h2>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {plots.map((plot, index) => (
          <div key={plot.id}>
            {plot.isUnlocked ? (
              <div
                className={`aspect-square w-16 h-16 md:w-20 md:h-20 border-2 rounded cursor-pointer hover:bg-amber-500 transition-colors flex items-center justify-center pixel-farm-slot ${
                  selectedPlotIndex === index 
                    ? 'border-yellow-400 border-4 bg-yellow-100' 
                    : 'border-amber-500'
                } ${
                  plot.isWatered ? 'bg-amber-500 pixel-watered-soil' : 'bg-amber-600'
                }`}
                onClick={() => handleClick(plot, index)}
                onMouseDown={(e) => handleMouseDown(plot, index, e)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onContextMenu={(e) => handleRightClick(e, plot, index)}
                onDragOver={(e) => handleDragOver(e, plot)}
                onDrop={(e) => handleDrop(e, index)}
              >
                {plot.crop && (
                  <div className="relative w-full h-full">
                    <img
                      src={getCropImage(plot.crop)}
                      alt={plot.crop.name}
                      className="w-full h-full object-cover rounded pixel-crop"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded">
                      <div
                        className="h-full bg-green-500 rounded transition-all duration-500"
                        style={{
                          width: `${(plot.crop.growthStage / plot.crop.maxStages) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`aspect-square w-16 h-16 md:w-20 md:h-20 bg-green-600 border-2 border-green-700 rounded transition-colors flex items-center justify-center pixel-grass-tile relative ${
                  plot.canPurchase ? 'cursor-pointer hover:bg-green-500' : 'cursor-not-allowed'
                }`}
                onClick={() => plot.canPurchase && handleUnlockClick(index)}
                onMouseDown={(e) => handleMouseDown(plot, index, e)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-full h-full bg-green-600 rounded pixel-grass-pattern"></div>
                {plot.canPurchase && plot.purchaseCost && (
                  <div className="absolute bottom-0 right-0 bg-amber-900 border border-amber-800 rounded-tl px-1 py-0.5 flex items-center gap-1">
                    <div className="w-3 h-3 pixel-coin"></div>
                    <span className="text-white text-xs pixel-text">{plot.purchaseCost}</span>
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
