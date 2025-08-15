import { useState, useEffect } from 'react';

interface SaveIndicatorProps {
  show: boolean;
}

export default function SaveIndicator({ show }: SaveIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 border-2 border-green-800 rounded-lg px-4 py-2 pixel-shadow animate-pulse">
      <div className="flex items-center gap-2">
        <span className="text-white font-bold text-sm pixel-text">💾 Game Saved</span>
      </div>
    </div>
  );
}
