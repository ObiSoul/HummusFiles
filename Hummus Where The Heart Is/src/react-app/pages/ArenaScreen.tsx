import { useState, useEffect, useRef } from 'react';
import GameLayout from '@/react-app/components/GameLayout';
import ArenaPlatterGrid from '@/react-app/components/ArenaPlatterGrid';
import FlavorPointBar from '@/react-app/components/FlavorPointBar';
import { getUpgradedStats } from '@/react-app/data/itemStats';
import { getItemDescription } from '@/react-app/data/itemDescriptions';

interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number;
  dayObtained?: number;
}

interface ArenaScreenProps {
  playerPlatter: (InventoryItem | null)[];
  playerUpgradedSlots: number[];
  unlockedSlots?: number;
  onReturnToWorkshop: () => void;
  onReturnToFarm?: () => void;
  winStreak?: number;
  lossStreak?: number;
  onBattleComplete?: (result: { winner: 'player' | 'opponent'; goldEarned: number; isSecondBattle?: boolean }) => void;
  isNewGamePlus?: boolean;
  newGamePlusLoops?: number;
  isBattleDay?: boolean;
  hasBattledToday?: boolean;
  currentDay?: number;
}

interface ActiveEffect {
  itemIndex: number;
  itemId: string;
  fpPerTick: number;
  tickInterval: number;
  isOpponent: boolean;
  endTime?: number; // For temporary effects
  nextTick: number;
}

interface ShakeEffect {
  itemIndex: number;
  isOpponent: boolean;
  endTime: number;
}

interface BattleResult {
  winner: 'player' | 'opponent';
  reason: 'reached_100' | 'opponent_reached_0';
}

interface BattleLogEntry {
  timestamp: number;
  type: 'activation' | 'fp_change' | 'synergy' | 'start' | 'end';
  itemName?: string;
  itemIndex?: number;
  isOpponent?: boolean;
  fpChange?: number;
  totalFP?: { player: number; opponent: number };
  message: string;
}

// Basic ingredients (fruits, vegetables, berries, citrus, grains, etc.)
// Premium items that should be restricted early game
const premiumItems = ['golden-apple', 'dragonfruit', 'black-cherry'];

