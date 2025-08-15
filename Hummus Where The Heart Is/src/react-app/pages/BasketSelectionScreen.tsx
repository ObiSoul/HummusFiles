import { useState, useEffect } from 'react';
import { getItemDescription } from '@/react-app/data/itemDescriptions';

interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number;
  dayObtained?: number;
}

interface Basket {
  id: string;
  items: InventoryItem[];
  recipeUnlock: string;
}

interface BasketSelectionScreenProps {
  onBasketSelected: (selectedItems: InventoryItem[], recipeUnlock: string) => void;
  platformType?: 'desktop' | 'mobile';
}

// All possible grown items
const GROWN_ITEMS: InventoryItem[] = [
  {
    id: 'apple',
    name: 'Apple',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Apple.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  },
  {
    id: 'banana',
    name: 'Banana',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Banana.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  },
  {
    id: 'cherry',
    name: 'Cherry',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Cherry.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  },
  {
    id: 'grape',
    name: 'Grapes',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Grapes.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  },
  {
    id: 'orange',
    name: 'Orange',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Orange.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Strawberry.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  },
  {
    id: 'tomato',
    name: 'Tomato',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Tomato.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  },
  {
    id: 'chickpeas',
    name: 'Chickpeas',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Chickpeas.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  },
  {
    id: 'chickpeas',
    name: 'Chickpeas',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Chickpeas.png',
    quantity: 2,
    spoilageLevel: 0,
    dayObtained: 1
  }
];

// All possible seeds (excluding wheat for baskets 2 and 3)
const SEED_ITEMS: InventoryItem[] = [
  {
    id: 'apple-seeds',
    name: 'Apple Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-seeds.png',
    quantity: 3,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'banana-seeds',
    name: 'Banana Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/banana-seeds.png',
    quantity: 3,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'cherry-seeds',
    name: 'Cherry Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cherry-seeds.png',
    quantity: 3,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'grape-seeds',
    name: 'Grape Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-seeds.png',
    quantity: 3,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'orange-seeds',
    name: 'Orange Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orange-seeds.png',
    quantity: 3,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'strawberry-seeds',
    name: 'Strawberry Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/strawberry-seeds.png',
    quantity: 3,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'tomato-seeds',
    name: 'Tomato Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-seeds.png',
    quantity: 3,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'chickpea-seeds',
    name: 'Chickpea Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/chickpea-seeds.png',
    quantity: 3,
    spoilageLevel: undefined,
    dayObtained: 1
  }
];

// Wheat seed (always in basket 1)
const WHEAT_SEED: InventoryItem = {
  id: 'wheat-seeds',
  name: 'Wheat Seeds',
  image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/wheat-seeds.png',
  quantity: 3,
  spoilageLevel: undefined,
  dayObtained: 1
};

// All possible spices
const SPICE_ITEMS: InventoryItem[] = [
  {
    id: 'garlic',
    name: 'Garlic',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Garlic.png',
    quantity: 1,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'basil',
    name: 'Basil',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Basil.png',
    quantity: 1,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'sugar',
    name: 'Sugar',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Sugar.png',
    quantity: 1,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'nutmeg',
    name: 'Nutmeg',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Nutmeg.png',
    quantity: 1,
    spoilageLevel: undefined,
    dayObtained: 1
  },
  {
    id: 'cajun',
    name: 'Cajun Spice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Cajun.png',
    quantity: 1,
    spoilageLevel: undefined,
    dayObtained: 1
  }
];



