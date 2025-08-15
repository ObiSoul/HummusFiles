import { useEffect } from 'react';

interface TooltipProps {
  item: {
    name: string;
    description?: string;
  } | null;
  position: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
}

export default function Tooltip({ item, position, visible, onClose }: TooltipProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible || !item) return null;

  return (
    <div
      className="fixed z-50 bg-amber-900 border-4 border-amber-800 rounded-lg p-3 pixel-shadow pointer-events-none"
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y - 10}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <h3 className="text-white font-bold text-sm pixel-text mb-1">
        {item.name}
      </h3>
      {item.description && (
        <p className="text-amber-200 text-xs pixel-text leading-relaxed max-w-48">
          {item.description}
        </p>
      )}
    </div>
  );
}
