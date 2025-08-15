import { useState } from 'react';
import InfoButton from './InfoButton';

interface LibraryProps {
  currentDay: number;
  gold: number;
  discoveredRecipes: string[];
  onBuyRecipe: (recipeId: string) => void;
}

interface Recipe {
  id: string;
  name: string;
  image: string;
  price: number;
  ingredients: string[];
  description: string;
}

// Recipe theme categories with their recipes
const RECIPE_THEMES: { [key: string]: { name: string; recipes: Recipe[] } } = {
  'tarts': {
    name: 'Tarts & Pastries',
    recipes: [
      {
        id: 'apple-tart',
        name: 'Apple Tart',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
        price: 4,
        ingredients: ['dough', 'sugar', 'apple'],
        description: 'Classic apple tart with golden pastry crust'
      },
      {
        id: 'golden-apple-tart',
        name: 'Golden Apple Tart',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
        price: 5,
        ingredients: ['dough', 'sugar', 'golden-apple'],
        description: 'Premium tart with rare golden apples'
      },
      {
        id: 'green-apple-tart',
        name: 'Green Apple Tart',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
        price: 4,
        ingredients: ['dough', 'sugar', 'green-apple'],
        description: 'Tart green apple pastry with crisp flavor'
      },
      {
        id: 'strawberry-tart',
        name: 'Strawberry Tart',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
        price: 4,
        ingredients: ['dough', 'sugar', 'strawberry'],
        description: 'Sweet strawberry tart with fresh berries'
      },
      {
        id: 'blueberry-tart',
        name: 'Blueberry Tart',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
        price: 4,
        ingredients: ['dough', 'sugar', 'blueberry'],
        description: 'Delicate blueberry tart with antioxidant-rich berries'
      },
      {
        id: 'blackberry-tart',
        name: 'Blackberry Tart',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
        price: 5,
        ingredients: ['dough', 'sugar', 'blackberry'],
        description: 'Rich blackberry tart with deep, complex flavors'
      },
      {
        id: 'raspberry-tart',
        name: 'Raspberry Tart',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
        price: 5,
        ingredients: ['dough', 'sugar', 'raspberry'],
        description: 'Elegant raspberry tart with tart-sweet balance'
      }
    ]
  },
  'drinks': {
    name: 'Refreshing Beverages',
    recipes: [
      {
        id: 'lemonade',
        name: 'Lemonade',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lemonade.png',
        price: 3,
        ingredients: ['lemon', 'sugar', 'water'],
        description: 'Classic refreshing lemon beverage'
      },
      {
        id: 'limeade',
        name: 'Limeade',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/limeade.png',
        price: 3,
        ingredients: ['lime', 'sugar', 'water'],
        description: 'Zesty lime drink with tropical flair'
      },
      {
        id: 'orangeade',
        name: 'Orangeade',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orangeade.png',
        price: 3,
        ingredients: ['orange', 'sugar', 'water'],
        description: 'Sweet orange citrus beverage'
      },
      {
        id: 'grape-juice',
        name: 'Grape Juice',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-juice.png',
        price: 4,
        ingredients: ['grape', 'sugar', 'water'],
        description: 'Rich purple grape juice with natural sweetness'
      }
    ]
  },
  'soups': {
    name: 'Hearty Soups',
    recipes: [
      {
        id: 'tomato-soup',
        name: 'Tomato Soup',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-soup.png',
        price: 3,
        ingredients: ['tomato', 'basil', 'water'],
        description: 'Classic comfort soup with fresh basil'
      },
      {
        id: 'pumpkin-soup',
        name: 'Pumpkin Soup',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-soup.png',
        price: 4,
        ingredients: ['pumpkin', 'water', 'garlic'],
        description: 'Creamy pumpkin soup with aromatic garlic'
      }
    ]
  },
  'salsas': {
    name: 'Zesty Salsas',
    recipes: [
      {
        id: 'classic-pico',
        name: 'Classic Pico de Gallo',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/classic-pico.png',
        price: 3,
        ingredients: ['tomato', 'onion', 'jalapeno'],
        description: 'Traditional Mexican salsa with fresh vegetables'
      },
      {
        id: 'pineapple-chili-salsa',
        name: 'Pineapple-Chili Salsa',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-chili-salsa.png',
        price: 4,
        ingredients: ['pineapple', 'chili-pepper', 'lime'],
        description: 'Tropical salsa with sweet heat combination'
      },
      {
        id: 'green-chile-salsa',
        name: 'Green Chile Salsa',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/green-chile-salsa.png',
        price: 3,
        ingredients: ['green-chile-pepper', 'onion', 'lime'],
        description: 'Mild green salsa with fresh lime zing'
      },
      {
        id: 'avocado-salsa-verde',
        name: 'Avocado Salsa Verde',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-salsa-verde.png',
        price: 4,
        ingredients: ['avocado', 'green-chile-pepper', 'lime'],
        description: 'Creamy green salsa with rich avocado base'
      },
      {
        id: 'roasted-red-relish',
        name: 'Roasted Red Relish',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/roasted-red-relish.png',
        price: 4,
        ingredients: ['red-bell-pepper', 'onion', 'sugar'],
        description: 'Sweet roasted pepper relish with caramelized onions'
      }
    ]
  },
  'jams': {
    name: 'Preserves & Jams',
    recipes: [
      {
        id: 'cherry-jam',
        name: 'Cherry Jam',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cherry-jam.png',
        price: 4,
        ingredients: ['cherry', 'sugar', 'lemon'],
        description: 'Classic cherry preserve with bright lemon notes'
      },
      {
        id: 'strawberry-jam',
        name: 'Strawberry Jam',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/strawberry-jam.png',
        price: 4,
        ingredients: ['strawberry', 'sugar', 'lemon'],
        description: 'Sweet strawberry jam with traditional flavor'
      },
      {
        id: 'mixed-berry-jam',
        name: 'Mixed Berry Jam',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/mixed-berry-jam.png',
        price: 5,
        ingredients: ['blueberry', 'blackberry', 'sugar'],
        description: 'Rich mixed berry jam with complex fruit flavors'
      },
      {
        id: 'grape-jelly',
        name: 'Grape Jelly',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-jelly.png',
        price: 4,
        ingredients: ['grape', 'sugar', 'water'],
        description: 'Smooth grape jelly with pure fruit essence'
      },
      {
        id: 'orange-marmalade',
        name: 'Orange Marmalade',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orange-marmalade.png',
        price: 4,
        ingredients: ['orange', 'sugar', 'lemon'],
        description: 'Chunky orange marmalade with citrus peel'
      },
      {
        id: 'kiwi-lime-jam',
        name: 'Kiwi-Lime Jam',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/kiwi-lime-jam.png',
        price: 5,
        ingredients: ['kiwi', 'lime', 'sugar'],
        description: 'Exotic kiwi-lime jam with tropical tang'
      },
      {
        id: 'pineapple-preserves',
        name: 'Pineapple Preserves',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-preserves.png',
        price: 5,
        ingredients: ['pineapple', 'sugar', 'lemon'],
        description: 'Tropical pineapple preserves with golden chunks'
      }
    ]
  },
  'flatbreads': {
    name: 'Artisan Flatbreads',
    recipes: [
      {
        id: 'garlic-herb-flatbread',
        name: 'Garlic Herb Flatbread',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/garlic-herb-flatbread.png',
        price: 4,
        ingredients: ['dough', 'garlic', 'basil'],
        description: 'Aromatic flatbread with fresh herbs and garlic'
      },
      {
        id: 'tomato-basil-flatbread',
        name: 'Tomato Basil Flatbread',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-basil-flatbread.png',
        price: 4,
        ingredients: ['dough', 'tomato', 'basil'],
        description: 'Mediterranean flatbread with tomatoes and basil'
      },
      {
        id: 'tri-bell-pepper-flatbread',
        name: 'Tri-Bell Pepper Flatbread',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tri-bell-pepper-flatbread.png',
        price: 5,
        ingredients: ['dough', 'green-bell-pepper', 'red-bell-pepper'],
        description: 'Colorful flatbread with rainbow bell peppers'
      },
      {
        id: 'pepper-onion-flatbread',
        name: 'Pepper & Onion Flatbread',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-onion-flatbread.png',
        price: 4,
        ingredients: ['dough', 'onion', 'red-onion'],
        description: 'Savory flatbread with caramelized onions'
      }
    ]
  },
  'frozen': {
    name: 'Frozen Treats',
    recipes: [
      {
        id: 'watermelon-lime-granita',
        name: 'Watermelon-Lime Granita',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-lime-granita.png',
        price: 4,
        ingredients: ['watermelon', 'lime', 'sugar'],
        description: 'Refreshing summer granita with tropical flavors'
      },
      {
        id: 'dragonfruit-sorbet',
        name: 'Dragonfruit Sorbet',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dragonfruit-sorbet.png',
        price: 5,
        ingredients: ['dragonfruit', 'sugar', 'water'],
        description: 'Exotic dragonfruit sorbet with vibrant color'
      },
      {
        id: 'blueberry-ice',
        name: 'Blueberry Ice',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/blueberry-ice.png',
        price: 4,
        ingredients: ['blueberry', 'sugar', 'water'],
        description: 'Cool blueberry ice with antioxidant benefits'
      },
      {
        id: 'pineapple-coconut-ice',
        name: 'Pineapple-Coconut Ice',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-coconut-ice.png',
        price: 5,
        ingredients: ['pineapple', 'coconut', 'sugar'],
        description: 'Tropical ice treat with pineapple and coconut'
      }
    ]
  },
  'sweets': {
    name: 'Sweet Delights',
    recipes: [
      {
        id: 'caramelized-banana',
        name: 'Caramelized Banana',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/caramelized-banana.png',
        price: 3,
        ingredients: ['banana', 'sugar'],
        description: 'Golden caramelized banana with rich sweetness'
      },
      {
        id: 'coconut-snow',
        name: 'Coconut Snow',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-snow.png',
        price: 4,
        ingredients: ['coconut', 'sugar', 'water'],
        description: 'Light coconut dessert with crystalline texture'
      },
      {
        id: 'candied-orange-peel',
        name: 'Candied Orange Peel',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-orange-peel.png',
        price: 4,
        ingredients: ['orange', 'sugar', 'water'],
        description: 'Crystallized orange peel with citrus intensity'
      },
      {
        id: 'candied-jalapenos',
        name: 'Candied Jalapeños',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-jalapenos.png',
        price: 5,
        ingredients: ['jalapeno', 'sugar', 'water'],
        description: 'Sweet and spicy candied peppers with heat'
      },
      {
        id: 'apple-compote',
        name: 'Apple Compote',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-compote.png',
        price: 4,
        ingredients: ['apple', 'sugar', 'nutmeg'],
        description: 'Spiced apple compote with warming nutmeg'
      },
      {
        id: 'golden-apple-compote',
        name: 'Golden Apple Compote',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/golden-apple-compote.png',
        price: 5,
        ingredients: ['golden-apple', 'sugar', 'nutmeg'],
        description: 'Premium compote with rare golden apples'
      }
    ]
  },
  'hummus': {
    name: 'Hummus Varieties',
    recipes: [
      {
        id: 'hummus',
        name: 'Classic Hummus',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/hummus.png',
        price: 4,
        ingredients: ['chickpeas', 'garlic', 'lemon'],
        description: 'Traditional Middle Eastern chickpea dip'
      },
      {
        id: 'pepper-hummus',
        name: 'Pepper Hummus',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-hummus.png',
        price: 4,
        ingredients: ['chickpeas', 'red-bell-pepper', 'garlic'],
        description: 'Spicy red pepper hummus with roasted flavors'
      },
      {
        id: 'jalapeno-lime-hummus',
        name: 'Jalapeño-Lime Hummus',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/jalapeno-lime-hummus.png',
        price: 4,
        ingredients: ['chickpeas', 'jalapeno', 'lime'],
        description: 'Zesty hummus with jalapeño heat and lime freshness'
      },
      {
        id: 'avocado-hummus',
        name: 'Avocado Hummus',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-hummus.png',
        price: 5,
        ingredients: ['chickpeas', 'avocado', 'lime'],
        description: 'Creamy green hummus enriched with avocado'
      },
      {
        id: 'herb-hummus',
        name: 'Herb Hummus',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/herb-hummus.png',
        price: 4,
        ingredients: ['chickpeas', 'basil', 'garlic'],
        description: 'Aromatic hummus infused with fresh basil'
      },
      {
        id: 'pumpkin-nutmeg-hummus',
        name: 'Pumpkin-Nutmeg Hummus',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-nutmeg-hummus.png',
        price: 5,
        ingredients: ['chickpeas', 'pumpkin', 'nutmeg'],
        description: 'Seasonal hummus with roasted pumpkin and spices'
      },
      {
        id: 'coconut-lime-hummus',
        name: 'Coconut-Lime Hummus',
        image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-lime-hummus.png',
        price: 5,
        ingredients: ['chickpeas', 'coconut', 'lime'],
        description: 'Tropical hummus with coconut richness'
      }
    ]
  }
};