// All available starter-friendly recipes with their info
const STARTER_RECIPES = [
  { id: 'dough', name: 'Basic Dough', description: 'Essential base for baking - combine water + wheat', ingredients: ['water', 'wheat'] },
  { id: 'apple-pie', name: 'Apple Pie', description: 'Classic dessert - combine apple + dough + sugar', ingredients: ['apple', 'wheat', 'sugar'] },
  { id: 'tomato-soup', name: 'Tomato Soup', description: 'Hearty soup - combine tomato + basil + water', ingredients: ['tomato', 'basil'] },
  { id: 'caramelized-banana', name: 'Caramelized Banana', description: 'Sweet treat - combine banana + sugar', ingredients: ['banana', 'sugar'] },
  { id: 'quick-marinara', name: 'Quick Marinara', description: 'Pasta sauce - combine tomato + garlic + basil', ingredients: ['tomato', 'garlic', 'basil'] },
  { id: 'garlic-herb-flatbread', name: 'Garlic Herb Flatbread', description: 'Savory bread - combine dough + garlic + basil', ingredients: ['wheat', 'garlic', 'basil'] },
  { id: 'grape-jelly', name: 'Grape Jelly', description: 'Sweet preserve - combine grape + sugar + water', ingredients: ['grape', 'sugar'] },
  { id: 'orangeade', name: 'Orangeade', description: 'Refreshing drink - combine orange + sugar + water', ingredients: ['orange', 'sugar'] },
  { id: 'apple-tart', name: 'Apple Tart', description: 'Elegant tart - combine dough + sugar + apple', ingredients: ['wheat', 'sugar', 'apple'] },
  { id: 'strawberry-tart', name: 'Strawberry Tart', description: 'Berry tart - combine dough + sugar + strawberry', ingredients: ['wheat', 'sugar', 'strawberry'] },
  { id: 'apple-compote', name: 'Apple Compote', description: 'Spiced apple - combine apple + sugar + nutmeg', ingredients: ['apple', 'sugar', 'nutmeg'] },
  { id: 'tomato-basil-flatbread', name: 'Tomato Basil Flatbread', description: 'Mediterranean bread - combine dough + tomato + basil', ingredients: ['wheat', 'tomato', 'basil'] },
  { id: 'cherry-jam', name: 'Cherry Jam', description: 'Sweet preserve - combine cherry + sugar + lemon', ingredients: ['cherry', 'sugar'] },
  { id: 'cherry-compote', name: 'Cherry Compote', description: 'Spiced cherries - combine cherry + sugar + nutmeg', ingredients: ['cherry', 'sugar', 'nutmeg'] },
  { id: 'hummus', name: 'Classic Hummus', description: 'Middle Eastern chickpea dip - combine chickpeas + garlic + lemon', ingredients: ['chickpeas', 'garlic', 'lemon'] },
  { id: 'pepper-hummus', name: 'Pepper Hummus', description: 'Spicy red pepper hummus - combine chickpeas + red bell pepper + garlic', ingredients: ['chickpeas', 'red-bell-pepper', 'garlic'] },
  { id: 'herb-hummus', name: 'Herb Hummus', description: 'Fresh basil hummus - combine chickpeas + basil + garlic', ingredients: ['chickpeas', 'basil', 'garlic'] },
];

