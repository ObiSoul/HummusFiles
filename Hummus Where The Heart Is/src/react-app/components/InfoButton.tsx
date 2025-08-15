import { useState } from 'react';

interface InfoButtonProps {
  title: string;
  description: string;
  position?: 'top-right' | 'top-left';
}

export default function InfoButton({ title, description, position = 'top-right' }: InfoButtonProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={`absolute z-10 ${position === 'top-right' ? 'top-2 right-2' : 'top-2 left-2'}`}>
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="w-6 h-6 bg-blue-600 hover:bg-blue-500 border-2 border-blue-800 text-white rounded-full flex items-center justify-center transition-colors pixel-button text-xs font-bold"
        title="Information"
      >
        ?
      </button>
      
      {showInfo && (
        <>
          {/* Backdrop to close info when clicking outside */}
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setShowInfo(false)}
          />
          
          {/* Info popup */}
          <div className={`absolute z-30 mt-2 w-64 bg-amber-900 border-4 border-amber-800 rounded-lg p-4 pixel-shadow ${
            position === 'top-right' ? 'right-0' : 'left-0'
          }`}>
            <h3 className="text-white font-bold text-sm pixel-text mb-2">
              {title}
            </h3>
            <p className="text-amber-200 text-xs pixel-text leading-relaxed">
              {description}
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-1 right-2 text-amber-300 hover:text-white text-sm font-bold"
            >
              ×
            </button>
          </div>
        </>
      )}
    </div>
  );
}
