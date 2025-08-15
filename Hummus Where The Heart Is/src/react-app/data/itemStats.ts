// Item stats for arena battles
export interface ItemStats {
  id: string;
  name: string;
  fpPerTick: number; // Flavor points per tick (positive = gain for player, negative = reduce opponent)
  tickInterval: number; // Milliseconds between ticks
  duration?: number; // Duration for temporary effects (in milliseconds), undefined = permanent
  description: string;
  type?: string; // Item type for synergy calculations
}

// Item type definitions for battle synergies
export const ITEM_BATTLE_TYPES: { [key: string]: string } = {
  // Fruits
  'apple': 'fruit', 'banana': 'fruit', 'cherry': 'fruit', 'grape': 'fruit', 'green-grape': 'fruit',
  'green-apple': 'fruit', 'golden-apple': 'fruit', 'black-cherry': 'fruit', 'dragonfruit': 'fruit',
  'coconut': 'fruit', 'kiwi': 'fruit', 'watermelon': 'fruit', 'pineapple': 'fruit',
  
  // Berries
  'strawberry': 'berry', 'raspberry': 'berry', 'blackberry': 'berry', 'blueberry': 'berry',
  
  // Citrus
  'lime': 'citrus', 'lemon': 'citrus', 'orange': 'citrus',
  
  // Vegetables
  'tomato': 'veggie', 'onion': 'veggie', 'red-onion': 'veggie', 'eggplant': 'veggie',
  'green-chile-pepper': 'veggie', 'avocado': 'veggie', 'chili-pepper': 'veggie',
  'green-bell-pepper': 'veggie', 'red-bell-pepper': 'veggie', 'yellow-bell-pepper': 'veggie',
  'jalapeno': 'veggie', 'pumpkin': 'veggie',
  
  // Grains & Legumes
  'wheat': 'grain', 'soybean': 'legume', 'chickpeas': 'legume',
  
  // Spices (used for support)
  'garlic': 'spice', 'basil': 'spice', 'sugar': 'spice', 'nutmeg': 'spice', 'cajun': 'spice',
  
  // All dishes inherit from their primary ingredient or get 'dish' type
  'apple-pie': 'dish', 'tomato-soup': 'dish', 'dough': 'dish'
  // ... other dishes would be 'dish' type by default
};