const basicItems = [
  { id: 'apple', name: 'Apple', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Apple.png' },
  { id: 'banana', name: 'Banana', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Banana.png' },
  { id: 'cherry', name: 'Cherry', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Cherry.png' },
  { id: 'grape', name: 'Grapes', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Grapes.png' },
  { id: 'green-grape', name: 'Green Grapes', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Grapes.png' },
  { id: 'orange', name: 'Orange', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Orange.png' },
  { id: 'lemon', name: 'Lemon', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Lemon.png' },
  { id: 'lime', name: 'Lime', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Lime.png' },
  { id: 'strawberry', name: 'Strawberry', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Strawberry.png' },
  { id: 'blueberry', name: 'Blueberry', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Blueberries.png' },
  { id: 'blackberry', name: 'Blackberry', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Blackberries.png' },
  { id: 'raspberry', name: 'Raspberry', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Raspberry.png' },
  { id: 'pineapple', name: 'Pineapple', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Pineapple.png' },
  { id: 'watermelon', name: 'Watermelon', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Watermelon.png' },
  { id: 'coconut', name: 'Coconut', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Coconut.png' },
  { id: 'kiwi', name: 'Kiwi', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Kiwi.png' },
  { id: 'green-apple', name: 'Green Apple', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Apple.png' },
  { id: 'golden-apple', name: 'Golden Apple', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Golden-Apple.png' },
  { id: 'dragonfruit', name: 'Dragonfruit', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Dragonfruit.png' },
  { id: 'black-cherry', name: 'Black Cherry', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Black-Cherry.png' },
  { id: 'tomato', name: 'Tomato', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Tomato.png' },
  { id: 'onion', name: 'Onion', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Onion.png' },
  { id: 'red-onion', name: 'Red Onion', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Red-Onion.png' },
  { id: 'chili-pepper', name: 'Chili Pepper', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Chili-Pepper.png' },
  { id: 'jalapeno', name: 'Jalapeño', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Jalapeno.png' },
  { id: 'green-chile-pepper', name: 'Green Chile Pepper', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Chile-Pepper.png' },
  { id: 'green-bell-pepper', name: 'Green Bell Pepper', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Bell-Pepper.png' },
  { id: 'red-bell-pepper', name: 'Red Bell Pepper', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Red-Bell-Pepper.png' },
  { id: 'yellow-bell-pepper', name: 'Yellow Bell Pepper', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Yellow-Bell-Pepper.png' },
  { id: 'eggplant', name: 'Eggplant', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Eggplant.png' },
  { id: 'avocado', name: 'Avocado', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Avacado.png' },
  { id: 'pumpkin', name: 'Pumpkin', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Pumpkin.png' },
  { id: 'wheat', name: 'Wheat', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Wheat.png' },
  { id: 'soybean', name: 'Soybean', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/soybean_16.png' },
  { id: 'chickpeas', name: 'Chickpeas', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Chickpeas.png' }
];

// Prepared dishes and cooked foods
const dishItems = [
  { id: 'apple-pie', name: 'Apple Pie', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-pie.png' },
  { id: 'tomato-soup', name: 'Tomato Soup', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-soup.png' },
  { id: 'dough', name: 'Dough', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dough.png' },
  { id: 'garlic-herb-flatbread', name: 'Garlic Herb Flatbread', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/garlic-herb-flatbread.png' },
  { id: 'mixed-berry-jam', name: 'Mixed Berry Jam', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/mixed-berry-jam.png' },
  { id: 'lemonade', name: 'Lemonade', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lemonade.png' },
  { id: 'cajun-garlic-soybeans', name: 'Cajun Garlic Soybeans', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cajun-garlic-soybeans.png' },
  { id: 'lime-edamame', name: 'Lime Edamame', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lime-edamame.png' },
  { id: 'eggplant-tomato-bake', name: 'Eggplant & Tomato Bake', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/eggplant-tomato-bake.png' },
  { id: 'chili-garlic-eggplant', name: 'Chili-Garlic Eggplant', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/chili-garlic-eggplant.png' },
  { id: 'pumpkin-soup', name: 'Pumpkin Soup', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-soup.png' },
  { id: 'spiced-pumpkin-puree', name: 'Spiced Pumpkin Purée', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/spiced-pumpkin-puree.png' },
  { id: 'guacamole', name: 'Guacamole', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/guacamole.png' },
  { id: 'avocado-tomato-salad', name: 'Avocado-Tomato Salad', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-tomato-salad.png' },
  { id: 'watermelon-basil-salad', name: 'Watermelon Basil Salad', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-basil-salad.png' },
  { id: 'caramelized-banana', name: 'Caramelized Banana', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/caramelized-banana.png' },
  { id: 'coconut-snow', name: 'Coconut Snow', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-snow.png' },
  { id: 'candied-orange-peel', name: 'Candied Orange Peel', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-orange-peel.png' },
  { id: 'watermelon-lime-granita', name: 'Watermelon-Lime Granita', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-lime-granita.png' },
  { id: 'dragonfruit-sorbet', name: 'Dragonfruit Sorbet', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dragonfruit-sorbet.png' },
  { id: 'blueberry-ice', name: 'Blueberry Ice', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/blueberry-ice.png' },
  { id: 'pineapple-coconut-ice', name: 'Pineapple-Coconut Ice', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-coconut-ice.png' },
  { id: 'limeade', name: 'Limeade', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/limeade.png' },
  { id: 'orangeade', name: 'Orangeade', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orangeade.png' },
  { id: 'grape-juice', name: 'Grape Juice', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-juice.png' },
  { id: 'classic-pico', name: 'Classic Pico de Gallo', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/classic-pico.png' },
  { id: 'pineapple-chili-salsa', name: 'Pineapple-Chili Salsa', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-chili-salsa.png' },
  { id: 'quick-marinara', name: 'Quick Marinara', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/quick-marinara.png' },
  { id: 'tomato-basil-flatbread', name: 'Tomato Basil Flatbread', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-basil-flatbread.png' },
  { id: 'apple-tart', name: 'Apple Tart', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png' },
  { id: 'strawberry-tart', name: 'Strawberry Tart', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png' },
  { id: 'apple-compote', name: 'Apple Compote', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-compote.png' },
  { id: 'cherry-jam', name: 'Cherry Jam', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cherry-jam.png' },
  { id: 'strawberry-jam', name: 'Strawberry Jam', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/strawberry-jam.png' },
  { id: 'orange-marmalade', name: 'Orange Marmalade', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orange-marmalade.png' },
  { id: 'hummus', name: 'Hummus', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/hummus.png' },
  { id: 'pepper-hummus', name: 'Pepper Hummus', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-hummus.png' },
  { id: 'jalapeno-lime-hummus', name: 'Jalapeño-Lime Hummus', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/jalapeno-lime-hummus.png' },
  { id: 'avocado-hummus', name: 'Avocado Hummus', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-hummus.png' },
  { id: 'herb-hummus', name: 'Herb Hummus', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/herb-hummus.png' },
  { id: 'pumpkin-nutmeg-hummus', name: 'Pumpkin-Nutmeg Hummus', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-nutmeg-hummus.png' },
  { id: 'coconut-lime-hummus', name: 'Coconut-Lime Hummus', image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-lime-hummus.png' }
];

// Helper function to determine opponent platter size based on season/day and New Game+
const getOpponentPlatterSize = (currentDay: number = 1, isNewGamePlus: boolean = false, newGamePlusLoops: number = 0): number => {
  // Base season progression: Spring=4, Summer=5, Fall=6, Winter=7
  let baseSize: number;
  if (currentDay <= 7) baseSize = 4; // Spring
  else if (currentDay <= 14) baseSize = 5; // Summer
  else if (currentDay <= 21) baseSize = 6; // Fall
  else baseSize = 7; // Winter
  
  // In New Game+, add +1 size per loop (with reasonable maximum)
  if (isNewGamePlus) {
    baseSize += newGamePlusLoops;
    // Cap at 12 slots maximum to keep things reasonable
    baseSize = Math.min(baseSize, 12);
  }
  
  return baseSize;
};

// Generate opponent based on fight number with progressive difficulty
// In New Game+ mode, difficulty scales infinitely based on loops
const generateOpponentByFight = (fightNumber: number, isNewGamePlus: boolean = false, newGamePlusLoops: number = 0, currentDay: number = 1, difficultyMultiplier: number = 1.0) => {
  // Helper function to determine current season
  const getSeason = (day: number): 'spring' | 'summer' | 'fall' | 'winter' => {
    if (day <= 7) return 'spring';
    else if (day <= 14) return 'summer';
    else if (day <= 21) return 'fall';
    else return 'winter';
  };
  
  const currentSeason = getSeason(currentDay);
  const platterSize = getOpponentPlatterSize(currentDay, isNewGamePlus, newGamePlusLoops);
  const opponentPlatter: (InventoryItem | null)[] = Array(platterSize).fill(null);
  const opponentUpgrades: number[] = Array(platterSize).fill(0);
  
  // Base difficulty settings for each fight - no FP multipliers in base game
  const baseDifficultySettings: Array<{
    dishes: number | number[];
    basicsMin: number;
    basicsMax: number;
    fpMultiplier: number;
  }> = [
    { dishes: 0, basicsMin: 4, basicsMax: 4, fpMultiplier: 1.0 }, // Fight 1
    { dishes: 1, basicsMin: 3, basicsMax: 3, fpMultiplier: 1.0 }, // Fight 2
    { dishes: [1, 2], basicsMin: 2, basicsMax: 3, fpMultiplier: 1.0 }, // Fight 3
    { dishes: 2, basicsMin: 2, basicsMax: 2, fpMultiplier: 1.0 }, // Fight 4
    { dishes: [2, 3], basicsMin: 1, basicsMax: 3, fpMultiplier: 1.0 }, // Fight 5
    { dishes: [3, 4], basicsMin: 0, basicsMax: 1, fpMultiplier: 1.0 }, // Fight 6
    { dishes: [4, 5], basicsMin: 0, basicsMax: 0, fpMultiplier: 1.0 }, // Fight 7
    { dishes: [5, 7], basicsMin: 0, basicsMax: 0, fpMultiplier: 1.0 }  // Fight 8+
  ];
  
  // Apply New Game+ scaling - only in New Game+ do opponents get stronger
  let difficultySettings: Array<{
    dishes: number | number[];
    basicsMin: number;
    basicsMax: number;
    fpMultiplier: number;
  }> = [...baseDifficultySettings];
  
  // Apply difficulty multiplier for optional second battles
  if (difficultyMultiplier > 1.0) {
    difficultySettings = difficultySettings.map(setting => ({
      ...setting,
      fpMultiplier: setting.fpMultiplier * difficultyMultiplier
    }));
  }
  
  if (isNewGamePlus) {
    // Base New Game+ multipliers (restored from original)
    const newGamePlusSettings: Array<{
      dishes: number | number[];
      basicsMin: number;
      basicsMax: number;
      fpMultiplier: number;
    }> = [
      { dishes: 0, basicsMin: 4, basicsMax: 4, fpMultiplier: 0.95 }, // Fight 1
      { dishes: 1, basicsMin: 3, basicsMax: 3, fpMultiplier: 1.00 }, // Fight 2
      { dishes: [1, 2], basicsMin: 2, basicsMax: 3, fpMultiplier: 1.05 }, // Fight 3
      { dishes: 2, basicsMin: 2, basicsMax: 2, fpMultiplier: 1.10 }, // Fight 4
      { dishes: [2, 3], basicsMin: 1, basicsMax: 3, fpMultiplier: 1.15 }, // Fight 5
      { dishes: [3, 4], basicsMin: 0, basicsMax: 1, fpMultiplier: 1.22 }, // Fight 6
      { dishes: [4, 5], basicsMin: 0, basicsMax: 0, fpMultiplier: 1.30 }, // Fight 7
      { dishes: [5, 7], basicsMin: 0, basicsMax: 0, fpMultiplier: 1.40 }  // Fight 8+
    ];
    
    difficultySettings = [...newGamePlusSettings];
    
    // Apply loop-based scaling if beyond first loop
    if (newGamePlusLoops > 0) {
      const loopMultiplier = 1 + (newGamePlusLoops * 0.3); // 30% more difficulty per loop
      difficultySettings = difficultySettings.map(setting => ({
        ...setting,
        fpMultiplier: setting.fpMultiplier * loopMultiplier,
        // Ensure later fights always have maximum dishes in higher loops
        dishes: typeof setting.dishes === 'number' ? 
          Math.min(setting.dishes + Math.floor(newGamePlusLoops / 2), 7) : 
          [Math.min(setting.dishes[0] + Math.floor(newGamePlusLoops / 2), 7), 7]
      }));
    }
  }
  
  const fightIndex = Math.min(fightNumber - 1, difficultySettings.length - 1);
  const settings = difficultySettings[fightIndex];
  
  let dishCount: number;
  if (Array.isArray(settings.dishes)) {
    dishCount = Math.floor(Math.random() * (settings.dishes[1] - settings.dishes[0] + 1)) + settings.dishes[0];
  } else {
    dishCount = settings.dishes;
  }
  
  const basicCount = Math.floor(Math.random() * (settings.basicsMax - settings.basicsMin + 1)) + settings.basicsMin;
  const totalItems = Math.min(dishCount + basicCount, platterSize);
  
  // Fill slots with dishes first
  const availableSlots = Array.from({ length: platterSize }, (_, i) => i);
  const shuffledSlots = availableSlots.sort(() => Math.random() - 0.5);
  
  let itemIndex = 0;
  
  // Add dishes
  for (let i = 0; i < dishCount && itemIndex < totalItems; i++) {
    const randomDish = dishItems[Math.floor(Math.random() * dishItems.length)];
    opponentPlatter[shuffledSlots[itemIndex]] = {
      ...randomDish,
      quantity: 1,
      spoilageLevel: 0,
      dayObtained: 1
    };
    
    // Higher fights have more upgrades - much more balanced for base game
    let upgradeChance: number;
    let maxUpgrade: number;
    
    if (isNewGamePlus) {
      // New Game+ has the old aggressive scaling
      upgradeChance = Math.min(0.2 + (fightNumber * 0.1), 0.8);
      maxUpgrade = Math.min(Math.floor(fightNumber / 2) + 1, 3);
    } else {
      // Base game has much gentler scaling
      upgradeChance = Math.min(0.1 + (fightNumber * 0.05), 0.4); // Cap at 40% instead of 80%
      maxUpgrade = Math.min(Math.floor(fightNumber / 4) + 1, 2); // Much slower upgrade progression, cap at level 2
    }
    
    if (Math.random() < upgradeChance) {
      opponentUpgrades[shuffledSlots[itemIndex]] = Math.floor(Math.random() * maxUpgrade) + 1;
    }
    
    itemIndex++;
  }
  
  // Add basics
  for (let i = 0; i < basicCount && itemIndex < totalItems; i++) {
    // Filter out premium items for early fights
    let availableBasics = basicItems;
    if (fightNumber <= 4 && !isNewGamePlus) {
      // Restrict premium items (golden apple, dragonfruit, black cherry) for fights 1-4 in base game
      availableBasics = basicItems.filter(item => !premiumItems.includes(item.id));
    } else if (fightNumber <= 2 && isNewGamePlus) {
      // Even in New Game+, restrict premium items for first 2 fights
      availableBasics = basicItems.filter(item => !premiumItems.includes(item.id));
    }
    
    const randomBasic = availableBasics[Math.floor(Math.random() * availableBasics.length)];
    opponentPlatter[shuffledSlots[itemIndex]] = {
      ...randomBasic,
      quantity: 1,
      spoilageLevel: 0,
      dayObtained: 1
    };
    
    // Basics have lower upgrade chance
    let upgradeChance: number;
    let maxUpgrade: number;
    
    if (isNewGamePlus) {
      // New Game+ keeps higher chances for basics
      upgradeChance = Math.min(0.1 + (fightNumber * 0.05), 0.5);
      maxUpgrade = Math.min(Math.floor(fightNumber / 3) + 1, 2);
    } else {
      // Base game has much lower chances for basic items
      upgradeChance = Math.min(0.05 + (fightNumber * 0.02), 0.25); // Cap at 25% instead of 50%
      maxUpgrade = Math.min(Math.floor(fightNumber / 6) + 1, 1); // Very slow, cap at level 1 only
    }
    
    if (Math.random() < upgradeChance) {
      opponentUpgrades[shuffledSlots[itemIndex]] = Math.floor(Math.random() * maxUpgrade) + 1;
    }
    
    itemIndex++;
  }
  
  // Apply seasonal upgrade bonuses on top of existing upgrades
  const applySeasonalUpgrades = () => {
    let bonusUpgrades = 0;
    
    // Determine how many seasonal upgrades to apply
    if (currentSeason === 'fall') {
      bonusUpgrades = Math.floor(Math.random() * 2) + 1; // 1-2 upgrades
    } else if (currentSeason === 'winter') {
      bonusUpgrades = Math.floor(Math.random() * 2) + 4; // 4-5 upgrades
    }
    
    // Apply seasonal upgrades to random slots with items
    for (let i = 0; i < bonusUpgrades; i++) {
      // Find slots that have items
      const filledSlots = [];
      for (let j = 0; j < platterSize; j++) {
        if (opponentPlatter[j] !== null) {
          filledSlots.push(j);
        }
      }
      
      if (filledSlots.length > 0) {
        // Pick a random filled slot
        const randomSlot = filledSlots[Math.floor(Math.random() * filledSlots.length)];
        // Add one upgrade level (cap at level 3 for balance)
        opponentUpgrades[randomSlot] = Math.min(opponentUpgrades[randomSlot] + 1, 3);
      }
    }
  };
  
  // Apply seasonal upgrades
  applySeasonalUpgrades();
  
  return { 
    platter: opponentPlatter, 
    upgrades: opponentUpgrades, 
    fpMultiplier: settings.fpMultiplier,
    fightNumber 
  };
};

export default function ArenaScreen({ 
  playerPlatter, 
  playerUpgradedSlots, 
  unlockedSlots = 4, 
  onReturnToWorkshop, 
  onReturnToFarm,
  winStreak = 0, 
  lossStreak = 0, 
  onBattleComplete,
  isNewGamePlus = false,
  newGamePlusLoops = 0,
  isBattleDay = false,
  hasBattledToday = false,
  currentDay = 1
}: ArenaScreenProps) {
  const fightNumber = winStreak + 1;
  const [isSecondBattle, setIsSecondBattle] = useState(false);
  const [opponent, setOpponent] = useState(() => generateOpponentByFight(fightNumber, isNewGamePlus, newGamePlusLoops, currentDay));
  const [playerFP, setPlayerFP] = useState(50);
  const [opponentFP, setOpponentFP] = useState(50);
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [battleSpeed, setBattleSpeed] = useState<'slow' | 'fast' | 'very-fast'>('fast');
  const [, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [shakeEffects, setShakeEffects] = useState<ShakeEffect[]>([]);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const battleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const speedSettings = {
    'slow': { label: 'Slow', multiplier: 2.0 },
    'fast': { label: 'Fast', multiplier: 1.0 },
    'very-fast': { label: 'Very Fast', multiplier: 0.5 }
  };

  // Store active effects in a ref so they're immediately available to the battle loop
  const activeEffectsRef = useRef<ActiveEffect[]>([]);

  // Initialize active effects from both platters
  const initializeEffects = () => {
    const effects: ActiveEffect[] = [];
    const log: BattleLogEntry[] = [];
    const now = Date.now();
    
    console.log('Initializing battle effects...');
    log.push({
      timestamp: now,
      type: 'start',
      message: `🚀 Battle Started! Fight #${fightNumber}${isSecondBattle ? ' (HARDER)' : ''}`
    });
    
    // Player effects with synergy calculation
    playerPlatter.slice(0, unlockedSlots).forEach((item, index) => {
      if (item) {
        const stats = getUpgradedStats(item.id, playerUpgradedSlots[index], playerPlatter, index);
        if (stats) {
          const adjustedInterval = stats.tickInterval * speedSettings[battleSpeed].multiplier;
          const effect = {
            itemIndex: index,
            itemId: item.id,
            fpPerTick: stats.fpPerTick,
            tickInterval: adjustedInterval,
            isOpponent: false,
            endTime: stats.duration ? now + (stats.duration * speedSettings[battleSpeed].multiplier) : undefined,
            nextTick: now + adjustedInterval
          };
          effects.push(effect);
          
          log.push({
            timestamp: now,
            type: 'activation',
            itemName: item.name,
            itemIndex: index,
            isOpponent: false,
            message: `🔵 ${item.name}: ${stats.description} (Slot ${index + 1})`
          });
          
          console.log(`Player item ${item.name}: ${stats.fpPerTick} FP every ${adjustedInterval}ms`);
        }
      }
    });
    
    // Opponent effects (with FP multiplier applied and synergy calculation)
    opponent.platter.forEach((item, index) => {
      if (item) {
        const stats = getUpgradedStats(item.id, opponent.upgrades[index], opponent.platter, index);
        if (stats) {
          const adjustedInterval = stats.tickInterval * speedSettings[battleSpeed].multiplier;
          const adjustedFPPerTick = stats.fpPerTick * opponent.fpMultiplier;
          const effect = {
            itemIndex: index,
            itemId: item.id,
            fpPerTick: adjustedFPPerTick,
            tickInterval: adjustedInterval,
            isOpponent: true,
            endTime: stats.duration ? now + (stats.duration * speedSettings[battleSpeed].multiplier) : undefined,
            nextTick: now + adjustedInterval
          };
          effects.push(effect);
          
          log.push({
            timestamp: now,
            type: 'activation',
            itemName: item.name,
            itemIndex: index,
            isOpponent: true,
            message: `🔴 ${item.name}: ${stats.description} (${opponent.fpMultiplier}x difficulty) (Slot ${index + 1})`
          });
          
          console.log(`Opponent item ${item.name}: ${adjustedFPPerTick} FP every ${adjustedInterval}ms (${opponent.fpMultiplier}x multiplier)`);
        }
      }
    });
    
    setBattleLog(log);
    console.log(`Battle initialized with ${effects.length} active effects`);
    
    // Store in both state and ref for immediate access
    activeEffectsRef.current = effects;
    setActiveEffects(effects);
    return effects;
  };

  // Battle loop
  useEffect(() => {
    if (!battleStarted || battleResult) {
      // Clear any existing interval
      if (battleIntervalRef.current) {
        clearInterval(battleIntervalRef.current);
        battleIntervalRef.current = null;
      }
      return;
    }

    console.log('Starting battle loop...');

    const runBattleTick = () => {
      const now = Date.now();
      
      // Use the ref to get current effects (avoiding stale closure)
      const currentEffects = activeEffectsRef.current;
      if (!currentEffects || currentEffects.length === 0) {
        console.log('No active effects found in battle tick');
        return;
      }
      
      let fpChanges = { player: 0, opponent: 0 };
      let hasActivations = false;
      
      // Process effects that are ready to tick
      const updatedEffects = currentEffects.filter(effect => {
        // Check if effect has expired
        if (effect.endTime && now >= effect.endTime) {
          console.log(`Effect expired: ${effect.itemId} (${effect.isOpponent ? 'opponent' : 'player'})`);
          return false; // Remove expired effect
        }
        
        // Check if it's time for this effect to tick
        if (now >= effect.nextTick) {
          hasActivations = true;
          console.log(`Effect activating: ${effect.itemId} (${effect.isOpponent ? 'opponent' : 'player'}) - ${effect.fpPerTick} FP`);
          
          // Add shake effect to show item activation
          setShakeEffects(currentShakes => [
            ...currentShakes.filter(shake => shake.endTime > now), // Remove expired shakes
            {
              itemIndex: effect.itemIndex,
              isOpponent: effect.isOpponent,
              endTime: now + 300 // Shake for 300ms
            }
          ]);

          // Get item name for logging
          const itemName = effect.isOpponent 
            ? opponent.platter[effect.itemIndex]?.name || 'Unknown'
            : playerPlatter[effect.itemIndex]?.name || 'Unknown';

          if (effect.isOpponent) {
            // Opponent's effect
            if (effect.fpPerTick > 0) {
              // Opponent gains FP
              fpChanges.opponent += effect.fpPerTick;
            } else {
              // Opponent reduces player's FP (negative values)
              fpChanges.player += effect.fpPerTick;
            }
          } else {
            // Player's effect
            if (effect.fpPerTick > 0) {
              // Player gains FP
              fpChanges.player += effect.fpPerTick;
            } else {
              // Player reduces opponent's FP (negative values)
              fpChanges.opponent += effect.fpPerTick;
            }
          }
          
          // Log the activation
          setBattleLog(currentLog => [...currentLog, {
            timestamp: now,
            type: 'activation',
            itemName: itemName,
            itemIndex: effect.itemIndex,
            isOpponent: effect.isOpponent,
            fpChange: effect.fpPerTick,
            message: `${effect.isOpponent ? '🔴' : '🔵'} ${itemName} activated: ${effect.fpPerTick > 0 ? '+' : ''}${effect.fpPerTick.toFixed(2)} FP`
          }]);
          
          // Schedule next tick
          effect.nextTick = now + effect.tickInterval;
        }
        
        return true; // Keep effect active
      });
      
      // Update the effects ref
      activeEffectsRef.current = updatedEffects;
      setActiveEffects(updatedEffects);
      
      // Apply FP changes if any occurred
      if (fpChanges.player !== 0 || fpChanges.opponent !== 0) {
        console.log(`FP Changes - Player: ${fpChanges.player.toFixed(2)}, Opponent: ${fpChanges.opponent.toFixed(2)}`);
        
        setPlayerFP(prevFP => {
          const newFP = Math.max(0, Math.min(100, prevFP + fpChanges.player));
          console.log(`Player FP: ${prevFP.toFixed(2)} -> ${newFP.toFixed(2)}`);
          
          // Log FP change
          setBattleLog(currentLog => [...currentLog, {
            timestamp: now,
            type: 'fp_change',
            fpChange: fpChanges.player,
            totalFP: { player: newFP, opponent: 0 },
            message: `Player FP: ${prevFP.toFixed(1)} → ${newFP.toFixed(1)} (${fpChanges.player > 0 ? '+' : ''}${fpChanges.player.toFixed(2)})`
          }]);
          
          return newFP;
        });
        
        setOpponentFP(prevFP => {
          const newFP = Math.max(0, Math.min(100, prevFP + fpChanges.opponent));
          console.log(`Opponent FP: ${prevFP.toFixed(2)} -> ${newFP.toFixed(2)}`);
          
          // Log FP change
          setBattleLog(currentLog => [...currentLog, {
            timestamp: now,
            type: 'fp_change',
            fpChange: fpChanges.opponent,
            totalFP: { player: 0, opponent: newFP },
            message: `Opponent FP: ${prevFP.toFixed(1)} → ${newFP.toFixed(1)} (${fpChanges.opponent > 0 ? '+' : ''}${fpChanges.opponent.toFixed(2)})`
          }]);
          
          return newFP;
        });
      }
      
      if (hasActivations) {
        console.log(`Battle tick completed - ${updatedEffects.length} effects remaining`);
      }
    };

    // Start the battle interval
    battleIntervalRef.current = setInterval(runBattleTick, 100); // Check every 100ms for smooth updates
    console.log('Battle interval started');
    
    return () => {
      if (battleIntervalRef.current) {
        console.log('Clearing battle interval');
        clearInterval(battleIntervalRef.current);
        battleIntervalRef.current = null;
      }
    };
  }, [battleStarted, battleResult]);

  // Separate effect to monitor FP changes and check win conditions
  useEffect(() => {
    if (!battleStarted || battleResult) return;

    // Check win conditions
    if (playerFP >= 100) {
      console.log('Player wins by reaching 100 FP!');
      setBattleLog(currentLog => [...currentLog, {
        timestamp: Date.now(),
        type: 'end',
        message: `🎉 PLAYER WINS! Reached 100 FP! Final score: Player ${playerFP.toFixed(1)} - Opponent ${opponentFP.toFixed(1)}`
      }]);
      setBattleResult({ winner: 'player', reason: 'reached_100' });
      setBattleStarted(false);
    } else if (opponentFP >= 100) {
      console.log('Opponent wins by reaching 100 FP!');
      setBattleLog(currentLog => [...currentLog, {
        timestamp: Date.now(),
        type: 'end',
        message: `💀 OPPONENT WINS! Reached 100 FP! Final score: Player ${playerFP.toFixed(1)} - Opponent ${opponentFP.toFixed(1)}`
      }]);
      setBattleResult({ winner: 'opponent', reason: 'reached_100' });
      setBattleStarted(false);
    } else if (playerFP <= 0) {
      console.log('Opponent wins - player reached 0 FP!');
      setBattleLog(currentLog => [...currentLog, {
        timestamp: Date.now(),
        type: 'end',
        message: `💀 OPPONENT WINS! Player reached 0 FP! Final score: Player ${playerFP.toFixed(1)} - Opponent ${opponentFP.toFixed(1)}`
      }]);
      setBattleResult({ winner: 'opponent', reason: 'opponent_reached_0' });
      setBattleStarted(false);
    } else if (opponentFP <= 0) {
      console.log('Player wins - opponent reached 0 FP!');
      setBattleLog(currentLog => [...currentLog, {
        timestamp: Date.now(),
        type: 'end',
        message: `🎉 PLAYER WINS! Opponent reached 0 FP! Final score: Player ${playerFP.toFixed(1)} - Opponent ${opponentFP.toFixed(1)}`
      }]);
      setBattleResult({ winner: 'player', reason: 'opponent_reached_0' });
      setBattleStarted(false);
    }
  }, [playerFP, opponentFP, battleStarted, battleResult]);

  const handleStartCooking = () => {
    console.log('Starting battle...');
    setBattleResult(null);
    setPlayerFP(50);
    setOpponentFP(50);
    setShakeEffects([]); // Clear any existing shake effects
    setBattleLog([]); // Clear battle log
    startTimeRef.current = Date.now();
    
    // Initialize effects first, then start battle
    const effects = initializeEffects();
    console.log(`Initialized ${effects.length} effects, starting battle in 100ms...`);
    
    // Small delay to ensure effects are set before starting
    setTimeout(() => {
      setBattleStarted(true);
      console.log('Battle started!');
    }, 100);
  };

  const handleFightHarderOpponent = () => {
    console.log('Starting harder opponent battle...');
    
    // Generate a harder opponent with 30% difficulty increase
    const harderOpponent = generateOpponentByFight(fightNumber, isNewGamePlus, newGamePlusLoops, currentDay, 1.3);
    setOpponent(harderOpponent);
    setIsSecondBattle(true);
    
    // Reset battle state for new fight
    setBattleResult(null);
    setPlayerFP(50);
    setOpponentFP(50);
    setActiveEffects([]);
    setShakeEffects([]);
    setBattleLog([]);
    activeEffectsRef.current = [];
    
    // Clear interval if it exists
    if (battleIntervalRef.current) {
      clearInterval(battleIntervalRef.current);
      battleIntervalRef.current = null;
    }
  };

  const handleResetBattle = () => {
    console.log('Resetting battle...');
    
    // Award rewards if there was a battle result
    if (battleResult) {
      const goldEarned = battleResult.winner === 'player' ? 5 + winStreak : 3 + lossStreak;
      
      console.log(`Battle completed - Winner: ${battleResult.winner}, Gold: ${goldEarned}`);
      console.log('Calling onBattleComplete with result...');
      
      onBattleComplete?.({ winner: battleResult.winner, goldEarned });
    }
    
    // Clean up battle state completely
    setBattleStarted(false);
    setBattleResult(null);
    setPlayerFP(50);
    setOpponentFP(50);
    setActiveEffects([]);
    setShakeEffects([]);
    setBattleLog([]);
    activeEffectsRef.current = []; // Clear the ref too
    
    // Clear interval if it exists
    if (battleIntervalRef.current) {
      clearInterval(battleIntervalRef.current);
      battleIntervalRef.current = null;
    }
    
    console.log('Battle reset complete');
  };

  return (
    <GameLayout>
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white pixel-text">
          The Arena
        </h1>
        <p className="text-white pixel-text text-sm opacity-80 mt-2">
          Battle of the Chefs!
        </p>
        <div className="mt-3 bg-amber-800 border-2 border-amber-600 rounded-lg p-3 inline-block pixel-shadow">
          <div className="flex items-center gap-4 text-sm flex-wrap justify-center">
            <span className="text-amber-200 pixel-text">
              <strong>Fight #{fightNumber}{isSecondBattle ? ' - HARDER' : ''}</strong>
            </span>
            <span className="text-amber-300 pixel-text">
              Opponent Strength: <strong>{Math.round((opponent.fpMultiplier - 1) * 100)}%</strong>
            </span>
            {isSecondBattle && (
              <span className="text-red-300 pixel-text">
                <strong>⚠️ HARDER OPPONENT (+30%)</strong>
              </span>
            )}
            <span className="text-orange-300 pixel-text">
              Season: <strong>{currentDay <= 7 ? 'Spring' : currentDay <= 14 ? 'Summer' : currentDay <= 21 ? 'Fall' : 'Winter'}</strong>
            </span>
            <span className="text-amber-400 pixel-text">
              Win Streak: <strong>{winStreak}</strong>
            </span>
            <span className="text-green-300 pixel-text">
              Opponent Items: <strong>{opponent.platter.filter(item => item !== null).length}/{opponent.platter.length}</strong>
            </span>
            {isNewGamePlus && (
              <span className="text-purple-300 pixel-text">
                <strong>New Game+ Loop {newGamePlusLoops + 1}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Battle Result Modal */}
      {battleResult && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-6 pixel-shadow text-center max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <h2 className="text-2xl font-bold text-white pixel-text mb-4">
              {battleResult.winner === 'player' ? '🎉 Victory!' : '💀 Defeat!'}
            </h2>
            <p className="text-amber-200 pixel-text text-sm mb-4">
              {battleResult.reason === 'reached_100'
                ? `${battleResult.winner === 'player' ? 'You' : 'Your opponent'} reached 100 Flavor Points!`
                : `${battleResult.winner === 'player' ? 'Your opponent' : 'You'} ran out of Flavor Points!`
              }
            </p>
            
            {/* Battle Log */}
            <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
              <h3 className="text-white font-bold pixel-text text-sm mb-2">📋 Battle Log</h3>
              <div className="space-y-1 text-xs pixel-text">
                {battleLog.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`text-left ${
                      entry.type === 'start' ? 'text-yellow-300 font-bold' :
                      entry.type === 'end' ? 'text-yellow-300 font-bold' :
                      entry.type === 'activation' ? (entry.isOpponent ? 'text-red-300' : 'text-blue-300') :
                      entry.type === 'fp_change' ? 'text-green-300' :
                      'text-gray-300'
                    }`}
                  >
                    {entry.message}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rewards Display */}
            <div className="bg-yellow-900 border-2 border-yellow-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-6 h-6 pixel-coin"></div>
                <span className="text-yellow-400 font-bold text-lg pixel-text">
                  +{battleResult.winner === 'player' 
                    ? isSecondBattle ? 8 + winStreak : 5 + winStreak 
                    : 3 + lossStreak} Gold!
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">📚</span>
                <span className="text-purple-300 font-bold text-lg pixel-text">
                  +{battleResult.winner === 'player' 
                    ? isSecondBattle ? '4' : '2'
                    : '1'} Random Recipe{battleResult.winner === 'player' && (isSecondBattle || !isSecondBattle) ? 's' : ''}!
                </span>
              </div>
              <p className="text-yellow-200 pixel-text text-xs">
                {battleResult.winner === 'player' 
                  ? isSecondBattle 
                    ? `Harder Battle: 8 gold ${winStreak > 0 ? `+ ${winStreak} win streak bonus` : ''}`
                    : `Base: 5 gold ${winStreak > 0 ? `+ ${winStreak} win streak bonus` : ''}`
                  : `Base: 3 gold ${lossStreak > 0 ? `+ ${lossStreak} loss streak bonus` : ''}`
                }
              </p>
              {isSecondBattle && battleResult.winner === 'player' && (
                <p className="text-orange-300 pixel-text text-xs mt-1 font-bold">
                  🔥 HARDER OPPONENT BONUS: +3 extra gold & +2 extra recipes! 🔥
                </p>
              )}
              {battleResult.winner === 'player' ? (
                <>
                  <p className="text-green-400 pixel-text text-xs mt-1">
                    Win Streak: {winStreak + 1} 🔥
                  </p>
                  <p className="text-purple-300 pixel-text text-xs mt-1">
                Check your cookbook for the new recipe{battleResult.winner === 'player' ? 's' : ''}! 📖
              </p>
                </>
              ) : (
                <p className="text-red-400 pixel-text text-xs mt-1">
                  Loss Streak: {lossStreak + 1} 💪
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Show Fight Harder Opponent only if player won the first battle */}
              {battleResult.winner === 'player' && !isSecondBattle && (
                <button
                  onClick={handleFightHarderOpponent}
                  className="bg-red-600 hover:bg-red-500 border-2 border-red-800 text-white font-bold px-4 py-2 rounded pixel-button pixel-text"
                >
                  🔥 Fight Harder Opponent (+30% difficulty)
                </button>
              )}
              
              {/* Only show Battle Again if it's not a battle day or if we haven't battled today, and player lost */}
              {(!isBattleDay || !hasBattledToday) && battleResult.winner === 'opponent' && (
                <button
                  onClick={handleResetBattle}
                  className="bg-green-600 hover:bg-green-500 border-2 border-green-800 text-white font-bold px-4 py-2 rounded pixel-button pixel-text"
                >
                  Battle Again
                </button>
              )}
              
              <button
                onClick={() => {
                  const goldEarned = battleResult.winner === 'player' 
                    ? isSecondBattle ? 8 + winStreak : 5 + winStreak 
                    : 3 + lossStreak;
                  
                  onBattleComplete?.({ winner: battleResult.winner, goldEarned, isSecondBattle });
                  onReturnToWorkshop();
                }}
                className="bg-purple-600 hover:bg-purple-500 border-2 border-purple-800 text-white font-bold px-4 py-2 rounded pixel-button pixel-text"
              >
                Return to Workshop
              </button>
              
              {onReturnToFarm && (
                <button
                  onClick={() => {
                    const goldEarned = battleResult.winner === 'player' 
                      ? isSecondBattle ? 8 + winStreak : 5 + winStreak 
                      : 3 + lossStreak;
                    
                    onBattleComplete?.({ winner: battleResult.winner, goldEarned, isSecondBattle });
                    onReturnToFarm();
                  }}
                  className="bg-amber-600 hover:bg-amber-500 border-2 border-amber-800 text-white font-bold px-4 py-2 rounded pixel-button pixel-text"
                >
                  Back to Farm
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top section - Player */}
      <div className="space-y-4 mb-6">
        <ArenaPlatterGrid
          platterItems={playerPlatter.slice(0, unlockedSlots)}
          upgradedSlots={playerUpgradedSlots.slice(0, unlockedSlots)}
          isOpponent={false}
          title="Your Platter"
          shakeEffects={shakeEffects}
          onItemHold={(item, _index, _event) => {
            if (item) {
              const description = getItemDescription(item);
              alert(`${item.name}\n\n${description}`);
            }
          }}
        />
        <FlavorPointBar 
          currentPoints={Math.round(playerFP)} 
          maxPoints={100} 
          isOpponent={false}
          label="Your Kitchen"
        />
      </div>

      {/* Middle section - Controls */}
      <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-4 pixel-shadow mb-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={battleStarted ? handleResetBattle : handleStartCooking}
            className="bg-green-600 hover:bg-green-500 border-2 border-green-800 text-white font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text cursor-pointer"
          >
            {battleStarted ? '🛑 Stop Battle' : '🔥 Start Cooking!'}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-white pixel-text text-sm">Speed:</span>
            <button
              onClick={() => setBattleSpeed(prev => {
                const speeds: ('slow' | 'fast' | 'very-fast')[] = ['slow', 'fast', 'very-fast'];
                const currentIndex = speeds.indexOf(prev);
                return speeds[(currentIndex + 1) % speeds.length];
              })}
              disabled={battleStarted}
              className={`font-bold text-sm px-3 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                !battleStarted
                  ? 'bg-blue-600 hover:bg-blue-500 border-blue-800 text-white cursor-pointer'
                  : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
              }`}
            >
              {speedSettings[battleSpeed].label}
            </button>
          </div>
          
          <button
            onClick={onReturnToWorkshop}
            disabled={battleStarted}
            className={`font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
              !battleStarted
                ? 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white cursor-pointer'
                : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
            }`}
          >
            ← Back to Workshop
          </button>
        </div>
      </div>

      {/* Bottom section - Opponent */}
      <div className="space-y-4">
        <FlavorPointBar 
          currentPoints={Math.round(opponentFP)} 
          maxPoints={100} 
          isOpponent={true}
          label="Opponent Chef"
        />
        <ArenaPlatterGrid
          platterItems={opponent.platter}
          upgradedSlots={opponent.upgrades}
          isOpponent={true}
          title="Opponent's Platter"
          shakeEffects={shakeEffects}
          onItemHold={(item, _index, _event) => {
            if (item) {
              const description = getItemDescription(item);
              alert(`${item.name}\n\n${description}`);
            }
          }}
        />
      </div>

      {/* Item Stats Display */}
      <div className="mt-6 space-y-4">
        {/* Player Items Stats */}
        <div className="bg-indigo-800 border-2 border-indigo-600 rounded-lg p-4 pixel-shadow">
          <h3 className="text-white font-bold pixel-text text-sm mb-2">Your Items:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            {playerPlatter.slice(0, unlockedSlots).map((item, index) => {
              if (!item) return null;
              const stats = getUpgradedStats(item.id, playerUpgradedSlots[index]);
              if (!stats) return null;
              
              return (
                <div key={index} className="flex items-center gap-2 text-indigo-200">
                  <img src={item.image} alt={item.name} className="w-4 h-4 pixel-item" />
                  <span className="pixel-text">{item.name}: {stats.description}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opponent Items Stats */}
        <div className="bg-red-800 border-2 border-red-600 rounded-lg p-4 pixel-shadow">
          <h3 className="text-white font-bold pixel-text text-sm mb-2">Opponent Items:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            {opponent.platter.map((item, index) => {
              if (!item) return null;
              const stats = getUpgradedStats(item.id, opponent.upgrades[index]);
              if (!stats) return null;
              
              return (
                <div key={index} className="flex items-center gap-2 text-red-200">
                  <img src={item.image} alt={item.name} className="w-4 h-4 pixel-item" />
                  <span className="pixel-text">{item.name}: {stats.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-white pixel-text text-sm opacity-80">
          {battleStarted
            ? `Battle in progress! Items "pop" at their intervals to trigger abilities • Watch the FP bars - first to 100 FP wins, 0 FP loses!`
            : "Each item has unique abilities! Positive values boost your FP, negative values reduce opponent's FP"
          }
        </p>
        <p className="text-white pixel-text text-xs opacity-60 mt-2">
          Upgrades multiply item effectiveness • Arrange your platter strategically • Some effects are temporary!
        </p>
        {battleStarted && (
          <p className="text-yellow-300 pixel-text text-xs opacity-80 mt-1">
            Speed: {speedSettings[battleSpeed].label} • Watch items shake when they activate • Check console for debug info
          </p>
        )}
      </div>
    </GameLayout>
  );
}