// Generate baskets with meaningful recipe unlocks
const generateBaskets = (): Basket[] => {
  // Use crypto.getRandomValues for better randomization
  const getSecureRandom = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  };

  // Advanced Fisher-Yates shuffle for maximum randomization
  const secureShffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(getSecureRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Helper function to get ingredients available in a basket
  const getBasketIngredients = (grownItem: InventoryItem, seedItem: InventoryItem, spice: InventoryItem): string[] => {
    const ingredients = [grownItem.id, spice.id];
    
    // Add the grown version of seeds
    if (seedItem.id === 'wheat-seeds') {
      ingredients.push('wheat');
    } else {
      ingredients.push(seedItem.id.replace('-seeds', ''));
    }
    
    // Water is always available for recipes
    ingredients.push('water');
    
    return ingredients;
  };

  // Helper function to find recipes that match basket ingredients (at least 2 matches)
  const findMatchingRecipes = (basketIngredients: string[]): typeof STARTER_RECIPES => {
    return STARTER_RECIPES.filter(recipe => {
      const matchingIngredients = recipe.ingredients.filter(ingredient => basketIngredients.includes(ingredient));
      return matchingIngredients.length >= 2;
    });
  };

  const baskets: Basket[] = [];
  const usedRecipes = new Set<string>();

  // Generate each basket
  for (let basketIndex = 0; basketIndex < 3; basketIndex++) {
    let attempts = 0;
    let validBasket: Basket | null = null;

    // Try to generate a valid basket (with matching recipe) up to 50 times
    while (attempts < 50 && !validBasket) {
      attempts++;

      // Generate random basket contents
      const shuffledGrown = secureShffle(GROWN_ITEMS);
      const shuffledSeeds = secureShffle(SEED_ITEMS);
      const shuffledSpices = secureShffle(SPICE_ITEMS);
      
      const grownItem = shuffledGrown[Math.floor(getSecureRandom() * shuffledGrown.length)];
      const seedItem = basketIndex === 0 ? WHEAT_SEED : shuffledSeeds[Math.floor(getSecureRandom() * shuffledSeeds.length)];
      const spiceItem = shuffledSpices[Math.floor(getSecureRandom() * shuffledSpices.length)];
      
      // Get available ingredients
      const basketIngredients = getBasketIngredients(grownItem, seedItem, spiceItem);
      
      // Find matching recipes
      const matchingRecipes = findMatchingRecipes(basketIngredients).filter(recipe => !usedRecipes.has(recipe.id));
      
      if (matchingRecipes.length > 0) {
        // Pick a random matching recipe
        const selectedRecipe = matchingRecipes[Math.floor(getSecureRandom() * matchingRecipes.length)];
        usedRecipes.add(selectedRecipe.id);
        
        validBasket = {
          id: `basket-${basketIndex + 1}`,
          items: [grownItem, seedItem, spiceItem],
          recipeUnlock: selectedRecipe.id
        };
      }
    }

    // If we couldn't find a valid basket, use a fallback
    if (!validBasket) {
      const fallbackRecipes = STARTER_RECIPES.filter(recipe => !usedRecipes.has(recipe.id));
      const fallbackRecipe = fallbackRecipes.length > 0 ? fallbackRecipes[0] : STARTER_RECIPES[basketIndex];
      
      // Create a simple fallback basket
      const shuffledGrown = secureShffle(GROWN_ITEMS);
      const shuffledSpices = secureShffle(SPICE_ITEMS);
      
      validBasket = {
        id: `basket-${basketIndex + 1}`,
        items: [
          shuffledGrown[basketIndex % shuffledGrown.length],
          basketIndex === 0 ? WHEAT_SEED : SEED_ITEMS[basketIndex % SEED_ITEMS.length],
          shuffledSpices[basketIndex % shuffledSpices.length]
        ],
        recipeUnlock: fallbackRecipe.id
      };
      usedRecipes.add(fallbackRecipe.id);
    }

    baskets.push(validBasket);
  }

  return baskets;
};

