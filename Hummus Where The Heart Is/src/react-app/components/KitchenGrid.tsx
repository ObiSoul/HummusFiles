interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number;
  dayObtained?: number;
}

interface KitchenGridProps {
  kitchenSlots: (InventoryItem | null)[];
  selectedSlotIndex?: number | null;
  onSlotClick?: (item: InventoryItem | null, index: number) => void;
  onItemHold?: (item: InventoryItem | null, index: number, event: React.MouseEvent) => void;
  onTakeResult?: (resultItem: InventoryItem, recipeId: string) => void;
  onAddWater?: () => void;
  
  platformType?: 'desktop' | 'mobile';
  onDrop?: (dragData: any, targetIndex: number) => void;
}

import InfoButton from './InfoButton';
import { useState, useRef } from 'react';

export default function KitchenGrid({ kitchenSlots, selectedSlotIndex, onSlotClick, onItemHold, onTakeResult, onAddWater, platformType = 'mobile', onDrop }: KitchenGridProps) {
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const holdStartTime = useRef<number>(0);
  
  
  const handleEmptySlotHold = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (index < 3) {
      const tooltip = "Empty Kitchen Slot - Place ingredients here to create recipes! Use Add Water button to add water. Try combining water + wheat = dough, or apple + dough + sugar = apple pie!";
      alert(tooltip);
    }
  };

  const handleMouseDown = (item: InventoryItem | null, index: number, event: React.MouseEvent) => {
    holdStartTime.current = Date.now();
    const timer = setTimeout(() => {
      if (item) {
        onItemHold?.(item, index, event);
      } else {
        handleEmptySlotHold(index, event);
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

  const handleAddWater = () => {
    // Call the parent's add water handler
    onAddWater?.();
  };

  const handleClick = (item: InventoryItem | null, index: number) => {
    // Only trigger click if it wasn't a long hold
    const holdDuration = Date.now() - holdStartTime.current;
    if (holdDuration < 500) {
      // Pass the actual item (including water) to the parent handler
      onSlotClick?.(item, index);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (platformType === 'desktop' && index < 3) {
      e.preventDefault();
      // Check if dragged item is valid for kitchen (no seeds)
      try {
        const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
        if (!dragData.item.id.endsWith('-seeds')) {
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
    if (platformType === 'desktop' && index < 3) {
      e.preventDefault();
      try {
        const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
        // Validate that seeds can't go in kitchen
        if (!dragData.item.id.endsWith('-seeds')) {
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
        sourceType: 'kitchen',
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
  // Check for recipes
  const getRecipeResult = (): { item: InventoryItem; recipeId: string } | null => {
    const ingredients = kitchenSlots.slice(0, 3).filter(item => item !== null);
    
    // Helper function to check for specific ingredient combinations
    const hasIngredients = (requiredIds: string[]) => {
      return requiredIds.every(id => ingredients.some(item => item?.id === id)) && ingredients.length >= requiredIds.length;
    };

    // Veg & Legume Recipes
    if (hasIngredients(['soybean', 'garlic', 'cajun'])) {
      return {
        item: {
          id: 'cajun-garlic-soybeans',
          name: 'Cajun Garlic Soybeans',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cajun-garlic-soybeans.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'cajun-garlic-soybeans'
      };
    }

    if (hasIngredients(['soybean', 'lime'])) {
      return {
        item: {
          id: 'lime-edamame',
          name: 'Lime Edamame',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lime-edamame.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'lime-edamame'
      };
    }

    if (hasIngredients(['eggplant', 'tomato', 'garlic'])) {
      return {
        item: {
          id: 'eggplant-tomato-bake',
          name: 'Eggplant & Tomato Bake',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/eggplant-tomato-bake.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'eggplant-tomato-bake'
      };
    }

    if (hasIngredients(['eggplant', 'chili-pepper', 'garlic'])) {
      return {
        item: {
          id: 'chili-garlic-eggplant',
          name: 'Chili-Garlic Eggplant',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/chili-garlic-eggplant.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'chili-garlic-eggplant'
      };
    }

    if (hasIngredients(['pumpkin', 'water', 'garlic'])) {
      return {
        item: {
          id: 'pumpkin-soup',
          name: 'Pumpkin Soup',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-soup.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'pumpkin-soup'
      };
    }

    if (hasIngredients(['pumpkin', 'sugar', 'nutmeg'])) {
      return {
        item: {
          id: 'spiced-pumpkin-puree',
          name: 'Spiced Pumpkin Purée',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/spiced-pumpkin-puree.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'spiced-pumpkin-puree'
      };
    }

    // Salads / Cold Recipes
    if (hasIngredients(['avocado', 'lime', 'onion'])) {
      return {
        item: {
          id: 'guacamole',
          name: 'Guacamole',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/guacamole.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'guacamole'
      };
    }

    if (hasIngredients(['avocado', 'tomato', 'red-onion'])) {
      return {
        item: {
          id: 'avocado-tomato-salad',
          name: 'Avocado-Tomato Salad',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-tomato-salad.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'avocado-tomato-salad'
      };
    }

    if (hasIngredients(['watermelon', 'basil', 'lime'])) {
      return {
        item: {
          id: 'watermelon-basil-salad',
          name: 'Watermelon Basil Salad',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-basil-salad.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'watermelon-basil-salad'
      };
    }

    // Sweets Recipes
    if (hasIngredients(['banana', 'sugar'])) {
      return {
        item: {
          id: 'caramelized-banana',
          name: 'Caramelized Banana',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/caramelized-banana.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'caramelized-banana'
      };
    }

    if (hasIngredients(['coconut', 'sugar', 'water'])) {
      return {
        item: {
          id: 'coconut-snow',
          name: 'Coconut Snow',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-snow.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'coconut-snow'
      };
    }

    if (hasIngredients(['orange', 'sugar', 'water'])) {
      return {
        item: {
          id: 'candied-orange-peel',
          name: 'Candied Orange Peel',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-orange-peel.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'candied-orange-peel'
      };
    }

    if (hasIngredients(['jalapeno', 'sugar', 'water'])) {
      return {
        item: {
          id: 'candied-jalapenos',
          name: 'Candied Jalapeños',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/candied-jalapenos.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'candied-jalapenos'
      };
    }

    if (hasIngredients(['red-onion', 'lime', 'water'])) {
      return {
        item: {
          id: 'quick-pickled-onions',
          name: 'Quick-Pickled Onions',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/quick-pickled-onions.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'quick-pickled-onions'
      };
    }

    // Frozen Treats
    if (hasIngredients(['watermelon', 'lime', 'sugar'])) {
      return {
        item: {
          id: 'watermelon-lime-granita',
          name: 'Watermelon-Lime Granita',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/watermelon-lime-granita.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'watermelon-lime-granita'
      };
    }

    if (hasIngredients(['dragonfruit', 'sugar', 'water'])) {
      return {
        item: {
          id: 'dragonfruit-sorbet',
          name: 'Dragonfruit Sorbet',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dragonfruit-sorbet.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'dragonfruit-sorbet'
      };
    }

    if (hasIngredients(['blueberry', 'sugar', 'water'])) {
      return {
        item: {
          id: 'blueberry-ice',
          name: 'Blueberry Ice',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/blueberry-ice.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'blueberry-ice'
      };
    }

    if (hasIngredients(['pineapple', 'coconut', 'sugar'])) {
      return {
        item: {
          id: 'pineapple-coconut-ice',
          name: 'Pineapple-Coconut Ice',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-coconut-ice.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'pineapple-coconut-ice'
      };
    }

    // Drinks
    if (hasIngredients(['lemon', 'sugar', 'water'])) {
      return {
        item: {
          id: 'lemonade',
          name: 'Lemonade',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/lemonade.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'lemonade'
      };
    }

    if (hasIngredients(['lime', 'sugar', 'water'])) {
      return {
        item: {
          id: 'limeade',
          name: 'Limeade',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/limeade.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'limeade'
      };
    }

    if (hasIngredients(['orange', 'sugar', 'water'])) {
      return {
        item: {
          id: 'orangeade',
          name: 'Orangeade',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orangeade.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'orangeade'
      };
    }

    if (hasIngredients(['grape', 'sugar', 'water'])) {
      return {
        item: {
          id: 'grape-juice',
          name: 'Grape Juice',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-juice.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'grape-juice'
      };
    }

    // Salsas
    if (hasIngredients(['tomato', 'onion', 'jalapeno'])) {
      return {
        item: {
          id: 'classic-pico',
          name: 'Classic Pico de Gallo',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/classic-pico.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'classic-pico'
      };
    }

    if (hasIngredients(['pineapple', 'chili-pepper', 'lime'])) {
      return {
        item: {
          id: 'pineapple-chili-salsa',
          name: 'Pineapple-Chili Salsa',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-chili-salsa.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'pineapple-chili-salsa'
      };
    }

    if (hasIngredients(['green-chile-pepper', 'onion', 'lime'])) {
      return {
        item: {
          id: 'green-chile-salsa',
          name: 'Green Chile Salsa',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/green-chile-salsa.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'green-chile-salsa'
      };
    }

    if (hasIngredients(['red-bell-pepper', 'onion', 'sugar'])) {
      return {
        item: {
          id: 'roasted-red-relish',
          name: 'Roasted Red Relish',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/roasted-red-relish.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'roasted-red-relish'
      };
    }

    if (hasIngredients(['avocado', 'green-chile-pepper', 'lime'])) {
      return {
        item: {
          id: 'avocado-salsa-verde',
          name: 'Avocado Salsa Verde',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-salsa-verde.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'avocado-salsa-verde'
      };
    }

    // Savory Sauces
    if (hasIngredients(['tomato', 'garlic', 'basil'])) {
      return {
        item: {
          id: 'quick-marinara',
          name: 'Quick Marinara',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/quick-marinara.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'quick-marinara'
      };
    }

    if (hasIngredients(['tomato', 'onion', 'cajun'])) {
      return {
        item: {
          id: 'cajun-tomato-base',
          name: 'Cajun Tomato Base',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cajun-tomato-base.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'cajun-tomato-base'
      };
    }

    if (hasIngredients(['green-bell-pepper', 'onion', 'cajun'])) {
      return {
        item: {
          id: 'pepper-trinity',
          name: 'Pepper Trinity',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-trinity.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'pepper-trinity'
      };
    }

    // Flatbreads
    if (hasIngredients(['dough', 'garlic', 'basil'])) {
      return {
        item: {
          id: 'garlic-herb-flatbread',
          name: 'Garlic Herb Flatbread',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/garlic-herb-flatbread.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'garlic-herb-flatbread'
      };
    }

    if (hasIngredients(['dough', 'tomato', 'basil'])) {
      return {
        item: {
          id: 'tomato-basil-flatbread',
          name: 'Tomato Basil Flatbread',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-basil-flatbread.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'tomato-basil-flatbread'
      };
    }

    if (hasIngredients(['dough', 'green-bell-pepper', 'red-bell-pepper']) || 
        hasIngredients(['dough', 'green-bell-pepper', 'yellow-bell-pepper'])) {
      return {
        item: {
          id: 'tri-bell-pepper-flatbread',
          name: 'Tri-Bell Pepper Flatbread',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tri-bell-pepper-flatbread.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'tri-bell-pepper-flatbread'
      };
    }

    if (hasIngredients(['dough', 'onion', 'red-onion'])) {
      return {
        item: {
          id: 'pepper-onion-flatbread',
          name: 'Pepper & Onion Flatbread',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-onion-flatbread.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'pepper-onion-flatbread'
      };
    }

    // Fruit Tarts - Apple varieties
    if (hasIngredients(['dough', 'sugar', 'apple'])) {
      return {
        item: {
          id: 'apple-tart',
          name: 'Apple Tart',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'apple-tart'
      };
    }

    if (hasIngredients(['dough', 'sugar', 'golden-apple'])) {
      return {
        item: {
          id: 'golden-apple-tart',
          name: 'Golden Apple Tart',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'golden-apple-tart'
      };
    }

    if (hasIngredients(['dough', 'sugar', 'green-apple'])) {
      return {
        item: {
          id: 'green-apple-tart',
          name: 'Green Apple Tart',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-tart.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'green-apple-tart'
      };
    }

    // Fruit Tarts - Berry varieties
    if (hasIngredients(['dough', 'sugar', 'strawberry'])) {
      return {
        item: {
          id: 'strawberry-tart',
          name: 'Strawberry Tart',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'strawberry-tart'
      };
    }

    if (hasIngredients(['dough', 'sugar', 'blueberry'])) {
      return {
        item: {
          id: 'blueberry-tart',
          name: 'Blueberry Tart',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'blueberry-tart'
      };
    }

    if (hasIngredients(['dough', 'sugar', 'blackberry'])) {
      return {
        item: {
          id: 'blackberry-tart',
          name: 'Blackberry Tart',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'blackberry-tart'
      };
    }

    if (hasIngredients(['dough', 'sugar', 'raspberry'])) {
      return {
        item: {
          id: 'raspberry-tart',
          name: 'Raspberry Tart',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/berry-tart.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'raspberry-tart'
      };
    }

    // Compotes
    if (hasIngredients(['apple', 'sugar', 'nutmeg'])) {
      return {
        item: {
          id: 'apple-compote',
          name: 'Apple Compote',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-compote.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'apple-compote'
      };
    }

    if (hasIngredients(['golden-apple', 'sugar', 'nutmeg'])) {
      return {
        item: {
          id: 'golden-apple-compote',
          name: 'Golden Apple Compote',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/golden-apple-compote.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'golden-apple-compote'
      };
    }

    // Jams & Preserves
    if (hasIngredients(['cherry', 'sugar', 'lemon'])) {
      return {
        item: {
          id: 'cherry-jam',
          name: 'Cherry Jam',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/cherry-jam.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'cherry-jam'
      };
    }

    if (hasIngredients(['blueberry', 'blackberry', 'sugar'])) {
      return {
        item: {
          id: 'mixed-berry-jam',
          name: 'Mixed Berry Jam',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/mixed-berry-jam.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'mixed-berry-jam'
      };
    }

    if (hasIngredients(['strawberry', 'sugar', 'lemon'])) {
      return {
        item: {
          id: 'strawberry-jam',
          name: 'Strawberry Jam',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/strawberry-jam.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'strawberry-jam'
      };
    }

    if (hasIngredients(['grape', 'sugar', 'water'])) {
      return {
        item: {
          id: 'grape-jelly',
          name: 'Grape Jelly',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/grape-jelly.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'grape-jelly'
      };
    }

    if (hasIngredients(['orange', 'sugar', 'lemon'])) {
      return {
        item: {
          id: 'orange-marmalade',
          name: 'Orange Marmalade',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/orange-marmalade.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'orange-marmalade'
      };
    }

    if (hasIngredients(['kiwi', 'lime', 'sugar'])) {
      return {
        item: {
          id: 'kiwi-lime-jam',
          name: 'Kiwi-Lime Jam',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/kiwi-lime-jam.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'kiwi-lime-jam'
      };
    }

    if (hasIngredients(['pineapple', 'sugar', 'lemon'])) {
      return {
        item: {
          id: 'pineapple-preserves',
          name: 'Pineapple Preserves',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pineapple-preserves.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'pineapple-preserves'
      };
    }

    // Hummus Recipes
    if (hasIngredients(['chickpeas', 'garlic', 'lemon'])) {
      return {
        item: {
          id: 'hummus',
          name: 'Hummus',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/hummus.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'hummus'
      };
    }

    if (hasIngredients(['chickpeas', 'red-bell-pepper', 'garlic'])) {
      return {
        item: {
          id: 'pepper-hummus',
          name: 'Pepper Hummus',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pepper-hummus.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'pepper-hummus'
      };
    }

    if (hasIngredients(['chickpeas', 'jalapeno', 'lime'])) {
      return {
        item: {
          id: 'jalapeno-lime-hummus',
          name: 'Jalapeño-Lime Hummus',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/jalapeno-lime-hummus.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'jalapeno-lime-hummus'
      };
    }

    if (hasIngredients(['chickpeas', 'avocado', 'lime'])) {
      return {
        item: {
          id: 'avocado-hummus',
          name: 'Avocado Hummus',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/avocado-hummus.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'avocado-hummus'
      };
    }

    if (hasIngredients(['chickpeas', 'basil', 'garlic'])) {
      return {
        item: {
          id: 'herb-hummus',
          name: 'Herb Hummus',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/herb-hummus.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'herb-hummus'
      };
    }

    if (hasIngredients(['chickpeas', 'pumpkin', 'nutmeg'])) {
      return {
        item: {
          id: 'pumpkin-nutmeg-hummus',
          name: 'Pumpkin-Nutmeg Hummus',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/pumpkin-nutmeg-hummus.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'pumpkin-nutmeg-hummus'
      };
    }

    if (hasIngredients(['chickpeas', 'coconut', 'lime'])) {
      return {
        item: {
          id: 'coconut-lime-hummus',
          name: 'Coconut-Lime Hummus',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/coconut-lime-hummus.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'coconut-lime-hummus'
      };
    }

    // Original Recipes
    if (hasIngredients(['apple', 'dough', 'sugar'])) {
      return {
        item: {
          id: 'apple-pie',
          name: 'Apple Pie',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/apple-pie.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'apple-pie'
      };
    }
    
    if (hasIngredients(['tomato', 'basil', 'water'])) {
      return {
        item: {
          id: 'tomato-soup',
          name: 'Tomato Soup',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/tomato-soup.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'tomato-soup'
      };
    }
    
    if (hasIngredients(['water', 'wheat'])) {
      return {
        item: {
          id: 'dough',
          name: 'Dough',
          image: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/dough.png',
          quantity: 1, spoilageLevel: 0, dayObtained: 1
        },
        recipeId: 'dough'
      };
    }
    
    return null;
  };

  

  const recipeResult = getRecipeResult();
  return (
    <div className="bg-orange-900 border-4 border-orange-800 rounded-lg p-4 pixel-shadow relative">
      <InfoButton
        title="Kitchen"
        description="Combine ingredients to create delicious dishes! Use Add Water button to add water. Try water + wheat = dough, or apple + dough + sugar = apple pie! Click the result to take it to your inventory."
      />
      <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Kitchen</h2>
      
      <div className="flex items-center justify-center gap-4">
        {/* Ingredient Slots */}
        <div className="flex items-center gap-2">
          {kitchenSlots.slice(0, 3).map((item, index) => (
            <div key={index}>
              <div
                className={`aspect-square w-16 h-16 md:w-20 md:h-20 bg-orange-700 border-2 rounded cursor-pointer hover:bg-orange-600 transition-colors flex items-center justify-center pixel-slot ${
                  selectedSlotIndex === index
                    ? 'border-yellow-400 border-4 bg-yellow-100'
                    : 'border-orange-600'
                }`}
                onClick={() => handleClick(item, index)}
                onMouseDown={(e) => handleMouseDown(item, index, e)}
                onMouseUp={handleMouseUp}
                onContextMenu={(e) => handleRightClick(e, item, index)}
                onMouseEnter={(e) => handleMouseEnter(e, item, index)}
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
              </div>
              <p className="text-orange-200 text-xs pixel-text mt-1 text-center">
                Slot {index + 1}
              </p>
            </div>
          ))}
        </div>

        {/* Plus Signs */}
        <div className="text-orange-200 text-2xl pixel-text">+</div>

        {/* Equals Sign */}
        <div className="text-orange-200 text-2xl pixel-text">=</div>

        {/* Result Slot */}
        <div>
          <div 
            className={`aspect-square w-16 h-16 md:w-20 md:h-20 bg-orange-600 border-2 border-orange-500 rounded flex items-center justify-center pixel-slot ${
              recipeResult ? 'opacity-100 cursor-pointer hover:bg-orange-500' : 'opacity-50'
            }`}
            onClick={() => recipeResult && onTakeResult?.(recipeResult.item, recipeResult.recipeId)}
          >
            {recipeResult ? (
              <div className="relative w-full h-full">
                <img
                  src={recipeResult.item.image}
                  alt={recipeResult.item.name}
                  className="w-full h-full object-cover rounded pixel-item"
                />
              </div>
            ) : (
              <span className="text-orange-400 text-xs pixel-text">?</span>
            )}
          </div>
          <p className="text-orange-200 text-xs pixel-text mt-1 text-center">
            Result
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-orange-200 text-xs pixel-text opacity-80 leading-relaxed">
          Use "Add Water" button below to add water • Try: Water + Wheat = Dough | Apple + Dough + Sugar = Apple Pie | Tomato + Basil + Water = Tomato Soup
        </p>
        <p className="text-orange-300 text-xs pixel-text opacity-60 mt-1">
          Click items to move them back to inventory • Click water to remove it • Click result to take it and discover recipe!
        </p>
      </div>

      {/* Add Water Button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleAddWater}
          disabled={kitchenSlots.slice(0, 3).every(item => item !== null) || !onAddWater}
          className={`font-bold text-sm px-6 py-3 rounded transition-colors pixel-button pixel-text border-2 ${
            kitchenSlots.slice(0, 3).some(item => item === null) && onAddWater
              ? 'bg-blue-600 hover:bg-blue-500 border-blue-800 text-white cursor-pointer'
              : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed opacity-50'
          }`}
        >
          {kitchenSlots.slice(0, 3).some(item => item === null) ? '💧 Add Water' : 'All Slots Full'}
        </button>
        <p className="text-blue-200 text-xs pixel-text mt-2 opacity-80">
          Adds water to the next empty kitchen slot automatically
        </p>
      </div>

      {/* Library Info */}
      <div className="mt-4 text-center">
        <div className="bg-indigo-800 border-2 border-indigo-600 rounded-lg p-3">
          <p className="text-indigo-200 text-xs pixel-text font-bold mb-1">
            📚 Looking for specific recipes?
          </p>
          <p className="text-indigo-300 text-xs pixel-text">
            Visit the Library tab for daily themed recipe offers!
          </p>
        </div>
      </div>
    </div>
  );
}
