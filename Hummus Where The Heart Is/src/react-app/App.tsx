import { useState } from "react";
import PlatformSelectionScreen from "@/react-app/pages/PlatformSelectionScreen";
import StartScreen from "@/react-app/pages/StartScreen";
import BasketSelectionScreen from "@/react-app/pages/BasketSelectionScreen";
import FarmScreen from "@/react-app/pages/FarmScreen";
import ArenaScreen from "@/react-app/pages/ArenaScreen";
import LoadingScreen from "@/react-app/components/LoadingScreen";
import MainMenu from "@/react-app/components/MainMenu";
import TutorialModal from "@/react-app/components/TutorialModal";
import { getRandomShopItems, getRandomSpiceItems, getAllSpiceItems } from "@/react-app/components/Shop";
import NavigationBar from "@/react-app/components/NavigationBar";
import SaveIndicator from "@/react-app/components/SaveIndicator";
import { AudioProvider } from "@/react-app/components/AudioProvider";

type Screen = 'platformSelection' | 'start' | 'basketSelection' | 'mainMenu' | 'farm' | 'loading' | 'arena' | 'gameComplete';

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
  maxStamina: number; // Maximum stamina (increases by 12 each season)
  gold: number;
  currentDay: number; // 1-28
  inventoryItems: (InventoryItem | null)[];
  fridgeItems: (InventoryItem | null)[];
  kitchenItems: (InventoryItem | null)[];
  platterItems: (InventoryItem | null)[]; // Expandable slots for battle platter
  upgradedPlatterSlots: number[]; // Track upgrade levels of platter slots
  unlockedFridgeSlots: number; // Number of unlocked fridge slots (starts at 1)
  unlockedPlatterSlots: number; // Number of unlocked platter slots (starts at 4)
  hasThirdShopSlot: boolean; // Whether the third shop slot has been purchased
  hasThirdSpiceSlot: boolean; // Whether the third spice slot has been purchased
  discoveredRecipes: string[]; // List of recipe IDs that have been discovered
  discoveredItems: string[]; // List of item IDs that have been discovered (had in inventory)
  winStreak: number; // Current win streak for arena battles
  lossStreak: number; // Current loss streak for arena battles
  hasBattledToday: boolean; // Whether the player has battled today (for battle days)
  hasWonAfterLoss: boolean; // Whether player has already gained a heart back after a loss
  farmPlots: FarmPlot[]; // Farm plot state to persist across sleeps
  isNewGamePlus: boolean; // Whether player is in New Game+ mode
  newGamePlusLoops: number; // Number of times player has looped through seasons
  hasUnlockedNewGamePlus: boolean; // Whether New Game+ has been unlocked permanently
  itemsSoldToday: number; // Number of items sold today (max 6 per day)
}

interface ShopItem {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number; // 0 = fresh, 1 = spoiling (green hue), 2 = rotten
  dayObtained?: number; // Track when item was obtained for spoilage
}

// Initialize 5x5 farm grid with progressive unlocking system
const getInitialFarmPlots = (): FarmPlot[] => {
  const plots: FarmPlot[] = [];
  
  for (let i = 0; i < 25; i++) {
    const plot: FarmPlot = {
      id: `plot-${i}`,
      isUnlocked: i < 3, // First 3 plots (0,0 1,0 2,0) start unlocked
      isPlanted: false,
      isWatered: false,
      canPurchase: i === 3, // Plot 3 (position 3,0) is first purchasable
      purchaseCost: i === 3 ? 1 : undefined // Costs 1 gold
    };
    plots.push(plot);
  }
  
  return plots;
};

// Save game state to localStorage
const saveGameState = (state: GameState, shopState: any) => {
  const saveData = {
    gameState: state,
    shopItems: shopState.shopItems,
    spiceItems: shopState.spiceItems,
    rerollCost: shopState.rerollCost,
    spiceRerollCost: shopState.spiceRerollCost,
    savedAt: Date.now()
  };
  localStorage.setItem('hmwthi_save', JSON.stringify(saveData));
};

// Load game state from localStorage
const loadGameState = () => {
  try {
    const saveData = localStorage.getItem('hmwthi_save');
    if (saveData) {
      return JSON.parse(saveData);
    }
  } catch (error) {
    console.error('Error loading save data:', error);
  }
  return null;
};

// Check if save file exists
const hasSaveFile = () => {
  try {
    const saveData = localStorage.getItem('hmwthi_save');
    return saveData !== null && saveData !== undefined;
  } catch (error) {
    console.error('Error checking save file:', error);
    return false;
  }
};

// Check if New Game+ is unlocked
const hasNewGamePlusUnlocked = () => {
  try {
    const saveData = localStorage.getItem('hmwthi_save');
    if (saveData) {
      const parsed = JSON.parse(saveData);
      return parsed.gameState?.hasUnlockedNewGamePlus || false;
    }
    return false;
  } catch (error) {
    console.error('Error checking New Game+ unlock:', error);
    return false;
  }
};

// Clear save file
const clearSaveFile = () => {
  localStorage.removeItem('hmwthi_save');
};

