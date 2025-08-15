# Uploading "Hummus Where The Heart Is" to itch.io

## Game Description
**Hummus Where The Heart Is** is a charming pixel art farming auto-battler where you grow crops, cook recipes, and battle in the arena! Manage your farm through four seasons, discover new recipes, and compete against AI chefs in strategic food battles.

## Features
- 🌱 Farm 30+ different crops across 4 seasons
- 🍳 Cook 50+ unique recipes with discovered ingredients
- ⚔️ Strategic auto-battler combat with food items
- 📱 Cross-platform (Desktop with drag & drop, Mobile with touch controls)
- 🔄 New Game+ mode for endless challenges
- 💾 Auto-save progress system

## Building for itch.io

### Step 1: Build the Game
The game has been built successfully! The `dist/` folder contains all the files needed for itch.io.

### Step 2: Prepare Upload Files
Create a ZIP file containing all files from the `dist/` folder:

```bash
cd dist/
zip -r hummus-where-the-heart-is.zip ./*
```

### Step 3: itch.io Upload Settings

**Project Settings:**
- **Title:** Hummus Where The Heart Is
- **Short description:** A charming pixel art farming auto-battler
- **Genre:** Strategy, Simulation, Casual
- **Tags:** farming, pixel-art, cooking, strategy, auto-battler, casual, web-game

**Upload Settings:**
- **Platform:** HTML (Web)
- **File:** hummus-where-the-heart-is.zip
- **This file will be played in the browser:** ✓ Checked
- **Embed options:** 
  - Width: 1200px
  - Height: 800px
  - Fullscreen button: ✓ Checked
  - Mobile friendly: ✓ Checked

### Step 4: Game Page Content

**Long Description:**
Welcome to **Hummus Where The Heart Is**, where farming meets strategic cooking battles!

🌾 **Farm Life:** Plant and grow over 30 different crops across four seasons. Each season brings new challenges and increases your maximum stamina. Manage your farm plots wisely and use the watering can to speed up growth.

🍳 **Master Chef:** Discover and cook 50+ unique recipes! Combine ingredients in your kitchen to create everything from simple dough to complex dishes like Apple Pie and Tomato Soup. Each recipe you discover adds to your cookbook.

⚔️ **Arena Battles:** Every few days, battle against AI chefs in strategic auto-battler combat! Each food item has unique abilities - some generate Flavor Points, others reduce your opponent's points. Arrange your battle platter strategically and upgrade slots for maximum effectiveness.

🎮 **Platform Options:** Choose your play style! Desktop users get enhanced drag & drop controls, while mobile users enjoy optimized touch controls with action menus.

🔄 **Endless Content:** Complete all four seasons to unlock New Game+ mode, where you keep all your progress and face infinitely scaling challenges!

**Screenshots Needed:**
1. Farm screen with crops growing
2. Kitchen/cooking interface
3. Arena battle screen
4. Shop interface
5. Cookbook showing recipes

**Controls:**
- **Desktop:** Mouse controls with drag & drop functionality
- **Mobile:** Touch controls with tap-to-select menus
- **Universal:** Sleep to advance days, manage stamina and gold

### Step 5: Pricing & Access
- **Free to play** (recommended for web games)
- **No payments:** Keep it free for maximum reach

### Step 6: Additional Files (Optional)
Consider adding:
- Game manual/tutorial document
- Changelog for updates
- Credits file

## Marketing Tips
- Post development screenshots on social media
- Share on farming/indie game communities
- Consider participating in itch.io game jams
- Update regularly with new content

## Technical Notes
- The game saves progress locally (localStorage)
- Works in all modern browsers
- Mobile responsive design
- No external dependencies or servers required

Good luck with your itch.io launch! 🎮✨