export default function BasketSelectionScreen({ onBasketSelected, platformType = 'mobile' }: BasketSelectionScreenProps) {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate new baskets each time component mounts with fresh randomization
    setBaskets(generateBaskets());
  }, []);

  

  const handleBasketSelect = (basket: Basket) => {
    onBasketSelected(basket.items, basket.recipeUnlock);
  };

  const getRecipeInfo = (recipeId: string) => {
    return STARTER_RECIPES.find(recipe => recipe.id === recipeId) || { 
      id: recipeId, 
      name: 'Mystery Recipe', 
      description: 'A special recipe to discover!',
      ingredients: []
    };
  };

  // Helper to check if an item matches the recipe
  const isIngredientForRecipe = (itemId: string, recipeId: string): boolean => {
    const recipe = getRecipeInfo(recipeId);
    if (!recipe.ingredients) return false;
    
    // Check direct match
    if (recipe.ingredients.includes(itemId)) return true;
    
    // Check seed -> grown conversion
    if (itemId.endsWith('-seeds')) {
      const grownVersion = itemId.replace('-seeds', '');
      if (recipe.ingredients.includes(grownVersion)) return true;
    }
    
    // Check for wheat -> dough conversion in recipes
    if (itemId === 'wheat-seeds' && recipe.ingredients.includes('wheat')) return true;
    
    return false;
  };

  const handleItemHover = (item: InventoryItem, event: React.MouseEvent) => {
    if (platformType === 'desktop') {
      setHoveredItem(item);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleItemLeave = () => {
    if (platformType === 'desktop') {
      setHoveredItem(null);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 via-purple-700 to-purple-900 flex items-center justify-center pixel-art">
      <div className="text-center max-w-6xl mx-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white pixel-text mb-4">
          Choose Your Starting Basket
        </h1>
        <p className="text-purple-200 pixel-text text-sm md:text-base mb-8 leading-relaxed">
          Each basket contains one grown item, one seed pack, one spice, and unlocks a recipe you can make with your starting ingredients!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {baskets.map((basket, basketIndex) => (
            <div
              key={basket.id}
              onClick={() => handleBasketSelect(basket)}
              className="bg-amber-900 border-4 border-amber-800 rounded-lg p-6 pixel-shadow hover:bg-amber-800 transition-colors cursor-pointer pixel-button group"
            >
              <div className="text-center mb-4">
                <h3 className="text-white font-bold text-lg pixel-text mb-2">
                  Basket {basketIndex + 1}
                </h3>
                {basketIndex === 0 && (
                  <p className="text-yellow-400 text-xs pixel-text">
                    🌾 Guaranteed Wheat Seeds!
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {basket.items.map((item) => {
                  const isRecipeIngredient = isIngredientForRecipe(item.id, basket.recipeUnlock);
                  return (
                    <div
                      key={`${basket.id}-${item.id}`}
                      className={`border-2 rounded p-3 pixel-slot group-hover:bg-amber-600 transition-colors relative ${
                        isRecipeIngredient 
                          ? 'bg-green-700 border-green-500 ring-2 ring-green-400' 
                          : 'bg-amber-700 border-amber-600'
                      }`}
                      onMouseEnter={(e) => handleItemHover(item, e)}
                      onMouseLeave={handleItemLeave}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 mx-auto pixel-item"
                      />
                      {item.quantity > 1 && (
                        <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center pixel-quantity">
                          {item.quantity}
                        </div>
                      )}
                      {isRecipeIngredient && (
                        <div className="absolute -top-1 -left-1 text-green-400 text-lg">
                          ✨
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1">
                {basket.items.map((item) => {
                  const isRecipeIngredient = isIngredientForRecipe(item.id, basket.recipeUnlock);
                  return (
                    <p key={item.id} className={`text-xs pixel-text ${
                      isRecipeIngredient ? 'text-green-300 font-bold' : 'text-amber-200'
                    }`}>
                      {isRecipeIngredient ? '✨ ' : ''}{item.name} x{item.quantity}
                      {isRecipeIngredient ? ' (Recipe ingredient!)' : ''}
                    </p>
                  );
                })}
                <div className="mt-2 pt-2 border-t border-amber-600">
                  <p className="text-purple-300 text-xs pixel-text font-bold">
                    📖 Recipe Unlock:
                  </p>
                  <p className="text-purple-200 text-xs pixel-text">
                    {getRecipeInfo(basket.recipeUnlock).name}
                  </p>
                  <p className="text-green-400 text-xs pixel-text opacity-90 mt-1">
                    Uses ingredients from this basket!
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-4 py-2 rounded transition-colors pixel-text border-2 border-green-800 group-hover:border-green-700">
                  Select This Basket
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-purple-300 pixel-text text-xs leading-relaxed opacity-80">
            {platformType === 'desktop' 
              ? "Hover over items to see details • Choose wisely - this will shape your entire run!"
              : "Each choice will shape your entire run • Choose the combination that speaks to you!"
            }
          </p>
        </div>
      </div>

      {/* Tooltip for desktop */}
      {/* Tooltip for desktop */}
      {platformType === 'desktop' && hoveredItem && (
        <div
          className="fixed z-50 bg-amber-900 border-4 border-amber-800 rounded-lg p-3 pixel-shadow pointer-events-none"
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 10}px`,
            transform: 'translateY(-100%)',
          }}
        >
          <h3 className="text-white font-bold text-sm pixel-text mb-1">
            {hoveredItem.name}
          </h3>
          <p className="text-amber-200 text-xs pixel-text leading-relaxed max-w-48">
            {getItemDescription(hoveredItem)}
          </p>
          <p className="text-yellow-400 text-xs pixel-text mt-1">
            Quantity: {hoveredItem.quantity}
          </p>
        </div>
      )}

      
    </div>
  );
}
