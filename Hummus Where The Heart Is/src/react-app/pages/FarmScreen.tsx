import { useState } from 'react';
import GameLayout from '@/react-app/components/GameLayout';
import ResourceBar from '@/react-app/components/ResourceBar';
import InventoryGrid from '@/react-app/components/InventoryGrid';
import FarmGrid from '@/react-app/components/FarmGrid';
import FridgeGrid from '@/react-app/components/FridgeGrid';
import KitchenGrid from '@/react-app/components/KitchenGrid';
import Cookbook from '@/react-app/components/Cookbook';
import PlatterGrid from '@/react-app/components/PlatterGrid';
import SellItemsGrid from '@/react-app/components/SellItemsGrid';
import Library from '@/react-app/components/Library';
import { getRandomShopItems, getRandomSpiceItems } from '@/react-app/components/Shop';
import Tooltip from '@/react-app/components/Tooltip';
import ItemActionModal from '@/react-app/components/ItemActionModal';
import SleepLoadingScreen from '@/react-app/components/SleepLoadingScreen';
import { getItemDescription } from '@/react-app/data/itemDescriptions';

interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number; // 0 = fresh, 1 = spoiling (green hue), 2 = rotten
  dayObtained?: number; // Track when item was obtained for spoilage
  sourceLocation?: 'inventory' | 'fridge'; // Track where item came from when placed on platter
  sourceIndex?: number; // Track original index when placed on platter
}



interface ShopItem {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

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

interface GameState {
  lives: number;
  stamina: number;
  maxStamina: number;
  gold: number;
  currentDay: number;
  inventoryItems: (InventoryItem | null)[];
  fridgeItems: (InventoryItem | null)[];
  kitchenItems: (InventoryItem | null)[];
  platterItems: (InventoryItem | null)[];
  upgradedPlatterSlots: number[];
  unlockedFridgeSlots: number;
  unlockedPlatterSlots: number;
  hasThirdShopSlot: boolean;
  hasThirdSpiceSlot: boolean;
  discoveredRecipes: string[];
  discoveredItems: string[];
  hasBattledToday: boolean;
  hasWonAfterLoss: boolean;
  farmPlots: FarmPlot[];
  isNewGamePlus: boolean;
  newGamePlusLoops: number;
  hasUnlockedNewGamePlus: boolean;
  itemsSoldToday: number;
}

interface FarmScreenProps {
  gameState: GameState;
  updateGameState: (newState: Partial<GameState>) => void;
  shopItems?: ShopItem[];
  spiceItems?: ShopItem[];
  rerollCost?: number;
  spiceRerollCost?: number;
  onBuyItem?: (item: ShopItem) => void;
  onRerollShop?: () => void;
  onRerollSpices?: () => void;
  onBuyThirdShopSlot?: () => void;
  onBuyThirdSpiceSlot?: () => void;
  onFindChef?: () => void;
  isBattleDay?: (day: number) => boolean;
  hasBattledToday?: boolean;
  platformType?: 'desktop' | 'mobile';
  isWorkshopOpen?: boolean;
  setIsWorkshopOpen?: (open: boolean) => void;
  onResetRerollCosts?: () => void;
  onGameComplete?: () => void;
  
  onBuyLibraryRecipe?: (recipeId: string) => void;
}

export default function FarmScreen({ 
  gameState, 
  updateGameState, 
  shopItems = getRandomShopItems(2),
  spiceItems = getRandomSpiceItems(2),
  rerollCost = 1,
  spiceRerollCost = 1,
  onBuyItem,
  onRerollShop,
  onRerollSpices,
  onBuyThirdShopSlot,
  onBuyThirdSpiceSlot,
  onFindChef,
  isBattleDay,
  hasBattledToday,
  platformType = 'mobile',
  isWorkshopOpen: isWorkshopOpenProp = false,
  setIsWorkshopOpen: setIsWorkshopOpenProp,
  onResetRerollCosts,
  onGameComplete,
  onBuyLibraryRecipe
}: FarmScreenProps) {
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);
  const [selectedFridgeIndex, setSelectedFridgeIndex] = useState<number | null>(null);
  const [selectedKitchenIndex, setSelectedKitchenIndex] = useState<number | null>(null);
  const [selectedPlatterIndex, setSelectedPlatterIndex] = useState<number | null>(null);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState<boolean>(isWorkshopOpenProp);
  const [showSleepLoading, setShowSleepLoading] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<{
    item: { name: string; description?: string } | null;
    position: { x: number; y: number };
    visible: boolean;
  }>({
    item: null,
    position: { x: 0, y: 0 },
    visible: false
  });

  const [itemActionModal, setItemActionModal] = useState<{
    item: InventoryItem | null;
    itemIndex: number;
    isOpen: boolean;
  }>({
    item: null,
    itemIndex: -1,
    isOpen: false
  });

  
  const [activeTab, setActiveTab] = useState<'inventory' | 'fridge'>('inventory');
  const [activeAreaTab, setActiveAreaTab] = useState<'farm' | 'shop' | 'kitchen' | 'cookbook' | 'library' | 'sell'>('farm');

  // Calculate days until next battle
  const getDaysUntilNextBattle = (currentDay: number): number => {
    const battleDays = [3, 7, 10, 14, 17, 21, 24, 28];
    const nextBattleDay = battleDays.find(day => day > currentDay);
    if (nextBattleDay) {
      return nextBattleDay - currentDay;
    }
    // If past day 28, no more battles
    return 0;
  };