// Always start with platform selection to give players the choice
const getInitialScreen = (): Screen => {
  return 'platformSelection';
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(getInitialScreen());
  const [platformType, setPlatformType] = useState<'desktop' | 'mobile'>('mobile');
  
  // Initialize states - will be overridden if loading from save
  const [shopItems, setShopItems] = useState<ShopItem[]>(getRandomShopItems(2, []));
  const [spiceItems, setSpiceItems] = useState<ShopItem[]>(getRandomSpiceItems(2));
  const [rerollCost, setRerollCost] = useState<number>(1);
  const [spiceRerollCost, setSpiceRerollCost] = useState<number>(1);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState<boolean>(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState<boolean>(false);
  
  const getInitialGameState = (startingItems?: InventoryItem[]): GameState => {
    const defaultInventory = Array(25).fill(null);
    
    // If starting items provided, place them in inventory
    if (startingItems) {
      startingItems.forEach((item, index) => {
        if (index < 25) {
          defaultInventory[index] = item;
        }
      });
    }
    
    return {
    lives: 5,
    stamina: 12,
    maxStamina: 12,
    gold: 10,
    currentDay: 1,
    inventoryItems: defaultInventory,
    fridgeItems: Array(25).fill(null), // 5x5 fridge grid
    kitchenItems: Array(3).fill(null), // 3 ingredient slots
    platterItems: Array(12).fill(null), // 12 total slots (expandable)
    upgradedPlatterSlots: Array(12).fill(0), // Track upgraded platter slots (0 = no upgrade)
    unlockedPlatterSlots: 4, // Start with 4 slots unlocked
    unlockedFridgeSlots: 1, // Start with 1 slot unlocked
    hasThirdShopSlot: false, // Start with only 2 shop slots
    hasThirdSpiceSlot: false, // Start with only 2 spice slots
    discoveredRecipes: [], // No recipes discovered initially
    discoveredItems: [], // Start with no items discovered initially
    winStreak: 0, // Start with no win streak
    lossStreak: 0, // Start with no loss streak
    hasBattledToday: false, // Start without having battled today
    hasWonAfterLoss: false, // Haven't gained heart back yet
    farmPlots: getInitialFarmPlots(), // Initialize farm plots
    isNewGamePlus: false, // Start in normal mode
    newGamePlusLoops: 0, // No loops completed yet
    hasUnlockedNewGamePlus: false, // New Game+ not unlocked initially
    itemsSoldToday: 0 // Start with no items sold today
  };
  };

  const [gameState, setGameState] = useState<GameState>(getInitialGameState());

  const handlePlatformSelected = (platform: 'desktop' | 'mobile') => {
    setPlatformType(platform);
    setCurrentScreen('start');
  };

  const handleStartGame = () => {
    setCurrentScreen('basketSelection');
  };

  const handleBasketSelected = (selectedItems: InventoryItem[], recipeUnlock: string) => {
    // Update discovered items based on selected items
    const newDiscoveredItems: string[] = [];
    selectedItems.forEach(item => {
      // Add the base item (remove -seeds suffix for seeds)
      const baseItemId = item.id.replace('-seeds', '');
      if (!newDiscoveredItems.includes(baseItemId)) {
        newDiscoveredItems.push(baseItemId);
      }
      // Also add the item itself if it's not a seed
      if (!item.id.endsWith('-seeds') && !newDiscoveredItems.includes(item.id)) {
        newDiscoveredItems.push(item.id);
      }
    });

    // Check if this is New Game+ starting fresh from basket selection
    const isNewGamePlusStart = gameState.isNewGamePlus;
    
    if (isNewGamePlusStart) {
      // New Game+ fresh start - create new game state but keep recipes and mark as New Game+
      const newGameState = getInitialGameState(selectedItems);
      newGameState.discoveredItems = newDiscoveredItems;
      
      // Ensure recipe unlock is valid and not empty
      const validRecipeUnlock = recipeUnlock && typeof recipeUnlock === 'string' ? recipeUnlock : 'dough';
      
      // Keep all preserved recipes from previous run and add the new basket recipe
      newGameState.discoveredRecipes = [...new Set([...gameState.discoveredRecipes, validRecipeUnlock])];
      newGameState.itemsSoldToday = 0;
      
      // Set New Game+ properties
      newGameState.isNewGamePlus = true;
      newGameState.newGamePlusLoops = gameState.newGamePlusLoops + 1; // Increment for the new loop
      newGameState.hasUnlockedNewGamePlus = true;
      
      setGameState(newGameState);
    } else {
      // Regular fresh start - create completely new game state
      const newGameState = getInitialGameState(selectedItems);
      newGameState.discoveredItems = newDiscoveredItems;
      
      // Ensure recipe unlock is valid and not empty
      const validRecipeUnlock = recipeUnlock && typeof recipeUnlock === 'string' ? recipeUnlock : 'dough';
      newGameState.discoveredRecipes = [validRecipeUnlock]; // Only the basket recipe for vanilla
      newGameState.itemsSoldToday = 0;
      
      setGameState(newGameState);
    }
    
    setCurrentScreen('farm');
  };

  const handleLoadGame = () => {
    const saveData = loadGameState();
    if (saveData) {
      setGameState(saveData.gameState);
      setShopItems(saveData.shopItems);
      setSpiceItems(saveData.spiceItems);
      setRerollCost(saveData.rerollCost);
      setSpiceRerollCost(saveData.spiceRerollCost);
      
      // If loading a New Game+ save, make sure shop generation uses saved recipes
      if (saveData.gameState.isNewGamePlus && saveData.gameState.discoveredRecipes.length > 0) {
        const slotCount = saveData.gameState.hasThirdShopSlot ? 3 : 2;
        setShopItems(getRandomShopItems(slotCount, saveData.gameState.discoveredRecipes));
      }
      
      setCurrentScreen('farm');
    }
  };

  const handleNewGame = () => {
    // Clear any existing save
    clearSaveFile();
    
    // Reset shop items and costs
    setShopItems(getRandomShopItems(2, []));
    setSpiceItems(getRandomSpiceItems(2));
    setRerollCost(1);
    setSpiceRerollCost(1);
    
    // Go to basket selection instead of directly to farm
    setCurrentScreen('basketSelection');
  };

  const handleResumeGame = () => {
    setCurrentScreen('farm');
  };

  const handleMainMenu = () => {
    setCurrentScreen('mainMenu');
  };

  const handleTutorial = () => {
    setShowTutorial(true);
  };

  // Helper function to check if current day is a battle day (3rd and 7th day of each season)
  const isBattleDay = (day: number): boolean => {
    const dayInSeason = ((day - 1) % 7) + 1;
    return dayInSeason === 3 || dayInSeason === 7;
  };

  const handleFindChef = () => {
    setCurrentScreen('loading');
  };

  const handleLoadingComplete = () => {
    setCurrentScreen('arena');
  };

  const handleReturnToWorkshop = () => {
    setIsWorkshopOpen(true); // Open workshop mode
    setCurrentScreen('farm');
  };

  

  const handleCloseGame = () => {
    if (confirm('Are you sure you want to close the game? Any unsaved progress will be lost.')) {
      window.close();
      // If window.close() doesn't work (some browsers block it), redirect to about:blank
      setTimeout(() => {
        window.location.href = 'about:blank';
      }, 100);
    }
  };

  const handleBuyItem = (shopItem: { id: string; name: string; image: string; price: number }) => {
    if (gameState.gold >= shopItem.price) {
      setGameState(prev => {
        const newInventory = [...prev.inventoryItems];
        
        // Look for existing item to stack (inventory supports stacking)
        const existingIndex = newInventory.findIndex(item => 
          item && item.id === shopItem.id
        );
        
        if (existingIndex !== -1 && newInventory[existingIndex]) {
          // Stack with existing item
          (newInventory[existingIndex] as InventoryItem).quantity += 1;
        } else {
          // Add to first empty slot
          const emptyIndex = newInventory.findIndex(item => item === null);
          if (emptyIndex !== -1) {
            // Check if item is a spice (doesn't spoil) or seed (doesn't spoil)
            const isSpice = !shopItem.id.endsWith('-seeds');
            const spoilageLevel = (isSpice || shopItem.id.endsWith('-seeds')) ? undefined : 0;
            
            newInventory[emptyIndex] = {
              id: shopItem.id,
              name: shopItem.name,
              image: shopItem.image,
              quantity: 1,
              spoilageLevel: spoilageLevel,
              dayObtained: prev.currentDay
            };
          }
        }
        
        // Add item to discovered items if not already discovered
        const newDiscoveredItems = [...prev.discoveredItems];
        if (!newDiscoveredItems.includes(shopItem.id)) {
          newDiscoveredItems.push(shopItem.id);
        }
        
        return {
          ...prev,
          gold: prev.gold - shopItem.price,
          inventoryItems: newInventory,
          discoveredItems: newDiscoveredItems
        };
      });
    }
  };

  const handleRerollShop = () => {
    if (gameState.gold >= rerollCost) {
      setGameState(prev => ({ ...prev, gold: prev.gold - rerollCost }));
      const slotCount = gameState.hasThirdShopSlot ? 3 : 2;
      setShopItems(getRandomShopItems(slotCount, gameState.discoveredRecipes));
      setRerollCost(prev => prev + 1); // Increase reroll cost each time
    }
  };

  const handleRerollSpices = () => {
    if (gameState.gold >= spiceRerollCost) {
      setGameState(prev => ({ ...prev, gold: prev.gold - spiceRerollCost }));
      const slotCount = gameState.hasThirdSpiceSlot ? 3 : 2;
      setSpiceItems(getRandomSpiceItems(slotCount));
      setSpiceRerollCost(prev => prev + 1); // Increase reroll cost each time
    }
  };

  const handleBuyThirdShopSlot = () => {
    if (gameState.gold >= 8 && !gameState.hasThirdShopSlot) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - 8,
        hasThirdShopSlot: true
      }));
      // Add a third item to current shop items using weighted selection
      const currentItems = [...shopItems];
      const newItems = getRandomShopItems(3, gameState.discoveredRecipes);
      // Keep current items and add one more
      const availableNewItems = newItems.filter(item => 
        !currentItems.some(existing => existing.id === item.id)
      );
      if (availableNewItems.length > 0) {
        setShopItems([...currentItems, availableNewItems[0]]);
      }
    }
  };

  const handleBuyLibraryRecipe = (recipeId: string) => {
    // Library recipe prices are fixed in the Library component
    const recipePrices: { [key: string]: number } = {
      'apple-tart': 4, 'golden-apple-tart': 5, 'green-apple-tart': 4, 'strawberry-tart': 4,
      'blueberry-tart': 4, 'blackberry-tart': 5, 'raspberry-tart': 5,
      'lemonade': 3, 'limeade': 3, 'orangeade': 3, 'grape-juice': 4,
      'tomato-soup': 3, 'pumpkin-soup': 4,
      'classic-pico': 3, 'pineapple-chili-salsa': 4, 'green-chile-salsa': 3,
      'avocado-salsa-verde': 4, 'roasted-red-relish': 4,
      'cherry-jam': 4, 'strawberry-jam': 4, 'mixed-berry-jam': 5, 'grape-jelly': 4,
      'orange-marmalade': 4, 'kiwi-lime-jam': 5, 'pineapple-preserves': 5,
      'garlic-herb-flatbread': 4, 'tomato-basil-flatbread': 4,
      'tri-bell-pepper-flatbread': 5, 'pepper-onion-flatbread': 4,
      'watermelon-lime-granita': 4, 'dragonfruit-sorbet': 5, 'blueberry-ice': 4, 'pineapple-coconut-ice': 5,
      'caramelized-banana': 3, 'coconut-snow': 4, 'candied-orange-peel': 4,
      'candied-jalapenos': 5, 'apple-compote': 4, 'golden-apple-compote': 5
    };
    
    const price = recipePrices[recipeId] || 4;
    
    if (gameState.gold >= price && !gameState.discoveredRecipes.includes(recipeId)) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - price,
        discoveredRecipes: [...prev.discoveredRecipes, recipeId]
      }));
      
      // Show success message
      const recipeNames: { [key: string]: string } = {
        'apple-tart': 'Apple Tart',
        'golden-apple-tart': 'Golden Apple Tart',
        'green-apple-tart': 'Green Apple Tart',
        'strawberry-tart': 'Strawberry Tart',
        'blueberry-tart': 'Blueberry Tart',
        'blackberry-tart': 'Blackberry Tart',
        'raspberry-tart': 'Raspberry Tart',
        'lemonade': 'Lemonade',
        'limeade': 'Limeade',
        'orangeade': 'Orangeade',
        'grape-juice': 'Grape Juice',
        'tomato-soup': 'Tomato Soup',
        'pumpkin-soup': 'Pumpkin Soup',
        'classic-pico': 'Classic Pico de Gallo',
        'pineapple-chili-salsa': 'Pineapple-Chili Salsa',
        'green-chile-salsa': 'Green Chile Salsa',
        'avocado-salsa-verde': 'Avocado Salsa Verde',
        'roasted-red-relish': 'Roasted Red Relish',
        'cherry-jam': 'Cherry Jam',
        'strawberry-jam': 'Strawberry Jam',
        'mixed-berry-jam': 'Mixed Berry Jam',
        'grape-jelly': 'Grape Jelly',
        'orange-marmalade': 'Orange Marmalade',
        'kiwi-lime-jam': 'Kiwi-Lime Jam',
        'pineapple-preserves': 'Pineapple Preserves',
        'garlic-herb-flatbread': 'Garlic Herb Flatbread',
        'tomato-basil-flatbread': 'Tomato Basil Flatbread',
        'tri-bell-pepper-flatbread': 'Tri-Bell Pepper Flatbread',
        'pepper-onion-flatbread': 'Pepper & Onion Flatbread',
        'watermelon-lime-granita': 'Watermelon-Lime Granita',
        'dragonfruit-sorbet': 'Dragonfruit Sorbet',
        'blueberry-ice': 'Blueberry Ice',
        'pineapple-coconut-ice': 'Pineapple-Coconut Ice',
        'caramelized-banana': 'Caramelized Banana',
        'coconut-snow': 'Coconut Snow',
        'candied-orange-peel': 'Candied Orange Peel',
        'candied-jalapenos': 'Candied Jalapeños',
        'apple-compote': 'Apple Compote',
        'golden-apple-compote': 'Golden Apple Compote'
      };
      
      const recipeName = recipeNames[recipeId] || recipeId;
      setTimeout(() => {
        alert(`📚 Recipe Purchased!\n\nYou learned: ${recipeName}\n\nCheck your cookbook to see the recipe details!`);
      }, 500);
    }
  };

  const handleBuyThirdSpiceSlot = () => {
    if (gameState.gold >= 10 && !gameState.hasThirdSpiceSlot) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - 10,
        hasThirdSpiceSlot: true
      }));
      // Add a third item to current spice items
      const currentItems = [...spiceItems];
      const availableItems = getAllSpiceItems().filter(item => 
        !currentItems.some(existing => existing.id === item.id)
      );
      if (availableItems.length > 0) {
        const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        setSpiceItems([...currentItems, randomItem]);
      }
    }
  };

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prev => {
      const updatedState = { ...prev, ...newState };
      
      // Auto-save game state after most actions to ensure progress is preserved
      const shouldAutoSave = newState.currentDay !== undefined || 
                            newState.gold !== undefined ||
                            newState.lives !== undefined ||
                            newState.inventoryItems !== undefined ||
                            newState.farmPlots !== undefined ||
                            newState.stamina !== undefined ||
                            newState.kitchenItems !== undefined ||
                            newState.fridgeItems !== undefined ||
                            newState.platterItems !== undefined ||
                            newState.discoveredRecipes !== undefined ||
                            newState.discoveredItems !== undefined ||
                            newState.unlockedFridgeSlots !== undefined ||
                            newState.unlockedPlatterSlots !== undefined;
                            
      if (shouldAutoSave) {
        // Save immediately rather than with timeout to ensure data persistence
        try {
          saveGameState(updatedState, {
            shopItems,
            spiceItems, 
            rerollCost,
            spiceRerollCost
          });
          // Show save indicator to user
          setShowSaveIndicator(true);
        } catch (error) {
          console.error('Failed to save game state:', error);
        }
      }
      
      return updatedState;
    });
  };

  const handleBattleComplete = (result: { winner: 'player' | 'opponent'; goldEarned: number; isSecondBattle?: boolean }) => {
    setGameState(prev => {
      let newLives = prev.lives;
      let newHasWonAfterLoss = prev.hasWonAfterLoss;
      
      if (result.winner === 'opponent') {
        // Lose a heart on defeat
        newLives = Math.max(0, prev.lives - 1);
        newHasWonAfterLoss = false; // Reset heart recovery opportunity
      } else if (result.winner === 'player' && prev.lossStreak > 0 && !prev.hasWonAfterLoss) {
        // First win after a loss gives back one heart (only once)
        newLives = Math.min(5, prev.lives + 1);
        newHasWonAfterLoss = true;
      }
      
      // Check for game over
      if (newLives === 0) {
        alert("Game Over! You've lost all your hearts. Starting a new run...");
        // Clear save file on game over
        clearSaveFile();
        // Reset to new game state
        const newGameState = getInitialGameState();
        // Also reset shop state
        setTimeout(() => {
          setShopItems(getRandomShopItems(2, []));
          setSpiceItems(getRandomSpiceItems(2));
          setRerollCost(1);
          setSpiceRerollCost(1);
        }, 100);
        return newGameState;
      }
      
      // Add random recipes after every battle
      let newDiscoveredRecipes = [...prev.discoveredRecipes];
      
      // Determine how many recipes to give based on result and if it's second battle
      let recipesToGive: number;
      if (result.winner === 'player') {
        // Player wins: 2 for regular win, 4 for second battle win (2 + 2 bonus)
        recipesToGive = result.isSecondBattle ? 4 : 2;
      } else {
        // Player loses: 1 for any loss
        recipesToGive = 1;
      }
      
      console.log(`Battle result: ${result.winner}, should give ${recipesToGive} recipes`);
      console.log(`Current discovered recipes: ${prev.discoveredRecipes.length}`);
      console.log(`Current recipes:`, prev.discoveredRecipes);
      
      // All available recipes that can be discovered (comprehensive list)
      const allRecipes = [
        'dough', 'apple-pie', 'tomato-soup',
        'cajun-garlic-soybeans', 'lime-edamame', 'eggplant-tomato-bake',
        'chili-garlic-eggplant', 'pumpkin-soup', 'spiced-pumpkin-puree',
        'guacamole', 'avocado-tomato-salad', 'watermelon-basil-salad',
        'caramelized-banana', 'coconut-snow', 'candied-orange-peel',
        'candied-jalapenos', 'quick-pickled-onions',
        'watermelon-lime-granita', 'dragonfruit-sorbet', 'blueberry-ice',
        'pineapple-coconut-ice', 'lemonade', 'limeade', 'orangeade',
        'grape-juice', 'classic-pico', 'pineapple-chili-salsa',
        'green-chile-salsa', 'roasted-red-relish', 'avocado-salsa-verde',
        'quick-marinara', 'cajun-tomato-base', 'pepper-trinity',
        'garlic-herb-flatbread', 'tomato-basil-flatbread',
        'tri-bell-pepper-flatbread', 'pepper-onion-flatbread',
        'apple-tart', 'golden-apple-tart', 'green-apple-tart',
        'strawberry-tart', 'blueberry-tart', 'blackberry-tart',
        'raspberry-tart', 'apple-compote', 'golden-apple-compote',
        'cherry-jam', 'mixed-berry-jam', 'strawberry-jam',
        'grape-jelly', 'orange-marmalade', 'kiwi-lime-jam',
        'pineapple-preserves'
      ];
      
      // Remove duplicates and ensure no undefined values
      const cleanRecipeList = [...new Set(allRecipes)].filter(recipe => recipe && typeof recipe === 'string');
      
      // Filter out already discovered recipes
      const undiscoveredRecipes = cleanRecipeList.filter(recipe => 
        !prev.discoveredRecipes.includes(recipe)
      );
      
      console.log(`Available undiscovered recipes: ${undiscoveredRecipes.length}`);
      console.log(`Undiscovered recipes:`, undiscoveredRecipes);
      
      // Add new recipes up to the amount we should get
      const actualRecipesToAdd = Math.min(recipesToGive, undiscoveredRecipes.length);
      
      // Create a copy of undiscovered recipes to avoid mutation issues
      const availableRecipes = [...undiscoveredRecipes];
      
      for (let i = 0; i < actualRecipesToAdd; i++) {
        if (availableRecipes.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * availableRecipes.length);
        const randomRecipe = availableRecipes[randomIndex];
        
        // Ensure the recipe isn't already in our new list
        if (!newDiscoveredRecipes.includes(randomRecipe)) {
          newDiscoveredRecipes.push(randomRecipe);
          console.log(`Added recipe: ${randomRecipe}`);
        }
        
        // Remove from available list to prevent duplicates
        availableRecipes.splice(randomIndex, 1);
      }
      
      console.log(`Total discovered recipes after battle: ${newDiscoveredRecipes.length}`);
      console.log(`New recipes list:`, newDiscoveredRecipes);

      // Handle win/loss streaks - special logic for second battles
      let newWinStreak = prev.winStreak;
      let newLossStreak = prev.lossStreak;
      
      if (result.winner === 'player') {
        // Player wins - always increment win streak and reset loss streak
        newWinStreak = prev.winStreak + 1;
        newLossStreak = 0;
      } else {
        // Player loses
        if (result.isSecondBattle) {
          // Second battle loss - this should contribute to loss streak
          newWinStreak = 0;
          newLossStreak = prev.lossStreak + 1;
        } else {
          // Regular first battle loss - normal loss streak logic
          newWinStreak = 0;
          newLossStreak = prev.lossStreak + 1;
        }
      }

      const updatedState = {
        ...prev,
        lives: newLives,
        gold: prev.gold + result.goldEarned,
        winStreak: newWinStreak,
        lossStreak: newLossStreak,
        hasBattledToday: true,
        hasWonAfterLoss: newHasWonAfterLoss,
        discoveredRecipes: newDiscoveredRecipes
      };
      
      // Show alert with new recipes gained
      if (actualRecipesToAdd > 0) {
        const recipeNames: { [key: string]: string } = {
          'dough': 'Basic Dough',
          'apple-pie': 'Apple Pie',
          'tomato-soup': 'Tomato Soup',
          'cajun-garlic-soybeans': 'Cajun Garlic Soybeans',
          'lime-edamame': 'Lime Edamame',
          'eggplant-tomato-bake': 'Eggplant & Tomato Bake',
          'chili-garlic-eggplant': 'Chili-Garlic Eggplant',
          'pumpkin-soup': 'Pumpkin Soup',
          'spiced-pumpkin-puree': 'Spiced Pumpkin Purée',
          'guacamole': 'Guacamole',
          'avocado-tomato-salad': 'Avocado-Tomato Salad',
          'watermelon-basil-salad': 'Watermelon Basil Salad',
          'caramelized-banana': 'Caramelized Banana',
          'coconut-snow': 'Coconut Snow',
          'candied-orange-peel': 'Candied Orange Peel',
          'candied-jalapenos': 'Candied Jalapeños',
          'quick-pickled-onions': 'Quick-Pickled Onions',
          'watermelon-lime-granita': 'Watermelon-Lime Granita',
          'dragonfruit-sorbet': 'Dragonfruit Sorbet',
          'blueberry-ice': 'Blueberry Ice',
          'pineapple-coconut-ice': 'Pineapple-Coconut Ice',
          'lemonade': 'Lemonade',
          'limeade': 'Limeade',
          'orangeade': 'Orangeade',
          'grape-juice': 'Grape Juice',
          'classic-pico': 'Classic Pico de Gallo',
          'pineapple-chili-salsa': 'Pineapple-Chili Salsa',
          'green-chile-salsa': 'Green Chile Salsa',
          'roasted-red-relish': 'Roasted Red Relish',
          'avocado-salsa-verde': 'Avocado Salsa Verde',
          'quick-marinara': 'Quick Marinara',
          'cajun-tomato-base': 'Cajun Tomato Base',
          'pepper-trinity': 'Pepper Trinity',
          'garlic-herb-flatbread': 'Garlic Herb Flatbread',
          'tomato-basil-flatbread': 'Tomato Basil Flatbread',
          'tri-bell-pepper-flatbread': 'Tri-Bell Pepper Flatbread',
          'pepper-onion-flatbread': 'Pepper & Onion Flatbread',
          'apple-tart': 'Apple Tart',
          'golden-apple-tart': 'Golden Apple Tart',
          'green-apple-tart': 'Green Apple Tart',
          'strawberry-tart': 'Strawberry Tart',
          'blueberry-tart': 'Blueberry Tart',
          'blackberry-tart': 'Blackberry Tart',
          'raspberry-tart': 'Raspberry Tart',
          'apple-compote': 'Apple Compote',
          'golden-apple-compote': 'Golden Apple Compote',
          'cherry-jam': 'Cherry Jam',
          'mixed-berry-jam': 'Mixed Berry Jam',
          'strawberry-jam': 'Strawberry Jam',
          'grape-jelly': 'Grape Jelly',
          'orange-marmalade': 'Orange Marmalade',
          'kiwi-lime-jam': 'Kiwi-Lime Jam',
          'pineapple-preserves': 'Pineapple Preserves'
        };
        
        const newRecipeIds = newDiscoveredRecipes.slice(-actualRecipesToAdd);
        const newRecipeNames = newRecipeIds.map(id => 
          recipeNames[id] || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        );
        
        setTimeout(() => {
          alert(`📚 Battle Complete!\n\nYou gained ${actualRecipesToAdd} new recipe${actualRecipesToAdd > 1 ? 's' : ''}:\n${newRecipeNames.join('\n')}\n\nCheck your cookbook to see them!`);
        }, 1000);
      }
      
      return updatedState;
    });
  };

  const handleReturnToFarm = () => {
    setCurrentScreen('farm');
  };

  const handleGameComplete = () => {
    setCurrentScreen('gameComplete');
  };

  const handleNewGamePlus = () => {
    // Store current recipes to preserve them through New Game+
    const preservedRecipes = [...gameState.discoveredRecipes];
    
    // Clear save file to start fresh
    clearSaveFile();
    
    // Reset shop items and costs for New Game+
    setShopItems(getRandomShopItems(2, preservedRecipes)); // Use preserved recipes for shop generation
    setSpiceItems(getRandomSpiceItems(2));
    setRerollCost(1);
    setSpiceRerollCost(1);
    
    // Create fresh game state but mark as New Game+ and preserve recipes
    const newGameState = getInitialGameState();
    newGameState.isNewGamePlus = true;
    newGameState.newGamePlusLoops = gameState.newGamePlusLoops; // Don't increment yet - will happen after basket selection
    newGameState.hasUnlockedNewGamePlus = true;
    newGameState.discoveredRecipes = preservedRecipes; // Keep all discovered recipes from previous run
    
    setGameState(newGameState);
    
    // Go to basket selection for complete fresh start
    setCurrentScreen('basketSelection');
  };

  const handleMainMenuFromComplete = () => {
    setCurrentScreen('mainMenu');
  };

  const handleExitGame = () => {
    // Always save before potentially exiting
    try {
      saveGameState(gameState, {
        shopItems,
        spiceItems,
        rerollCost,
        spiceRerollCost
      });
    } catch (error) {
      console.error('Failed to save game state before exit:', error);
    }
    
    if (confirm('Game progress has been saved! Are you sure you want to exit?')) {
      // Try to close the window or redirect
      window.close();
      setTimeout(() => {
        window.location.href = 'about:blank';
      }, 100);
    }
  };

  if (currentScreen === 'platformSelection') {
    return (
      <AudioProvider>
        <PlatformSelectionScreen onPlatformSelected={handlePlatformSelected} />
      </AudioProvider>
    );
  }

  if (currentScreen === 'start') {
    return (
      <AudioProvider>
        <StartScreen 
          onStartGame={handleStartGame}
          hasSaveFile={hasSaveFile()}
          onLoadGame={handleLoadGame}
          hasNewGamePlusUnlocked={hasNewGamePlusUnlocked()}
          onStartNewGamePlus={() => {
            // Load current save to get recipes, then start New Game+
            const saveData = loadGameState();
            if (saveData && saveData.gameState.hasUnlockedNewGamePlus) {
              // Preserve recipes from the saved game
              const preservedRecipes = saveData.gameState.discoveredRecipes || [];
              
              // Reset shop items and costs for New Game+
              setShopItems(getRandomShopItems(2, preservedRecipes));
              setSpiceItems(getRandomSpiceItems(2));
              setRerollCost(1);
              setSpiceRerollCost(1);
              
              // Create fresh New Game+ state with preserved recipes
              const newGameState = getInitialGameState();
              newGameState.isNewGamePlus = true;
              newGameState.newGamePlusLoops = saveData.gameState.newGamePlusLoops || 0;
              newGameState.hasUnlockedNewGamePlus = true;
              newGameState.discoveredRecipes = preservedRecipes;
              
              setGameState(newGameState);
              
              // Go to basket selection for New Game+
              setCurrentScreen('basketSelection');
            } else {
              // Fallback - start basic New Game+
              handleNewGamePlus();
            }
          }}
        />
      </AudioProvider>
    );
  }

  if (currentScreen === 'basketSelection') {
    return (
      <AudioProvider>
        <BasketSelectionScreen 
          onBasketSelected={handleBasketSelected}
          platformType={platformType}
        />
      </AudioProvider>
    );
  }

  if (currentScreen === 'mainMenu') {
    return (
      <AudioProvider>
        <MainMenu
          onResumeGame={handleResumeGame}
          onNewGame={handleNewGame}
          onTutorial={handleTutorial}
          onCloseGame={handleCloseGame}
          isGameInProgress={true}
        />
        <TutorialModal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
      </AudioProvider>
    );
  }

  if (currentScreen === 'loading') {
    return (
      <AudioProvider>
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      </AudioProvider>
    );
  }

  if (currentScreen === 'gameComplete') {
    return (
      <AudioProvider>
        <div className="min-h-screen bg-gradient-to-b from-purple-800 via-purple-700 to-purple-900 flex items-center justify-center pixel-art">
        <div className="text-center max-w-2xl mx-4">
          <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-8 pixel-shadow">
            <h1 className="text-4xl md:text-5xl font-bold text-white pixel-text mb-6">
              🎉 CONGRATULATIONS! 🎉
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 pixel-text mb-4">
              Game Complete!
            </h2>
            <p className="text-amber-200 pixel-text text-lg mb-6 leading-relaxed">
              You've successfully survived all four seasons and become a master chef! 
              You've unlocked <strong className="text-yellow-400">New Game+</strong> mode for endless challenges.
            </p>
            
            <div className="bg-purple-800 border-2 border-purple-600 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white pixel-text mb-3">New Game+ Unlocked!</h3>
              <p className="text-purple-200 pixel-text text-sm leading-relaxed">
                • Start completely fresh from basket selection<br/>
                • Keep all discovered recipes from this run<br/>
                • Seasons loop endlessly (Spring 1 after Winter 7)<br/>
                • Opponents scale infinitely in difficulty<br/>
                • Compete for the highest loop count!
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleNewGamePlus}
                className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-lg px-8 py-4 rounded transition-colors pixel-button pixel-text border-4 border-purple-800"
              >
                🚀 Start New Game+ (Keep Recipes)
              </button>
              
              <button
                onClick={handleMainMenuFromComplete}
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded transition-colors pixel-button pixel-text border-4 border-blue-800"
              >
                📋 Main Menu
              </button>
              
              <button
                onClick={handleExitGame}
                className="block w-full bg-red-600 hover:bg-red-500 text-white font-bold text-lg px-8 py-4 rounded transition-colors pixel-button pixel-text border-4 border-red-800"
              >
                🚪 Exit Game
              </button>
            </div>
          </div>
        </div>
      </div>
      </AudioProvider>
    );
  }

  if (currentScreen === 'arena') {
    return (
      <AudioProvider>
        <NavigationBar onMainMenu={handleMainMenu} currentScreen={currentScreen} />
        <ArenaScreen
          playerPlatter={gameState.platterItems}
          playerUpgradedSlots={gameState.upgradedPlatterSlots}
          unlockedSlots={gameState.unlockedPlatterSlots}
          winStreak={gameState.winStreak}
          lossStreak={gameState.lossStreak}
          onReturnToWorkshop={handleReturnToWorkshop}
          onReturnToFarm={handleReturnToFarm}
          onBattleComplete={handleBattleComplete}
          isNewGamePlus={gameState.isNewGamePlus}
          newGamePlusLoops={gameState.newGamePlusLoops}
          isBattleDay={isBattleDay(gameState.currentDay)}
          hasBattledToday={gameState.hasBattledToday}
          currentDay={gameState.currentDay}
        />
      </AudioProvider>
    );
  }

  // Shop is now integrated into FarmScreen as a tab

  return (
    <AudioProvider>
      <NavigationBar onMainMenu={handleMainMenu} currentScreen={currentScreen} />
      <FarmScreen
        gameState={gameState}
        updateGameState={updateGameState}
        shopItems={shopItems}
        spiceItems={spiceItems}
        rerollCost={rerollCost}
        spiceRerollCost={spiceRerollCost}
        onBuyItem={handleBuyItem}
        onRerollShop={handleRerollShop}
        onRerollSpices={handleRerollSpices}
        onBuyThirdShopSlot={handleBuyThirdShopSlot}
        onBuyThirdSpiceSlot={handleBuyThirdSpiceSlot}
        onFindChef={handleFindChef}
        isBattleDay={isBattleDay}
        hasBattledToday={gameState.hasBattledToday}
        platformType={platformType}
        isWorkshopOpen={isWorkshopOpen}
        setIsWorkshopOpen={setIsWorkshopOpen}
        
        onResetRerollCosts={() => {
          setRerollCost(1);
          setSpiceRerollCost(1);
          
          // Randomize shop items for the new day
          const slotCount = gameState.hasThirdShopSlot ? 3 : 2;
          const spiceSlotCount = gameState.hasThirdSpiceSlot ? 3 : 2;
          const newShopItems = getRandomShopItems(slotCount);
          const newSpiceItems = getRandomSpiceItems(spiceSlotCount);
          setShopItems(newShopItems);
          setSpiceItems(newSpiceItems);
          
          // Save the updated shop state
          setTimeout(() => {
            saveGameState(gameState, {
              shopItems: newShopItems,
              spiceItems: newSpiceItems,
              rerollCost: 1,
              spiceRerollCost: 1
            });
          }, 100);
        }}
        onGameComplete={handleGameComplete}
        onBuyLibraryRecipe={handleBuyLibraryRecipe}
      />
      <SaveIndicator show={showSaveIndicator} />
    </AudioProvider>
  );
}