export const ITEM_STATS: { [key: string]: ItemStats } = {
  // Basic Fruits - Small FP gains
  'apple': {
    id: 'apple',
    name: 'Apple',
    fpPerTick: 1,
    tickInterval: 1300,
    description: '1 FP/1.3s, +1 FP for each fruit on platter',
    type: 'fruit'
  },
  'banana': {
    id: 'banana',
    name: 'Banana',
    fpPerTick: 0.4,
    tickInterval: 2000,
    description: '+0.4 FP/2s',
    type: 'fruit'
  },
  'cherry': {
    id: 'cherry',
    name: 'Cherry',
    fpPerTick: 0.5,
    tickInterval: 1500,
    description: '+0.5 FP/1.5s',
    type: 'fruit'
  },
  'strawberry': {
    id: 'strawberry',
    name: 'Strawberry',
    fpPerTick: 0.4,
    tickInterval: 1500,
    description: '+0.4 FP/1.5s',
    type: 'berry'
  },
  'grape': {
    id: 'grape',
    name: 'Grapes',
    fpPerTick: 0.6,
    tickInterval: 2500,
    description: '+0.6 FP/2.5s',
    type: 'fruit'
  },
  'green-grape': {
    id: 'green-grape',
    name: 'Green Grapes',
    fpPerTick: 0.5,
    tickInterval: 2500,
    description: '+0.5 FP/2.5s',
    type: 'fruit'
  },

  // Medium Fruits - Moderate FP gains
  'orange': {
    id: 'orange',
    name: 'Orange',
    fpPerTick: 0.7,
    tickInterval: 2000,
    description: '+0.7 FP/2s',
    type: 'citrus'
  },
  'lemon': {
    id: 'lemon',
    name: 'Lemon',
    fpPerTick: -0.8,
    tickInterval: 2000,
    duration: 6000,
    description: '-0.8 FP/2s for 6s',
    type: 'citrus'
  },
  'lime': {
    id: 'lime',
    name: 'Lime',
    fpPerTick: -0.6,
    tickInterval: 1500,
    duration: 4500,
    description: '-0.6 FP/1.5s for 4.5s',
    type: 'citrus'
  },
  'kiwi': {
    id: 'kiwi',
    name: 'Kiwi',
    fpPerTick: 0.8,
    tickInterval: 3000,
    description: '+0.8 FP/3s',
    type: 'fruit'
  },
  'green-apple': {
    id: 'green-apple',
    name: 'Green Apple',
    fpPerTick: 0.4,
    tickInterval: 2000,
    description: '+0.4 FP/2s',
    type: 'fruit'
  },

  // Large Fruits - High FP gains
  'pineapple': {
    id: 'pineapple',
    name: 'Pineapple',
    fpPerTick: 1.2,
    tickInterval: 3000,
    description: '+1.2 FP/3s',
    type: 'fruit'
  },
  'watermelon': {
    id: 'watermelon',
    name: 'Watermelon',
    fpPerTick: 1.5,
    tickInterval: 4000,
    description: '+1.5 FP/4s',
    type: 'fruit'
  },
  'coconut': {
    id: 'coconut',
    name: 'Coconut',
    fpPerTick: 1.0,
    tickInterval: 2500,
    description: '+1.0 FP/2.5s',
    type: 'fruit'
  },

  // Premium Fruits - Special abilities
  'golden-apple': {
    id: 'golden-apple',
    name: 'Golden Apple',
    fpPerTick: 2.0,
    tickInterval: 2000,
    description: '+2.0 FP/2s',
    type: 'fruit'
  },
  'dragonfruit': {
    id: 'dragonfruit',
    name: 'Dragonfruit',
    fpPerTick: -1.5,
    tickInterval: 1500,
    duration: 9000,
    description: '-1.5 FP/1.5s for 9s',
    type: 'fruit'
  },

  // Berries - Fast ticking, moderate gains
  'blueberry': {
    id: 'blueberry',
    name: 'Blueberry',
    fpPerTick: 0.3,
    tickInterval: 1000,
    description: '+0.3 FP/1s',
    type: 'berry'
  },
  'blackberry': {
    id: 'blackberry',
    name: 'Blackberry',
    fpPerTick: 0.4,
    tickInterval: 1000,
    description: '+0.4 FP/1s',
    type: 'berry'
  },
  'raspberry': {
    id: 'raspberry',
    name: 'Raspberry',
    fpPerTick: 0.5,
    tickInterval: 1200,
    description: '+0.5 FP/1.2s',
    type: 'berry'
  },
  'black-cherry': {
    id: 'black-cherry',
    name: 'Black Cherry',
    fpPerTick: 0.8,
    tickInterval: 1500,
    description: '+0.8 FP/1.5s',
    type: 'fruit'
  },

  // Vegetables - Mixed abilities
  'tomato': {
    id: 'tomato',
    name: 'Tomato',
    fpPerTick: 0.6,
    tickInterval: 2000,
    description: '+0.6 FP/2s',
    type: 'veggie'
  },
  'onion': {
    id: 'onion',
    name: 'Onion',
    fpPerTick: -0.5,
    tickInterval: 1000,
    duration: 5000,
    description: '-0.5 FP/1s for 5s',
    type: 'veggie'
  },
  'red-onion': {
    id: 'red-onion',
    name: 'Red Onion',
    fpPerTick: -0.7,
    tickInterval: 1200,
    duration: 6000,
    description: '-0.7 FP/1.2s for 6s',
    type: 'veggie'
  },
  'eggplant': {
    id: 'eggplant',
    name: 'Eggplant',
    fpPerTick: 0.8,
    tickInterval: 3000,
    description: '+0.8 FP/3s',
    type: 'veggie'
  },
  'avocado': {
    id: 'avocado',
    name: 'Avocado',
    fpPerTick: 1.0,
    tickInterval: 2500,
    description: '+1.0 FP/2.5s',
    type: 'veggie'
  },
  'pumpkin': {
    id: 'pumpkin',
    name: 'Pumpkin',
    fpPerTick: 1.3,
    tickInterval: 4000,
    description: '+1.3 FP/4s',
    type: 'veggie'
  },

  // Peppers - Offensive abilities
  'chili-pepper': {
    id: 'chili-pepper',
    name: 'Chili Pepper',
    fpPerTick: -1.2,
    tickInterval: 1000,
    duration: 8000,
    description: '-1.2 FP/1s for 8s',
    type: 'veggie'
  },
  'jalapeno': {
    id: 'jalapeno',
    name: 'Jalapeno',
    fpPerTick: -0.9,
    tickInterval: 1500,
    duration: 7500,
    description: '-0.9 FP/1.5s for 7.5s',
    type: 'veggie'
  },
  'green-chile-pepper': {
    id: 'green-chile-pepper',
    name: 'Green Chile Pepper',
    fpPerTick: -0.6,
    tickInterval: 1200,
    duration: 6000,
    description: '-0.6 FP/1.2s for 6s',
    type: 'veggie'
  },
  'green-bell-pepper': {
    id: 'green-bell-pepper',
    name: 'Green Bell Pepper',
    fpPerTick: 0.5,
    tickInterval: 2500,
    description: '+0.5 FP/2.5s',
    type: 'veggie'
  },
  'red-bell-pepper': {
    id: 'red-bell-pepper',
    name: 'Red Bell Pepper',
    fpPerTick: 0.6,
    tickInterval: 2500,
    description: '+0.6 FP/2.5s',
    type: 'veggie'
  },
  'yellow-bell-pepper': {
    id: 'yellow-bell-pepper',
    name: 'Yellow Bell Pepper',
    fpPerTick: 0.7,
    tickInterval: 2500,
    description: '+0.7 FP/2.5s',
    type: 'veggie'
  },

  // Grains and Beans
  'wheat': {
    id: 'wheat',
    name: 'Wheat',
    fpPerTick: 0.4,
    tickInterval: 2000,
    description: '+0.4 FP/2s',
    type: 'grain'
  },
  'soybean': {
    id: 'soybean',
    name: 'Soybean',
    fpPerTick: 0.7,
    tickInterval: 3000,
    description: '+0.7 FP/3s',
    type: 'legume'
  },
  'chickpeas': {
    id: 'chickpeas',
    name: 'Chickpeas',
    fpPerTick: 0.8,
    tickInterval: 1900,
    description: '+0.8 FP/1.9s',
    type: 'legume'
  },

  // Cooked Foods - Original recipes
  'apple-pie': {
    id: 'apple-pie',
    name: 'Apple Pie',
    fpPerTick: 2.5,
    tickInterval: 3000,
    description: '+2.5 FP/3s',
    type: 'dish'
  },
  'tomato-soup': {
    id: 'tomato-soup',
    name: 'Tomato Soup',
    fpPerTick: 1.8,
    tickInterval: 2000,
    description: '+1.8 FP/2s',
    type: 'dish'
  },
  'dough': {
    id: 'dough',
    name: 'Dough',
    fpPerTick: 0.3,
    tickInterval: 1500,
    description: '+0.3 FP/1.5s',
    type: 'dish'
  },

  // New Advanced Recipes - Veg & Legume
  'cajun-garlic-soybeans': {
    id: 'cajun-garlic-soybeans',
    name: 'Cajun Garlic Soybeans',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (seasoned + garlic effects)',
    type: 'dish'
  },
  'lime-edamame': {
    id: 'lime-edamame',
    name: 'Lime Edamame',
    fpPerTick: 1.0,
    tickInterval: 1100,
    description: '+1 FP/1.1s (cleanse + boost effects)',
    type: 'dish'
  },
  'eggplant-tomato-bake': {
    id: 'eggplant-tomato-bake',
    name: 'Eggplant & Tomato Bake',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (soak + tomato bleed + garlic)',
    type: 'dish'
  },
  'chili-garlic-eggplant': {
    id: 'chili-garlic-eggplant',
    name: 'Chili-Garlic Eggplant',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (soak + burn + garlic)',
    type: 'dish'
  },
  'pumpkin-soup': {
    id: 'pumpkin-soup',
    name: 'Pumpkin Soup',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (+3 FP on place, garlic pulse)',
    type: 'dish'
  },
  'spiced-pumpkin-puree': {
    id: 'spiced-pumpkin-puree',
    name: 'Spiced Pumpkin Purée',
    fpPerTick: 1.0,
    tickInterval: 900,
    description: '+1 FP/0.9s (nutmeg boost + sugar burst)',
    type: 'dish'
  },

  // New Advanced Recipes - Salads
  'guacamole': {
    id: 'guacamole',
    name: 'Guacamole',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (+3 FP shield, cleanse + onion tears)',
    type: 'dish'
  },
  'avocado-tomato-salad': {
    id: 'avocado-tomato-salad',
    name: 'Avocado-Tomato Salad',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (+3 FP shield, red onion + tomato)',
    type: 'dish'
  },
  'watermelon-basil-salad': {
    id: 'watermelon-basil-salad',
    name: 'Watermelon Basil Salad',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (basil synergy + team spritz)',
    type: 'dish'
  },

  // New Advanced Recipes - Sweets
  'caramelized-banana': {
    id: 'caramelized-banana',
    name: 'Caramelized Banana',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (slip guard + sugar burst)',
    type: 'dish'
  },
  'coconut-snow': {
    id: 'coconut-snow',
    name: 'Coconut Snow',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (coconut aura + sugar burst)',
    type: 'dish'
  },
  'candied-orange-peel': {
    id: 'candied-orange-peel',
    name: 'Candied Orange Peel',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (orange pulse + sugar boost)',
    type: 'dish'
  },
  'candied-jalapenos': {
    id: 'candied-jalapenos',
    name: 'Candied Jalapeños',
    fpPerTick: 1.0,
    tickInterval: 1100,
    description: '+1 FP/1.1s (burn effect + sugar boost)',
    type: 'dish'
  },
  'quick-pickled-onions': {
    id: 'quick-pickled-onions',
    name: 'Quick-Pickled Onions',
    fpPerTick: 1.0,
    tickInterval: 1100,
    description: '+1 FP/1.1s (stronger tears + self-cleanse)',
    type: 'dish'
  },

  // New Advanced Recipes - Frozen Treats
  'watermelon-lime-granita': {
    id: 'watermelon-lime-granita',
    name: 'Watermelon-Lime Granita',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (refreshing chill + citrus cleanse)',
    type: 'dish'
  },
  'dragonfruit-sorbet': {
    id: 'dragonfruit-sorbet',
    name: 'Dragonfruit Sorbet',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (exotic energy + freeze armor)',
    type: 'dish'
  },
  'blueberry-ice': {
    id: 'blueberry-ice',
    name: 'Blueberry Ice',
    fpPerTick: 1.0,
    tickInterval: 1050,
    description: '+1 FP/1.05s (antioxidant boost + ice shield)',
    type: 'dish'
  },
  'pineapple-coconut-ice': {
    id: 'pineapple-coconut-ice',
    name: 'Pineapple-Coconut Ice',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (tropical freeze + coconut protection)',
    type: 'dish'
  },

  // New Advanced Recipes - Drinks
  'lemonade': {
    id: 'lemonade',
    name: 'Lemonade',
    fpPerTick: 1.0,
    tickInterval: 1100,
    description: '+1 FP/1.1s (citrus burst + cooling effect)',
    type: 'dish'
  },
  'limeade': {
    id: 'limeade',
    name: 'Limeade',
    fpPerTick: 1.0,
    tickInterval: 1100,
    description: '+1 FP/1.1s (cleansing lime + hydration boost)',
    type: 'dish'
  },
  'orangeade': {
    id: 'orangeade',
    name: 'Orangeade',
    fpPerTick: 1.0,
    tickInterval: 1050,
    description: '+1 FP/1.05s (vitamin burst + team energy)',
    type: 'dish'
  },
  'grape-juice': {
    id: 'grape-juice',
    name: 'Grape Juice',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (antioxidant power + sweet energy)',
    type: 'dish'
  },

  // New Advanced Recipes - Salsas
  'classic-pico': {
    id: 'classic-pico',
    name: 'Classic Pico de Gallo',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (fresh veggie burst + spicy kick)',
    type: 'dish'
  },
  'pineapple-chili-salsa': {
    id: 'pineapple-chili-salsa',
    name: 'Pineapple-Chili Salsa',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (tropical heat + burn effect)',
    type: 'dish'
  },
  'green-chile-salsa': {
    id: 'green-chile-salsa',
    name: 'Green Chile Salsa',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (mild spice + cleansing heat)',
    type: 'dish'
  },
  'roasted-red-relish': {
    id: 'roasted-red-relish',
    name: 'Roasted Red Relish',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (smoky sweetness + caramelized boost)',
    type: 'dish'
  },
  'avocado-salsa-verde': {
    id: 'avocado-salsa-verde',
    name: 'Avocado Salsa Verde',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (creamy protection + fresh herbs)',
    type: 'dish'
  },

  // New Advanced Recipes - Savory Sauces
  'quick-marinara': {
    id: 'quick-marinara',
    name: 'Quick Marinara',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (tomato intensity + garlic punch)',
    type: 'dish'
  },
  'cajun-tomato-base': {
    id: 'cajun-tomato-base',
    name: 'Cajun Tomato Base',
    fpPerTick: 1.0,
    tickInterval: 950,
    description: '+1 FP/0.95s (spicy tomato + cajun heat)',
    type: 'dish'
  },
  'pepper-trinity': {
    id: 'pepper-trinity',
    name: 'Pepper Trinity',
    fpPerTick: 1.0,
    tickInterval: 1000,
    description: '+1 FP/1s (Louisiana trinity + aromatic base)',
    type: 'dish'
  },

  // New Advanced Recipes - Flatbreads
  'garlic-herb-flatbread': {
    id: 'garlic-herb-flatbread',
    name: 'Garlic Herb Flatbread',
    fpPerTick: 1.2,
    tickInterval: 1200,
    description: '+1.2 FP/1.2s (garlic aroma + herb freshness)',
    type: 'dish'
  },
  'tomato-basil-flatbread': {
    id: 'tomato-basil-flatbread',
    name: 'Tomato Basil Flatbread',
    fpPerTick: 1.1,
    tickInterval: 1100,
    description: '+1.1 FP/1.1s (Mediterranean herbs + tomato burst)',
    type: 'dish'
  },
  'tri-bell-pepper-flatbread': {
    id: 'tri-bell-pepper-flatbread',
    name: 'Tri-Bell Pepper Flatbread',
    fpPerTick: 1.3,
    tickInterval: 1300,
    description: '+1.3 FP/1.3s (triple pepper power + bread base)',
    type: 'dish'
  },
  'pepper-onion-flatbread': {
    id: 'pepper-onion-flatbread',
    name: 'Pepper & Onion Flatbread',
    fpPerTick: 1.0,
    tickInterval: 1200,
    description: '+1 FP/1.2s (caramelized onion + pepper combo)',
    type: 'dish'
  },

  // New Advanced Recipes - Fruit Tarts
  'apple-tart': {
    id: 'apple-tart',
    name: 'Apple Tart',
    fpPerTick: 1.4,
    tickInterval: 1400,
    description: '+1.4 FP/1.4s (French pastry + apple elegance)',
    type: 'dish'
  },
  'golden-apple-tart': {
    id: 'golden-apple-tart',
    name: 'Golden Apple Tart',
    fpPerTick: 1.8,
    tickInterval: 1400,
    description: '+1.8 FP/1.4s (premium golden apple + pastry craft)',
    type: 'dish'
  },
  'green-apple-tart': {
    id: 'green-apple-tart',
    name: 'Green Apple Tart',
    fpPerTick: 1.3,
    tickInterval: 1400,
    description: '+1.3 FP/1.4s (tart apple + sweet pastry balance)',
    type: 'dish'
  },
  'strawberry-tart': {
    id: 'strawberry-tart',
    name: 'Strawberry Tart',
    fpPerTick: 1.5,
    tickInterval: 1200,
    description: '+1.5 FP/1.2s (berry sweetness + pastry elegance)',
    type: 'dish'
  },
  'blueberry-tart': {
    id: 'blueberry-tart',
    name: 'Blueberry Tart',
    fpPerTick: 1.4,
    tickInterval: 1200,
    description: '+1.4 FP/1.2s (antioxidant berries + refined pastry)',
    type: 'dish'
  },
  'blackberry-tart': {
    id: 'blackberry-tart',
    name: 'Blackberry Tart',
    fpPerTick: 1.6,
    tickInterval: 1200,
    description: '+1.6 FP/1.2s (rich dark berries + pastry art)',
    type: 'dish'
  },
  'raspberry-tart': {
    id: 'raspberry-tart',
    name: 'Raspberry Tart',
    fpPerTick: 1.5,
    tickInterval: 1300,
    description: '+1.5 FP/1.3s (complex berry flavors + buttery crust)',
    type: 'dish'
  },

  // New Advanced Recipes - Compotes
  'apple-compote': {
    id: 'apple-compote',
    name: 'Apple Compote',
    fpPerTick: 1.1,
    tickInterval: 1500,
    description: '+1.1 FP/1.5s (warm spiced apples + nutmeg comfort)',
    type: 'dish'
  },
  'golden-apple-compote': {
    id: 'golden-apple-compote',
    name: 'Golden Apple Compote',
    fpPerTick: 1.5,
    tickInterval: 1500,
    description: '+1.5 FP/1.5s (premium golden apple + magical warmth)',
    type: 'dish'
  },

  // New Advanced Recipes - Jams & Preserves
  'cherry-jam': {
    id: 'cherry-jam',
    name: 'Cherry Jam',
    fpPerTick: 1.2,
    tickInterval: 1600,
    description: '+1.2 FP/1.6s (sweet cherry preserve + lemon brightness)',
    type: 'dish'
  },
  'mixed-berry-jam': {
    id: 'mixed-berry-jam',
    name: 'Mixed Berry Jam',
    fpPerTick: 1.4,
    tickInterval: 1500,
    description: '+1.4 FP/1.5s (complex berry medley + rich preserve)',
    type: 'dish'
  },
  'strawberry-jam': {
    id: 'strawberry-jam',
    name: 'Strawberry Jam',
    fpPerTick: 1.3,
    tickInterval: 1400,
    description: '+1.3 FP/1.4s (classic strawberry + citrus zing)',
    type: 'dish'
  },
  'grape-jelly': {
    id: 'grape-jelly',
    name: 'Grape Jelly',
    fpPerTick: 1.1,
    tickInterval: 1700,
    description: '+1.1 FP/1.7s (smooth grape essence + pure sweetness)',
    type: 'dish'
  },
  'orange-marmalade': {
    id: 'orange-marmalade',
    name: 'Orange Marmalade',
    fpPerTick: 1.3,
    tickInterval: 1600,
    description: '+1.3 FP/1.6s (citrus peel bite + orange sunshine)',
    type: 'dish'
  },
  'kiwi-lime-jam': {
    id: 'kiwi-lime-jam',
    name: 'Kiwi-Lime Jam',
    fpPerTick: 1.2,
    tickInterval: 1500,
    description: '+1.2 FP/1.5s (exotic kiwi tang + lime zest)',
    type: 'dish'
  },
  'pineapple-preserves': {
    id: 'pineapple-preserves',
    name: 'Pineapple Preserves',
    fpPerTick: 1.4,
    tickInterval: 1800,
    description: '+1.4 FP/1.8s (tropical pineapple chunks + golden sweetness)',
    type: 'dish'
  },

  // Hummus Dishes
  'hummus': {
    id: 'hummus',
    name: 'Hummus',
    fpPerTick: 1.9,
    tickInterval: 1000,
    description: '+1.9 FP/1s (Debuff Guard for allies, +0.4 FP/s near Wheat/Dough)',
    type: 'dish'
  },
  'pepper-hummus': {
    id: 'pepper-hummus',
    name: 'Pepper Hummus',
    fpPerTick: 2.0,
    tickInterval: 1000,
    description: '+2.0 FP/1s (Smolder debuff to nearest enemy)',
    type: 'dish'
  },
  'jalapeno-lime-hummus': {
    id: 'jalapeno-lime-hummus',
    name: 'Jalapeño-Lime Hummus',
    fpPerTick: 1.8,
    tickInterval: 1000,
    description: '+1.8 FP/1s (Speed boost/debuff effects)',
    type: 'dish'
  },
  'avocado-hummus': {
    id: 'avocado-hummus',
    name: 'Avocado Hummus',
    fpPerTick: 1.7,
    tickInterval: 1000,
    description: '+1.7 FP/1s (Shield protection on placement)',
    type: 'dish'
  },
  'herb-hummus': {
    id: 'herb-hummus',
    name: 'Herb Hummus',
    fpPerTick: 1.8,
    tickInterval: 1000,
    description: '+1.8 FP/1s (+0.3 FP/s per adjacent Veg, cap +0.6)',
    type: 'dish'
  },
  'pumpkin-nutmeg-hummus': {
    id: 'pumpkin-nutmeg-hummus',
    name: 'Pumpkin-Nutmeg Hummus',
    fpPerTick: 1.7,
    tickInterval: 1000,
    description: '+1.7 FP/1s (Next ally action +2 FP burst)',
    type: 'dish'
  },
  'coconut-lime-hummus': {
    id: 'coconut-lime-hummus',
    name: 'Coconut-Lime Hummus',
    fpPerTick: 1.8,
    tickInterval: 1000,
    description: '+1.8 FP/1s (Team burn damage reduction)',
    type: 'dish'
  }
};

