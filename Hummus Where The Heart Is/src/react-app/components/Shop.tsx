interface ShopItem {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

interface ShopProps {
  gold: number;
  shopItems: ShopItem[];
  onBuyItem: (item: ShopItem) => void;
  onBackToFarm: () => void;
  rerollCost: number;
  onReroll: () => void;
}

const ALL_SEED_ITEMS: ShopItem[] = [
  {
    id: 'apple-seeds',
    name: 'Apple Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-seeds.png',
    price: 2,
    description: 'Sweet red apples'
  },
  {
    id: 'banana-seeds',
    name: 'Banana Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/banana-seeds.png',
    price: 3,
    description: 'Yellow curved fruit'
  },
  {
    id: 'blackberry-seeds',
    name: 'Blackberry Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/blackberry-seeds.png',
    price: 4,
    description: 'Dark purple berries'
  },
  {
    id: 'black-cherry-seeds',
    name: 'Black Cherry Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/black-cherry-seeds.png',
    price: 5,
    description: 'Rich dark cherries'
  },
  {
    id: 'blueberry-seeds',
    name: 'Blueberry Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/blueberry-seeds.png',
    price: 3,
    description: 'Small blue berries'
  },
  {
    id: 'soybean-seeds',
    name: 'Soybean Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/soybean-seeds.png',
    price: 4,
    description: 'Nutritious brown-green beans'
  },
  {
    id: 'grape-seeds',
    name: 'Grape Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-seeds.png',
    price: 4,
    description: 'Purple clusters of sweet grapes'
  },
  {
    id: 'cherry-seeds',
    name: 'Cherry Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cherry-seeds.png',
    price: 3,
    description: 'Bright red sweet cherries'
  },
  {
    id: 'golden-apple-seeds',
    name: 'Golden Apple Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/golden-apple-seeds.png',
    price: 6,
    description: 'Rare golden apples with magical properties'
  },
  {
    id: 'dragonfruit-seeds',
    name: 'Dragonfruit Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dragonfruit-seeds.png',
    price: 7,
    description: 'Exotic pink fruit with black seeds'
  },
  {
    id: 'coconut-seeds',
    name: 'Coconut Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-seeds.png',
    price: 5,
    description: 'Tropical brown coconuts with sweet milk'
  },
  {
    id: 'kiwi-seeds',
    name: 'Kiwi Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/kiwi-seeds.png',
    price: 4,
    description: 'Brown fuzzy kiwi fruits with green flesh'
  },
  {
    id: 'lime-seeds',
    name: 'Lime Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lime-seeds.png',
    price: 3,
    description: 'Tart green citrus fruits'
  },
  {
    id: 'green-grape-seeds',
    name: 'Green Grape Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/green-grape-seeds.png',
    price: 4,
    description: 'Green clusters of sweet grapes'
  },
  {
    id: 'green-apple-seeds',
    name: 'Green Apple Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/green-apple-seeds.png',
    price: 2,
    description: 'Crisp green apples with tart flavor'
  },
  {
    id: 'lemon-seeds',
    name: 'Lemon Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lemon-seeds.png',
    price: 3,
    description: 'Bright yellow citrus fruits'
  },
  {
    id: 'strawberry-seeds',
    name: 'Strawberry Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/strawberry-seeds.png',
    price: 3,
    description: 'Sweet red berries with tiny seeds'
  },
  {
    id: 'raspberry-seeds',
    name: 'Raspberry Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/raspberry-seeds.png',
    price: 4,
    description: 'Tart red berries with complex flavor'
  },
  {
    id: 'watermelon-seeds',
    name: 'Watermelon Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-seeds.png',
    price: 5,
    description: 'Large green melons with sweet red flesh'
  },
  {
    id: 'pineapple-seeds',
    name: 'Pineapple Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-seeds.png',
    price: 6,
    description: 'Tropical golden fruit with spiky crown'
  },
  {
    id: 'orange-seeds',
    name: 'Orange Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orange-seeds.png',
    price: 3,
    description: 'Sweet orange citrus fruits'
  },
  {
    id: 'eggplant-seeds',
    name: 'Eggplant Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/eggplant-seeds.png',
    price: 4,
    description: 'Purple eggplant vegetables, great for cooking'
  },
  {
    id: 'green-chile-pepper-seeds',
    name: 'Green Chile Pepper Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/green-chile-pepper-seeds.png',
    price: 3,
    description: 'Spicy green chile peppers with mild heat'
  },
  {
    id: 'avocado-seeds',
    name: 'Avocado Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-seeds.png',
    price: 5,
    description: 'Creamy green avocados, perfect for healthy meals'
  },
  {
    id: 'chili-pepper-seeds',
    name: 'Chili Pepper Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/chili-pepper-seeds.png',
    price: 4,
    description: 'Hot red chili peppers with fiery heat'
  },
  {
    id: 'green-bell-pepper-seeds',
    name: 'Green Bell Pepper Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/green-bell-pepper-seeds.png',
    price: 3,
    description: 'Sweet green bell peppers, perfect for cooking'
  },
  {
    id: 'red-bell-pepper-seeds',
    name: 'Red Bell Pepper Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/red-bell-pepper-seeds.png',
    price: 3,
    description: 'Sweet red bell peppers with vibrant color'
  },
  {
    id: 'onion-seeds',
    name: 'Onion Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/onion-seeds.png',
    price: 2,
    description: 'Essential cooking ingredient, adds flavor to any dish'
  },
  {
    id: 'jalapeno-seeds',
    name: 'Jalapeno Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/jalapeno-seeds.png',
    price: 4,
    description: 'Spicy green peppers with medium heat and great flavor'
  },
  {
    id: 'pumpkin-seeds',
    name: 'Pumpkin Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-seeds.png',
    price: 6,
    description: 'Large orange pumpkins, perfect for autumn dishes'
  },
  {
    id: 'red-onion-seeds',
    name: 'Red Onion Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/red-onion-seeds.png',
    price: 3,
    description: 'Purple-red onions with sweet flavor and beautiful color'
  },
  {
    id: 'tomato-seeds',
    name: 'Tomato Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-seeds.png',
    price: 3,
    description: 'Juicy red tomatoes, perfect for cooking and sauces'
  },
  {
    id: 'yellow-bell-pepper-seeds',
    name: 'Yellow Bell Pepper Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/yellow-bell-pepper-seeds.png',
    price: 3,
    description: 'Sweet yellow bell peppers with bright color and crisp texture'
  },
  {
    id: 'wheat-seeds',
    name: 'Wheat Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/wheat-seeds.png',
    price: 4,
    description: 'Golden wheat stalks, essential grain for baking and cooking'
  },
  {
    id: 'chickpea-seeds',
    name: 'Chickpea Seeds',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/chickpea-seeds.png',
    price: 4,
    description: 'Beige chickpea legumes, perfect for making hummus and protein dishes'
  }
];

const ALL_SPICE_ITEMS: ShopItem[] = [
  {
    id: 'garlic',
    name: 'Garlic',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Garlic.png',
    price: 3,
    description: 'Aromatic garlic bulb, essential for many savory dishes'
  },
  {
    id: 'nutmeg',
    name: 'Nutmeg',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Nutmeg.png',
    price: 5,
    description: 'Warm, sweet spice perfect for desserts and baked goods'
  },
  {
    id: 'basil',
    name: 'Basil',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Basil.png',
    price: 4,
    description: 'Fresh aromatic herb, great for Italian and Mediterranean cuisine'
  },
  {
    id: 'sugar',
    name: 'Sugar',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Sugar.png',
    price: 2,
    description: 'Sweet crystalline ingredient for desserts and baking'
  },
  {
    id: 'cajun',
    name: 'Cajun Spice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Cajun.png',
    price: 6,
    description: 'Bold spice blend with heat and complex flavors'
  }
];

// Recipe to ingredient mapping
const RECIPE_INGREDIENTS: { [key: string]: string[] } = {
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
  'tri-bell-pepper-flatbread': ['dough', 'green-bell-pepper', 'red-bell-pepper'],
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

// Function to get random seed items with recipe-based weighting
export function getRandomShopItems(count: number = 2, discoveredRecipes: string[] = []): ShopItem[] {
  // Get all ingredients from discovered recipes
  const recipeIngredients = new Set<string>();
  discoveredRecipes.forEach(recipeId => {
    const ingredients = RECIPE_INGREDIENTS[recipeId] || [];
    ingredients.forEach(ingredient => {
      // Only add if it's a growable ingredient (has seeds)
      const seedId = `${ingredient}-seeds`;
      if (ALL_SEED_ITEMS.some(seed => seed.id === seedId)) {
        recipeIngredients.add(ingredient);
      }
    });
  });

  // Create weighted selection array
  const weightedItems: ShopItem[] = [];
  
  ALL_SEED_ITEMS.forEach(seed => {
    const ingredientName = seed.id.replace('-seeds', '');
    const isRecipeIngredient = recipeIngredients.has(ingredientName);
    
    // Add item once normally
    weightedItems.push(seed);
    
    // Add 20% more weight if it's used in discovered recipes
    if (isRecipeIngredient) {
      // 20% boost = add 1 more copy for every 5 items (1/5 = 0.2 = 20%)
      // To be more precise, we'll add it based on a probability
      if (Math.random() < 0.2) {
        weightedItems.push(seed);
      }
    }
  });

  // Shuffle and select from weighted array
  const shuffled = [...weightedItems].sort(() => 0.5 - Math.random());
  
  // Remove duplicates while preserving the weighted selection
  const selected: ShopItem[] = [];
  const usedIds = new Set<string>();
  
  for (const item of shuffled) {
    if (!usedIds.has(item.id) && selected.length < count) {
      selected.push(item);
      usedIds.add(item.id);
    }
  }
  
  // If we still need more items, fill from remaining items
  if (selected.length < count) {
    const remaining = ALL_SEED_ITEMS.filter(item => !usedIds.has(item.id));
    const shuffledRemaining = remaining.sort(() => 0.5 - Math.random());
    selected.push(...shuffledRemaining.slice(0, count - selected.length));
  }
  
  return selected.slice(0, Math.min(count, ALL_SEED_ITEMS.length));
}

// Function to get random spice items
export function getRandomSpiceItems(count: number = 2): ShopItem[] {
  const shuffled = [...ALL_SPICE_ITEMS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, ALL_SPICE_ITEMS.length));
}

// Function to get all seed items
export function getAllShopItems(): ShopItem[] {
  return ALL_SEED_ITEMS;
}

// Function to get all spice items
export function getAllSpiceItems(): ShopItem[] {
  return ALL_SPICE_ITEMS;
}

export default function Shop({ gold, shopItems, onBuyItem, onBackToFarm, rerollCost, onReroll }: ShopProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 via-green-700 to-green-900 pixel-art">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white pixel-text">
            Seed Shop
          </h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToFarm}
            className="bg-gray-600 hover:bg-gray-500 border-4 border-gray-800 text-white font-bold text-lg px-6 py-3 rounded transition-colors pixel-button pixel-text"
          >
            ← Back to Farm
          </button>
          
          <div className="flex items-center gap-2 bg-amber-900 border-4 border-amber-800 rounded-lg p-3 pixel-shadow">
            <div className="w-6 h-6 pixel-coin"></div>
            <span className="text-white font-bold text-lg pixel-text">{gold}</span>
          </div>
        </div>

        <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-6 pixel-shadow">
          <div className="flex justify-end mb-4">
            <button
              onClick={onReroll}
              disabled={gold < rerollCost}
              className={`font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                gold >= rerollCost
                  ? 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white cursor-pointer'
                  : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
              }`}
            >
              Reroll Shop ({rerollCost} gold)
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
                    onClick={() => onBuyItem(item)}
                    disabled={gold < item.price}
                    className={`w-full font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                      gold >= item.price
                        ? 'bg-green-600 hover:bg-green-500 border-green-800 text-white cursor-pointer'
                        : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {gold >= item.price ? 'Buy' : 'Not enough gold'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white pixel-text text-sm opacity-80">
            Purchase seeds to plant and grow • Spices for cooking combinations • Items never spoil
          </p>
        </div>
      </div>
    </div>
  );
}
