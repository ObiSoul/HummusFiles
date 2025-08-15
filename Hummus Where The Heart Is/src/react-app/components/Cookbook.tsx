interface Item {
  id: string;
  name: string;
  image: string;
  category: string;
  baseStats: string;
  ability: string;
  description: string;
}

interface CookbookProps {
  discoveredItems: string[]; // List of item IDs that have been discovered (had in inventory)
  discoveredRecipes: string[]; // List of recipe IDs that have been discovered
}

import InfoButton from './InfoButton';

const ALL_ITEMS: Item[] = [
  // Fruits
  {
    id: 'apple',
    name: 'Apple',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Apple.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.3s',
    ability: '+1 FP for each fruit on player\'s platter',
    description: 'Sweet red apple that gets stronger with more fruits on your platter.'
  },
  {
    id: 'banana',
    name: 'Banana',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Banana.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.6s',
    ability: 'Slip Guard—every 6s, block 1 –FP',
    description: 'Yellow curved fruit that helps you slip away from damage.'
  },
  {
    id: 'cherry',
    name: 'Cherry',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Cherry.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.4s',
    ability: 'On place +2 FP burst',
    description: 'Sweet red cherry that gives immediate FP when placed.'
  },
  {
    id: 'black-cherry',
    name: 'Black Cherry',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Black-Cherry.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.5s',
    ability: '10% crit = +3 FP burst',
    description: 'Dark cherry with a chance for critical flavor bursts.'
  },
  {
    id: 'grape',
    name: 'Grapes',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Grapes.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.4s',
    ability: 'Adjacent Sugar → +1 FP every 5s',
    description: 'Purple grape cluster that pairs wonderfully with sugar.'
  },
  {
    id: 'green-grape',
    name: 'Green Grapes',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Grapes.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.4s',
    ability: '–1 FP to enemy every 8s (tart)',
    description: 'Tart green grapes that occasionally sour the opponent\'s experience.'
  },
  {
    id: 'green-apple',
    name: 'Green Apple',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Apple.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.3s',
    ability: '20% chance on pop to apply –1 FP (once)',
    description: 'Crisp green apple with a chance to deliver a tart surprise.'
  },
  {
    id: 'golden-apple',
    name: 'Golden Apple',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Golden-Apple.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.2s',
    ability: 'Counts as 2 fruits for Apple-style bonuses; +10% FP/s per other fruit (max +50%)',
    description: 'Legendary golden apple that amplifies all fruit synergies.'
  },
  {
    id: 'dragonfruit',
    name: 'Dragonfruit',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Dragonfruit.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.1s',
    ability: 'First time you reach 10 FP, gain +5 FP shield',
    description: 'Exotic pink fruit that provides protective energy when needed.'
  },
  {
    id: 'coconut',
    name: 'Coconut',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Coconut.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.7s',
    ability: 'Adjacent allies reduce –FP by 1 every 5s',
    description: 'Tropical coconut that protects nearby allies from negative effects.'
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Kiwi.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.3s',
    ability: 'Duo with Lime → apply –1 FP to a random enemy every 4s',
    description: 'Fuzzy kiwi that teams up with lime for citrus attacks.'
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Watermelon.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.5s',
    ability: 'With Basil or Lime adjacent → +0.5 FP/s',
    description: 'Refreshing watermelon that combines well with herbs and citrus.'
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Pineapple.png',
    category: 'Fruit',
    baseStats: '1 FP / 1.4s',
    ability: 'With Chili Pepper adjacent → Burn: –1 FP/2s for 6s, refresh every 8s',
    description: 'Tropical pineapple that creates spicy combinations with peppers.'
  },

  // Berries
  {
    id: 'strawberry',
    name: 'Strawberry',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Strawberry.png',
    category: 'Berry',
    baseStats: '1 FP / 1.0s',
    ability: 'On place +3 FP; Adjacent Sugar → +0.3 FP/s',
    description: 'Sweet berry that provides instant gratification and loves sugar.'
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Raspberry.png',
    category: 'Berry',
    baseStats: '1 FP / 1.1s',
    ability: 'Adjacent Sugar → +0.4 FP/s',
    description: 'Tart raspberry that becomes incredible when sweetened.'
  },
  {
    id: 'blackberry',
    name: 'Blackberries',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Blackberries.png',
    category: 'Berry',
    baseStats: '1 FP / 1.15s',
    ability: 'Adjacent Sugar → +0.4 FP/s',
    description: 'Dark berries that create amazing synergy with sugar.'
  },
  {
    id: 'blueberry',
    name: 'Blueberries',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Blueberries.png',
    category: 'Berry',
    baseStats: '1 FP / 1.2s',
    ability: 'After 10s, speed up to 1 FP / 1.0s',
    description: 'Small blue berries that get more productive over time.'
  },

  // Citrus
  {
    id: 'orange',
    name: 'Orange',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Orange.png',
    category: 'Citrus',
    baseStats: '1 FP / 1.8s',
    ability: 'Pulse: +1 FP to all allies every 10s',
    description: 'Bright orange that energizes the entire team.'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Lemon.png',
    category: 'Citrus',
    baseStats: '1 FP / 2.2s',
    ability: 'Aura: Adjacent ally +0.3 FP/s (Zest)',
    description: 'Zesty lemon that enhances nearby allies with citrus energy.'
  },
  {
    id: 'lime',
    name: 'Lime',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Lime.png',
    category: 'Citrus',
    baseStats: '1 FP / 2.2s',
    ability: 'Cleanse one ongoing –FP from adjacent ally every 6s',
    description: 'Tart lime that cleanses negative effects from friends.'
  },

  // Vegetables
  {
    id: 'tomato',
    name: 'Tomato',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Tomato.png',
    category: 'Veggie',
    baseStats: '1 FP / 3s',
    ability: '–1 FP to opponent each second for 10s, then –2 FP/s for the rest of battle',
    description: 'Juicy tomato that becomes increasingly devastating over time.'
  },
  {
    id: 'eggplant',
    name: 'Eggplant',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Eggplant.png',
    category: 'Veggie',
    baseStats: '1 FP / 2.0s',
    ability: 'Soak: every 5s, reduce incoming –FP by 1',
    description: 'Purple eggplant that absorbs incoming damage like a sponge.'
  },
  {
    id: 'green-chile-pepper',
    name: 'Green Chile Pepper',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Chile-Pepper.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.9s',
    ability: 'Apply –1 FP/3s for 6s to nearest enemy',
    description: 'Spicy green pepper that targets the closest threat.'
  },
  {
    id: 'avocado',
    name: 'Avocado',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Avacado.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.7s',
    ability: 'With Lime or Tomato adjacent → +0.5 FP/s and +3 FP shield once',
    description: 'Creamy avocado that forms protective bonds with citrus and tomatoes.'
  },
  {
    id: 'chili-pepper',
    name: 'Chili Pepper',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Chili-Pepper.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.7s',
    ability: 'Every 7s, inflict –1 FP/s for 2s (Burn)',
    description: 'Fiery red pepper that periodically burns opponents.'
  },
  {
    id: 'green-bell-pepper',
    name: 'Green Bell Pepper',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Green-Bell-Pepper.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.8s',
    ability: 'Tri-Bell Set (near any two Bell Peppers) → +0.5 FP/s',
    description: 'Crisp green pepper that forms powerful trios with other bell peppers.'
  },
  {
    id: 'red-bell-pepper',
    name: 'Red Bell Pepper',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Red-Bell-Pepper.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.6s',
    ability: 'Every 10s → +2 FP burst',
    description: 'Sweet red pepper that provides regular flavor bursts.'
  },
  {
    id: 'yellow-bell-pepper',
    name: 'Yellow Bell Pepper',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Yellow-Bell-Pepper.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.7s',
    ability: 'Aura: Adjacent allies +0.2 FP/s',
    description: 'Bright yellow pepper that boosts all nearby allies.'
  },
  {
    id: 'onion',
    name: 'Onion',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Onion.png',
    category: 'Veggie',
    baseStats: '1 FP / 2.0s',
    ability: 'Tears: –1 FP to 2 random enemies every 5s',
    description: 'Pungent onion that makes multiple enemies cry.'
  },
  {
    id: 'red-onion',
    name: 'Red Onion',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Red-Onion.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.9s',
    ability: 'Tears+: –1 FP to 2 enemies every 4s',
    description: 'Stronger purple onion that brings tears more frequently.'
  },
  {
    id: 'jalapeno',
    name: 'Jalapeño',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Jalapeno.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.6s',
    ability: '–1 FP/s for 2s every 6s',
    description: 'Spicy jalapeño that delivers regular burning sensations.'
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Pumpkin.png',
    category: 'Veggie',
    baseStats: '1 FP / 1.8s',
    ability: 'Adjacent Sugar or Nutmeg → +0.6 FP/s; both present → extra +1 FP/5s',
    description: 'Seasonal pumpkin that becomes amazing with sweet spices.'
  },

  // Grains & Legumes
  {
    id: 'wheat',
    name: 'Wheat',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Wheat.png',
    category: 'Grain',
    baseStats: '0.5 FP / 2s',
    ability: 'Passive: Dough crafts from this Wheat get +1 FP on place (meta bonus)',
    description: 'Essential grain that enhances any dough made from it.'
  },
  {
    id: 'soybean',
    name: 'Soybean',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/soybean_16.png',
    category: 'Legume',
    baseStats: '1 FP / 1.8s',
    ability: 'Adjacent Garlic or Cajun → +0.5 FP/s',
    description: 'Nutritious beans that pair excellently with savory spices.'
  },
  {
    id: 'chickpeas',
    name: 'Chickpeas',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Chickpeas.png',
    category: 'Legume',
    baseStats: '1 FP / 1.9s',
    ability: 'Base for hummus family recipes. +0.3 FP/s per adjacent Veg (cap +0.6)',
    description: 'Protein-rich beige legumes, perfect for making creamy hummus dishes.'
  },

  // Spices
  {
    id: 'garlic',
    name: 'Garlic',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Garlic.png',
    category: 'Spice',
    baseStats: 'Support Item',
    ability: 'Enhances adjacent Soybean and other savory combinations',
    description: 'Aromatic spice that brings out the best in savory dishes.'
  },
  {
    id: 'basil',
    name: 'Basil',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Basil.png',
    category: 'Spice',
    baseStats: 'Support Item',
    ability: 'Enhances adjacent Watermelon and creates herb synergies',
    description: 'Fresh herb that adds aromatic complexity to fruits and vegetables.'
  },
  {
    id: 'sugar',
    name: 'Sugar',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Sugar.png',
    category: 'Spice',
    baseStats: 'Support Item',
    ability: 'Enhances all adjacent berries and pairs with Pumpkin',
    description: 'Sweet enhancer that makes berries and desserts incredible.'
  },
  {
    id: 'nutmeg',
    name: 'Nutmeg',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Nutmeg.png',
    category: 'Spice',
    baseStats: 'Support Item',
    ability: 'Pairs with Pumpkin for autumn dessert combinations',
    description: 'Warm spice perfect for autumn flavors and desserts.'
  },
  {
    id: 'cajun',
    name: 'Cajun Spice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/Cajun.png',
    category: 'Spice',
    baseStats: 'Support Item',
    ability: 'Enhances adjacent Soybean with bold, complex flavors',
    description: 'Bold spice blend that brings heat and complexity.'
  },

  // Special Items
  {
    id: 'water',
    name: 'Water',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/water.png',
    category: 'Special',
    baseStats: 'Crafting Item',
    ability: 'Essential ingredient for creating Dough and other recipes',
    description: 'Pure water, the foundation of all cooking.'
  },

  // Cooked Dishes
  {
    id: 'dough',
    name: 'Dough',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dough.png',
    category: 'Dish',
    baseStats: '1 FP / 1s',
    ability: '5% chance to block all incoming –FP',
    description: 'Basic dough that provides steady production with defensive utility.'
  },
  {
    id: 'apple-pie',
    name: 'Apple Pie',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-pie.png',
    category: 'Dish',
    baseStats: '2.5 FP / 3s',
    ability: 'Premium dessert with high flavor output',
    description: 'Delicious apple pie that delivers consistent high flavor.'
  },
  {
    id: 'tomato-soup',
    name: 'Tomato Soup',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-soup.png',
    category: 'Dish',
    baseStats: '1.8 FP / 2s',
    ability: 'Warming soup with reliable flavor generation',
    description: 'Comforting soup that provides steady, reliable flavor.'
  },

  // Advanced Veg & Legume Dishes
  {
    id: 'cajun-garlic-soybeans',
    name: 'Cajun Garlic Soybeans',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cajun-garlic-soybeans.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: '+0.5 FP/s (seasoned). –1 FP/s for 2s every 6s (Cajun). Mitigate –FP by 1 every 8s (Garlic)',
    description: 'Spicy seasoned soybeans with defensive garlic properties.'
  },
  {
    id: 'lime-edamame',
    name: 'Lime Edamame',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lime-edamame.png',
    category: 'Dish',
    baseStats: '1 FP / 1.1s',
    ability: 'Cleanse adjacent ally every 6s, +0.3 FP/s',
    description: 'Fresh edamame with cleansing lime properties.'
  },
  {
    id: 'eggplant-tomato-bake',
    name: 'Eggplant & Tomato Bake',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/eggplant-tomato-bake.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Soak: reduce incoming –FP by 1 every 5s. –1 FP/s for 3s every 10s (tomato). –1 FP every 8s (garlic)',
    description: 'Mediterranean bake combining defensive and offensive properties.'
  },
  {
    id: 'chili-garlic-eggplant',
    name: 'Chili-Garlic Eggplant',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/chili-garlic-eggplant.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: 'Soak (–1 every 5s). Burn: –1 FP/s for 2s every 6s. –1 FP every 8s (garlic)',
    description: 'Spicy eggplant dish with defensive soak and burning attacks.'
  },
  {
    id: 'pumpkin-soup',
    name: 'Pumpkin Soup',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-soup.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'On place: +3 FP. –1 FP every 8s (garlic). If Nutmeg adjacent: +15% FP/s',
    description: 'Hearty pumpkin soup with initial burst and garlic effects.'
  },
  {
    id: 'spiced-pumpkin-puree',
    name: 'Spiced Pumpkin Purée',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/spiced-pumpkin-puree.png',
    category: 'Dish',
    baseStats: '1 FP / 0.9s',
    ability: '+15% FP/s (nutmeg). +1 FP every 5s (sugar)',
    description: 'Rich spiced purée with nutmeg enhancement and sugar bursts.'
  },

  // Advanced Salad Dishes
  {
    id: 'guacamole',
    name: 'Guacamole',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/guacamole.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: 'On place: +3 FP shield. Cleanse nearest ally every 8s. –1 FP to 2 enemies every 6s (onion)',
    description: 'Creamy avocado dip with protective and cleansing properties.'
  },
  {
    id: 'avocado-tomato-salad',
    name: 'Avocado-Tomato Salad',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-tomato-salad.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: '+3 FP shield on place. –1 FP to 2 enemies every 6s (red onion). Light tomato bleed –1/s for 2s every 10s',
    description: 'Fresh salad with defensive shield and multi-enemy attacks.'
  },
  {
    id: 'watermelon-basil-salad',
    name: 'Watermelon Basil Salad',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-basil-salad.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: '+0.5 FP/s (basil synergy). Cleanse random ally every 10s. Team spritz: +1 FP to all allies every 14s',
    description: 'Refreshing summer salad that supports the entire team.'
  },

  // Advanced Sweet Dishes  
  {
    id: 'caramelized-banana',
    name: 'Caramelized Banana',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/caramelized-banana.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Block 1 –FP every 6s (banana slip). +1 FP every 5s (sugar)',
    description: 'Sweet caramelized fruit with defensive blocks and sugar bursts.'
  },
  {
    id: 'coconut-snow',
    name: 'Coconut Snow',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-snow.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Aura: adjacent allies reduce –FP by 1 every 5s (coconut). +1 FP burst every 10s',
    description: 'Frozen treat that protects nearby allies with coconut aura.'
  },
  {
    id: 'candied-orange-peel',
    name: 'Candied Orange Peel',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-orange-peel.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: '+1 FP to all allies every 12s (orange pulse). +0.3 FP/s (sugar)',
    description: 'Candied citrus that energizes the entire team with orange power.'
  },
  {
    id: 'candied-jalapenos',
    name: 'Candied Jalapeños',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-jalapenos.png',
    category: 'Dish',
    baseStats: '1 FP / 1.1s',
    ability: 'Burn: –1 FP/s for 2s every 6s. +0.3 FP/s (sugar)',
    description: 'Sweet and spicy peppers that burn enemies while providing steady flavor.'
  },
  {
    id: 'quick-pickled-onions',
    name: 'Quick-Pickled Onions',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/quick-pickled-onions.png',
    category: 'Dish',
    baseStats: '1 FP / 1.1s',
    ability: '–1 FP to 2 enemies every 4s (stronger tears). Self-cleanse every 10s',
    description: 'Tangy pickled onions with enhanced tear effects and self-cleaning.'
  },

  // Advanced Frozen Treats
  {
    id: 'watermelon-lime-granita',
    name: 'Watermelon-Lime Granita',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-lime-granita.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Refreshing: +1 FP to random ally every 8s. Cleanse one debuff from self every 6s',
    description: 'Icy watermelon treat that refreshes allies and cleanses debuffs.'
  },
  {
    id: 'dragonfruit-sorbet',
    name: 'Dragonfruit Sorbet',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dragonfruit-sorbet.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: 'Exotic Armor: First hit each turn reduced by 1 FP. +1 FP burst every 7s',
    description: 'Exotic frozen dessert with mysterious protective properties.'
  },
  {
    id: 'blueberry-ice',
    name: 'Blueberry Ice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/blueberry-ice.png',
    category: 'Dish',
    baseStats: '1 FP / 1.05s',
    ability: 'Antioxidant Shield: Block first –FP of each battle phase. +0.2 FP/s after 15s',
    description: 'Healthy blue ice with protective antioxidant properties.'
  },
  {
    id: 'pineapple-coconut-ice',
    name: 'Pineapple-Coconut Ice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-coconut-ice.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Tropical Freeze: Adjacent allies +0.3 FP/s. Immune to burn effects',
    description: 'Tropical frozen treat that protects from heat and boosts allies.'
  },

  // Advanced Drinks
  {
    id: 'lemonade',
    name: 'Lemonade',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lemonade.png',
    category: 'Dish',
    baseStats: '1 FP / 1.1s',
    ability: 'Citrus Burst: +2 FP every 8s. Cleanse adjacent ally debuffs every 10s',
    description: 'Classic lemon drink that bursts with citrus energy and cleanses allies.'
  },
  {
    id: 'limeade',
    name: 'Limeade',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/limeade.png',
    category: 'Dish',
    baseStats: '1 FP / 1.1s',
    ability: 'Hydration: +1 FP to all allies every 12s. Self-cleanse every 8s',
    description: 'Refreshing lime drink that hydrates the team and cleanses debuffs.'
  },
  {
    id: 'orangeade',
    name: 'Orangeade',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orangeade.png',
    category: 'Dish',
    baseStats: '1 FP / 1.05s',
    ability: 'Vitamin Boost: All allies +10% FP/s for 15s after placement. +1 FP every 6s',
    description: 'Energizing orange drink that provides lasting vitamin enhancement.'
  },
  {
    id: 'grape-juice',
    name: 'Grape Juice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-juice.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Antioxidant Power: +15% FP generation. Resist next 2 debuffs applied',
    description: 'Rich grape juice packed with antioxidants and debuff resistance.'
  },

  // Advanced Salsas
  {
    id: 'classic-pico',
    name: 'Classic Pico de Gallo',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/classic-pico.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: 'Fresh Veggie Power: +0.2 FP/s for each adjacent veggie. –1 FP to enemy every 6s',
    description: 'Classic fresh salsa that gets stronger with more vegetables nearby.'
  },
  {
    id: 'pineapple-chili-salsa',
    name: 'Pineapple-Chili Salsa',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-chili-salsa.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: 'Tropical Heat: –1 FP/s for 3s every 7s (burn). +1 FP burst when enemy takes fire damage',
    description: 'Spicy tropical salsa that burns enemies and feeds off fire damage.'
  },
  {
    id: 'green-chile-salsa',
    name: 'Green Chile Salsa',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/green-chile-salsa.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Mild Heat: –1 FP to random enemy every 8s. Cleanse one ally debuff every 10s',
    description: 'Gentle green salsa with mild heat and cleansing properties.'
  },
  {
    id: 'roasted-red-relish',
    name: 'Roasted Red Relish',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/roasted-red-relish.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Smoky Sweetness: +1 FP every 5s (sugar). Adjacent items +0.2 FP/s (roasted aroma)',
    description: 'Sweet roasted relish that enhances nearby items with smoky flavor.'
  },
  {
    id: 'avocado-salsa-verde',
    name: 'Avocado Salsa Verde',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-salsa-verde.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: 'Creamy Protection: +2 FP shield on place. Adjacent allies take 1 less damage from debuffs',
    description: 'Creamy green salsa that shields allies and reduces debuff damage.'
  },

  // Advanced Savory Sauces
  {
    id: 'quick-marinara',
    name: 'Quick Marinara',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/quick-marinara.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Italian Intensity: –2 FP to enemy every 10s. Adjacent dishes +0.3 FP/s (flavor base)',
    description: 'Classic tomato sauce that intensifies and enhances other dishes.'
  },
  {
    id: 'cajun-tomato-base',
    name: 'Cajun Tomato Base',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cajun-tomato-base.png',
    category: 'Dish',
    baseStats: '1 FP / 0.95s',
    ability: 'Bold Cajun Heat: –1 FP/s for 2s every 6s (spicy). +20% FP/s when enemy is debuffed',
    description: 'Spicy Louisiana-style base that gets stronger when enemies suffer.'
  },
  {
    id: 'pepper-trinity',
    name: 'Pepper Trinity',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-trinity.png',
    category: 'Dish',
    baseStats: '1 FP / 1.0s',
    ability: 'Holy Trinity: All adjacent allies +0.4 FP/s. Create aromatic aura (+15% team FP/s)',
    description: 'Sacred Louisiana cooking base that elevates the entire team.'
  },

  // Advanced Flatbreads
  {
    id: 'garlic-herb-flatbread',
    name: 'Garlic Herb Flatbread',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/garlic-herb-flatbread.png',
    category: 'Dish',
    baseStats: '1.2 FP / 1.2s',
    ability: 'Aromatic Bread: Adjacent allies +0.2 FP/s from garlic aroma. Self-cleanse every 12s',
    description: 'Rustic flatbread with garlic and fresh herbs that boosts nearby allies.'
  },
  {
    id: 'tomato-basil-flatbread',
    name: 'Tomato Basil Flatbread',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-basil-flatbread.png',
    category: 'Dish',
    baseStats: '1.1 FP / 1.1s',
    ability: 'Mediterranean Harmony: +1 FP burst every 8s. Adjacent herbs +0.3 FP/s',
    description: 'Mediterranean-style bread with tomato and basil that creates herb synergies.'
  },
  {
    id: 'tri-bell-pepper-flatbread',
    name: 'Tri-Bell Pepper Flatbread',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tri-bell-pepper-flatbread.png',
    category: 'Dish',
    baseStats: '1.3 FP / 1.3s',
    ability: 'Triple Pepper Power: +0.5 FP/s for each different pepper type on platter (max +1.5)',
    description: 'Colorful flatbread that gets stronger with pepper variety.'
  },
  {
    id: 'pepper-onion-flatbread',
    name: 'Pepper & Onion Flatbread',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-onion-flatbread.png',
    category: 'Dish',
    baseStats: '1 FP / 1.2s',
    ability: 'Caramelized Comfort: –1 FP to random enemy every 10s. Adjacent onions +0.4 FP/s',
    description: 'Savory flatbread with caramelized onions and peppers.'
  },

  // Advanced Fruit Tarts
  {
    id: 'apple-tart',
    name: 'Apple Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
    category: 'Dish',
    baseStats: '1.4 FP / 1.4s',
    ability: 'French Elegance: +2 FP burst every 12s. Adjacent sugar items +0.3 FP/s',
    description: 'Elegant French tart with perfectly arranged apple slices.'
  },
  {
    id: 'golden-apple-tart',
    name: 'Golden Apple Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
    category: 'Dish',
    baseStats: '1.8 FP / 1.4s',
    ability: 'Golden Radiance: +3 FP burst every 10s. Counts as premium dessert for bonuses',
    description: 'Premium tart made with magical golden apples and expert pastry craft.'
  },
  {
    id: 'green-apple-tart',
    name: 'Green Apple Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
    category: 'Dish',
    baseStats: '1.3 FP / 1.4s',
    ability: 'Tart Balance: –0.5 FP to enemy every 15s (apple tartness). +0.2 FP/s from sugar',
    description: 'Balanced tart with tart green apples and sweet pastry.'
  },
  {
    id: 'strawberry-tart',
    name: 'Strawberry Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
    category: 'Dish',
    baseStats: '1.5 FP / 1.2s',
    ability: 'Berry Sweetness: +2 FP on place. Adjacent berries +0.4 FP/s',
    description: 'Delightful tart showcasing fresh strawberries on buttery pastry.'
  },
  {
    id: 'blueberry-tart',
    name: 'Blueberry Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
    category: 'Dish',
    baseStats: '1.4 FP / 1.2s',
    ability: 'Antioxidant Shield: Block first debuff each turn. +15% FP/s after 20s',
    description: 'Healthy tart packed with antioxidant-rich blueberries.'
  },
  {
    id: 'blackberry-tart',
    name: 'Blackberry Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
    category: 'Dish',
    baseStats: '1.6 FP / 1.2s',
    ability: 'Dark Berry Power: +20% FP/s when below 50% health. Immune to poison',
    description: 'Rich tart with dark blackberries that grows stronger when threatened.'
  },
  {
    id: 'raspberry-tart',
    name: 'Raspberry Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
    category: 'Dish',
    baseStats: '1.5 FP / 1.3s',
    ability: 'Complex Flavors: Random bonus effect every 15s (+2 FP burst or cleanse or shield)',
    description: 'Sophisticated tart with complex raspberry flavors and buttery crust.'
  },

  // Advanced Compotes
  {
    id: 'apple-compote',
    name: 'Apple Compote',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-compote.png',
    category: 'Dish',
    baseStats: '1.1 FP / 1.5s',
    ability: 'Warm Comfort: +1 FP to all allies every 20s. Adjacent spices +0.3 FP/s',
    description: 'Comforting spiced apple compote that warms the entire team.'
  },
  {
    id: 'golden-apple-compote',
    name: 'Golden Apple Compote',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/golden-apple-compote.png',
    category: 'Dish',
    baseStats: '1.5 FP / 1.5s',
    ability: 'Golden Warmth: +2 FP to all allies every 18s. Magical aura: team +10% FP/s',
    description: 'Premium compote with magical golden apples and enchanting warmth.'
  },

  // Advanced Jams & Preserves
  {
    id: 'cherry-jam',
    name: 'Cherry Jam',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cherry-jam.png',
    category: 'Dish',
    baseStats: '1.2 FP / 1.6s',
    ability: 'Sweet Preserve: +1 FP burst every 10s. Citrus zing: cleanse self every 15s',
    description: 'Classic cherry preserve with bright lemon notes for balance.'
  },
  {
    id: 'mixed-berry-jam',
    name: 'Mixed Berry Jam',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/mixed-berry-jam.png',
    category: 'Dish',
    baseStats: '1.4 FP / 1.5s',
    ability: 'Berry Medley: +0.3 FP/s for each berry type on platter. Complex antioxidants',
    description: 'Rich preserve combining multiple berry varieties for complex flavors.'
  },
  {
    id: 'strawberry-jam',
    name: 'Strawberry Jam',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/strawberry-jam.png',
    category: 'Dish',
    baseStats: '1.3 FP / 1.4s',
    ability: 'Classic Preserve: +2 FP on place. Adjacent bread items +0.4 FP/s',
    description: 'Traditional strawberry jam that pairs perfectly with bread items.'
  },
  {
    id: 'grape-jelly',
    name: 'Grape Jelly',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-jelly.png',
    category: 'Dish',
    baseStats: '1.1 FP / 1.7s',
    ability: 'Smooth Essence: Immune to disruption effects. +1 FP burst every 12s',
    description: 'Pure grape jelly with smooth texture and concentrated flavor.'
  },
  {
    id: 'orange-marmalade',
    name: 'Orange Marmalade',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orange-marmalade.png',
    category: 'Dish',
    baseStats: '1.3 FP / 1.6s',
    ability: 'Citrus Intensity: –0.5 FP to enemy every 12s. Orange peel: +1 FP burst every 15s',
    description: 'British-style marmalade with bitter orange peel adding complexity.'
  },
  {
    id: 'kiwi-lime-jam',
    name: 'Kiwi-Lime Jam',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/kiwi-lime-jam.png',
    category: 'Dish',
    baseStats: '1.2 FP / 1.5s',
    ability: 'Exotic Tang: Cleanse random ally every 10s. –0.5 FP to enemy from tartness',
    description: 'Exotic jam combining tropical kiwi with zesty lime for unique flavors.'
  },
  {
    id: 'pineapple-preserves',
    name: 'Pineapple Preserves',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-preserves.png',
    category: 'Dish',
    baseStats: '1.4 FP / 1.8s',
    ability: 'Tropical Chunks: +2 FP burst every 15s. Enzyme power: reduce enemy defense by 1',
    description: 'Chunky pineapple preserve with natural enzymes and tropical sweetness.'
  },

  // Hummus Dishes
  {
    id: 'hummus',
    name: 'Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/hummus.png',
    category: 'Dish',
    baseStats: '1.9 FP / 1s',
    ability: 'Debuff Guard for adjacent allies on place, +0.4 FP/s near Wheat/Dough',
    description: 'Classic Middle Eastern chickpea dip with garlic and lemon that protects allies.'
  },
  {
    id: 'pepper-hummus',
    name: 'Pepper Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-hummus.png',
    category: 'Dish',
    baseStats: '2.0 FP / 1s',
    ability: 'Smolder debuff to nearest enemy every 8s',
    description: 'Spicy red pepper hummus that inflicts burning debuffs on enemies.'
  },
  {
    id: 'jalapeno-lime-hummus',
    name: 'Jalapeño-Lime Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/jalapeno-lime-hummus.png',
    category: 'Dish',
    baseStats: '1.8 FP / 1s',
    ability: 'Speed boost for allies, speed debuff for enemies',
    description: 'Zesty hummus with jalapeño heat that affects battle tempo.'
  },
  {
    id: 'avocado-hummus',
    name: 'Avocado Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-hummus.png',
    category: 'Dish',
    baseStats: '1.7 FP / 1s',
    ability: 'Shield protection on placement (+3 FP shield)',
    description: 'Creamy green hummus enriched with fresh avocado for protection.'
  },
  {
    id: 'herb-hummus',
    name: 'Herb Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/herb-hummus.png',
    category: 'Dish',
    baseStats: '1.8 FP / 1s',
    ability: '+0.3 FP/s per adjacent vegetable (max +0.6 FP/s)',
    description: 'Aromatic hummus infused with fresh basil that gains power from vegetables.'
  },
  {
    id: 'pumpkin-nutmeg-hummus',
    name: 'Pumpkin-Nutmeg Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-nutmeg-hummus.png',
    category: 'Dish',
    baseStats: '1.7 FP / 1s',
    ability: 'Next ally action gets +2 FP burst boost',
    description: 'Seasonal hummus with roasted pumpkin and warm nutmeg spice.'
  },
  {
    id: 'coconut-lime-hummus',
    name: 'Coconut-Lime Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-lime-hummus.png',
    category: 'Dish',
    baseStats: '1.8 FP / 1s',
    ability: 'Reduces burn damage for entire team',
    description: 'Tropical hummus with coconut richness and lime zest that protects from fire.'
  }
];

interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  description: string;
}

const ALL_RECIPES: Recipe[] = [
  // Basic Recipes
  {
    id: 'dough',
    name: 'Dough',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dough.png',
    ingredients: ['Water', 'Wheat'],
    description: 'Basic bread dough made from water and wheat. Essential for many baked goods.'
  },
  {
    id: 'apple-pie',
    name: 'Apple Pie',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-pie.png',
    ingredients: ['Apple', 'Dough', 'Sugar'],
    description: 'Classic American apple pie with sweet filling and flaky crust.'
  },
  {
    id: 'tomato-soup',
    name: 'Tomato Soup',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-soup.png',
    ingredients: ['Tomato', 'Basil', 'Water'],
    description: 'Comforting tomato soup with fresh basil.'
  },

  // Veg & Legume Recipes
  {
    id: 'cajun-garlic-soybeans',
    name: 'Cajun Garlic Soybeans',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cajun-garlic-soybeans.png',
    ingredients: ['Soybean', 'Garlic', 'Cajun Spice'],
    description: 'Spicy seasoned soybeans with bold Cajun flavors.'
  },
  {
    id: 'lime-edamame',
    name: 'Lime Edamame',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lime-edamame.png',
    ingredients: ['Soybean', 'Lime'],
    description: 'Fresh edamame with zesty lime seasoning.'
  },
  {
    id: 'eggplant-tomato-bake',
    name: 'Eggplant & Tomato Bake',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/eggplant-tomato-bake.png',
    ingredients: ['Eggplant', 'Tomato', 'Garlic'],
    description: 'Mediterranean layered vegetable bake.'
  },
  {
    id: 'chili-garlic-eggplant',
    name: 'Chili-Garlic Eggplant',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/chili-garlic-eggplant.png',
    ingredients: ['Eggplant', 'Chili Pepper', 'Garlic'],
    description: 'Spicy grilled eggplant with chili and garlic.'
  },
  {
    id: 'pumpkin-soup',
    name: 'Pumpkin Soup',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-soup.png',
    ingredients: ['Pumpkin', 'Water', 'Garlic'],
    description: 'Creamy autumn pumpkin soup with savory garlic.'
  },
  {
    id: 'spiced-pumpkin-puree',
    name: 'Spiced Pumpkin Purée',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/spiced-pumpkin-puree.png',
    ingredients: ['Pumpkin', 'Sugar', 'Nutmeg'],
    description: 'Sweet spiced pumpkin purée perfect for desserts.'
  },

  // Salad Recipes
  {
    id: 'guacamole',
    name: 'Guacamole',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/guacamole.png',
    ingredients: ['Avocado', 'Lime', 'Onion'],
    description: 'Classic Mexican avocado dip with lime and onions.'
  },
  {
    id: 'avocado-tomato-salad',
    name: 'Avocado-Tomato Salad',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-tomato-salad.png',
    ingredients: ['Avocado', 'Tomato', 'Red Onion'],
    description: 'Fresh salad with creamy avocado and juicy tomatoes.'
  },
  {
    id: 'watermelon-basil-salad',
    name: 'Watermelon Basil Salad',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-basil-salad.png',
    ingredients: ['Watermelon', 'Basil', 'Lime'],
    description: 'Refreshing summer salad with sweet watermelon and aromatic basil.'
  },

  // Sweet Recipes
  {
    id: 'caramelized-banana',
    name: 'Caramelized Banana',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/caramelized-banana.png',
    ingredients: ['Banana', 'Sugar'],
    description: 'Sweet caramelized bananas with golden sugar coating.'
  },
  {
    id: 'coconut-snow',
    name: 'Coconut Snow',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-snow.png',
    ingredients: ['Coconut', 'Sugar', 'Water'],
    description: 'Frozen treat that protects nearby allies with coconut aura.'
  },
  {
    id: 'candied-orange-peel',
    name: 'Candied Orange Peel',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-orange-peel.png',
    ingredients: ['Orange', 'Sugar', 'Water'],
    description: 'Candied citrus that energizes the entire team with orange power.'
  },
  {
    id: 'candied-jalapenos',
    name: 'Candied Jalapeños',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-jalapenos.png',
    ingredients: ['Jalapeño', 'Sugar', 'Water'],
    description: 'Sweet and spicy peppers that burn enemies while providing steady flavor.'
  },
  {
    id: 'quick-pickled-onions',
    name: 'Quick-Pickled Onions',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/quick-pickled-onions.png',
    ingredients: ['Red Onion', 'Lime', 'Water'],
    description: 'Tangy pickled onions with enhanced tear effects and self-cleaning.'
  },

  // Frozen Treats
  {
    id: 'watermelon-lime-granita',
    name: 'Watermelon-Lime Granita',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-lime-granita.png',
    ingredients: ['Watermelon', 'Lime', 'Sugar'],
    description: 'Icy watermelon treat that refreshes allies and cleanses debuffs.'
  },
  {
    id: 'dragonfruit-sorbet',
    name: 'Dragonfruit Sorbet',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dragonfruit-sorbet.png',
    ingredients: ['Dragonfruit', 'Sugar', 'Water'],
    description: 'Exotic frozen dessert with mysterious protective properties.'
  },
  {
    id: 'blueberry-ice',
    name: 'Blueberry Ice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/blueberry-ice.png',
    ingredients: ['Blueberry', 'Sugar', 'Water'],
    description: 'Healthy blue ice with protective antioxidant properties.'
  },
  {
    id: 'pineapple-coconut-ice',
    name: 'Pineapple-Coconut Ice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-coconut-ice.png',
    ingredients: ['Pineapple', 'Coconut', 'Sugar'],
    description: 'Tropical frozen treat that protects from heat and boosts allies.'
  },

  // Drinks
  {
    id: 'lemonade',
    name: 'Lemonade',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lemonade.png',
    ingredients: ['Lemon', 'Sugar', 'Water'],
    description: 'Classic refreshing lemon drink perfect for hot days.'
  },
  {
    id: 'limeade',
    name: 'Limeade',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/limeade.png',
    ingredients: ['Lime', 'Sugar', 'Water'],
    description: 'Refreshing lime drink that hydrates the team and cleanses debuffs.'
  },
  {
    id: 'orangeade',
    name: 'Orangeade',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orangeade.png',
    ingredients: ['Orange', 'Sugar', 'Water'],
    description: 'Energizing orange drink that provides lasting vitamin enhancement.'
  },
  {
    id: 'grape-juice',
    name: 'Grape Juice',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-juice.png',
    ingredients: ['Grape', 'Sugar', 'Water'],
    description: 'Rich grape juice packed with antioxidants and debuff resistance.'
  },

  // Salsas
  {
    id: 'classic-pico',
    name: 'Classic Pico de Gallo',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/classic-pico.png',
    ingredients: ['Tomato', 'Onion', 'Jalapeño'],
    description: 'Classic fresh salsa that gets stronger with more vegetables nearby.'
  },
  {
    id: 'pineapple-chili-salsa',
    name: 'Pineapple-Chili Salsa',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-chili-salsa.png',
    ingredients: ['Pineapple', 'Chili Pepper', 'Lime'],
    description: 'Spicy tropical salsa that burns enemies and feeds off fire damage.'
  },
  {
    id: 'green-chile-salsa',
    name: 'Green Chile Salsa',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/green-chile-salsa.png',
    ingredients: ['Green Chile Pepper', 'Onion', 'Lime'],
    description: 'Gentle green salsa with mild heat and cleansing properties.'
  },
  {
    id: 'roasted-red-relish',
    name: 'Roasted Red Relish',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/roasted-red-relish.png',
    ingredients: ['Red Bell Pepper', 'Onion', 'Sugar'],
    description: 'Sweet roasted relish that enhances nearby items with smoky flavor.'
  },
  {
    id: 'avocado-salsa-verde',
    name: 'Avocado Salsa Verde',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-salsa-verde.png',
    ingredients: ['Avocado', 'Green Chile Pepper', 'Lime'],
    description: 'Creamy green salsa that shields allies and reduces debuff damage.'
  },

  // Savory Sauces
  {
    id: 'quick-marinara',
    name: 'Quick Marinara',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/quick-marinara.png',
    ingredients: ['Tomato', 'Garlic', 'Basil'],
    description: 'Classic tomato sauce that intensifies and enhances other dishes.'
  },
  {
    id: 'cajun-tomato-base',
    name: 'Cajun Tomato Base',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cajun-tomato-base.png',
    ingredients: ['Tomato', 'Onion', 'Cajun Spice'],
    description: 'Spicy Louisiana-style base that gets stronger when enemies suffer.'
  },
  {
    id: 'pepper-trinity',
    name: 'Pepper Trinity',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-trinity.png',
    ingredients: ['Green Bell Pepper', 'Onion', 'Cajun Spice'],
    description: 'Sacred Louisiana cooking base that elevates the entire team.'
  },

  // Flatbreads
  {
    id: 'garlic-herb-flatbread',
    name: 'Garlic Herb Flatbread',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/garlic-herb-flatbread.png',
    ingredients: ['Dough', 'Garlic', 'Basil'],
    description: 'Rustic flatbread with garlic and fresh herbs that boosts nearby allies.'
  },
  {
    id: 'tomato-basil-flatbread',
    name: 'Tomato Basil Flatbread',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-basil-flatbread.png',
    ingredients: ['Dough', 'Tomato', 'Basil'],
    description: 'Mediterranean-style bread with tomato and basil that creates herb synergies.'
  },
  {
    id: 'tri-bell-pepper-flatbread',
    name: 'Tri-Bell Pepper Flatbread',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tri-bell-pepper-flatbread.png',
    ingredients: ['Dough', 'Green Bell Pepper', 'Red Bell Pepper'],
    description: 'Colorful flatbread that gets stronger with pepper variety.'
  },
  {
    id: 'pepper-onion-flatbread',
    name: 'Pepper & Onion Flatbread',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-onion-flatbread.png',
    ingredients: ['Dough', 'Onion', 'Red Onion'],
    description: 'Savory flatbread with caramelized onions and peppers.'
  },

  // Fruit Tarts
  {
    id: 'apple-tart',
    name: 'Apple Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
    ingredients: ['Dough', 'Sugar', 'Apple'],
    description: 'Elegant French apple tart with perfectly arranged slices.'
  },
  {
    id: 'golden-apple-tart',
    name: 'Golden Apple Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
    ingredients: ['Dough', 'Sugar', 'Golden Apple'],
    description: 'Premium tart made with magical golden apples and expert pastry craft.'
  },
  {
    id: 'green-apple-tart',
    name: 'Green Apple Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
    ingredients: ['Dough', 'Sugar', 'Green Apple'],
    description: 'Balanced tart with tart green apples and sweet pastry.'
  },
  {
    id: 'strawberry-tart',
    name: 'Strawberry Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
    ingredients: ['Dough', 'Sugar', 'Strawberry'],
    description: 'Delightful tart showcasing fresh strawberries on buttery pastry.'
  },
  {
    id: 'blueberry-tart',
    name: 'Blueberry Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
    ingredients: ['Dough', 'Sugar', 'Blueberry'],
    description: 'Healthy tart packed with antioxidant-rich blueberries.'
  },
  {
    id: 'blackberry-tart',
    name: 'Blackberry Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
    ingredients: ['Dough', 'Sugar', 'Blackberry'],
    description: 'Rich tart with dark blackberries that grows stronger when threatened.'
  },
  {
    id: 'raspberry-tart',
    name: 'Raspberry Tart',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
    ingredients: ['Dough', 'Sugar', 'Raspberry'],
    description: 'Sophisticated tart with complex raspberry flavors and buttery crust.'
  },

  // Compotes
  {
    id: 'apple-compote',
    name: 'Apple Compote',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-compote.png',
    ingredients: ['Apple', 'Sugar', 'Nutmeg'],
    description: 'Comforting spiced apple compote that warms the entire team.'
  },
  {
    id: 'golden-apple-compote',
    name: 'Golden Apple Compote',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/golden-apple-compote.png',
    ingredients: ['Golden Apple', 'Sugar', 'Nutmeg'],
    description: 'Premium compote with magical golden apples and enchanting warmth.'
  },

  // Jams & Preserves
  {
    id: 'cherry-jam',
    name: 'Cherry Jam',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cherry-jam.png',
    ingredients: ['Cherry', 'Sugar', 'Lemon'],
    description: 'Classic cherry preserve with bright lemon notes for balance.'
  },
  {
    id: 'mixed-berry-jam',
    name: 'Mixed Berry Jam',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/mixed-berry-jam.png',
    ingredients: ['Blueberry', 'Blackberry', 'Sugar'],
    description: 'Rich preserve combining multiple berry varieties for complex flavors.'
  },
  {
    id: 'strawberry-jam',
    name: 'Strawberry Jam',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/strawberry-jam.png',
    ingredients: ['Strawberry', 'Sugar', 'Lemon'],
    description: 'Traditional strawberry jam that pairs perfectly with bread items.'
  },
  {
    id: 'grape-jelly',
    name: 'Grape Jelly',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-jelly.png',
    ingredients: ['Grape', 'Sugar', 'Water'],
    description: 'Pure grape jelly with smooth texture and concentrated flavor.'
  },
  {
    id: 'orange-marmalade',
    name: 'Orange Marmalade',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orange-marmalade.png',
    ingredients: ['Orange', 'Sugar', 'Lemon'],
    description: 'British-style marmalade with bitter orange peel adding complexity.'
  },
  {
    id: 'kiwi-lime-jam',
    name: 'Kiwi-Lime Jam',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/kiwi-lime-jam.png',
    ingredients: ['Kiwi', 'Lime', 'Sugar'],
    description: 'Exotic jam combining tropical kiwi with zesty lime for unique flavors.'
  },
  {
    id: 'pineapple-preserves',
    name: 'Pineapple Preserves',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-preserves.png',
    ingredients: ['Pineapple', 'Sugar', 'Lemon'],
    description: 'Chunky pineapple preserve with natural enzymes and tropical sweetness.'
  },

  // Hummus Recipes
  {
    id: 'hummus',
    name: 'Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/hummus.png',
    ingredients: ['Chickpeas', 'Garlic', 'Lemon'],
    description: 'Classic Middle Eastern chickpea dip with garlic and lemon that protects allies.'
  },
  {
    id: 'pepper-hummus',
    name: 'Pepper Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-hummus.png',
    ingredients: ['Chickpeas', 'Red Bell Pepper', 'Garlic'],
    description: 'Spicy red pepper hummus that inflicts burning debuffs on enemies.'
  },
  {
    id: 'jalapeno-lime-hummus',
    name: 'Jalapeño-Lime Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/jalapeno-lime-hummus.png',
    ingredients: ['Chickpeas', 'Jalapeño', 'Lime'],
    description: 'Zesty hummus with jalapeño heat that affects battle tempo.'
  },
  {
    id: 'avocado-hummus',
    name: 'Avocado Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-hummus.png',
    ingredients: ['Chickpeas', 'Avocado', 'Lime'],
    description: 'Creamy green hummus enriched with fresh avocado for protection.'
  },
  {
    id: 'herb-hummus',
    name: 'Herb Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/herb-hummus.png',
    ingredients: ['Chickpeas', 'Basil', 'Garlic'],
    description: 'Aromatic hummus infused with fresh basil that gains power from vegetables.'
  },
  {
    id: 'pumpkin-nutmeg-hummus',
    name: 'Pumpkin-Nutmeg Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-nutmeg-hummus.png',
    ingredients: ['Chickpeas', 'Pumpkin', 'Nutmeg'],
    description: 'Seasonal hummus with roasted pumpkin and warm nutmeg spice.'
  },
  {
    id: 'coconut-lime-hummus',
    name: 'Coconut-Lime Hummus',
    image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-lime-hummus.png',
    ingredients: ['Chickpeas', 'Coconut', 'Lime'],
    description: 'Tropical hummus with coconut richness and lime zest that protects from fire.'
  }
];