// Theme rotation schedule (9 themes for variety, repeats every 9 days)
const THEME_SCHEDULE = ['tarts', 'drinks', 'soups', 'salsas', 'jams', 'flatbreads', 'frozen', 'sweets', 'hummus'];

// Get today's theme based on current day
function getDailyTheme(day: number): string {
  return THEME_SCHEDULE[(day - 1) % THEME_SCHEDULE.length];
}

// Get 2 random recipes from today's theme
function getDailyRecipes(day: number, discoveredRecipes: string[]): Recipe[] {
  const theme = getDailyTheme(day);
  const themeRecipes = RECIPE_THEMES[theme].recipes;
  
  // Filter out already discovered recipes
  const undiscoveredRecipes = themeRecipes.filter(recipe => 
    !discoveredRecipes.includes(recipe.id)
  );
  
  // If we have fewer than 2 undiscovered recipes, fill with discovered ones
  let availableRecipes = [...undiscoveredRecipes];
  if (availableRecipes.length < 2) {
    const discoveredFromTheme = themeRecipes.filter(recipe => 
      discoveredRecipes.includes(recipe.id)
    );
    availableRecipes = [...availableRecipes, ...discoveredFromTheme];
  }
  
  // Shuffle and take 2
  const shuffled = [...availableRecipes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

export default function Library({ currentDay, gold, discoveredRecipes, onBuyRecipe }: LibraryProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState<string | null>(null);
  
  const currentTheme = getDailyTheme(currentDay);
  const themeData = RECIPE_THEMES[currentTheme];
  const dailyRecipes = getDailyRecipes(currentDay, discoveredRecipes);
  
  const handleBuyRecipe = (recipeId: string, price: number) => {
    if (gold >= price) {
      onBuyRecipe(recipeId);
      setShowPurchaseModal(null);
    }
  };
  
  return (
    <div className="bg-purple-900 border-4 border-purple-800 rounded-lg p-4 pixel-shadow relative">
      <InfoButton
        title="Recipe Library"
        description="The Library offers 2 themed recipes daily! Each day features a different theme like Tarts, Drinks, or Soups. Prices are fixed and themes rotate every 8 days. Perfect for targeted recipe collection!"
      />
      
      <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Recipe Library</h2>
      
      {/* Daily Theme Header */}
      <div className="bg-purple-800 border-2 border-purple-600 rounded-lg p-4 mb-6">
        <div className="text-center">
          <h3 className="text-purple-200 text-sm pixel-text mb-2">Today's Theme (Day {currentDay})</h3>
          <h4 className="text-white font-bold text-lg pixel-text mb-2">{themeData.name}</h4>
          <p className="text-purple-300 text-xs pixel-text">
            Theme rotates daily • {THEME_SCHEDULE.length} unique themes total
          </p>
        </div>
      </div>
      
      {/* Daily Recipe Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {dailyRecipes.map((recipe, _index) => {
          const isOwned = discoveredRecipes.includes(recipe.id);
          const canAfford = gold >= recipe.price;
          
          return (
            <div
              key={recipe.id}
              className={`border-2 rounded-lg p-4 pixel-shadow transition-colors ${
                isOwned 
                  ? 'bg-green-800 border-green-600' 
                  : 'bg-purple-700 border-purple-600 hover:bg-purple-600'
              }`}
            >
              <div className="text-center">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-16 h-16 mx-auto mb-3 pixel-item"
                />
                <h3 className="text-white font-bold text-sm pixel-text mb-2">
                  {recipe.name}
                </h3>
                <p className="text-purple-200 text-xs pixel-text mb-3 leading-relaxed">
                  {recipe.description}
                </p>
                
                
                
                {/* Price and Buy Button */}
                {isOwned ? (
                  <div className="w-full bg-green-600 border-2 border-green-800 text-white font-bold text-sm px-4 py-2 rounded pixel-button pixel-text">
                    ✓ Owned
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-4 h-4 pixel-coin"></div>
                      <span className="text-yellow-400 font-bold text-sm pixel-text">
                        {recipe.price}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowPurchaseModal(recipe.id)}
                      disabled={!canAfford}
                      className={`w-full font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                        canAfford
                          ? 'bg-yellow-600 hover:bg-yellow-500 border-yellow-800 text-white cursor-pointer'
                          : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Buy Recipe' : 'Not enough gold'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Theme Schedule Preview */}
      <div className="bg-purple-800 border-2 border-purple-600 rounded-lg p-4">
        <h4 className="text-white font-bold text-sm pixel-text mb-3 text-center">Upcoming Themes</h4>
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 text-xs pixel-text">
          {THEME_SCHEDULE.map((themeKey, index) => {
            const futureDay = currentDay + index;
            const isToday = index === 0;
            
            return (
              <div
                key={themeKey}
                className={`p-2 rounded text-center ${
                  isToday 
                    ? 'bg-yellow-600 text-white font-bold' 
                    : 'bg-purple-700 text-purple-200'
                }`}
              >
                <div className="text-xs">Day {futureDay}</div>
                <div className="text-xs">{RECIPE_THEMES[themeKey].name}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => setShowPurchaseModal(null)}
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {(() => {
              const recipe = dailyRecipes.find(r => r.id === showPurchaseModal);
              if (!recipe) return null;
              
              return (
                <div className="bg-purple-900 border-4 border-purple-800 rounded-lg p-6 pixel-shadow max-w-md w-full">
                  <h3 className="text-white font-bold text-lg pixel-text mb-4 text-center">
                    Purchase Recipe
                  </h3>
                  
                  <div className="text-center mb-4">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-20 h-20 mx-auto mb-3 pixel-item"
                    />
                    <h4 className="text-white font-bold text-lg pixel-text mb-2">
                      {recipe.name}
                    </h4>
                    <p className="text-purple-200 text-sm pixel-text mb-3">
                      {recipe.description}
                    </p>
                    
                    <div className="bg-purple-800 border-2 border-purple-600 rounded-lg p-3 mb-4">
                      <p className="text-purple-300 text-xs pixel-text mb-1">Secret Recipe:</p>
                      <p className="text-purple-200 text-sm pixel-text italic">
                        Ingredients will be revealed in your cookbook after purchase!
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-6 h-6 pixel-coin"></div>
                      <span className="text-yellow-400 font-bold text-xl pixel-text">
                        {recipe.price}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPurchaseModal(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 border-2 border-gray-800 text-white font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleBuyRecipe(recipe.id, recipe.price)}
                      disabled={gold < recipe.price}
                      className={`flex-1 font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
                        gold >= recipe.price
                          ? 'bg-yellow-600 hover:bg-yellow-500 border-yellow-800 text-white cursor-pointer'
                          : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {gold >= recipe.price ? 'Buy Recipe' : 'Not enough gold'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
