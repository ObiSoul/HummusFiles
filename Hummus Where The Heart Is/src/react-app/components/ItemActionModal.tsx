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

interface ItemActionModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onMoveToKitchen: () => void;
  onMoveToFridge: () => void;
  onMoveToWorkshop: () => void;
  canMoveToKitchen: boolean;
  canMoveToFridge: boolean;
  canMoveToWorkshop: boolean;
  kitchenSpaceAvailable: boolean;
  fridgeSpaceAvailable: boolean;
  workshopSpaceAvailable: boolean;
}

export default function ItemActionModal({ 
  item, 
  isOpen, 
  onClose, 
  onMoveToKitchen, 
  onMoveToFridge, 
  onMoveToWorkshop,
  canMoveToKitchen,
  canMoveToFridge,
  canMoveToWorkshop,
  kitchenSpaceAvailable,
  fridgeSpaceAvailable,
  workshopSpaceAvailable
}: ItemActionModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150); // Small delay for animation
  };

  const handleMoveToKitchen = () => {
    onMoveToKitchen();
    handleClose();
  };

  const handleMoveToFridge = () => {
    onMoveToFridge();
    handleClose();
  };

  const handleMoveToWorkshop = () => {
    onMoveToWorkshop();
    handleClose();
  };

  const getKitchenButtonText = () => {
    if (!canMoveToKitchen) return "Kitchen (Seeds not allowed)";
    if (!kitchenSpaceAvailable) return "Kitchen (Full)";
    return "Move to Kitchen";
  };

  const getFridgeButtonText = () => {
    if (!canMoveToFridge) return "Fridge (Seeds not allowed)";
    if (!fridgeSpaceAvailable) return "Fridge (Full)";
    return "Move to Fridge";
  };

  const getWorkshopButtonText = () => {
    if (!canMoveToWorkshop) return "Workshop (Seeds not allowed)";
    if (!workshopSpaceAvailable) return "Workshop (Full)";
    return "Move to Workshop";
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-150 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="bg-amber-900 border-4 border-amber-800 rounded-lg p-6 pixel-shadow max-w-sm mx-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-8 h-8 pixel-item"
              />
              <div>
                <h3 className="text-white font-bold text-sm pixel-text">
                  {item.name}
                </h3>
                <p className="text-amber-300 text-xs pixel-text">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-amber-300 hover:text-white text-lg font-bold"
            >
              ×
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleMoveToKitchen}
              disabled={!canMoveToKitchen || !kitchenSpaceAvailable}
              className={`w-full font-bold text-sm px-4 py-3 rounded transition-colors pixel-button pixel-text border-2 ${
                canMoveToKitchen && kitchenSpaceAvailable
                  ? 'bg-orange-600 hover:bg-orange-500 border-orange-800 text-white cursor-pointer'
                  : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
              }`}
            >
              {getKitchenButtonText()}
            </button>

            <button
              onClick={handleMoveToFridge}
              disabled={!canMoveToFridge || !fridgeSpaceAvailable}
              className={`w-full font-bold text-sm px-4 py-3 rounded transition-colors pixel-button pixel-text border-2 ${
                canMoveToFridge && fridgeSpaceAvailable
                  ? 'bg-blue-600 hover:bg-blue-500 border-blue-800 text-white cursor-pointer'
                  : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
              }`}
            >
              {getFridgeButtonText()}
            </button>

            <button
              onClick={handleMoveToWorkshop}
              disabled={!canMoveToWorkshop || !workshopSpaceAvailable}
              className={`w-full font-bold text-sm px-4 py-3 rounded transition-colors pixel-button pixel-text border-2 ${
                canMoveToWorkshop && workshopSpaceAvailable
                  ? 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white cursor-pointer'
                  : 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
              }`}
            >
              {getWorkshopButtonText()}
            </button>

            <button
              onClick={handleClose}
              className="w-full font-bold text-sm px-4 py-3 rounded transition-colors pixel-button pixel-text border-2 bg-gray-600 hover:bg-gray-500 border-gray-800 text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Item Description */}
          <div className="mt-4 text-center">
            <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3 mb-3">
              <p className="text-amber-100 text-xs pixel-text leading-relaxed">
                {getItemDescription(item)}
              </p>
            </div>
            
            <p className="text-amber-200 text-xs pixel-text opacity-80 leading-relaxed">
              {item.id.endsWith('-seeds') 
                ? "Seeds can only go to the farm for planting. They don't spoil so they don't need fridge storage."
                : "Foods and spices can go to kitchen (for cooking), fridge (for storage), or workshop (for battle)!"
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