export default function Cookbook({ discoveredItems, discoveredRecipes }: CookbookProps) {
  const discoveredItemData = ALL_ITEMS.filter(item => 
    discoveredItems.includes(item.id)
  );

  const discoveredRecipeData = ALL_RECIPES.filter(recipe => 
    discoveredRecipes.includes(recipe.id)
  );

  const undiscoveredItemCount = ALL_ITEMS.length - discoveredItemData.length;
  const undiscoveredRecipeCount = ALL_RECIPES.length - discoveredRecipeData.length;

  // Group items by category
  const itemsByCategory = discoveredItemData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof discoveredItemData>);

  const categoryOrder = ['Fruit', 'Berry', 'Citrus', 'Veggie', 'Grain', 'Legume', 'Spice', 'Special', 'Dish'];

  return (
    <div className="bg-purple-900 border-4 border-purple-800 rounded-lg p-4 pixel-shadow relative">
      <InfoButton
        title="Battle Cookbook"
        description="Your complete collection of discovered items and their battle abilities! Each item shows its stats and special powers for arena combat. Items are unlocked by having them in your inventory at least once."
      />
      <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Battle Cookbook</h2>
      
      <div className="mb-4 text-center">
        <p className="text-purple-200 text-sm pixel-text">
          Items Discovered: {discoveredItemData.length}/{ALL_ITEMS.length} • Recipes Learned: {discoveredRecipeData.length}/{ALL_RECIPES.length}
        </p>
        {(undiscoveredItemCount > 0 || undiscoveredRecipeCount > 0) && (
          <p className="text-purple-300 text-xs pixel-text opacity-80 mt-1">
            {undiscoveredItemCount > 0 && `${undiscoveredItemCount} items`}
            {undiscoveredItemCount > 0 && undiscoveredRecipeCount > 0 && ' and '}
            {undiscoveredRecipeCount > 0 && `${undiscoveredRecipeCount} recipes`}
            {' still waiting to be discovered...'}
          </p>
        )}
      </div>

      {discoveredItemData.length === 0 && discoveredRecipeData.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-purple-200 font-bold text-lg pixel-text mb-2">
            Empty Battle Cookbook
          </h3>
          <p className="text-purple-300 text-sm pixel-text leading-relaxed max-w-md mx-auto">
            Start collecting items and crafting recipes to discover their battle abilities! Items unlock when obtained, recipes unlock when crafted or learned.
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Discovered Recipes Section */}
          {discoveredRecipeData.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-yellow-100 font-bold text-sm pixel-text border-b border-yellow-700 pb-1">
                📜 Discovered Recipes ({discoveredRecipeData.length})
              </h3>
              
              <div className="space-y-3">
                {discoveredRecipeData.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-yellow-800 border-2 border-yellow-600 rounded-lg p-3 pixel-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-12 h-12 pixel-item rounded flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-sm pixel-text mb-1">
                          {recipe.name}
                        </h4>
                        
                        <div className="mb-2">
                          <span className="text-yellow-200 text-xs pixel-text bg-yellow-900 px-2 py-1 rounded">
                            {recipe.ingredients.join(' + ')}
                          </span>
                        </div>
                        
                        <p className="text-yellow-100 text-xs pixel-text leading-relaxed">
                          {recipe.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          

          {/* Discovered Items Section */}
          {discoveredItemData.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-purple-100 font-bold text-sm pixel-text border-b border-purple-700 pb-1">
                🥗 Battle Ingredients ({discoveredItemData.length})
              </h3>
            </div>
          )}

          {categoryOrder.map(category => {
            const categoryItems = itemsByCategory[category];
            if (!categoryItems || categoryItems.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h4 className="text-purple-200 font-bold text-xs pixel-text border-b border-purple-800 pb-1 ml-4">
                  {category}s ({categoryItems.length})
                </h4>
                
                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-purple-700 border-2 border-purple-600 rounded-lg p-3 pixel-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 pixel-item rounded flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm pixel-text mb-1">
                            {item.name}
                          </h4>
                          
                          <div className="mb-2">
                            <span className="text-purple-200 text-xs pixel-text bg-purple-800 px-2 py-1 rounded">
                              {item.baseStats}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <p className="text-yellow-200 text-xs pixel-text leading-relaxed font-semibold">
                              Ability: {item.ability}
                            </p>
                          </div>
                          
                          <p className="text-purple-200 text-xs pixel-text leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-purple-200 text-xs pixel-text opacity-80 leading-relaxed">
          Plan your battle strategy • Items and recipes stay discovered forever • Check adjacency bonuses for synergies
        </p>
        <p className="text-purple-300 text-xs pixel-text opacity-60 mt-1">
          Pro tip: Craft recipes in the kitchen or learn them with 3 gold to unlock powerful dishes for battle
        </p>
      </div>
    </div>
  );
}
