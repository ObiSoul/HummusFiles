import { useState } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TutorialSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const tutorialSections: TutorialSection[] = [
  {
    id: 'basics',
    title: '1. Basic Controls & Item Information',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          Learn how to interact with items and navigate the game interface:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-800 border-2 border-blue-700 rounded-lg p-3">
            <p className="text-blue-200 text-xs pixel-text font-bold mb-2">🖥️ Desktop Users:</p>
            <ul className="text-blue-200 text-xs pixel-text space-y-1">
              <li>• <strong>Right-click</strong> any item for instant stats</li>
              <li>• <strong>Drag & drop</strong> items between areas</li>
              <li>• <strong>Hover</strong> for detailed tooltips</li>
              <li>• Works in inventory, fridge, kitchen, platter, and farm</li>
            </ul>
          </div>
          <div className="bg-green-800 border-2 border-green-700 rounded-lg p-3">
            <p className="text-green-200 text-xs pixel-text font-bold mb-2">📱 Mobile Users:</p>
            <ul className="text-green-200 text-xs pixel-text space-y-1">
              <li>• <strong>Tap items</strong> to open action modal with details</li>
              <li>• <strong>Tap slots</strong> to select them</li>
              <li>• Action modal shows move options and item info</li>
              <li>• All interactions through tapping interface</li>
            </ul>
          </div>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-xs pixel-text font-bold mb-2">💡 Navigation Tips:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• Switch between Inventory and Fridge tabs on the left</li>
            <li>• Use area tabs (Farm, Shop, Kitchen, etc.) on the right</li>
            <li>• Click Workshop button to enter battle preparation mode</li>
            <li>• Each tab has specific functions and interactions</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'farm-tab',
    title: '2. Farm Tab - Growing Your Crops',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          The Farm tab is where you plant seeds and grow crops:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-800 border-2 border-blue-700 rounded-lg p-3">
            <p className="text-blue-200 text-xs pixel-text font-bold mb-2">🖥️ Desktop Farming:</p>
            <ul className="text-blue-200 text-xs pixel-text space-y-1">
              <li>• <strong>Drag seeds</strong> to empty plots to plant</li>
              <li>• <strong>Click crops</strong> to water them (1 stamina)</li>
              <li>• <strong>Click mature crops</strong> to harvest</li>
              <li>• Right-click crops for growth progress</li>
            </ul>
          </div>
          <div className="bg-green-800 border-2 border-green-700 rounded-lg p-3">
            <p className="text-green-200 text-xs pixel-text font-bold mb-2">📱 Mobile Farming:</p>
            <ul className="text-green-200 text-xs pixel-text space-y-1">
              <li>• <strong>Tap empty plot</strong> to select it (yellow outline)</li>
              <li>• <strong>Tap seed</strong> in inventory to plant it</li>
              <li>• <strong>Tap planted crops</strong> to water them</li>
              <li>• <strong>Tap mature crops</strong> to harvest</li>
            </ul>
          </div>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-xs pixel-text font-bold mb-2">🌱 Farm Management:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• Buy new farm plots with gold as you progress</li>
            <li>• Planting costs 1 stamina, watering costs 1 stamina</li>
            <li>• Crops grow through 4 stages over multiple days</li>
            <li>• Harvesting gives you fruit + 2 gold reward</li>
            <li>• Plants auto-water once overnight when you sleep</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'inventory-tab',
    title: '3. Inventory Tab - Managing Your Items',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          Your inventory stores all items you collect. Key features:
        </p>
        <div className="space-y-2">
          <div className="bg-amber-800 border border-amber-700 rounded p-2">
            <p className="text-yellow-200 text-xs pixel-text font-bold">Storage System</p>
            <p className="text-amber-200 text-xs pixel-text">25 slots total • Items stack automatically • Seeds never spoil</p>
          </div>
          <div className="bg-red-800 border border-red-700 rounded p-2">
            <p className="text-red-200 text-xs pixel-text font-bold">Spoilage Warning</p>
            <p className="text-amber-200 text-xs pixel-text">Most items spoil after 2 days (green tint) and rot after 4 days in inventory</p>
          </div>
          <div className="bg-blue-800 border border-blue-700 rounded p-2">
            <p className="text-blue-200 text-xs pixel-text font-bold">Item Movement</p>
            <p className="text-amber-200 text-xs pixel-text">Move items to fridge, kitchen, or workshop via drag/drop or tap actions</p>
          </div>
          <div className="bg-orange-800 border border-orange-700 rounded p-2">
            <p className="text-orange-200 text-xs pixel-text font-bold">⚠️ Kitchen Expiration</p>
            <p className="text-amber-200 text-xs pixel-text">Spices and items in kitchen slots CAN expire! Battle platter items are safe.</p>
          </div>
        </div>
        <div className="bg-purple-800 border-2 border-purple-700 rounded-lg p-3">
          <p className="text-purple-200 text-xs pixel-text font-bold mb-2">📦 Inventory Tips:</p>
          <ul className="text-purple-200 text-xs pixel-text space-y-1">
            <li>• Seeds are safe from spoilage and can be stored indefinitely</li>
            <li>• Grown crops and cooked items will spoil if not refrigerated</li>
            <li>• Use the fridge to prevent spoilage completely</li>
            <li>• Rotten items (💀 icon) are worthless - avoid letting items rot</li>
            <li>• ⚠️ Items in kitchen slots CAN expire, move to fridge when done cooking!</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'fridge-tab',
    title: '4. Fridge Tab - Perfect Storage',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          The Fridge prevents item spoilage and provides safe long-term storage:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-800 border-2 border-blue-700 rounded-lg p-3">
            <p className="text-blue-200 text-xs pixel-text font-bold mb-2">❄️ Fridge Benefits:</p>
            <ul className="text-blue-200 text-xs pixel-text space-y-1">
              <li>• Items never spoil when stored in fridge</li>
              <li>• Perfect for storing cooked dishes</li>
              <li>• Great for stockpiling rare ingredients</li>
              <li>• Items stay fresh forever</li>
            </ul>
          </div>
          <div className="bg-green-800 border-2 border-green-700 rounded-lg p-3">
            <p className="text-green-200 text-xs pixel-text font-bold mb-2">💰 Fridge Economics:</p>
            <ul className="text-green-200 text-xs pixel-text space-y-1">
              <li>• Start with 1 fridge slot unlocked</li>
              <li>• Buy additional slots for 5 gold each</li>
              <li>• Maximum 25 slots available</li>
              <li>• Great investment for item management</li>
            </ul>
          </div>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-xs pixel-text font-bold mb-2">🎯 Best Practices:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• Store expensive cooked dishes immediately</li>
            <li>• Keep rare ingredients like Golden Apples safe</li>
            <li>• Free up inventory space for daily farming</li>
            <li>• Seeds don't need refrigeration (they never spoil)</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'shop-tab',
    title: '5. Shop Tab - Seeds and Spices',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          The Shop offers seeds for farming and spices for cooking, with smart selection features:
        </p>
        <div className="space-y-2">
          <div className="bg-amber-800 border border-amber-700 rounded p-2">
            <p className="text-yellow-200 text-xs pixel-text font-bold">Seeds Section</p>
            <p className="text-amber-200 text-xs pixel-text">Plant on farm • Smart priority for recipe ingredients • 8g for 3rd slot</p>
          </div>
          <div className="bg-red-800 border border-red-700 rounded p-2">
            <p className="text-red-200 text-xs pixel-text font-bold">Spices Section</p>
            <p className="text-amber-200 text-xs pixel-text">Use in cooking & battles • Essential for recipes • 10g for 3rd slot</p>
          </div>
        </div>
        <div className="bg-purple-800 border-2 border-purple-700 rounded-lg p-3">
          <p className="text-purple-200 text-xs pixel-text font-bold mb-2">🧠 Smart Shop Features:</p>
          <ul className="text-purple-200 text-xs pixel-text space-y-1">
            <li>• 20% higher chance for seeds used in discovered recipes</li>
            <li>• Shop learns your needs as you unlock more recipes</li>
            <li>• Reroll buttons refresh items for increasing costs</li>
            <li>• Daily automatic refresh with new items</li>
          </ul>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-xs pixel-text font-bold mb-2">💡 Shopping Tips:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• Buy 3rd slots early for more variety</li>
            <li>• Seeds are cheaper than spices but spices are versatile</li>
            <li>• Stock up on basic ingredients like garlic, basil, sugar</li>
            <li>• Higher-tier seeds unlock more valuable crops</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'kitchen-tab',
    title: '6. Kitchen Tab - Cooking Recipes',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          The Kitchen is where you combine ingredients to create powerful dishes:
        </p>
        <div className="bg-orange-800 border-2 border-orange-700 rounded-lg p-3">
          <p className="text-orange-200 text-sm pixel-text font-bold mb-2">👨‍🍳 Cooking Process:</p>
          <ul className="text-orange-200 text-xs pixel-text space-y-1">
            <li>• Use 3 ingredient slots to create recipes</li>
            <li>• Drag/drop or tap to place ingredients</li>
            <li>• Successful recipes automatically go to fridge</li>
            <li>• Failed attempts consume ingredients</li>
            <li>• Click water in slots to remove it instantly</li>
          </ul>
        </div>
        <div className="bg-purple-800 border-2 border-purple-700 rounded-lg p-3">
          <p className="text-purple-200 text-sm pixel-text font-bold mb-2">💰 Buy Recipe Feature:</p>
          <ul className="text-purple-200 text-xs pixel-text space-y-1">
            <li>• Spend 3 gold to learn a guaranteed recipe</li>
            <li>• Choose from 3 random growable ingredients</li>
            <li>• Instantly unlock recipe using that ingredient</li>
            <li>• Improves shop's seed selection algorithm</li>
            <li>• Great alternative to experimental cooking</li>
          </ul>
        </div>
        <div className="bg-green-800 border-2 border-green-700 rounded-lg p-3">
          <p className="text-green-200 text-xs pixel-text font-bold mb-2">🧪 Recipe Discovery:</p>
          <ul className="text-green-200 text-xs pixel-text space-y-1">
            <li>• Try: Water + Wheat = Dough</li>
            <li>• Try: Apple + Dough + Sugar = Apple Pie</li>
            <li>• Try: Tomato + Basil + Water = Tomato Soup</li>
            <li>• Experiment with different combinations!</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'cookbook-tab',
    title: '7. Cookbook Tab - Your Recipe Collection',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          The Cookbook displays all discovered items and recipes with their battle abilities:
        </p>
        <div className="space-y-2">
          <div className="bg-purple-800 border border-purple-700 rounded p-2">
            <p className="text-purple-200 text-xs pixel-text font-bold">Battle Reference</p>
            <p className="text-amber-200 text-xs pixel-text">View FP/second rates, special abilities, and synergies for strategic planning</p>
          </div>
          <div className="bg-blue-800 border border-blue-700 rounded p-2">
            <p className="text-blue-200 text-xs pixel-text font-bold">Recipe Database</p>
            <p className="text-amber-200 text-xs pixel-text">All discovered recipes with exact ingredient requirements</p>
          </div>
          <div className="bg-green-800 border border-green-700 rounded p-2">
            <p className="text-green-200 text-xs pixel-text font-bold">Progress Tracking</p>
            <p className="text-amber-200 text-xs pixel-text">See how many items you've discovered out of the total collection</p>
          </div>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-xs pixel-text font-bold mb-2">⚔️ Battle Cookbook Features:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• Each item shows its Flavor Points per second generation</li>
            <li>• Special abilities and on-placement effects listed</li>
            <li>• Synergies with other foods clearly explained</li>
            <li>• Perfect for planning your battle platter strategy</li>
            <li>• Items unlock as you grow/cook them</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'library-tab',
    title: '8. Library Tab - Daily Recipe Offers',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          The Library offers 2 themed recipes daily with rotating themes:
        </p>
        <div className="bg-purple-800 border-2 border-purple-700 rounded-lg p-3">
          <p className="text-purple-200 text-sm pixel-text font-bold mb-2">📅 Daily Themes System:</p>
          <ul className="text-purple-200 text-xs pixel-text space-y-1">
            <li>• Different theme each day: Tarts, Drinks, Soups, Salsas, etc.</li>
            <li>• 9 unique themes total, rotating every day</li>
            <li>• 2 recipes from today's theme offered</li>
            <li>• Themes repeat every 9 days for planning</li>
          </ul>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-xs pixel-text font-bold mb-2">💰 Library Features:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• Buy recipes directly instead of experimenting</li>
            <li>• Fixed prices - no randomization</li>
            <li>• See upcoming themes to plan purchases</li>
            <li>• Great way to target specific recipe types</li>
            <li>• Recipes immediately unlock in your Cookbook</li>
          </ul>
        </div>
        <div className="bg-green-800 border-2 border-green-700 rounded-lg p-3">
          <p className="text-green-200 text-xs pixel-text font-bold mb-2">🎯 Strategic Use:</p>
          <ul className="text-green-200 text-xs pixel-text space-y-1">
            <li>• Plan ahead using the theme schedule</li>
            <li>• Focus on themes that match your ingredient stockpile</li>
            <li>• Complement Kitchen experimentation with targeted purchases</li>
            <li>• Perfect for building specific recipe categories</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'sell-tab',
    title: '9. Sell Tab - Converting Items to Gold',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          The Sell tab lets you convert grown crops and cooked dishes into gold:
        </p>
        <div className="bg-yellow-800 border-2 border-yellow-700 rounded-lg p-3">
          <p className="text-yellow-200 text-sm pixel-text font-bold mb-2">💰 Selling Process:</p>
          <ul className="text-yellow-200 text-xs pixel-text space-y-1">
            <li>• Click the sell slot to activate selling mode</li>
            <li>• Click any sellable item in your inventory</li>
            <li>• Confirm the sale to receive gold immediately</li>
            <li>• 6 sales per day maximum (resets on sleep)</li>
          </ul>
        </div>
        <div className="bg-green-800 border-2 border-green-700 rounded-lg p-3">
          <p className="text-green-200 text-xs pixel-text font-bold mb-2">💵 Pricing System:</p>
          <ul className="text-green-200 text-xs pixel-text space-y-1">
            <li>• Grown crops: 2x their original seed price</li>
            <li>• Cooked dishes: 11 gold (2 ingredients) or 15 gold (3 ingredients)</li>
            <li>• Spices: 50% of their purchase price</li>
            <li>• Seeds and water cannot be sold</li>
          </ul>
        </div>
        <div className="bg-red-800 border-2 border-red-700 rounded-lg p-3">
          <p className="text-red-200 text-xs pixel-text font-bold mb-2">⚠️ Selling Strategy:</p>
          <ul className="text-red-200 text-xs pixel-text space-y-1">
            <li>• Don't sell rare ingredients you might need for recipes</li>
            <li>• Cooked dishes are usually too valuable to sell</li>
            <li>• Focus on selling excess grown crops</li>
            <li>• Plan daily sales to maximize gold income</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'workshop-mode',
    title: '10. Workshop Mode - Battle Preparation',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          Workshop Mode switches the interface to focus on battle platter preparation:
        </p>
        <div className="bg-indigo-800 border-2 border-indigo-700 rounded-lg p-3">
          <p className="text-indigo-200 text-sm pixel-text font-bold mb-2">⚔️ Workshop Interface:</p>
          <ul className="text-indigo-200 text-xs pixel-text space-y-1">
            <li>• Left side: Inventory for selecting items</li>
            <li>• Right side: Battle platter for arrangement</li>
            <li>• All foods and spices allowed (no seeds)</li>
            <li>• Strategic positioning affects battle performance</li>
          </ul>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-xs pixel-text font-bold mb-2">🏗️ Platter Management:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• Start with 4 unlocked slots</li>
            <li>• Buy additional slots for 20 gold each (max 12)</li>
            <li>• Upgrade slots randomly for 15 gold (stackable boosts)</li>
            <li>• Upgraded slots: ⚡ Level 1, 🔥 Level 2, 💎 Level 3+</li>
          </ul>
        </div>
        <div className="bg-red-800 border-2 border-red-700 rounded-lg p-3">
          <p className="text-red-200 text-xs pixel-text font-bold mb-2">🥊 Battle Features:</p>
          <ul className="text-red-200 text-xs pixel-text space-y-1">
            <li>• Available on battle days (Day 3 & 7 of each season)</li>
            <li>• "Find Chef" button appears when battle is required</li>
            <li>• Must battle before sleeping on battle days</li>
            <li>• Check Cookbook for item abilities and synergies</li>
            <li>• ✅ Items in battle platter do NOT expire during battles</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'battle-system',
    title: '11. Arena Battles - Combat System',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          Battles pit your platter against other players' arrangements in flavor combat:
        </p>
        <div className="bg-red-900 border-2 border-red-700 rounded-lg p-3">
          <p className="text-red-200 text-sm pixel-text font-bold mb-2">⚔️ Battle Mechanics:</p>
          <ul className="text-red-200 text-xs pixel-text space-y-1">
            <li>• Each item generates Flavor Points (FP) per second</li>
            <li>• Special abilities trigger during battle</li>
            <li>• First platter to reach 100 FP wins</li>
            <li>• Positioning and synergies matter greatly</li>
          </ul>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-xs pixel-text font-bold mb-2">📅 Battle Schedule:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• Day 3 & 7 of each season (8 battles total per game)</li>
            <li>• Must battle before you can sleep on battle days</li>
            <li>• Battle countdown shows days until next battle</li>
            <li>• Prepare your platter in advance using Workshop</li>
          </ul>
        </div>
        <div className="bg-green-800 border-2 border-green-700 rounded-lg p-3">
          <p className="text-green-200 text-xs pixel-text font-bold mb-2">🏆 Rewards & Consequences:</p>
          <ul className="text-green-200 text-xs pixel-text space-y-1">
            <li>• <strong>Win:</strong> Gain gold + learn 2 new recipes</li>
            <li>• <strong>Lose:</strong> Lose 1 heart + learn 1 recipe</li>
            <li>• Win after previous loss: Recover 1 heart</li>
            <li>• Game over at 0 hearts (start new run)</li>
            <li>• Every battle teaches new recipes regardless!</li>
            <li>• 📋 Battle log shows all abilities and FP changes</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'resources',
    title: '12. Resource Management - Time, Energy & Progress',
    content: (
      <div className="space-y-3">
        <p className="text-amber-200 text-sm pixel-text leading-relaxed">
          Master the game's resource systems to maximize your farming and cooking efficiency:
        </p>
        <div className="bg-blue-700 border-2 border-blue-600 rounded-lg p-3">
          <p className="text-blue-200 text-sm pixel-text font-bold mb-2">⚡ Stamina System:</p>
          <ul className="text-blue-200 text-xs pixel-text space-y-1">
            <li>• Start with 12 stamina daily</li>
            <li>• Each new season adds +12 permanent max stamina</li>
            <li>• Planting seeds costs 1 stamina each</li>
            <li>• Watering crops costs 1 stamina each</li>
            <li>• Sleep fully restores stamina</li>
          </ul>
        </div>
        <div className="bg-amber-800 border-2 border-amber-700 rounded-lg p-3">
          <p className="text-yellow-200 text-sm pixel-text font-bold mb-2">📅 Calendar & Seasons:</p>
          <ul className="text-amber-200 text-xs pixel-text space-y-1">
            <li>• 28-day game cycle with 4 seasons of 7 days each</li>
            <li>• Spring (1-7), Summer (8-14), Fall (15-21), Winter (22-28)</li>
            <li>• Each season start grants +12 max stamina</li>
            <li>• Items spoil overnight when sleeping</li>
            <li>• Shop items refresh daily automatically</li>
          </ul>
        </div>
        <div className="bg-green-800 border-2 border-green-700 rounded-lg p-3">
          <p className="text-green-200 text-sm pixel-text font-bold mb-2">❤️ Health & Lives:</p>
          <ul className="text-green-200 text-xs pixel-text space-y-1">
            <li>• Start with 3 hearts (lives)</li>
            <li>• Lose 1 heart when you lose a battle</li>
            <li>• Win after a loss to recover 1 heart</li>
            <li>• Game over at 0 hearts - start new run</li>
            <li>• New Game+ available after completing Day 28</li>
          </ul>
        </div>
      </div>
    )
  }
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [activeSection, setActiveSection] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[9999] p-4">
      <div className="bg-amber-900 border-4 border-amber-800 rounded-lg pixel-shadow max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b-2 border-amber-700">
          <h2 className="text-white font-bold text-xl pixel-text">🎓 Game Tutorial</h2>
          <button
            onClick={onClose}
            className="text-amber-300 hover:text-white text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex h-[70vh]">
          {/* Navigation Sidebar */}
          <div className="w-64 bg-amber-800 border-r-2 border-amber-700 overflow-y-auto">
            <div className="p-2 space-y-1">
              {tutorialSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors pixel-button pixel-text text-sm ${
                    activeSection === index
                      ? 'bg-amber-600 text-white border-2 border-amber-500'
                      : 'text-amber-200 hover:bg-amber-700 border-2 border-transparent'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-xl pixel-text border-b-2 border-amber-700 pb-2">
                {tutorialSections[activeSection].title}
              </h3>
              <div className="space-y-4">
                {tutorialSections[activeSection].content}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between p-4 border-t-2 border-amber-700 bg-amber-800">
          <button
            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
            disabled={activeSection === 0}
            className={`px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
              activeSection === 0
                ? 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 border-blue-800 text-white'
            }`}
          >
            ← Previous
          </button>

          <span className="text-amber-200 text-sm pixel-text">
            {activeSection + 1} of {tutorialSections.length}
          </span>

          <button
            onClick={() => setActiveSection(Math.min(tutorialSections.length - 1, activeSection + 1))}
            disabled={activeSection === tutorialSections.length - 1}
            className={`px-4 py-2 rounded transition-colors pixel-button pixel-text border-2 ${
              activeSection === tutorialSections.length - 1
                ? 'bg-gray-500 border-gray-700 text-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 border-blue-800 text-white'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