// Calculate type-based synergy bonuses
export function calculateTypeSynergies(platterItems: any[], itemIndex: number): number {
  const item = platterItems[itemIndex];
  if (!item) return 1.0;
  
  const itemType = ITEM_BATTLE_TYPES[item.id];
  if (!itemType) return 1.0;
  
  let synergyMultiplier = 1.0;
  
  // Check adjacent slots for type synergies (4-column grid layout)
  const columns = 4;
  const row = Math.floor(itemIndex / columns);
  const col = itemIndex % columns;
  
  const adjacentIndices = [
    itemIndex - 1, // Left
    itemIndex + 1, // Right
    itemIndex - columns, // Above
    itemIndex + columns  // Below
  ].filter(idx => {
    if (idx < 0 || idx >= platterItems.length) return false;
    
    const adjRow = Math.floor(idx / columns);
    const adjCol = idx % columns;
    
    // Left/right must be in same row
    if (idx === itemIndex - 1 && adjRow !== row) return false;
    if (idx === itemIndex + 1 && adjRow !== row) return false;
    
    return true;
  });
  
  const adjacentItems = adjacentIndices
    .map(idx => platterItems[idx])
    .filter(adjItem => adjItem !== null);
  
  // Count all fruits on the platter for apple synergy
  const allFruits = platterItems.filter(platterItem => 
    platterItem && ITEM_BATTLE_TYPES[platterItem.id] === 'fruit'
  );
  
  // Apply specific synergies based on item type and adjacent items
  switch (itemType) {
    case 'fruit':
      // Special apple synergy: +1 FP for each fruit on platter
      if (item.id === 'apple') {
        const fruitCount = allFruits.length;
        synergyMultiplier += (fruitCount - 1) * 1.0; // -1 to not count itself
      } else {
        // Other fruits get +10% per adjacent fruit (stacks)
        const adjacentFruits = adjacentItems.filter(adjItem => 
          ITEM_BATTLE_TYPES[adjItem.id] === 'fruit'
        ).length;
        synergyMultiplier += adjacentFruits * 0.1;
      }
      
      // Special synergy with sugar
      const hasAdjacentSugar = adjacentItems.some(adjItem => adjItem.id === 'sugar');
      if (hasAdjacentSugar) synergyMultiplier += 0.15;
      break;
      
    case 'berry':
      // Berries get massive boost from adjacent sugar
      const berryHasSugar = adjacentItems.some(adjItem => adjItem.id === 'sugar');
      if (berryHasSugar) synergyMultiplier += 0.4;
      
      // Berry clusters: +5% per adjacent berry
      const adjacentBerries = adjacentItems.filter(adjItem => 
        ITEM_BATTLE_TYPES[adjItem.id] === 'berry'
      ).length;
      synergyMultiplier += adjacentBerries * 0.05;
      break;
      
    case 'citrus':
      // Citrus fruits boost each other and provide team cleanse effects
      const adjacentCitrus = adjacentItems.filter(adjItem => 
        ITEM_BATTLE_TYPES[adjItem.id] === 'citrus'
      ).length;
      synergyMultiplier += adjacentCitrus * 0.12;
      break;
      
    case 'veggie':
      // Vegetables synergize with spices
      const adjacentSpices = adjacentItems.filter(adjItem => 
        ITEM_BATTLE_TYPES[adjItem.id] === 'spice'
      ).length;
      synergyMultiplier += adjacentSpices * 0.2;
      
      // Peppers boost each other
      if (item.id.includes('pepper')) {
        const adjacentPeppers = adjacentItems.filter(adjItem => 
          adjItem.id.includes('pepper')
        ).length;
        synergyMultiplier += adjacentPeppers * 0.08;
      }
      break;
      
    case 'legume':
      // Legumes boost with spices
      const legumeSpices = adjacentItems.filter(adjItem => 
        ['garlic', 'cajun'].includes(adjItem.id)
      ).length;
      synergyMultiplier += legumeSpices * 0.25;
      break;
      
    case 'grain':
      // Grains provide foundation bonus to adjacent dishes
      // This is handled in dish calculations
      break;
      
    case 'dish':
      // Dishes can benefit from ingredient types they contain
      if (item.id.includes('berry') || item.id.includes('strawberry') || item.id.includes('blueberry')) {
        const dishBerryBonus = adjacentItems.filter(adjItem => 
          ITEM_BATTLE_TYPES[adjItem.id] === 'berry'
        ).length;
        synergyMultiplier += dishBerryBonus * 0.1;
      }
      break;
  }
  
  // Cap synergy multiplier at 3x for balance
  return Math.min(synergyMultiplier, 3.0);
}

