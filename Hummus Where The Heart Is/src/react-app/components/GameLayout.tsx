import { ReactNode } from 'react';

interface GameLayoutProps {
  children: ReactNode;
  currentDay?: number;
}

// Helper function to get season from day
function getSeason(day: number): 'spring' | 'summer' | 'fall' | 'winter' {
  if (day <= 7) return 'spring';
  if (day <= 14) return 'summer';
  if (day <= 21) return 'fall';
  return 'winter';
}

// Get background image for season
function getSeasonalBackground(season: 'spring' | 'summer' | 'fall' | 'winter'): string {
  const backgrounds = {
    spring: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/spring.png',
    summer: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/summer.png',
    fall: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/autumn.png',
    winter: 'https://mocha-cdn.com/01989ecc-9860-7e78-9469-c7b3132b0b84/winter.png'
  };
  return backgrounds[season];
}

export default function GameLayout({ children, currentDay = 1 }: GameLayoutProps) {
  const season = getSeason(currentDay);
  const backgroundImage = getSeasonalBackground(season);

  return (
    <div 
      className="min-h-screen pixel-art bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        imageRendering: 'pixelated'
      }}
    >
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-4 max-w-7xl min-h-screen">
        {children}
      </div>
    </div>
  );
}
