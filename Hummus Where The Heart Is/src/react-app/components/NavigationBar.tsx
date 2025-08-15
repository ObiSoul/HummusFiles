interface NavigationBarProps {
  onMainMenu: () => void;
  currentScreen?: string;
}

export default function NavigationBar({ onMainMenu, currentScreen }: NavigationBarProps) {
  if (currentScreen === 'start' || currentScreen === 'mainMenu') {
    return null; // Don't show nav on start screen or main menu
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onMainMenu}
        className="bg-amber-900 hover:bg-amber-800 border-4 border-amber-800 text-white font-bold text-sm px-4 py-2 rounded transition-colors pixel-button pixel-text pixel-shadow"
      >
        Menu
      </button>
    </div>
  );
}
