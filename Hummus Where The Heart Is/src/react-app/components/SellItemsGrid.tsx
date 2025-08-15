import { useState } from 'react';
import InfoButton from './InfoButton';

interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  spoilageLevel?: number;
  dayObtained?: number;
}

interface SellItemsGridProps {
  inventoryItems: (InventoryItem | null)[];
  gold: number;
  onSellItem: (itemIndex: number, sellPrice: number, quantityToSell?: number) => void;
  itemsSoldToday: number;
}

export default function SellItemsGrid({ inventoryItems, gold, onSellItem, itemsSoldToday }: SellItemsGridProps) {
  const [selectedSellSlot, setSelectedSellSlot] = useState<boolean>(false);
  const [confirmSell, setConfirmSell] = useState<{
    item: InventoryItem;
    index: number;
    price: number;
    selectedQuantity: number;
  } | null>(null);

  // Get sell price based on ingredient count for dishes
  const getSellPrice = (itemId: string): number => {
    // Two ingredient dishes sell for 11 gold each
    const twoIngredientDishes = [
      'dough', 'caramelized-banana', 'lime-edamame'
    ];
    
    // Three ingredient dishes sell for 15 gold each
    const threeIngredientDishes = [
      'apple-pie', 'tomato-soup', 'cajun-garlic-soybeans', 'eggplant-tomato-bake', 
      'chili-garlic-eggplant', 'pumpkin-soup', 'spiced-pumpkin-puree',
      'guacamole', 'avocado-tomato-salad', 'watermelon-basil-salad',
      'coconut-snow', 'candied-orange-peel', 'candied-jalapenos', 'quick-pickled-onions',
      'watermelon-lime-granita', 'dragonfruit-sorbet', 'blueberry-ice', 'pineapple-coconut-ice',
      'lemonade', 'limeade', 'orangeade', 'grape-juice', 'classic-pico', 'pineapple-chili-salsa',
      'green-chile-salsa', 'roasted-red-relish', 'avocado-salsa-verde', 'quick-marinara',
      'cajun-tomato-base', 'pepper-trinity', 'garlic-herb-flatbread', 'tomato-basil-flatbread',
      'tri-bell-pepper-flatbread', 'pepper-onion-flatbread', 'apple-tart', 'golden-apple-tart',
      'green-apple-tart', 'strawberry-tart', 'blueberry-tart', 'blackberry-tart', 'raspberry-tart',
      'apple-compote', 'golden-apple-compote', 'cherry-jam', 'mixed-berry-jam', 'strawberry-jam',
      'grape-jelly', 'orange-marmalade', 'kiwi-lime-jam', 'pineapple-preserves'
    ];
    
    if (twoIngredientDishes.includes(itemId)) {
      return 11; // Two ingredient dishes sell for 11 gold each
    }
    
    if (threeIngredientDishes.includes(itemId)) {
      return 15; // Three ingredient dishes sell for 15 gold each
    }
    
    // Spices sell for 50% of their purchase price
    const spicePrices: { [key: string]: number } = {
      'garlic': 2, // Sold for 1 gold (50% of 2)
      'nutmeg': 3, // Sold for 1.5 gold (50% of 3) - round to 2
      'basil': 2, // Sold for 1 gold (50% of 2)
      'sugar': 2, // Sold for 1 gold (50% of 2)
      'cajun': 4 // Sold for 2 gold (50% of 4)
    };
    
    if (spicePrices[itemId]) {
      return Math.round(spicePrices[itemId] * 0.5); // 50% of purchase price, rounded
    }
    
    // Grown crops sell for double their seed price
    const seedPrices: { [key: string]: number } = {
      'apple': 2, 'banana': 3, 'blackberry': 4, 'black-cherry': 5, 'blueberry': 3,
      'soybean': 4, 'grape': 4, 'cherry': 3, 'golden-apple': 6, 'dragonfruit': 7,
      'coconut': 5, 'kiwi': 4, 'lime': 3, 'green-grape': 4, 'green-apple': 2,
      'lemon': 3, 'strawberry': 3, 'raspberry': 4, 'watermelon': 5, 'pineapple': 6,
      'orange': 3, 'eggplant': 4, 'green-chile-pepper': 3, 'avocado': 5, 'chili-pepper': 4,
      'green-bell-pepper': 3, 'red-bell-pepper': 3, 'onion': 2, 'jalapeno': 4,
      'pumpkin': 6, 'red-onion': 3, 'tomato': 3, 'yellow-bell-pepper': 3, 'wheat': 4
    };
    
    return seedPrices[itemId] ? seedPrices[itemId] * 2 : 1; // Double the seed price
  };

  const canSellItem = (item: InventoryItem): boolean => {
    // Can't sell seeds or water, but can sell dishes, grown crops, and spices
    return !item.id.endsWith('-seeds') && item.id !== 'water';
  };

  const handleSellSlotClick = () => {
    setSelectedSellSlot(!selectedSellSlot);
  };

  const handleInventoryItemClick = (item: InventoryItem | null, index: number) => {
    if (!selectedSellSlot || !item || !canSellItem(item) || itemsSoldToday >= 6) return;
    
    const sellPrice = getSellPrice(item.id);
    
    setConfirmSell({
      item,
      index,
      price: sellPrice,
      selectedQuantity: 1
    });
  };

  const handleConfirmSell = () => {
    if (confirmSell) {
      onSellItem(confirmSell.index, confirmSell.price * confirmSell.selectedQuantity, confirmSell.selectedQuantity);
      setConfirmSell(null);
      setSelectedSellSlot(false);
    }
  };

  const handleCancelSell = () => {
    setConfirmSell(null);
  };

  return (
    <div className="bg-yellow-900 border-4 border-yellow-800 rounded-lg p-4 pixel-shadow relative">
      <InfoButton
        title="Sell Items"
        description="Turn your grown crops into gold! Click the sell slot to activate, then click any grown crop in your inventory to sell it. You can't sell seeds, spices, or special items. Sell price is double the original seed cost! Limited to 6 sales per day."
      />
      <h2 className="text-white font-bold text-xl pixel-text mb-4 text-center">Sell Items</h2>
      
      {/* Daily Sell Counter */}
      <div className="text-center mb-4">
        <div className="bg-yellow-800 border-2 border-yellow-700 rounded-lg p-2 inline-block">
          <span className="text-white font-bold text-sm pixel-text">
            Daily Sales: {itemsSoldToday}/6
          </span>
          {itemsSoldToday >= 6 && (
            <div className="text-red-300 text-xs pixel-text mt-1">
              Daily limit reached! Sleep to reset.
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4 text-center">
        <p className="text-yellow-200 text-sm pixel-text mb-3">
          Click the sell slot, then click an item in your inventory to sell it
        </p>
        
        {/* Sell Slot */}
        <div
          className={`w-20 h-20 mx-auto border-4 rounded transition-colors pixel-slot flex items-center justify-center ${
            itemsSoldToday >= 6
              ? 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
              : selectedSellSlot
              ? 'bg-yellow-600 border-yellow-400 pixel-glow cursor-pointer'
              : 'bg-yellow-700 hover:bg-yellow-600 border-yellow-600 cursor-pointer'
          }`}
          onClick={itemsSoldToday >= 6 ? undefined : handleSellSlotClick}
        >
          {itemsSoldToday >= 6 ? (
            <div className="text-center">
              <div className="text-2xl mb-1">🚫</div>
              <div className="text-gray-300 text-xs pixel-text">Full</div>
            </div>
          ) : selectedSellSlot ? (
            <div className="text-center">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-yellow-100 text-xs pixel-text font-bold">SELL</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl mb-1">🏪</div>
              <div className="text-yellow-200 text-xs pixel-text">Click</div>
            </div>
          )}
        </div>
        
        {selectedSellSlot && itemsSoldToday < 6 && (
          <p className="text-yellow-100 text-xs pixel-text mt-2 font-bold">
            Now click a grown crop in your inventory to sell it!
          </p>
        )}
        {itemsSoldToday >= 6 && (
          <p className="text-red-300 text-xs pixel-text mt-2 font-bold">
            Daily sell limit reached! Sleep to reset counter.
          </p>
        )}
      </div>

      {/* Current Gold Display */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 bg-amber-900 border-2 border-amber-700 rounded-lg p-2">
          <div className="w-5 h-5 pixel-coin"></div>
          <span className="text-white font-bold text-lg pixel-text">{gold}</span>
        </div>
      </div>

      {/* Inventory Grid for Reference */}
      <div className="grid grid-cols-5 gap-2">
        {inventoryItems.slice(0, 25).map((item, index) => (
          <div
            key={index}
            className={`aspect-square border-2 rounded transition-colors flex items-center justify-center pixel-slot ${
              item && canSellItem(item) && selectedSellSlot && itemsSoldToday < 6
                ? 'bg-yellow-600 hover:bg-yellow-500 border-yellow-400 cursor-pointer'
                : item && canSellItem(item) && itemsSoldToday < 6
                ? 'bg-yellow-700 border-yellow-600 cursor-pointer'
                : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
            }`}
            onClick={() => handleInventoryItemClick(item, index)}
          >
            {item && (
              <div className="relative w-full h-full">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded pixel-item"
                />
                {item.quantity > 1 && (
                  <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center pixel-quantity">
                    {item.quantity}
                  </div>
                )}
                {/* Spoilage overlay */}
                {item.spoilageLevel === 1 && (
                  <div className="absolute inset-0 bg-green-400 opacity-20 rounded pointer-events-none"></div>
                )}
                {item.spoilageLevel === 2 && (
                  <div className="absolute inset-0 bg-red-900 opacity-40 rounded pointer-events-none flex items-center justify-center">
                    <span className="text-red-200 text-lg">💀</span>
                  </div>
                )}
                {/* Show sell price overlay if sellable */}
                {canSellItem(item) && selectedSellSlot && itemsSoldToday < 6 && (
                  <div className="absolute top-0 left-0 bg-green-600 text-white text-xs font-bold pixel-text px-1 rounded-br">
                    {getSellPrice(item.id)}g
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmSell && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-6 pixel-shadow text-center max-w-sm mx-4">
            <h3 className="text-white font-bold text-lg pixel-text mb-4">
              Confirm Sale
            </h3>
            
            <div className="mb-6">
              <img
                src={confirmSell.item.image}
                alt={confirmSell.item.name}
                className="w-16 h-16 mx-auto mb-3 pixel-item"
              />
              
              {/* Quantity Selector */}
              <div className="mb-4">
                <p className="text-amber-200 pixel-text text-sm mb-2 text-center">
                  Select quantity to sell:
                </p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <button
                    onClick={() => setConfirmSell(prev => prev ? {
                      ...prev,
                      selectedQuantity: Math.max(1, prev.selectedQuantity - 1)
                    } : null)}
                    disabled={confirmSell.selectedQuantity <= 1}
                    className={`w-8 h-8 font-bold text-lg rounded transition-colors pixel-button pixel-text border-2 ${
                      confirmSell.selectedQuantity <= 1
                        ? 'bg-gray-500 border-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-500 border-red-800 text-white cursor-pointer'
                    }`}
                  >
                    -
                  </button>
                  
                  <div className="bg-amber-800 border-2 border-amber-700 rounded px-4 py-2 min-w-[60px] text-center">
                    <span className="text-white font-bold pixel-text text-lg">
                      {confirmSell.selectedQuantity}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setConfirmSell(prev => prev ? {
                      ...prev,
                      selectedQuantity: Math.min(prev.item.quantity, prev.selectedQuantity + 1)
                    } : null)}
                    disabled={confirmSell.selectedQuantity >= confirmSell.item.quantity}
                    className={`w-8 h-8 font-bold text-lg rounded transition-colors pixel-button pixel-text border-2 ${
                      confirmSell.selectedQuantity >= confirmSell.item.quantity
                        ? 'bg-gray-500 border-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-500 border-green-800 text-white cursor-pointer'
                    }`}
                  >
                    +
                  </button>
                </div>
                
                {/* Quick select buttons for common amounts */}
                {confirmSell.item.quantity > 1 && (
                  <div className="flex justify-center gap-2 mb-3">
                    <button
                      onClick={() => setConfirmSell(prev => prev ? { ...prev, selectedQuantity: 1 } : null)}
                      className="bg-blue-600 hover:bg-blue-500 border-2 border-blue-800 text-white font-bold text-xs px-2 py-1 rounded pixel-button pixel-text"
                    >
                      1
                    </button>
                    {confirmSell.item.quantity >= 5 && (
                      <button
                        onClick={() => setConfirmSell(prev => prev ? { ...prev, selectedQuantity: Math.min(5, prev.item.quantity) } : null)}
                        className="bg-blue-600 hover:bg-blue-500 border-2 border-blue-800 text-white font-bold text-xs px-2 py-1 rounded pixel-button pixel-text"
                      >
                        5
                      </button>
                    )}
                    {confirmSell.item.quantity >= 10 && (
                      <button
                        onClick={() => setConfirmSell(prev => prev ? { ...prev, selectedQuantity: Math.min(10, prev.item.quantity) } : null)}
                        className="bg-blue-600 hover:bg-blue-500 border-2 border-blue-800 text-white font-bold text-xs px-2 py-1 rounded pixel-button pixel-text"
                      >
                        10
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmSell(prev => prev ? { ...prev, selectedQuantity: prev.item.quantity } : null)}
                      className="bg-purple-600 hover:bg-purple-500 border-2 border-purple-800 text-white font-bold text-xs px-2 py-1 rounded pixel-button pixel-text"
                    >
                      All
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-amber-200 pixel-text text-sm text-center">
                Selling {confirmSell.selectedQuantity} of {confirmSell.item.quantity} {confirmSell.item.name}{confirmSell.selectedQuantity > 1 ? 's' : ''}
              </p>
              <p className="text-amber-200 pixel-text text-sm text-center mb-2">
                for
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 pixel-coin"></div>
                <span className="text-yellow-400 font-bold text-xl pixel-text">
                  {confirmSell.price * confirmSell.selectedQuantity}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmSell}
                className="bg-green-600 hover:bg-green-500 border-2 border-green-800 text-white font-bold px-4 py-2 rounded pixel-button pixel-text"
              >
                Sell
              </button>
              <button
                onClick={handleCancelSell}
                className="bg-red-600 hover:bg-red-500 border-2 border-red-800 text-white font-bold px-4 py-2 rounded pixel-button pixel-text"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-yellow-200 text-xs pixel-text opacity-80 leading-relaxed">
          Sell grown crops for 2x seed price • Sell dishes: 2 ingredients = 11 gold, 3 ingredients = 15 gold • Sell spices for 50% of purchase price • Seeds and water cannot be sold • 6 sales per day limit
        </p>
        <p className="text-yellow-300 text-xs pixel-text opacity-60 mt-1">
          {itemsSoldToday >= 6 
            ? 'Daily sell limit reached! Sleep to reset counter and sell more tomorrow.'
            : selectedSellSlot 
              ? 'Click any highlighted item to sell it!' 
              : 'Click the sell slot above to begin selling'
          }
        </p>
      </div>
    </div>
  );
}