// Apply upgrade multipliers and type synergies to item stats
export function getUpgradedStats(itemId: string, upgradeLevel: number, platterItems?: any[], itemIndex?: number): ItemStats | null {
  const baseStats = ITEM_STATS[itemId];
  if (!baseStats) return null;

  // Upgrade multipliers: Level 0 = 1x, Level 1 = 1.5x, Level 2 = 2x, Level 3+ = 3x
  const multipliers = [1, 1.5, 2, 3, 3]; // Index = upgrade level
  const upgradeMultiplier = multipliers[Math.min(upgradeLevel, 4)];
  
  // Calculate type synergy bonus if platter context is provided
  let synergyMultiplier = 1.0;
  if (platterItems && itemIndex !== undefined) {
    synergyMultiplier = calculateTypeSynergies(platterItems, itemIndex);
  }
  
  const totalMultiplier = upgradeMultiplier * synergyMultiplier;
  
  let description = baseStats.description;
  if (upgradeMultiplier > 1) {
    description += ` (${upgradeMultiplier}x upgraded)`;
  }
  if (synergyMultiplier > 1) {
    description += ` (${synergyMultiplier.toFixed(1)}x synergy)`;
  }

  return {
    ...baseStats,
    fpPerTick: baseStats.fpPerTick * totalMultiplier,
    type: ITEM_BATTLE_TYPES[itemId] || 'unknown',
    description
  };
}