  const handleItemHold = (item: InventoryItem | null, _index: number, event: React.MouseEvent) => {
    if (item) {
      const description = getItemDescription(item);
      
      setTooltip({
        item: {
          name: item.name,
          description: description
        },
        position: { x: event.clientX, y: event.clientY },
        visible: true
      });
    } else {
      // Hide tooltip when called with null item (on mouse leave)
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  };

  const handleItemClick = (item: InventoryItem | null, index: number) => {
    // If no item, do nothing
    if (!item) return;

    // Handle planting seeds on selected farm plot (existing logic for farm planting)
    if (selectedPlotIndex !== null && activeAreaTab === 'farm') {
      const plot = gameState.farmPlots[selectedPlotIndex];
      if (plot.isUnlocked && !plot.isPlanted && item.id.endsWith('-seeds') && gameState.stamina > 0) {
        // Remove one seed from inventory
        const newInventory = [...gameState.inventoryItems];
        const inventoryItem = newInventory[index] as InventoryItem;
        
        if (inventoryItem.quantity > 1) {
          inventoryItem.quantity -= 1;
        } else {
          newInventory[index] = null;
        }
        
        // Plant the crop on the farm - map to correct fruit sprites
        const fruitImageMap: { [key: string]: string } = {
          'apple-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Apple.png',
          'banana-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Banana.png',
          'blackberry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Blackberries.png',
          'black-cherry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Black-Cherry.png',
          'blueberry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Blueberries.png',
          'soybean-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/soybean_16.png',
          'grape-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Grapes.png',
          'cherry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Cherry.png',
          'golden-apple-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Golden-Apple.png',
          'dragonfruit-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Dragonfruit.png',
          'coconut-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Coconut.png',
          'kiwi-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Kiwi.png',
          'lime-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Lime.png',
          'green-grape-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Grapes.png',
          'green-apple-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Apple.png',
          'lemon-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Lemon.png',
          'strawberry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Strawberry.png',
          'raspberry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Raspberry.png',
          'watermelon-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Watermelon.png',
          'pineapple-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Pineapple.png',
          'orange-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Orange.png',
          'eggplant-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Eggplant.png',
          'green-chile-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Chile-Pepper.png',
          'avocado-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Avacado.png',
          'chili-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Chili-Pepper.png',
          'green-bell-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Bell-Pepper.png',
          'red-bell-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Red-Bell-Pepper.png',
          'onion-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Onion.png',
          'jalapeno-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Jalapeno.png',
          'pumpkin-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Pumpkin.png',
          'red-onion-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Red-Onion.png',
          'tomato-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Tomato.png',
          'yellow-bell-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Yellow-Bell-Pepper.png',
          'wheat-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Wheat.png'
        };
        const fruitImage = fruitImageMap[item.id] || item.image.replace('-seeds.png', '.png');
        const newFarmPlots = gameState.farmPlots.map((p, i) => 
          i === selectedPlotIndex ? {
            ...p,
            isPlanted: true,
            isWatered: false,
            crop: {
              id: item.id.replace('-seeds', ''),
              name: item.name.replace(' Seeds', ''),
              image: fruitImage,
              growthStage: 1,
              maxStages: 4
            }
          } : p
        );
        
        updateGameState({ 
          inventoryItems: newInventory,
          stamina: gameState.stamina - 1, // Planting costs 1 stamina
          farmPlots: newFarmPlots
        });
        setSelectedPlotIndex(null); // Clear selection
        return;
      }
    }

    // New logic: Show item action modal for inventory items
    // But only if we're not in specific interaction modes
    if (selectedPlotIndex === null && selectedFridgeIndex === null && 
        selectedKitchenIndex === null && selectedPlatterIndex === null) {
      setItemActionModal({
        item,
        itemIndex: index,
        isOpen: true
      });
    }
  };

  const handlePlotClick = (plot: FarmPlot, index: number) => {
    // Water planted crops directly by clicking on them
    if (plot.isPlanted && plot.crop && plot.crop.growthStage < plot.crop.maxStages && gameState.stamina > 0) {
      const newFarmPlots = gameState.farmPlots.map((p, i) => 
        i === index ? {
          ...p,
          isWatered: true,
          crop: p.crop ? {
            ...p.crop,
            growthStage: Math.min(p.crop.growthStage + 1, p.crop.maxStages)
          } : p.crop
        } : p
      );
      
      updateGameState({ 
        stamina: gameState.stamina - 1,
        farmPlots: newFarmPlots
      });
      return;
    }
    
    if (plot.isUnlocked && !plot.isPlanted) {
      // Select empty plot
      setSelectedPlotIndex(index);
      setSelectedFridgeIndex(null); // Clear fridge selection
    } else if (plot.crop && plot.crop.growthStage >= plot.crop.maxStages) {
      // Harvest the crop
      const newInventory = [...gameState.inventoryItems];
      
      // Look for existing item to stack (inventory supports stacking)
      const existingIndex = newInventory.findIndex(item => 
        item && item.id === plot.crop!.id
      );
      
      if (existingIndex !== -1 && newInventory[existingIndex]) {
        // Stack with existing item
        (newInventory[existingIndex] as InventoryItem).quantity += 1;
      } else {
        // Add to first empty slot
        const emptyIndex = newInventory.findIndex(item => item === null);
        if (emptyIndex !== -1) {
          newInventory[emptyIndex] = {
            id: plot.crop!.id,
            name: plot.crop!.name,
            image: plot.crop!.image,
            quantity: 1,
            spoilageLevel: 0,
            dayObtained: gameState.currentDay
          };
        }
      }
      
      // Add harvested item to discovered items if not already discovered
      const newDiscoveredItems = [...gameState.discoveredItems];
      if (!newDiscoveredItems.includes(plot.crop!.id)) {
        newDiscoveredItems.push(plot.crop!.id);
      }
      
      // Clear the plot
      const newFarmPlots = gameState.farmPlots.map((p, i) => 
        i === index ? {
          ...p,
          isPlanted: false,
          crop: undefined,
          isWatered: false
        } : p
      );
      
      updateGameState({ 
        inventoryItems: newInventory,
        gold: gameState.gold + 2, // Give gold for harvesting
        discoveredItems: newDiscoveredItems,
        farmPlots: newFarmPlots
      });
      setSelectedPlotIndex(null); // Clear selection after harvesting
    } else {
      // Clear selections for any other clicks
      setSelectedPlotIndex(null);
    }
  };

  const handleSleep = () => {
    if (gameState.currentDay < 28) {
      setShowSleepLoading(true);
    } else if (gameState.currentDay === 28) {
      if (gameState.isNewGamePlus) {
        // In New Game+, cycle endlessly - go back to day 1
        setShowSleepLoading(true);
      } else {
        // Regular game completion after day 28
        onGameComplete?.();
      }
    }
  };

  const handleSleepComplete = () => {
    // Determine next day logic
    let nextDay = gameState.currentDay + 1;
    let isSeasonCycle = false;
    
    // In New Game+, after day 28, cycle back to day 1 (endless seasons)
    if (gameState.isNewGamePlus && gameState.currentDay === 28) {
      nextDay = 1;
      isSeasonCycle = true;
    }
    
    // Process spoilage for inventory items (not fridge items)
    const newInventoryItems = gameState.inventoryItems.map(item => {
      if (!item) return null;
      
      // Seeds don't spoil
      if (item.id.endsWith('-seeds')) return item;
      
      // Calculate spoilage based on days since obtained
      const daysOld = nextDay - (item.dayObtained || gameState.currentDay);
      let newSpoilageLevel = 0;
      
      if (daysOld >= 2) newSpoilageLevel = 1; // Spoiling (green hue) after 2 days
      if (daysOld >= 4) newSpoilageLevel = 2; // Rotten after 4 days
      
      return {
        ...item,
        spoilageLevel: newSpoilageLevel
      };
    });
    
    // Auto-water planted crops overnight
    const newFarmPlots = gameState.farmPlots.map(plot => {
      // If plot has a crop that isn't fully grown, water it once overnight
      if (plot.isPlanted && plot.crop && plot.crop.growthStage < plot.crop.maxStages) {
        return {
          ...plot,
          isWatered: true,
          crop: {
            ...plot.crop,
            growthStage: Math.min(plot.crop.growthStage + 1, plot.crop.maxStages)
          }
        };
      }
      return plot;
    });
    
    // Check if starting a new season (day 8, 15, 22) for stamina bonus
    let newMaxStamina = gameState.maxStamina;
    let shouldAlert = false;
    let alertMessage = '';
    
    if (nextDay === 8 || nextDay === 15 || nextDay === 22) {
      newMaxStamina = gameState.maxStamina + 12;
      shouldAlert = true;
      const seasonNames = ['Summer', 'Fall', 'Winter'];
      const seasonIndex = nextDay === 8 ? 0 : nextDay === 15 ? 1 : 2;
      alertMessage = `🌟 NEW SEASON: ${seasonNames[seasonIndex]}! 🌟\n\nYour maximum stamina has increased by 12!\nNew max stamina: ${newMaxStamina}`;
    }
    
    // Special alert for New Game+ season cycling
    if (isSeasonCycle) {
      shouldAlert = true;
      alertMessage = `🔄 NEW GAME+ CYCLE! 🔄\n\nStarting Spring again with increased difficulty!\nLoop: ${gameState.newGamePlusLoops + 1}\n\nOpponents will be stronger!`;
    }
    
    updateGameState({ 
      currentDay: nextDay,
      stamina: newMaxStamina, // Restore full stamina (including new season bonus)
      maxStamina: newMaxStamina,
      inventoryItems: newInventoryItems,
      farmPlots: newFarmPlots, // Update farm plots with auto-watered crops
      hasBattledToday: false, // Reset battle status for new day
      itemsSoldToday: 0 // Reset daily sell counter
    });
    
    // Reset shop reroll costs daily - handled by parent App component
    onResetRerollCosts?.();
    
    // Ensure game is saved after sleep
    setTimeout(() => {
      console.log('Game saved after sleep cycle');
    }, 200);
    
    // Hide loading screen
    setShowSleepLoading(false);
    
    // Show appropriate alert
    if (shouldAlert && alertMessage) {
      setTimeout(() => {
        alert(alertMessage);
      }, 100);
    }
  };

  const handleUnlockPlot = (index: number) => {
    const plot = gameState.farmPlots[index];
    if (plot.canPurchase && plot.purchaseCost && gameState.gold >= plot.purchaseCost) {
      const newPlots = gameState.farmPlots.map((p, i) => {
        if (i === index) {
          // Unlock the purchased plot
          return { ...p, isUnlocked: true, isWatered: false, canPurchase: false, purchaseCost: undefined };
        }
        return p;
      });
      
      // Define the unlock sequence based on customer request:
      // Plot 3 (3,0) -> Plot 4 (4,0) -> Plot 5 (0,1) -> and so on...
      let nextPlotIndex: number | undefined;
      let nextCost: number;
      
      if (index === 3) {
        // After buying plot 3, plot 4 becomes available for 2 gold
        nextPlotIndex = 4;
        nextCost = 2;
      } else if (index === 4) {
        // After buying plot 4, plot 5 becomes available for 3 gold  
        nextPlotIndex = 5;
        nextCost = 3;
      } else {
        // Continue with increasing cost pattern
        const unlockedCount = newPlots.filter(p => p.isUnlocked).length;
        nextCost = unlockedCount - 2; // Cost increases with each purchase
        
        // Find next available plot to unlock (simple sequence)
        for (let i = 0; i < 25; i++) {
          if (!newPlots[i].isUnlocked && !newPlots[i].canPurchase) {
            nextPlotIndex = i;
            break;
          }
        }
      }
      
      if (nextPlotIndex !== undefined && nextPlotIndex < 25) {
        newPlots[nextPlotIndex] = {
          ...newPlots[nextPlotIndex],
          canPurchase: true,
          purchaseCost: nextCost
        };
      }
      
      updateGameState({ 
        gold: gameState.gold - plot.purchaseCost,
        farmPlots: newPlots
      });
    }
  };

  const handleFridgeItemClick = (item: InventoryItem | null, index: number) => {
    if (item) {
      // Move item from fridge to inventory if possible (with stacking)
      const newInventory = [...gameState.inventoryItems];
      
      // First try to stack with existing item
      const existingIndex = newInventory.findIndex(slot => 
        slot && slot.id === item.id
      );
      
      if (existingIndex !== -1 && newInventory[existingIndex]) {
        // Stack with existing item
        (newInventory[existingIndex] as InventoryItem).quantity += item.quantity;
      } else {
        // Find empty slot if no existing item to stack with
        const emptyIndex = newInventory.findIndex(slot => slot === null);
        if (emptyIndex !== -1) {
          newInventory[emptyIndex] = item;
        } else {
          // No space available
          return;
        }
      }
      
      const newFridgeItems = [...gameState.fridgeItems];
      newFridgeItems[index] = null;
      
      updateGameState({
        inventoryItems: newInventory,
        fridgeItems: newFridgeItems
      });
      setSelectedFridgeIndex(null); // Clear selection
    } else {
      // Select empty fridge slot
      if (index < gameState.unlockedFridgeSlots) {
        setSelectedFridgeIndex(index);
        setSelectedPlotIndex(null); // Clear farm selection
      }
    }
  };

  

  const handleUnlockFridgeSlot = () => {
    if (gameState.gold >= 5 && gameState.unlockedFridgeSlots < 25) {
      updateGameState({
        gold: gameState.gold - 5,
        unlockedFridgeSlots: gameState.unlockedFridgeSlots + 1
      });
    }
  };

  const handleKitchenItemClick = (item: InventoryItem | null, index: number) => {
    if (item) {
      // Special handling for water - delete it instead of moving to inventory
      if (item.id === 'water') {
        const newKitchenItems = [...gameState.kitchenItems];
        newKitchenItems[index] = null;
        
        updateGameState({
          kitchenItems: newKitchenItems
        });
        setSelectedKitchenIndex(null); // Clear selection
        return;
      }
      
      // Move item from kitchen back to inventory if possible
      const newInventory = [...gameState.inventoryItems];
      const emptyIndex = newInventory.findIndex(slot => slot === null);
      
      if (emptyIndex !== -1) {
        newInventory[emptyIndex] = item;
        const newKitchenItems = [...gameState.kitchenItems];
        newKitchenItems[index] = null;
        
        updateGameState({
          inventoryItems: newInventory,
          kitchenItems: newKitchenItems
        });
        setSelectedKitchenIndex(null); // Clear selection
      }
    } else {
      // Select empty kitchen slot (only first 3 slots are usable)
      if (index < 3) {
        setSelectedKitchenIndex(index);
        setSelectedPlotIndex(null); // Clear farm selection
        setSelectedFridgeIndex(null); // Clear fridge selection
      }
    }
  };

  

  const handlePlatterItemClick = (item: InventoryItem | null, index: number) => {
    if (item) {
      // Move item from platter back to inventory if possible
      const newInventory = [...gameState.inventoryItems];
      const emptyIndex = newInventory.findIndex(slot => slot === null);
      
      if (emptyIndex !== -1) {
        newInventory[emptyIndex] = item;
        const newPlatterItems = [...gameState.platterItems];
        newPlatterItems[index] = null;
        
        updateGameState({
          inventoryItems: newInventory,
          platterItems: newPlatterItems
        });
        setSelectedPlatterIndex(null); // Clear selection
      }
    } else {
      // Select empty platter slot (only if unlocked)
      if (index < gameState.unlockedPlatterSlots) {
        setSelectedPlatterIndex(index);
        setSelectedPlotIndex(null); // Clear farm selection
        setSelectedFridgeIndex(null); // Clear fridge selection
        setSelectedKitchenIndex(null); // Clear kitchen selection
      }
    }
  };

  const handlePlaceItemOnPlatter = (sourceLocation: 'inventory' | 'fridge', sourceIndex: number, targetPlatterIndex: number) => {
    const sourceItems = sourceLocation === 'inventory' ? gameState.inventoryItems : gameState.fridgeItems;
    const sourceItem = sourceItems[sourceIndex];
    
    if (!sourceItem || sourceItem.id.endsWith('-seeds')) return; // Can't place seeds
    if (gameState.platterItems[targetPlatterIndex] !== null) return; // Slot already occupied
    
    const newSourceItems = [...sourceItems];
    const newPlatterItems = [...gameState.platterItems];
    
    // Take one item from source
    if (sourceItem.quantity > 1) {
      newSourceItems[sourceIndex] = {
        ...sourceItem,
        quantity: sourceItem.quantity - 1
      };
    } else {
      newSourceItems[sourceIndex] = null;
    }
    
    // Place item on platter with source tracking
    newPlatterItems[targetPlatterIndex] = {
      ...sourceItem,
      quantity: 1,
      sourceLocation,
      sourceIndex
    };
    
    if (sourceLocation === 'inventory') {
      updateGameState({
        inventoryItems: newSourceItems,
        platterItems: newPlatterItems
      });
    } else {
      updateGameState({
        fridgeItems: newSourceItems,
        platterItems: newPlatterItems
      });
    }
  };

  const handleReturnPlatterItem = (platterIndex: number) => {
    const platterItem = gameState.platterItems[platterIndex];
    if (!platterItem) return;
    
    const newPlatterItems = [...gameState.platterItems];
    newPlatterItems[platterIndex] = null;
    
    // Return to source location if tracked, otherwise default to inventory
    const targetLocation = platterItem.sourceLocation || 'inventory';
    
    if (targetLocation === 'inventory') {
      const newInventory = [...gameState.inventoryItems];
      
      // Try to stack with existing item
      const existingIndex = newInventory.findIndex(slot => 
        slot && slot.id === platterItem.id
      );
      
      if (existingIndex !== -1 && newInventory[existingIndex]) {
        (newInventory[existingIndex] as InventoryItem).quantity += platterItem.quantity;
      } else {
        // Find empty slot
        const emptyIndex = newInventory.findIndex(slot => slot === null);
        if (emptyIndex !== -1) {
          const { sourceLocation, sourceIndex, ...itemWithoutSource } = platterItem;
          newInventory[emptyIndex] = itemWithoutSource;
        } else {
          return; // No space
        }
      }
      
      updateGameState({
        inventoryItems: newInventory,
        platterItems: newPlatterItems
      });
    } else {
      const newFridgeItems = [...gameState.fridgeItems];
      
      // Try to stack with existing item
      const existingIndex = newFridgeItems.findIndex(slot => 
        slot && slot.id === platterItem.id
      );
      
      if (existingIndex !== -1 && newFridgeItems[existingIndex]) {
        (newFridgeItems[existingIndex] as InventoryItem).quantity += platterItem.quantity;
      } else {
        // Find empty slot
        const emptyIndex = newFridgeItems.findIndex(slot => slot === null);
        if (emptyIndex !== -1) {
          const { sourceLocation, sourceIndex, ...itemWithoutSource } = platterItem;
          newFridgeItems[emptyIndex] = itemWithoutSource;
        } else {
          return; // No space
        }
      }
      
      updateGameState({
        fridgeItems: newFridgeItems,
        platterItems: newPlatterItems
      });
    }
  };

  const handleWorkshopClick = () => {
    const newWorkshopState = !isWorkshopOpen;
    setIsWorkshopOpen(newWorkshopState);
    
    // Update parent component's workshop state if available
    if (setIsWorkshopOpenProp) {
      setIsWorkshopOpenProp(newWorkshopState);
    }
    
    // Clear all other selections when toggling workshop
    setSelectedPlotIndex(null);
    setSelectedFridgeIndex(null);
    setSelectedKitchenIndex(null);
    setSelectedPlatterIndex(null);
  };

  const handleSellItem = (itemIndex: number, goldGained: number, quantityToSell: number = 1) => {
    // Check if daily sell limit reached
    if (gameState.itemsSoldToday >= 6) {
      return; // Don't sell if limit reached
    }
    
    const newInventory = [...gameState.inventoryItems];
    const item = newInventory[itemIndex];
    
    if (!item) return;
    
    // If selling entire stack or item has only 1 quantity, remove the item completely
    if (quantityToSell >= item.quantity) {
      newInventory[itemIndex] = null;
    } else {
      // Otherwise, reduce the quantity
      newInventory[itemIndex] = {
        ...item,
        quantity: item.quantity - quantityToSell
      };
    }
    
    updateGameState({
      inventoryItems: newInventory,
      gold: gameState.gold + goldGained,
      itemsSoldToday: gameState.itemsSoldToday + 1
    });
  };

  // Helper functions to check space availability and item compatibility
  const findEmptyKitchenSlot = (): number => {
    for (let i = 0; i < 3; i++) {
      if (gameState.kitchenItems[i] === null) return i;
    }
    return -1;
  };

  const findEmptyFridgeSlot = (): number => {
    for (let i = 0; i < gameState.unlockedFridgeSlots; i++) {
      if (gameState.fridgeItems[i] === null) return i;
    }
    return -1;
  };

  const findEmptyWorkshopSlot = (): number => {
    for (let i = 0; i < gameState.unlockedPlatterSlots; i++) {
      if (gameState.platterItems[i] === null) return i;
    }
    return -1;
  };

  // Item action modal handlers
  const handleMoveToKitchen = () => {
    const { item, itemIndex } = itemActionModal;
    if (!item) return;

    const emptySlot = findEmptyKitchenSlot();
    if (emptySlot === -1) return;

    const newInventory = [...gameState.inventoryItems];
    const inventoryItem = newInventory[itemIndex] as InventoryItem;
    
    // Only take one item from the stack
    if (inventoryItem.quantity > 1) {
      inventoryItem.quantity -= 1;
    } else {
      newInventory[itemIndex] = null;
    }
    
    const newKitchenItems = [...gameState.kitchenItems];
    newKitchenItems[emptySlot] = {
      ...item,
      quantity: 1 // Always place exactly 1 item in kitchen
    };
    
    updateGameState({
      inventoryItems: newInventory,
      kitchenItems: newKitchenItems
    });
  };

  const handleMoveToFridge = () => {
    const { item, itemIndex } = itemActionModal;
    if (!item || !canMoveToFridge(item)) return;

    const newFridgeItems = [...gameState.fridgeItems];
    
    // First try to stack with existing item in fridge
    const existingIndex = newFridgeItems.findIndex(slot => 
      slot && slot.id === item.id && newFridgeItems.indexOf(slot) < gameState.unlockedFridgeSlots
    );
    
    if (existingIndex !== -1 && newFridgeItems[existingIndex]) {
      // Stack with existing item
      (newFridgeItems[existingIndex] as InventoryItem).quantity += item.quantity;
    } else {
      // Find empty slot if no existing item to stack with
      const emptySlot = findEmptyFridgeSlot();
      if (emptySlot === -1) return;
      newFridgeItems[emptySlot] = item;
    }

    const newInventory = [...gameState.inventoryItems];
    newInventory[itemIndex] = null;
    
    updateGameState({
      inventoryItems: newInventory,
      fridgeItems: newFridgeItems
    });
  };

  const handleMoveToWorkshop = () => {
    const { item, itemIndex } = itemActionModal;
    if (!item) return;

    const emptySlot = findEmptyWorkshopSlot();
    if (emptySlot === -1) return;

    const newInventory = [...gameState.inventoryItems];
    const inventoryItem = newInventory[itemIndex] as InventoryItem;
    
    // Only take one item from the stack
    if (inventoryItem.quantity > 1) {
      inventoryItem.quantity -= 1;
    } else {
      newInventory[itemIndex] = null;
    }
    
    const newPlatterItems = [...gameState.platterItems];
    newPlatterItems[emptySlot] = {
      ...item,
      quantity: 1 // Always place exactly 1 item on platter
    };
    
    updateGameState({
      inventoryItems: newInventory,
      platterItems: newPlatterItems
    });
  };

  const closeItemActionModal = () => {
    setItemActionModal({
      item: null,
      itemIndex: -1,
      isOpen: false
    });
  };

  // Drag and drop handlers for desktop
  const handleInventoryDragStart = (_item: InventoryItem, _index: number) => {
    // Store drag data for potential use
  };

  const handleDropToFridge = (dragData: any, targetIndex: number) => {
    if (dragData.sourceType === 'inventory') {
      const sourceItem = gameState.inventoryItems[dragData.sourceIndex];
      if (sourceItem && canMoveToFridge(sourceItem)) {
        const newInventory = [...gameState.inventoryItems];
        const newFridgeItems = [...gameState.fridgeItems];
        
        // Check if target slot is empty
        if (gameState.fridgeItems[targetIndex] === null) {
          // Target slot is empty - check for existing items to stack with first
          const existingIndex = newFridgeItems.findIndex(slot => 
            slot && slot.id === sourceItem.id && newFridgeItems.indexOf(slot) < gameState.unlockedFridgeSlots
          );
          
          if (existingIndex !== -1 && newFridgeItems[existingIndex]) {
            // Stack with existing item
            (newFridgeItems[existingIndex] as InventoryItem).quantity += sourceItem.quantity;
          } else {
            // Place in target slot
            newFridgeItems[targetIndex] = sourceItem;
          }
          
          newInventory[dragData.sourceIndex] = null;
          
          updateGameState({
            inventoryItems: newInventory,
            fridgeItems: newFridgeItems
          });
        }
      }
    } else if (dragData.sourceType === 'kitchen') {
      const sourceItem = gameState.kitchenItems[dragData.sourceIndex];
      if (sourceItem && canMoveToFridge(sourceItem)) {
        const newKitchenItems = [...gameState.kitchenItems];
        const newFridgeItems = [...gameState.fridgeItems];
        
        // Check if target slot is empty
        if (gameState.fridgeItems[targetIndex] === null) {
          // Target slot is empty - check for existing items to stack with first
          const existingIndex = newFridgeItems.findIndex(slot => 
            slot && slot.id === sourceItem.id && newFridgeItems.indexOf(slot) < gameState.unlockedFridgeSlots
          );
          
          if (existingIndex !== -1 && newFridgeItems[existingIndex]) {
            // Stack with existing item
            (newFridgeItems[existingIndex] as InventoryItem).quantity += sourceItem.quantity;
          } else {
            // Place in target slot
            newFridgeItems[targetIndex] = sourceItem;
          }
          
          newKitchenItems[dragData.sourceIndex] = null;
          
          updateGameState({
            kitchenItems: newKitchenItems,
            fridgeItems: newFridgeItems
          });
        }
      }
    } else if (dragData.sourceType === 'platter') {
      const sourceItem = gameState.platterItems[dragData.sourceIndex];
      if (sourceItem && canMoveToFridge(sourceItem)) {
        const newPlatterItems = [...gameState.platterItems];
        const newFridgeItems = [...gameState.fridgeItems];
        
        // Check if target slot is empty
        if (gameState.fridgeItems[targetIndex] === null) {
          // Target slot is empty - check for existing items to stack with first
          const existingIndex = newFridgeItems.findIndex(slot => 
            slot && slot.id === sourceItem.id && newFridgeItems.indexOf(slot) < gameState.unlockedFridgeSlots
          );
          
          if (existingIndex !== -1 && newFridgeItems[existingIndex]) {
            // Stack with existing item
            (newFridgeItems[existingIndex] as InventoryItem).quantity += sourceItem.quantity;
          } else {
            // Place in target slot
            newFridgeItems[targetIndex] = sourceItem;
          }
          
          newPlatterItems[dragData.sourceIndex] = null;
          
          updateGameState({
            platterItems: newPlatterItems,
            fridgeItems: newFridgeItems
          });
        }
      }
    }
  };

  const handleDropToKitchen = (dragData: any, targetIndex: number) => {
    if (dragData.sourceType === 'inventory' && !dragData.item.id.endsWith('-seeds')) {
      const sourceItem = gameState.inventoryItems[dragData.sourceIndex];
      if (sourceItem && gameState.kitchenItems[targetIndex] === null) {
        const newInventory = [...gameState.inventoryItems];
        const newKitchenItems = [...gameState.kitchenItems];
        
        // Only take one item from the stack
        if (sourceItem.quantity > 1) {
          newInventory[dragData.sourceIndex] = {
            ...sourceItem,
            quantity: sourceItem.quantity - 1
          };
        } else {
          newInventory[dragData.sourceIndex] = null;
        }
        
        newKitchenItems[targetIndex] = {
          ...sourceItem,
          quantity: 1
        };
        
        updateGameState({
          inventoryItems: newInventory,
          kitchenItems: newKitchenItems
        });
      }
    } else if (dragData.sourceType === 'fridge') {
      const sourceItem = gameState.fridgeItems[dragData.sourceIndex];
      if (sourceItem && !sourceItem.id.endsWith('-seeds') && gameState.kitchenItems[targetIndex] === null) {
        const newFridgeItems = [...gameState.fridgeItems];
        const newKitchenItems = [...gameState.kitchenItems];
        
        // Only take one item from the stack
        if (sourceItem.quantity > 1) {
          newFridgeItems[dragData.sourceIndex] = {
            ...sourceItem,
            quantity: sourceItem.quantity - 1
          };
        } else {
          newFridgeItems[dragData.sourceIndex] = null;
        }
        
        newKitchenItems[targetIndex] = {
          ...sourceItem,
          quantity: 1
        };
        
        updateGameState({
          fridgeItems: newFridgeItems,
          kitchenItems: newKitchenItems
        });
      }
    }
  };

  const handleDropToPlatter = (dragData: any, targetIndex: number) => {
    const canMoveToPlatter = !dragData.item.id.endsWith('-seeds'); // Only seeds can't go to platter
    
    if (!canMoveToPlatter) return;

    if (dragData.sourceType === 'inventory') {
      const sourceItem = gameState.inventoryItems[dragData.sourceIndex];
      if (sourceItem && gameState.platterItems[targetIndex] === null) {
        const newInventory = [...gameState.inventoryItems];
        const newPlatterItems = [...gameState.platterItems];
        
        // Only take one item from the stack
        if (sourceItem.quantity > 1) {
          newInventory[dragData.sourceIndex] = {
            ...sourceItem,
            quantity: sourceItem.quantity - 1
          };
        } else {
          newInventory[dragData.sourceIndex] = null;
        }
        
        newPlatterItems[targetIndex] = {
          ...sourceItem,
          quantity: 1
        };
        
        updateGameState({
          inventoryItems: newInventory,
          platterItems: newPlatterItems
        });
      }
    } else if (dragData.sourceType === 'fridge') {
      const sourceItem = gameState.fridgeItems[dragData.sourceIndex];
      if (sourceItem && gameState.platterItems[targetIndex] === null) {
        const newFridgeItems = [...gameState.fridgeItems];
        const newPlatterItems = [...gameState.platterItems];
        
        // Only take one item from the stack
        if (sourceItem.quantity > 1) {
          newFridgeItems[dragData.sourceIndex] = {
            ...sourceItem,
            quantity: sourceItem.quantity - 1
          };
        } else {
          newFridgeItems[dragData.sourceIndex] = null;
        }
        
        newPlatterItems[targetIndex] = {
          ...sourceItem,
          quantity: 1
        };
        
        updateGameState({
          fridgeItems: newFridgeItems,
          platterItems: newPlatterItems
        });
      }
    }
  };

  const handleSeedDropOnFarm = (dragData: any, plotIndex: number) => {
    if (dragData.sourceType === 'inventory' && dragData.item.id.endsWith('-seeds')) {
      const plot = gameState.farmPlots[plotIndex];
      if (plot.isUnlocked && !plot.isPlanted && gameState.stamina > 0) {
        const sourceItem = gameState.inventoryItems[dragData.sourceIndex];
        if (sourceItem) {
          const newInventory = [...gameState.inventoryItems];
          
          // Remove one seed from inventory
          if (sourceItem.quantity > 1) {
            newInventory[dragData.sourceIndex] = {
              ...sourceItem,
              quantity: sourceItem.quantity - 1
            };
          } else {
            newInventory[dragData.sourceIndex] = null;
          }
          
          // Plant the crop on the farm
          const fruitImageMap: { [key: string]: string } = {
            'apple-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Apple.png',
            'banana-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Banana.png',
            'blackberry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Blackberries.png',
            'black-cherry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Black-Cherry.png',
            'blueberry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Blueberries.png',
            'soybean-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/soybean_16.png',
            'grape-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Grapes.png',
            'cherry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Cherry.png',
            'golden-apple-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Golden-Apple.png',
            'dragonfruit-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Dragonfruit.png',
            'coconut-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Coconut.png',
            'kiwi-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Kiwi.png',
            'lime-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Lime.png',
            'green-grape-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Grapes.png',
            'green-apple-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Apple.png',
            'lemon-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Lemon.png',
            'strawberry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Strawberry.png',
            'raspberry-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Raspberry.png',
            'watermelon-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Watermelon.png',
            'pineapple-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Pineapple.png',
            'orange-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Orange.png',
            'eggplant-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Eggplant.png',
            'green-chile-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Chile-Pepper.png',
            'avocado-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Avacado.png',
            'chili-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Chili-Pepper.png',
            'green-bell-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Bell-Pepper.png',
            'red-bell-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Red-Bell-Pepper.png',
            'onion-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Onion.png',
            'jalapeno-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Jalapeno.png',
            'pumpkin-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Pumpkin.png',
            'red-onion-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Red-Onion.png',
            'tomato-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Tomato.png',
            'yellow-bell-pepper-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Yellow-Bell-Pepper.png',
            'wheat-seeds': 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Wheat.png'
          };
          
          const fruitImage = fruitImageMap[dragData.item.id] || dragData.item.image.replace('-seeds.png', '.png');
          const newFarmPlots = gameState.farmPlots.map((p, i) => 
            i === plotIndex ? {
              ...p,
              isPlanted: true,
              isWatered: false,
              crop: {
                id: dragData.item.id.replace('-seeds', ''),
                name: dragData.item.name.replace(' Seeds', ''),
                image: fruitImage,
                growthStage: 1,
                maxStages: 4
              }
            } : p
          );
          
          updateGameState({ 
            inventoryItems: newInventory,
            stamina: gameState.stamina - 1,
            farmPlots: newFarmPlots
          });
        }
      }
    }
  };

  // Check if item can be moved to various locations
  const canMoveToKitchen = (item: InventoryItem): boolean => {
    return !item.id.endsWith('-seeds'); // Seeds can't go to kitchen
  };

  const canMoveToFridge = (item: InventoryItem): boolean => {
    return !item.id.endsWith('-seeds'); // Seeds can't go to fridge
  };

  const canMoveToWorkshop = (item: InventoryItem): boolean => {
    return !item.id.endsWith('-seeds'); // Only seeds can't go to workshop, spices are now allowed
  };

  

  const handleAddWater = () => {
    // Find first empty kitchen slot
    const emptySlotIndex = gameState.kitchenItems.slice(0, 3).findIndex(item => item === null);
    if (emptySlotIndex === -1) return; // No empty slots
    
    const waterItem: InventoryItem = {
      id: 'water',
      name: 'Water',
      image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/water.png',
      quantity: 1,
      spoilageLevel: undefined, // Water doesn't spoil
      dayObtained: gameState.currentDay
    };
    
    // Add water to the kitchen
    const newKitchenItems = [...gameState.kitchenItems];
    newKitchenItems[emptySlotIndex] = waterItem;
    
    updateGameState({
      kitchenItems: newKitchenItems
    });
  };

  const handleTakeResult = (resultItem: InventoryItem, recipeId: string) => {
    // Add result to inventory if possible and clear used ingredients (with stacking)
    const newInventory = [...gameState.inventoryItems];
    
    // First try to stack with existing item
    const existingIndex = newInventory.findIndex(slot => 
      slot && slot.id === resultItem.id
    );
    
    if (existingIndex !== -1 && newInventory[existingIndex]) {
      // Stack with existing item
      (newInventory[existingIndex] as InventoryItem).quantity += resultItem.quantity;
    } else {
      // Find empty slot if no existing item to stack with
      const emptyIndex = newInventory.findIndex(slot => slot === null);
      
      if (emptyIndex !== -1) {
        // Add the result item to inventory with current day
        newInventory[emptyIndex] = {
          ...resultItem,
          dayObtained: gameState.currentDay
        };
      } else {
        // No space available
        return;
      }
    }
      
      // Clear kitchen ingredients that were used in the recipe
    const newKitchenItems = [...gameState.kitchenItems];
    
    // Add recipe to discovered recipes if not already discovered
    const newDiscoveredRecipes = [...gameState.discoveredRecipes];
    if (!newDiscoveredRecipes.includes(recipeId)) {
      newDiscoveredRecipes.push(recipeId);
    }
    
    // Add created item to discovered items if not already discovered
    const newDiscoveredItems = [...gameState.discoveredItems];
    if (!newDiscoveredItems.includes(resultItem.id)) {
      newDiscoveredItems.push(resultItem.id);
    }
    
    // Generic ingredient removal function
    const removeIngredients = (requiredIds: string[]) => {
      const removed = new Set<string>();
      for (let i = 0; i < 3; i++) {
        if (newKitchenItems[i]) {
          const itemId = newKitchenItems[i]!.id;
          if (requiredIds.includes(itemId) && !removed.has(itemId)) {
            newKitchenItems[i] = null;
            removed.add(itemId);
          }
        }
      }
    };

    // Handle specific recipes
    const recipeIngredients: { [key: string]: string[] } = {
      // Original recipes
      'apple-pie': ['apple', 'dough', 'sugar'],
      'tomato-soup': ['tomato', 'basil', 'water'],
      'dough': ['water', 'wheat'],
      
      // Veg & Legume Recipes
      'cajun-garlic-soybeans': ['soybean', 'garlic', 'cajun'],
      'lime-edamame': ['soybean', 'lime'],
      'eggplant-tomato-bake': ['eggplant', 'tomato', 'garlic'],
      'chili-garlic-eggplant': ['eggplant', 'chili-pepper', 'garlic'],
      'pumpkin-soup': ['pumpkin', 'water', 'garlic'],
      'spiced-pumpkin-puree': ['pumpkin', 'sugar', 'nutmeg'],
      
      // Salads
      'guacamole': ['avocado', 'lime', 'onion'],
      'avocado-tomato-salad': ['avocado', 'tomato', 'red-onion'],
      'watermelon-basil-salad': ['watermelon', 'basil', 'lime'],
      
      // Sweets
      'caramelized-banana': ['banana', 'sugar'],
      'coconut-snow': ['coconut', 'sugar', 'water'],
      'candied-orange-peel': ['orange', 'sugar', 'water'],
      'candied-jalapenos': ['jalapeno', 'sugar', 'water'],
      'quick-pickled-onions': ['red-onion', 'lime', 'water'],
      
      // Frozen Treats
      'watermelon-lime-granita': ['watermelon', 'lime', 'sugar'],
      'dragonfruit-sorbet': ['dragonfruit', 'sugar', 'water'],
      'blueberry-ice': ['blueberry', 'sugar', 'water'],
      'pineapple-coconut-ice': ['pineapple', 'coconut', 'sugar'],
      
      // Drinks
      'lemonade': ['lemon', 'sugar', 'water'],
      'limeade': ['lime', 'sugar', 'water'],
      'orangeade': ['orange', 'sugar', 'water'],
      'grape-juice': ['grape', 'sugar', 'water'],
      
      // Salsas
      'classic-pico': ['tomato', 'onion', 'jalapeno'],
      'pineapple-chili-salsa': ['pineapple', 'chili-pepper', 'lime'],
      'green-chile-salsa': ['green-chile-pepper', 'onion', 'lime'],
      'roasted-red-relish': ['red-bell-pepper', 'onion', 'sugar'],
      'avocado-salsa-verde': ['avocado', 'green-chile-pepper', 'lime'],
      
      // Savory Sauces
      'quick-marinara': ['tomato', 'garlic', 'basil'],
      'cajun-tomato-base': ['tomato', 'onion', 'cajun'],
      'pepper-trinity': ['green-bell-pepper', 'onion', 'cajun'],
      
      // Flatbreads
      'garlic-herb-flatbread': ['dough', 'garlic', 'basil'],
      'tomato-basil-flatbread': ['dough', 'tomato', 'basil'],
      'tri-bell-pepper-flatbread': ['dough', 'green-bell-pepper', 'red-bell-pepper'], // or yellow
      'pepper-onion-flatbread': ['dough', 'onion', 'red-onion'],
      
      // Fruit Tarts
      'apple-tart': ['dough', 'sugar', 'apple'],
      'golden-apple-tart': ['dough', 'sugar', 'golden-apple'],
      'green-apple-tart': ['dough', 'sugar', 'green-apple'],
      'strawberry-tart': ['dough', 'sugar', 'strawberry'],
      'blueberry-tart': ['dough', 'sugar', 'blueberry'],
      'blackberry-tart': ['dough', 'sugar', 'blackberry'],
      'raspberry-tart': ['dough', 'sugar', 'raspberry'],
      
      // Compotes
      'apple-compote': ['apple', 'sugar', 'nutmeg'],
      'golden-apple-compote': ['golden-apple', 'sugar', 'nutmeg'],
      
      // Jams & Preserves
      'cherry-jam': ['cherry', 'sugar', 'lemon'],
      'mixed-berry-jam': ['blueberry', 'blackberry', 'sugar'],
      'strawberry-jam': ['strawberry', 'sugar', 'lemon'],
      'grape-jelly': ['grape', 'sugar', 'water'],
      'orange-marmalade': ['orange', 'sugar', 'lemon'],
      'kiwi-lime-jam': ['kiwi', 'lime', 'sugar'],
      'pineapple-preserves': ['pineapple', 'sugar', 'lemon']
    };

    // Remove ingredients for the crafted recipe
    if (recipeIngredients[recipeId]) {
      removeIngredients(recipeIngredients[recipeId]);
    }
    
    updateGameState({
      inventoryItems: newInventory,
      kitchenItems: newKitchenItems,
      discoveredRecipes: newDiscoveredRecipes,
      discoveredItems: newDiscoveredItems
    });
  };

  if (showSleepLoading) {
    return <SleepLoadingScreen onSleepComplete={handleSleepComplete} currentDay={gameState.currentDay} />;
  }

  return (
    <GameLayout currentDay={gameState.currentDay}>
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white pixel-text">
          Hummus Where The Heart Is
        </h1>
      </div>

      <ResourceBar 
        lives={gameState.lives} 
        stamina={gameState.stamina}
        maxStamina={gameState.maxStamina}
        gold={gameState.gold}
        currentDay={gameState.currentDay}
        onSleep={handleSleep}
        onWorkshopClick={handleWorkshopClick}
        isWorkshopOpen={isWorkshopOpen}
        isBattleDay={isBattleDay ? isBattleDay(gameState.currentDay) : false}
        hasBattledToday={hasBattledToday}
      />

      {/* Battle countdown display */}
      {!isWorkshopOpen && gameState.currentDay <= 28 && getDaysUntilNextBattle(gameState.currentDay) > 0 && (
        <div className="text-center mb-4">
          <p className="text-red-400 font-bold text-lg pixel-text">
            ⚔️ {getDaysUntilNextBattle(gameState.currentDay)} day{getDaysUntilNextBattle(gameState.currentDay) === 1 ? '' : 's'} until your next battle!
          </p>
        </div>
      )}

      {isWorkshopOpen ? (
        // Workshop Mode - Show Inventory and Platter Grid
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="order-2 lg:order-1 space-y-6">
            <InventoryGrid 
              items={gameState.inventoryItems} 
              onItemClick={handleItemClick}
              onItemHold={handleItemHold}
              platformType={platformType}
              onDragStart={handleInventoryDragStart}
            />
          </div>
          
          <div className="order-1 lg:order-2 space-y-6">
            <PlatterGrid
              platterItems={gameState.platterItems}
              upgradedSlots={gameState.upgradedPlatterSlots}
              unlockedSlots={gameState.unlockedPlatterSlots}
              selectedSlotIndex={selectedPlatterIndex}
              onItemClick={handlePlatterItemClick}
              onItemHold={handleItemHold}
              onRandomUpgrade={() => {
                if (gameState.gold >= 15) {
                  // Randomly select one of the unlocked slots
                  const randomSlot = Math.floor(Math.random() * gameState.unlockedPlatterSlots);
                  const newUpgradedSlots = [...gameState.upgradedPlatterSlots];
                  newUpgradedSlots[randomSlot] += 1; // Increment upgrade level
                  updateGameState({
                    gold: gameState.gold - 15,
                    upgradedPlatterSlots: newUpgradedSlots
                  });
                }
              }}
              onUnlockSlot={() => {
                if (gameState.gold >= 20 && gameState.unlockedPlatterSlots < 12) {
                  updateGameState({
                    gold: gameState.gold - 20,
                    unlockedPlatterSlots: gameState.unlockedPlatterSlots + 1
                  });
                }
              }}
              onFindChef={isBattleDay && isBattleDay(gameState.currentDay) && !hasBattledToday ? onFindChef : undefined}
              gold={gameState.gold}
              showUpgrade={true}
              platformType={platformType}
              onDrop={handleDropToPlatter}
              inventoryItems={gameState.inventoryItems}
              fridgeItems={gameState.fridgeItems}
              onPlaceItem={handlePlaceItemOnPlatter}
              onReturnItem={handleReturnPlatterItem}
            />
          </div>
        </div>
      ) : (
        // Normal Farm Mode
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1 space-y-6">
          {/* Tab Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setActiveTab('inventory');
                setSelectedFridgeIndex(null);
                setSelectedKitchenIndex(null);
              }}
              className={`px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                activeTab === 'inventory'
                  ? 'bg-amber-600 border-amber-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => {
                setActiveTab('fridge');
                setSelectedPlotIndex(null);
                setSelectedKitchenIndex(null);
              }}
              className={`px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                activeTab === 'fridge'
                  ? 'bg-blue-600 border-blue-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
              }`}
            >
              Fridge
            </button>
          </div>

          {/* Inventory or Fridge */}
          {activeTab === 'inventory' ? (
            <InventoryGrid 
              items={gameState.inventoryItems} 
              onItemClick={handleItemClick}
              onItemHold={handleItemHold}
              platformType={platformType}
              onDragStart={handleInventoryDragStart}
            />
          ) : (
            <FridgeGrid
              items={gameState.fridgeItems}
              unlockedSlots={gameState.unlockedFridgeSlots}
              selectedSlotIndex={selectedFridgeIndex}
              onItemClick={handleFridgeItemClick}
              onItemHold={handleItemHold}
              onUnlockSlot={handleUnlockFridgeSlot}
              gold={gameState.gold}
              platformType={platformType}
              onDrop={handleDropToFridge}
            />
          )}
        </div>

        <div className="order-1 lg:order-2 space-y-6">
          {/* Area Tab Navigation */}
          <div className="flex justify-center gap-1 md:gap-3 flex-wrap">
            <button
              onClick={() => {
                setActiveAreaTab('farm');
                setSelectedPlotIndex(null);
                setSelectedFridgeIndex(null);
                setSelectedKitchenIndex(null);
              }}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded transition-colors pixel-button pixel-text border-2 text-xs md:text-sm ${
                activeAreaTab === 'farm'
                  ? 'bg-green-600 border-green-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
              }`}
            >
              Farm
            </button>
            <button
              onClick={() => {
                setActiveAreaTab('shop');
                setSelectedPlotIndex(null);
                setSelectedFridgeIndex(null);
                setSelectedKitchenIndex(null);
              }}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded transition-colors pixel-button pixel-text border-2 text-xs md:text-sm ${
                activeAreaTab === 'shop'
                  ? 'bg-purple-600 border-purple-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => {
                setActiveAreaTab('kitchen');
                setSelectedPlotIndex(null);
                setSelectedFridgeIndex(null);
                setSelectedKitchenIndex(null);
              }}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded transition-colors pixel-button pixel-text border-2 text-xs md:text-sm ${
                activeAreaTab === 'kitchen'
                  ? 'bg-orange-600 border-orange-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
              }`}
            >
              Kitchen
            </button>
            <button
              onClick={() => {
                setActiveAreaTab('cookbook');
                setSelectedPlotIndex(null);
                setSelectedFridgeIndex(null);
                setSelectedKitchenIndex(null);
              }}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded transition-colors pixel-button pixel-text border-2 text-xs md:text-sm ${
                activeAreaTab === 'cookbook'
                  ? 'bg-purple-600 border-purple-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
              }`}
            >
              Cookbook
            </button>
            <button
              onClick={() => {
                setActiveAreaTab('library');
                setSelectedPlotIndex(null);
                setSelectedFridgeIndex(null);
                setSelectedKitchenIndex(null);
              }}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded transition-colors pixel-button pixel-text border-2 text-xs md:text-sm ${
                activeAreaTab === 'library'
                  ? 'bg-indigo-600 border-indigo-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => {
                setActiveAreaTab('sell');
                setSelectedPlotIndex(null);
                setSelectedFridgeIndex(null);
                setSelectedKitchenIndex(null);
              }}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded transition-colors pixel-button pixel-text border-2 text-xs md:text-sm ${
                activeAreaTab === 'sell'
                  ? 'bg-yellow-600 border-yellow-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 border-gray-800 text-white'
              }`}
            >
              Sell
            </button>
          </div>

          {/* Farm, Shop, or Kitchen */}
          {activeAreaTab === 'farm' ? (
            <FarmGrid 
              plots={gameState.farmPlots}
              selectedPlotIndex={selectedPlotIndex}
              onPlotClick={handlePlotClick}
              onUnlockPlot={handleUnlockPlot}
              platformType={platformType}
              onSeedDrop={handleSeedDropOnFarm}
            />
          ) : activeAreaTab === 'shop' ? (
            <div className="space-y-6">
              {/* Seeds Section */}
              <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-6 pixel-shadow">
                <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Seeds</h2>
                <div className="flex justify-between items-center mb-4">
                  {/* Third slot upgrade for seeds */}
                  {!gameState.hasThirdShopSlot && (
                    <button
                      onClick={onBuyThirdShopSlot}
                      disabled={gameState.gold < 8}
                      className={`font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                        gameState.gold >= 8
                          ? 'bg-yellow-600 hover:bg-yellow-500 border-yellow-800 text-white cursor-pointer'
                          : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Unlock 3rd Slot (8 gold)
                    </button>
                  )}
                  {gameState.hasThirdShopSlot && <div></div>}

                  {/* Reroll button for seeds */}
                  <button
                    onClick={onRerollShop}
                    disabled={gameState.gold < (rerollCost || 1)}
                    className={`font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                      gameState.gold >= (rerollCost || 1)
                        ? 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white cursor-pointer'
                        : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Reroll Seeds ({rerollCost} gold)
                  </button>
                </div>
                
                <div className={`grid gap-4 ${shopItems.length === 3 ? 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'}`}>
                  {shopItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-amber-700 border-2 border-amber-600 rounded-lg p-4 pixel-shadow hover:bg-amber-600 transition-colors"
                    >
                      <div className="text-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 mx-auto mb-3 pixel-item"
                        />
                        <h3 className="text-white font-bold text-sm pixel-text mb-2">
                          {item.name}
                        </h3>
                        <p className="text-amber-200 text-xs pixel-text mb-3 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-4 h-4 pixel-coin"></div>
                          <span className="text-yellow-400 font-bold text-sm pixel-text">
                            {item.price}
                          </span>
                        </div>
                        <button
                          onClick={() => onBuyItem?.(item)}
                          disabled={gameState.gold < item.price}
                          className={`w-full font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                            gameState.gold >= item.price
                              ? 'bg-green-600 hover:bg-green-500 border-green-800 text-white cursor-pointer'
                              : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {gameState.gold >= item.price ? 'Buy' : 'Not enough gold'}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty slot placeholder when third seed slot not unlocked */}
                  {!gameState.hasThirdShopSlot && shopItems.length === 2 && (
                    <div className="bg-gray-700 border-2 border-gray-600 rounded-lg p-4 pixel-shadow opacity-50">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-600 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">🔒</span>
                        </div>
                        <h3 className="text-gray-400 font-bold text-sm pixel-text mb-2">
                          Locked Slot
                        </h3>
                        <p className="text-gray-500 text-xs pixel-text mb-3 leading-relaxed">
                          Purchase to unlock
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-4 h-4 pixel-coin opacity-50"></div>
                          <span className="text-gray-500 font-bold text-sm pixel-text">
                            8
                          </span>
                        </div>
                        <div className="w-full font-bold text-sm px-4 py-2 rounded pixel-button pixel-text border-2 bg-gray-500 border-gray-700 text-gray-300">
                          Locked
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Spices Section */}
              <div className="bg-red-900 border-4 border-red-800 rounded-lg p-6 pixel-shadow">
                <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Spices</h2>
                <div className="flex justify-between items-center mb-4">
                  {/* Third slot upgrade for spices */}
                  {!gameState.hasThirdSpiceSlot && (
                    <button
                      onClick={onBuyThirdSpiceSlot}
                      disabled={gameState.gold < 10}
                      className={`font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                        gameState.gold >= 10
                          ? 'bg-yellow-600 hover:bg-yellow-500 border-yellow-800 text-white cursor-pointer'
                          : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Unlock 3rd Slot (10 gold)
                    </button>
                  )}
                  {gameState.hasThirdSpiceSlot && <div></div>}

                  {/* Reroll button for spices */}
                  <button
                    onClick={onRerollSpices}
                    disabled={gameState.gold < (spiceRerollCost || 1)}
                    className={`font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                      gameState.gold >= (spiceRerollCost || 1)
                        ? 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white cursor-pointer'
                        : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Reroll Spices ({spiceRerollCost} gold)
                  </button>
                </div>
                
                <div className={`grid gap-4 ${spiceItems.length === 3 ? 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'}`}>
                  {spiceItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-red-700 border-2 border-red-600 rounded-lg p-4 pixel-shadow hover:bg-red-600 transition-colors"
                    >
                      <div className="text-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 mx-auto mb-3 pixel-item"
                        />
                        <h3 className="text-white font-bold text-sm pixel-text mb-2">
                          {item.name}
                        </h3>
                        <p className="text-red-200 text-xs pixel-text mb-3 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-4 h-4 pixel-coin"></div>
                          <span className="text-yellow-400 font-bold text-sm pixel-text">
                            {item.price}
                          </span>
                        </div>
                        <button
                          onClick={() => onBuyItem?.(item)}
                          disabled={gameState.gold < item.price}
                          className={`w-full font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                            gameState.gold >= item.price
                              ? 'bg-green-600 hover:bg-green-500 border-green-800 text-white cursor-pointer'
                              : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {gameState.gold >= item.price ? 'Buy' : 'Not enough gold'}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty slot placeholder when third spice slot not unlocked */}
                  {!gameState.hasThirdSpiceSlot && spiceItems.length === 2 && (
                    <div className="bg-gray-700 border-2 border-gray-600 rounded-lg p-4 pixel-shadow opacity-50">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-600 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">🔒</span>
                        </div>
                        <h3 className="text-gray-400 font-bold text-sm pixel-text mb-2">
                          Locked Slot
                        </h3>
                        <p className="text-gray-500 text-xs pixel-text mb-3 leading-relaxed">
                          Purchase to unlock
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-4 h-4 pixel-coin opacity-50"></div>
                          <span className="text-gray-500 font-bold text-sm pixel-text">
                            10
                          </span>
                        </div>
                        <div className="w-full font-bold text-sm px-4 py-2 rounded pixel-button pixel-text border-2 bg-gray-500 border-gray-700 text-gray-300">
                          Locked
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeAreaTab === 'kitchen' ? (
            <KitchenGrid
              kitchenSlots={gameState.kitchenItems}
              selectedSlotIndex={selectedKitchenIndex}
              onSlotClick={handleKitchenItemClick}
              onItemHold={handleItemHold}
              onTakeResult={handleTakeResult}
              onAddWater={handleAddWater}
              platformType={platformType}
              onDrop={handleDropToKitchen}
            />
          ) : activeAreaTab === 'sell' ? (
            <SellItemsGrid
              inventoryItems={gameState.inventoryItems}
              gold={gameState.gold}
              onSellItem={handleSellItem}
              itemsSoldToday={gameState.itemsSoldToday}
            />
          ) : activeAreaTab === 'library' ? (
            <Library
              currentDay={gameState.currentDay}
              gold={gameState.gold}
              discoveredRecipes={gameState.discoveredRecipes}
              onBuyRecipe={onBuyLibraryRecipe || (() => {})}
            />
          ) : (
            <Cookbook 
              discoveredItems={gameState.discoveredItems}
              discoveredRecipes={gameState.discoveredRecipes}
            />
          )}
        </div>
      </div>
      )}

      {/* Help text reminder */}
      <div className="text-center mt-4 mb-2">
        <p className="text-yellow-300 pixel-text text-xs opacity-75">
          Stuck? Click on Main Menu to access Tutorial Handguide
        </p>
      </div>

      <div className="text-center mt-6">
        <p className="text-white pixel-text text-sm opacity-80">
          {platformType === 'desktop' 
            ? isWorkshopOpen
              ? isBattleDay && isBattleDay(gameState.currentDay)
                ? hasBattledToday
                  ? `🖱️ Drag & drop foods and spices to platter • Battle complete for today! Buy more slots for 20 gold each (${gameState.unlockedPlatterSlots}/12 unlocked)`
                  : `🖱️ BATTLE DAY! Drag & drop foods and spices to arrange platter • Click ⚔️ Find Chef to battle • Must battle before sleeping`
                : `🖱️ Drag & drop foods and spices to platter slots • Only seeds are blocked • Upgrade slots boost items in battle`
              : activeAreaTab === 'shop' 
                ? `Smart shop prioritizes seeds for your discovered recipes • ${gameState.hasThirdShopSlot ? '3 slots unlocked' : 'Buy 3rd slot permanently for 8 gold'} • Use Sell tab to sell grown items for 2x seed price`
                : activeAreaTab === 'kitchen'
                  ? "🖱️ Drag & drop ingredients to kitchen slots • Seeds not allowed • Use Add Water buttons for water • Try combining ingredients!"
                : activeAreaTab === 'cookbook'
                  ? `Battle Cookbook: ${gameState.discoveredItems.length} items discovered • All item abilities shown for strategic planning!`
                  : activeAreaTab === 'sell'
                    ? "Click the sell slot, then click any grown crop or dish to sell it for gold!"
                    : activeTab === 'inventory'
                      ? "🖱️ Drag seeds to farm plots to plant • Click planted crops to water them • Drag items to fridge for storage • Drag foods to kitchen/platter • Hold items to view details"
                      : "🖱️ Drag items from inventory to fill fridge slots • Drag fridge items back to inventory • Buy more slots for 5 gold each"
            : isWorkshopOpen
              ? isBattleDay && isBattleDay(gameState.currentDay)
                ? hasBattledToday
                  ? `Tap empty platter slots to select items • Tap placed items to return them • Battle complete for today! Buy more slots for 20 gold each (${gameState.unlockedPlatterSlots}/12 unlocked)`
                  : `BATTLE DAY! Tap ⚔️ Find Chef to battle • Must battle before sleeping • Buy more slots for 20 gold each (${gameState.unlockedPlatterSlots}/12 unlocked)`
                : `Tap empty platter slots to select items • Tap placed items to return them • Buy more slots for 20 gold each (${gameState.unlockedPlatterSlots}/12 unlocked)`
              : activeAreaTab === 'shop' 
                ? `Smart shop prioritizes seeds for your discovered recipes • ${gameState.hasThirdShopSlot ? '3 slots unlocked' : 'Buy 3rd slot permanently for 8 gold'} • Sell spices for 50% price`
                : activeAreaTab === 'kitchen'
                  ? selectedKitchenIndex !== null
                    ? "Now tap a non-seed item in your inventory to place it in the kitchen!"
                    : "Tap items for move options with descriptions • Use Add Water button for water • Tap water to remove it • Try combining ingredients to discover new recipes!"
                : activeAreaTab === 'library'
                  ? "Daily themed recipe offers! Today's theme rotates every day • Buy recipes directly instead of random discovery"
                : activeAreaTab === 'cookbook'
                  ? `Battle Cookbook: ${gameState.discoveredItems.length} items discovered • All item abilities shown for strategic planning!`
                  : activeAreaTab === 'sell'
                    ? "Click the sell slot, then click any grown crop or dish to sell it for gold!"
                    : selectedPlotIndex !== null 
                      ? "Now click a seed in your inventory to plant it!" 
                      : selectedFridgeIndex !== null
                        ? "Now click an item in your inventory to move it to the fridge!"
                        : activeTab === 'inventory'
                          ? "Click empty farm plots to select for planting • Click planted crops to water them • Hold items to view details • Click empty fridge slots to select for storage • Click mature crops to harvest • Use Sell tab to sell grown items"
                          : "Click empty fridge slots to select them • Hold items to view details • Click fridge items to move to inventory • Buy more slots for 5 gold each"
          }
        </p>
        <p className="text-white pixel-text text-xs opacity-60 mt-2">
          {isWorkshopOpen
            ? isBattleDay && isBattleDay(gameState.currentDay)
              ? hasBattledToday
                ? platformType === 'desktop' 
                  ? "Battle complete! You can sleep to advance to the next day • Right-click items for detailed stats and abilities"
                  : "Battle complete! You can sleep to advance to the next day • Arrange foods for future battles"
                : platformType === 'desktop'
                  ? "Battle days: Day 3 and 7 of each season (every 3rd then 4th day) • Right-click for item stats • You must battle before sleeping!"
                  : "Battle days: Day 3 and 7 of each season (every 3rd then 4th day) • You must battle before sleeping!"
              : platformType === 'desktop'
                ? "Arrange your best foods strategically • Right-click for stats • Upgrade slots boost items in battle • No seeds or spices allowed"
                : "Arrange your best foods strategically • Upgrade slots boost items in battle • No seeds or spices allowed"
            : activeAreaTab === 'kitchen' 
              ? platformType === 'desktop'
                  ? "Seeds cannot be used in the kitchen • Right-click for item stats • Use Add Water button for water • Buy Recipe to learn new recipes for 3 gold • Try: Water + Wheat = Dough"
                  : "Seeds cannot be used in the kitchen • Use Add Water button for water • Buy Recipe to learn new recipes for 3 gold • Try: Water + Wheat = Dough | Apple + Dough + Sugar = Apple Pie"
              : activeAreaTab === 'cookbook'
                ? "View combat stats and abilities • Plan your battle strategy • Items unlock when obtained"
                : activeAreaTab === 'sell'
                  ? "Grown crops sell for 2x seed price • Spices sell for 50% purchase price • Crafted items are too valuable to sell!"
                  : isBattleDay && isBattleDay(gameState.currentDay)
                  ? hasBattledToday
                    ? platformType === 'desktop'
                      ? "Battle complete for today! Hover items for stats • Click planted crops to water them directly • Items spoil after two nights (green hue) and rot after four nights"
                      : "Battle complete for today! Return tomorrow for regular farming • Hold items to view details • Items spoil after two nights (green hue) and rot after four nights"
                    : platformType === 'desktop'
                      ? "BATTLE DAY! Open Workshop and click Find Chef to battle • Hover items for stats • Click planted crops to water them directly • Items spoil after two nights • Seeds never spoil • Fridge prevents spoilage"
                      : "BATTLE DAY! Open Workshop and click Find Chef to battle • Hold items to view details • Items spoil after two nights • Seeds never spoil • Fridge prevents spoilage"
                  : platformType === 'desktop'
                    ? "Right-click items for instant stats • Click planted crops to water them directly • Items spoil after two nights (green hue) and rot after four nights • Seeds never spoil • Fridge prevents spoilage"
                    : "Click items to see details • Click planted crops to water them directly • Items spoil after two nights (green hue) and rot after four nights • Seeds never spoil • Fridge prevents spoilage"
          }
        </p>
      </div>

      <Tooltip
        item={tooltip.item}
        position={tooltip.position}
        visible={tooltip.visible}
        onClose={() => setTooltip(prev => ({ ...prev, visible: false }))}
      />

      <ItemActionModal
        item={itemActionModal.item}
        isOpen={itemActionModal.isOpen}
        onClose={closeItemActionModal}
        onMoveToKitchen={handleMoveToKitchen}
        onMoveToFridge={handleMoveToFridge}
        onMoveToWorkshop={handleMoveToWorkshop}
        canMoveToKitchen={itemActionModal.item ? canMoveToKitchen(itemActionModal.item) : false}
        canMoveToFridge={itemActionModal.item ? canMoveToFridge(itemActionModal.item) : false}
        canMoveToWorkshop={itemActionModal.item ? canMoveToWorkshop(itemActionModal.item) : false}
        kitchenSpaceAvailable={findEmptyKitchenSlot() !== -1}
        fridgeSpaceAvailable={findEmptyFridgeSlot() !== -1}
        workshopSpaceAvailable={findEmptyWorkshopSlot() !== -1}
      />
    </GameLayout>
  );
}
