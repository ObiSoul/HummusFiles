import { useState, useEffect } from 'react';

interface SleepLoadingScreenProps {
  onSleepComplete: () => void;
  currentDay: number;
}

export default function SleepLoadingScreen({ onSleepComplete, currentDay }: SleepLoadingScreenProps) {
  const [loadingText, setLoadingText] = useState('Preparing for Sleep');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const nextDay = currentDay + 1;
    const seasonNames = ['Spring', 'Summer', 'Fall', 'Winter'];
    const seasonIndex = Math.floor((nextDay - 1) / 7);
    const nextSeason = seasonNames[seasonIndex] || 'Unknown';
    
    const loadingMessages = [
      'Preparing for Sleep',
      'Saving Game Progress',
      'Refreshing Shop Items',
      `Preparing ${nextSeason} Day ${((nextDay - 1) % 7) + 1}`,
      'Sweet Dreams'
    ];

    let messageIndex = 0;
    let dotCount = 0;

    const messageInterval = setInterval(() => {
      setLoadingText(loadingMessages[messageIndex]);
      messageIndex++;
      
      if (messageIndex >= loadingMessages.length) {
        clearInterval(messageInterval);
        clearInterval(dotInterval);
        setTimeout(() => {
          onSleepComplete();
        }, 500);
        return;
      }
    }, 800);

    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotInterval);
    };
  }, [onSleepComplete, currentDay]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center pixel-art">
      <div className="text-center">
        <div className="bg-indigo-900 border-4 border-indigo-800 rounded-lg p-12 pixel-shadow max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full border-4 border-blue-300 pixel-shadow animate-pulse flex items-center justify-center">
              <span className="text-4xl">💤</span>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 pixel-text">
            {loadingText}{dots}
          </h2>
          
          <div className="w-full bg-indigo-800 border-2 border-indigo-700 rounded-lg h-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
