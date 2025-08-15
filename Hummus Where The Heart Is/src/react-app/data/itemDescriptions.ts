// Item type/category mapping
const ITEM_TYPES: { [key: string]: string } = {
  // Seeds
  'apple-seeds': 'Fruit Seed', 'banana-seeds': 'Fruit Seed', 'cherry-seeds': 'Fruit Seed',
  'grape-seeds': 'Fruit Seed', 'green-grape-seeds': 'Fruit Seed', 'green-apple-seeds': 'Fruit Seed',
  'golden-apple-seeds': 'Fruit Seed', 'black-cherry-seeds': 'Fruit Seed', 'dragonfruit-seeds': 'Fruit Seed',
  'coconut-seeds': 'Fruit Seed', 'kiwi-seeds': 'Fruit Seed', 'lime-seeds': 'Citrus Seed',
  'lemon-seeds': 'Citrus Seed', 'orange-seeds': 'Citrus Seed', 'strawberry-seeds': 'Berry Seed',
  'raspberry-seeds': 'Berry Seed', 'blackberry-seeds': 'Berry Seed', 'blueberry-seeds': 'Berry Seed',
  'watermelon-seeds': 'Fruit Seed', 'pineapple-seeds': 'Fruit Seed', 'tomato-seeds': 'Veggie Seed',
  'onion-seeds': 'Veggie Seed', 'red-onion-seeds': 'Veggie Seed', 'eggplant-seeds': 'Veggie Seed',
  'green-chile-pepper-seeds': 'Veggie Seed', 'avocado-seeds': 'Veggie Seed', 'chili-pepper-seeds': 'Veggie Seed',
  'green-bell-pepper-seeds': 'Veggie Seed', 'red-bell-pepper-seeds': 'Veggie Seed', 'yellow-bell-pepper-seeds': 'Veggie Seed',
  'jalapeno-seeds': 'Veggie Seed', 'pumpkin-seeds': 'Veggie Seed', 'wheat-seeds': 'Grain Seed',
  'soybean-seeds': 'Legume Seed', 'chickpea-seeds': 'Legume Seed',

  // Grown Crops
  'apple': 'Fruit', 'banana': 'Fruit', 'cherry': 'Fruit', 'grape': 'Fruit', 'green-grape': 'Fruit',
  'green-apple': 'Fruit', 'golden-apple': 'Fruit', 'black-cherry': 'Fruit', 'dragonfruit': 'Fruit',
  'coconut': 'Fruit', 'kiwi': 'Fruit', 'lime': 'Citrus', 'lemon': 'Citrus', 'orange': 'Citrus',
  'strawberry': 'Berry', 'raspberry': 'Berry', 'blackberry': 'Berry', 'blueberry': 'Berry',
  'watermelon': 'Fruit', 'pineapple': 'Fruit', 'tomato': 'Veggie', 'onion': 'Veggie', 'red-onion': 'Veggie',
  'eggplant': 'Veggie', 'green-chile-pepper': 'Veggie', 'avocado': 'Veggie', 'chili-pepper': 'Veggie',
  'green-bell-pepper': 'Veggie', 'red-bell-pepper': 'Veggie', 'yellow-bell-pepper': 'Veggie',
  'jalapeno': 'Veggie', 'pumpkin': 'Veggie', 'wheat': 'Grain', 'soybean': 'Legume', 'chickpeas': 'Legume',

  // Spices
  'garlic': 'Spice', 'basil': 'Spice', 'sugar': 'Spice', 'nutmeg': 'Spice', 'cajun': 'Spice',

  // Special Items
  'water': 'Special',

  // All dishes are categorized as "Dish"
  'dough': 'Dish', 'apple-pie': 'Dish', 'tomato-soup': 'Dish', 'cajun-garlic-soybeans': 'Dish',
  'hummus': 'Dish', 'pepper-hummus': 'Dish', 'jalapeno-lime-hummus': 'Dish', 'avocado-hummus': 'Dish',
  'herb-hummus': 'Dish', 'pumpkin-nutmeg-hummus': 'Dish', 'coconut-lime-hummus': 'Dish',
  'lime-edamame': 'Dish', 'eggplant-tomato-bake': 'Dish', 'chili-garlic-eggplant': 'Dish',
  'pumpkin-soup': 'Dish', 'spiced-pumpkin-puree': 'Dish', 'guacamole': 'Dish', 'avocado-tomato-salad': 'Dish',
  'watermelon-basil-salad': 'Dish', 'caramelized-banana': 'Dish', 'coconut-snow': 'Dish',
  'candied-orange-peel': 'Dish', 'candied-jalapenos': 'Dish', 'quick-pickled-onions': 'Dish',
  'watermelon-lime-granita': 'Dish', 'dragonfruit-sorbet': 'Dish', 'blueberry-ice': 'Dish',
  'pineapple-coconut-ice': 'Dish', 'lemonade': 'Dish', 'limeade': 'Dish', 'orangeade': 'Dish',
  'grape-juice': 'Dish', 'classic-pico': 'Dish', 'pineapple-chili-salsa': 'Dish', 'green-chile-salsa': 'Dish',
  'roasted-red-relish': 'Dish', 'avocado-salsa-verde': 'Dish', 'quick-marinara': 'Dish',
  'cajun-tomato-base': 'Dish', 'pepper-trinity': 'Dish', 'garlic-herb-flatbread': 'Dish',
  'tomato-basil-flatbread': 'Dish', 'tri-bell-pepper-flatbread': 'Dish', 'pepper-onion-flatbread': 'Dish',
  'apple-tart': 'Dish', 'golden-apple-tart': 'Dish', 'green-apple-tart': 'Dish', 'strawberry-tart': 'Dish',
  'blueberry-tart': 'Dish', 'blackberry-tart': 'Dish', 'raspberry-tart': 'Dish', 'apple-compote': 'Dish',
  'golden-apple-compote': 'Dish', 'cherry-jam': 'Dish', 'mixed-berry-jam': 'Dish', 'strawberry-jam': 'Dish',
  'grape-jelly': 'Dish', 'orange-marmalade': 'Dish', 'kiwi-lime-jam': 'Dish', 'pineapple-preserves': 'Dish'
};

// Centralized item descriptions for consistent tooltips throughout the game
export const ITEM_DESCRIPTIONS: { [key: string]: string } = {
  // Seeds
  'apple-seeds': 'Plant these to grow sweet red apples. Takes 4 growth stages, can be watered to speed growth.',
  'banana-seeds': 'Plant these to grow yellow curved bananas. Takes 4 growth stages, can be watered to speed growth.',
  'cherry-seeds': 'Plant these to grow bright red sweet cherries. Takes 4 growth stages, can be watered to speed growth.',
  'grape-seeds': 'Plant these to grow purple clusters of sweet grapes. Takes 4 growth stages, can be watered to speed growth.',
  'green-grape-seeds': 'Plant these to grow green clusters of sweet grapes. Takes 4 growth stages, can be watered to speed growth.',
  'green-apple-seeds': 'Plant these to grow crisp green apples with tart flavor. Takes 4 growth stages, can be watered to speed growth.',
  'golden-apple-seeds': 'Plant these to grow rare golden apples with magical properties. Takes 4 growth stages, can be watered to speed growth.',
  'black-cherry-seeds': 'Plant these to grow rich dark cherries with intense flavor. Takes 4 growth stages, can be watered to speed growth.',
  'dragonfruit-seeds': 'Plant these to grow exotic pink fruit with black seeds. Takes 4 growth stages, can be watered to speed growth.',
  'coconut-seeds': 'Plant these to grow tropical brown coconuts with sweet milk. Takes 4 growth stages, can be watered to speed growth.',
  'kiwi-seeds': 'Plant these to grow brown fuzzy kiwi fruits with green flesh. Takes 4 growth stages, can be watered to speed growth.',
  'lime-seeds': 'Plant these to grow tart green citrus fruits. Takes 4 growth stages, can be watered to speed growth.',
  'lemon-seeds': 'Plant these to grow bright yellow citrus fruits. Takes 4 growth stages, can be watered to speed growth.',
  'orange-seeds': 'Plant these to grow sweet orange citrus fruits. Takes 4 growth stages, can be watered to speed growth.',
  'strawberry-seeds': 'Plant these to grow sweet red berries with fresh flavor. Takes 4 growth stages, can be watered to speed growth.',
  'raspberry-seeds': 'Plant these to grow tart red berries with complex flavor. Takes 4 growth stages, can be watered to speed growth.',
  'blackberry-seeds': 'Plant these to grow dark purple berries with rich flavor. Takes 4 growth stages, can be watered to speed growth.',
  'blueberry-seeds': 'Plant these to grow small blue berries bursting with flavor. Takes 4 growth stages, can be watered to speed growth.',
  'watermelon-seeds': 'Plant these to grow large green melons with sweet red flesh. Takes 4 growth stages, can be watered to speed growth.',
  'pineapple-seeds': 'Plant these to grow tropical golden fruit with spiky crown. Takes 4 growth stages, can be watered to speed growth.',
  'tomato-seeds': 'Plant these to grow juicy red tomatoes, perfect for cooking. Takes 4 growth stages, can be watered to speed growth.',
  'onion-seeds': 'Plant these to grow essential white onions that add flavor to any dish. Takes 4 growth stages, can be watered to speed growth.',
  'red-onion-seeds': 'Plant these to grow purple-red onions with sweet flavor. Takes 4 growth stages, can be watered to speed growth.',
  'eggplant-seeds': 'Plant these to grow purple eggplant vegetables, great for cooking. Takes 4 growth stages, can be watered to speed growth.',
  'green-chile-pepper-seeds': 'Plant these to grow spicy green chile peppers with mild heat. Takes 4 growth stages, can be watered to speed growth.',
  'avocado-seeds': 'Plant these to grow creamy green avocados, perfect for healthy meals. Takes 4 growth stages, can be watered to speed growth.',
  'chili-pepper-seeds': 'Plant these to grow hot red chili peppers with fiery heat. Takes 4 growth stages, can be watered to speed growth.',
  'green-bell-pepper-seeds': 'Plant these to grow sweet green bell peppers, perfect for cooking. Takes 4 growth stages, can be watered to speed growth.',
  'red-bell-pepper-seeds': 'Plant these to grow sweet red bell peppers with vibrant color. Takes 4 growth stages, can be watered to speed growth.',
  'yellow-bell-pepper-seeds': 'Plant these to grow sweet yellow bell peppers with bright color. Takes 4 growth stages, can be watered to speed growth.',
  'jalapeno-seeds': 'Plant these to grow spicy jalapeño peppers with medium heat. Takes 4 growth stages, can be watered to speed growth.',
  'pumpkin-seeds': 'Plant these to grow large orange pumpkins, perfect for autumn dishes. Takes 4 growth stages, can be watered to speed growth.',
  'wheat-seeds': 'Plant these to grow golden wheat stalks, essential for baking. Takes 4 growth stages, can be watered to speed growth.',
  'soybean-seeds': 'Plant these to grow nutritious soybeans, great for protein. Takes 4 growth stages, can be watered to speed growth.',
  'chickpea-seeds': 'Plant these to grow chickpeas, perfect for making hummus. Takes 4 growth stages, can be watered to speed growth.',

  // Grown Crops
  'apple': 'A fresh red apple, sweet and crispy. Battle: 1 FP/1.3s, +1 FP for each fruit on platter.',
  'banana': 'A ripe yellow banana, sweet and nutritious. Battle: 1 FP/1.6s, Slip Guard blocks 1 –FP every 6s.',
  'cherry': 'Bright red cherries, sweet with a hint of tartness. Battle: 1 FP/1.4s, +2 FP burst on place.',
  'grape': 'Purple clusters of sweet grapes, juicy and delicious. Battle: 1 FP/1.4s, adjacent Sugar gives +1 FP every 5s.',
  'green-grape': 'Green clusters of sweet grapes, refreshing and juicy. Battle: 1 FP/1.4s, –1 FP to enemy every 8s.',
  'green-apple': 'A crisp green apple with tart flavor and satisfying crunch. Battle: 1 FP/1.3s, 20% chance to apply –1 FP.',
  'golden-apple': 'A rare golden apple with magical properties and sweet flavor. Battle: 1 FP/1.2s, counts as 2 fruits, +10% FP/s per fruit.',
  'black-cherry': 'Rich dark cherries, sweet with intense flavor. Battle: 1 FP/1.5s, 10% crit = +3 FP burst.',
  'dragonfruit': 'Exotic pink fruit with black seeds, mildly sweet and refreshing. Battle: 1 FP/1.1s, +5 FP shield at 10 FP.',
  'coconut': 'A tropical brown coconut with sweet milk and meat inside. Battle: 1 FP/1.7s, adjacent allies reduce –FP by 1 every 5s.',
  'kiwi': 'A fuzzy brown kiwi fruit with bright green flesh and tiny black seeds. Battle: 1 FP/1.3s, duo with Lime applies –1 FP every 4s.',
  'lime': 'A tart green citrus fruit, perfect for cooking and drinks. Battle: 1 FP/2.2s, cleanses debuffs every 6s.',
  'lemon': 'A bright yellow citrus fruit, sour and aromatic. Battle: 1 FP/2.2s, adjacent ally +0.3 FP/s.',
  'orange': 'Sweet orange citrus fruit, juicy and vitamin-rich. Battle: 1 FP/1.8s, +1 FP to all allies every 10s.',
  'strawberry': 'Sweet red berries with fresh flavor and tiny seeds. Battle: 1 FP/1.0s, +3 FP on place, Sugar gives +0.3 FP/s.',
  'raspberry': 'Tart red berries with complex flavor and delicate texture. Battle: 1 FP/1.1s, Sugar gives +0.4 FP/s.',
  'blackberry': 'Dark purple berries, tart and flavorful. Battle: 1 FP/1.15s, Sugar gives +0.4 FP/s.',
  'blueberry': 'Small blue berries, bursting with antioxidants and flavor. Battle: 1 FP/1.2s, speeds to 1.0s after 10s.',
  'watermelon': 'Large green melon with sweet red flesh and black seeds. Battle: 1 FP/1.5s, Basil or Lime gives +0.5 FP/s.',
  'pineapple': 'Tropical golden fruit with spiky crown and sweet tangy flavor. Battle: 1 FP/1.4s, Chili gives burn effect.',
  'tomato': 'A juicy red tomato, perfect for cooking, sauces, and fresh eating. Battle: 1 FP/3s, escalates to –2 FP/s after 10s.',
  'onion': 'A versatile white onion, essential for cooking and adds savory depth. Battle: 1 FP/2.0s, –1 FP to 2 enemies every 5s.',
  'red-onion': 'A beautiful purple-red onion with sweet flavor and gorgeous color. Battle: 1 FP/1.9s, –1 FP to 2 enemies every 4s.',
  'eggplant': 'A large purple vegetable with creamy flesh, perfect for Mediterranean dishes. Battle: 1 FP/2.0s, reduces –FP by 1 every 5s.',
  'green-chile-pepper': 'A spicy green pepper with mild heat, adds flavor to any dish. Battle: 1 FP/1.9s, –1 FP/3s for 6s to nearest enemy.',
  'avocado': 'A creamy green fruit rich in healthy fats, perfect for salads and toast. Battle: 1 FP/1.7s, Lime/Tomato gives +0.5 FP/s and shield.',
  'chili-pepper': 'A fiery red pepper that brings intense heat to your cooking. Battle: 1 FP/1.7s, –1 FP/s for 2s every 7s.',
  'green-bell-pepper': 'A sweet, crisp green pepper that adds crunch and flavor to meals. Battle: 1 FP/1.8s, Tri-Bell bonus +0.5 FP/s.',
  'red-bell-pepper': 'A sweet red pepper with vibrant color and crisp texture. Battle: 1 FP/1.6s, +2 FP burst every 10s.',
  'yellow-bell-pepper': 'A sweet yellow bell pepper with bright color and crisp texture. Battle: 1 FP/1.7s, adjacent allies +0.2 FP/s.',
  'jalapeno': 'A spicy green pepper with medium heat, perfect for adding kick to your meals. Battle: 1 FP/1.6s, –1 FP/s for 2s every 6s.',
  'pumpkin': 'A large orange pumpkin, perfect for autumn cooking and hearty dishes. Battle: 1 FP/1.8s, Sugar/Nutmeg gives +0.6 FP/s.',
  'wheat': 'Golden wheat stalks ready for harvest, perfect for baking and cooking. Combine with Water to make Dough!',
  'soybean': 'Nutritious brown-green beans, great for protein and versatile cooking. Battle: 1 FP/1.8s, Garlic/Cajun gives +0.5 FP/s.',
  'chickpeas': 'Protein-rich beige legumes, perfect for making creamy hummus. Battle: 1 FP/1.9s, base for hummus family recipes.',

  // Spices
  'garlic': 'Aromatic garlic bulb, essential for savory dishes. Battle: Support item that enhances adjacent Soybean and other savory combinations.',
  'basil': 'Fresh aromatic herb, great for Italian cuisine. Battle: Support item that enhances adjacent Watermelon and creates herb synergies.',
  'sugar': 'Sweet crystalline ingredient for desserts and baking. Battle: Support item that enhances all adjacent berries and pairs with Pumpkin.',
  'nutmeg': 'Warm, sweet spice perfect for desserts and autumn flavors. Battle: Support item that pairs with Pumpkin for dessert combinations.',
  'cajun': 'Bold spice blend with heat and complex flavors from Louisiana. Battle: Support item that enhances adjacent Soybean with bold flavors.',

  // Special Items
  'water': 'Pure clean water, essential for cooking and baking. Use watering can on empty kitchen slots to add water for recipes.',

  // Basic Dishes
  'dough': 'Fresh dough made from water and wheat, ready for baking. Battle: 1 FP/1s, 5% chance to block all –FP. Recipe: Water + Wheat.',
  'apple-pie': 'A delicious apple pie made with fresh apples, dough, and sugar - the perfect dessert! Battle: 2.5 FP/3s, premium dessert. Recipe: Apple + Dough + Sugar.',
  'tomato-soup': 'A warm and comforting soup made with fresh tomatoes, aromatic basil, and pure water - perfect for a cozy meal! Battle: 1.8 FP/2s, reliable flavor generation. Recipe: Tomato + Basil + Water.',

  // Advanced Veg & Legume Dishes
  'cajun-garlic-soybeans': 'Spicy seasoned soybeans with defensive garlic properties. Battle: 1 FP/0.95s, +0.5 FP/s, burn and mitigation effects. Recipe: Soybean + Cajun + Garlic.',
  'lime-edamame': 'Fresh edamame with cleansing lime properties. Battle: 1 FP/1.1s, cleanses ally every 6s, +0.3 FP/s. Recipe: Soybean + Lime.',
  'eggplant-tomato-bake': 'Mediterranean bake combining defensive and offensive properties. Battle: 1 FP/1.0s, soak defense, tomato burn. Recipe: Eggplant + Tomato + Garlic.',
  'chili-garlic-eggplant': 'Spicy eggplant dish with defensive soak and burning attacks. Battle: 1 FP/0.95s, soak and burn effects. Recipe: Eggplant + Chili Pepper + Garlic.',
  'pumpkin-soup': 'Hearty pumpkin soup with initial burst and garlic effects. Battle: 1 FP/1.0s, +3 FP on place, garlic debuffs. Recipe: Pumpkin + Water + Garlic.',
  'spiced-pumpkin-puree': 'Rich spiced purée with nutmeg enhancement and sugar bursts. Battle: 1 FP/0.9s, +15% FP/s, +1 FP every 5s. Recipe: Pumpkin + Sugar + Nutmeg.',

  // Advanced Salad Dishes
  'guacamole': 'Creamy avocado dip with protective and cleansing properties. Battle: 1 FP/0.95s, +3 FP shield, cleanses and attacks. Recipe: Avocado + Lime + Onion.',
  'avocado-tomato-salad': 'Fresh salad with defensive shield and multi-enemy attacks. Battle: 1 FP/0.95s, +3 FP shield, attacks multiple enemies. Recipe: Avocado + Tomato + Red Onion.',
  'watermelon-basil-salad': 'Refreshing summer salad that supports the entire team. Battle: 1 FP/0.95s, team support abilities. Recipe: Watermelon + Basil + Lime.',

  // Sweet Dishes
  'caramelized-banana': 'Sweet caramelized fruit with defensive blocks and sugar bursts. Battle: 1 FP/1.0s, blocks and sugar effects. Recipe: Banana + Sugar.',
  'coconut-snow': 'Frozen treat that protects nearby allies with coconut aura. Battle: 1 FP/1.0s, ally protection and bursts. Recipe: Coconut + Sugar + Water.',
  'candied-orange-peel': 'Candied citrus that energizes the entire team with orange power. Battle: 1 FP/1.0s, team energy pulse. Recipe: Orange + Sugar + Water.',
  'candied-jalapenos': 'Sweet and spicy peppers that burn enemies while providing steady flavor. Battle: 1 FP/1.1s, burn and sugar effects. Recipe: Jalapeño + Sugar + Water.',
  'quick-pickled-onions': 'Tangy pickled onions with enhanced tear effects and self-cleaning. Battle: 1 FP/1.1s, stronger tears, self-cleanse. Recipe: Red Onion + Lime + Water.',

  // Frozen Treats
  'watermelon-lime-granita': 'Icy watermelon treat that refreshes allies and cleanses debuffs. Battle: 1 FP/1.0s, ally refresh and cleanse. Recipe: Watermelon + Lime + Sugar.',
  'dragonfruit-sorbet': 'Exotic frozen dessert with mysterious protective properties. Battle: 1 FP/0.95s, exotic armor and bursts. Recipe: Dragonfruit + Sugar + Water.',
  'blueberry-ice': 'Healthy blue ice with protective antioxidant properties. Battle: 1 FP/1.05s, antioxidant shield. Recipe: Blueberry + Sugar + Water.',
  'pineapple-coconut-ice': 'Tropical frozen treat that protects from heat and boosts allies. Battle: 1 FP/1.0s, heat immunity and ally boost. Recipe: Pineapple + Coconut + Sugar.',

  // Drinks
  'lemonade': 'Classic lemon drink that bursts with citrus energy and cleanses allies. Battle: 1 FP/1.1s, citrus burst and cleanse. Recipe: Lemon + Sugar + Water.',
  'limeade': 'Refreshing lime drink that hydrates the team and cleanses debuffs. Battle: 1 FP/1.1s, team hydration and cleanse. Recipe: Lime + Sugar + Water.',
  'orangeade': 'Energizing orange drink that provides lasting vitamin enhancement. Battle: 1 FP/1.05s, vitamin boost for team. Recipe: Orange + Sugar + Water.',
  'grape-juice': 'Rich grape juice packed with antioxidants and debuff resistance. Battle: 1 FP/1.0s, antioxidant power and resistance. Recipe: Grape + Sugar + Water.',

  // Salsas
  'classic-pico': 'Classic fresh salsa that gets stronger with more vegetables nearby. Battle: 1 FP/0.95s, veggie synergy and attacks. Recipe: Tomato + Onion + Jalapeño.',
  'pineapple-chili-salsa': 'Spicy tropical salsa that burns enemies and feeds off fire damage. Battle: 1 FP/0.95s, tropical heat and fire synergy. Recipe: Pineapple + Chili Pepper + Lime.',
  'green-chile-salsa': 'Gentle green salsa with mild heat and cleansing properties. Battle: 1 FP/1.0s, mild heat and ally cleanse. Recipe: Green Chile Pepper + Onion + Lime.',
  'roasted-red-relish': 'Sweet roasted relish that enhances nearby items with smoky flavor. Battle: 1 FP/1.0s, sugar bursts and aroma boost. Recipe: Red Bell Pepper + Onion + Sugar.',
  'avocado-salsa-verde': 'Creamy green salsa that shields allies and reduces debuff damage. Battle: 1 FP/0.95s, ally protection and shields. Recipe: Avocado + Green Chile Pepper + Lime.',

  // Savory Sauces
  'quick-marinara': 'Classic tomato sauce that intensifies and enhances other dishes. Battle: 1 FP/1.0s, Italian intensity and flavor base. Recipe: Tomato + Garlic + Basil.',
  'cajun-tomato-base': 'Spicy Louisiana-style base that gets stronger when enemies suffer. Battle: 1 FP/0.95s, cajun heat, stronger when enemies debuffed. Recipe: Tomato + Onion + Cajun.',
  'pepper-trinity': 'Sacred Louisiana cooking base that elevates the entire team. Battle: 1 FP/1.0s, trinity power, team aura boost. Recipe: Green Bell Pepper + Onion + Cajun.',

  // Flatbreads
  'garlic-herb-flatbread': 'Rustic flatbread with garlic and fresh herbs that boosts nearby allies. Battle: 1.2 FP/1.2s, aromatic boost and cleanse. Recipe: Dough + Garlic + Basil.',
  'tomato-basil-flatbread': 'Mediterranean-style bread with tomato and basil that creates herb synergies. Battle: 1.1 FP/1.1s, Mediterranean harmony. Recipe: Dough + Tomato + Basil.',
  'tri-bell-pepper-flatbread': 'Colorful flatbread that gets stronger with pepper variety. Battle: 1.3 FP/1.3s, triple pepper power. Recipe: Dough + Green Bell Pepper + Red Bell Pepper.',
  'pepper-onion-flatbread': 'Savory flatbread with caramelized onions and peppers. Battle: 1 FP/1.2s, caramelized comfort. Recipe: Dough + Onion + Red Onion.',

  // Fruit Tarts
  'apple-tart': 'Elegant French tart with perfectly arranged apple slices. Battle: 1.4 FP/1.4s, French elegance and sugar boost. Recipe: Dough + Sugar + Apple.',
  'golden-apple-tart': 'Premium tart made with magical golden apples and expert pastry craft. Battle: 1.8 FP/1.4s, golden radiance and premium bonuses. Recipe: Dough + Sugar + Golden Apple.',
  'green-apple-tart': 'Balanced tart with tart green apples and sweet pastry. Battle: 1.3 FP/1.4s, tart balance and sugar synergy. Recipe: Dough + Sugar + Green Apple.',
  'strawberry-tart': 'Delightful tart showcasing fresh strawberries on buttery pastry. Battle: 1.5 FP/1.2s, berry sweetness and synergy. Recipe: Dough + Sugar + Strawberry.',
  'blueberry-tart': 'Healthy tart packed with antioxidant-rich blueberries. Battle: 1.4 FP/1.2s, antioxidant shield and power. Recipe: Dough + Sugar + Blueberry.',
  'blackberry-tart': 'Rich tart with dark blackberries that grows stronger when threatened. Battle: 1.6 FP/1.2s, dark berry power and immunity. Recipe: Dough + Sugar + Blackberry.',
  'raspberry-tart': 'Sophisticated tart with complex raspberry flavors and buttery crust. Battle: 1.5 FP/1.3s, complex flavors and random bonuses. Recipe: Dough + Sugar + Raspberry.',

  // Compotes
  'apple-compote': 'Comforting spiced apple compote that warms the entire team. Battle: 1.1 FP/1.5s, warm comfort and spice boost. Recipe: Apple + Sugar + Nutmeg.',
  'golden-apple-compote': 'Premium compote with magical golden apples and enchanting warmth. Battle: 1.5 FP/1.5s, golden warmth and magical aura. Recipe: Golden Apple + Sugar + Nutmeg.',

  // Jams & Preserves
  'cherry-jam': 'Classic cherry preserve with bright lemon notes for balance. Battle: 1.2 FP/1.6s, sweet preserve and citrus zing. Recipe: Cherry + Sugar + Lemon.',
  'mixed-berry-jam': 'Rich preserve combining multiple berry varieties for complex flavors. Battle: 1.4 FP/1.5s, berry medley and antioxidants. Recipe: Blueberry + Blackberry + Sugar.',
  'strawberry-jam': 'Traditional strawberry jam that pairs perfectly with bread items. Battle: 1.3 FP/1.4s, classic preserve and bread synergy. Recipe: Strawberry + Sugar + Lemon.',
  'grape-jelly': 'Pure grape jelly with smooth texture and concentrated flavor. Battle: 1.1 FP/1.7s, smooth essence and immunity. Recipe: Grape + Sugar + Water.',
  'orange-marmalade': 'British-style marmalade with bitter orange peel adding complexity. Battle: 1.3 FP/1.6s, citrus intensity and peel power. Recipe: Orange + Sugar + Lemon.',
  'kiwi-lime-jam': 'Exotic jam combining tropical kiwi with zesty lime for unique flavors. Battle: 1.2 FP/1.5s, exotic tang and cleanse. Recipe: Kiwi + Lime + Sugar.',
  'pineapple-preserves': 'Chunky pineapple preserve with natural enzymes and tropical sweetness. Battle: 1.4 FP/1.8s, tropical chunks and enzyme power. Recipe: Pineapple + Sugar + Lemon.',

  // Hummus Dishes
  'hummus': 'Classic Middle Eastern chickpea dip with garlic and lemon. Battle: 1.9 FP/s, Debuff Guard for adjacent allies on place, +0.4 FP/s near Wheat/Dough. Recipe: Chickpeas + Garlic + Lemon.',
  'pepper-hummus': 'Spicy red pepper hummus with roasted bell pepper flavors. Battle: 2.0 FP/s, inflicts Smolder debuff on nearest enemy. Recipe: Chickpeas + Red Bell Pepper + Garlic.',
  'jalapeno-lime-hummus': 'Zesty hummus with jalapeño heat and lime freshness. Battle: 1.8 FP/s, speed boost for allies, speed debuff for enemies. Recipe: Chickpeas + Jalapeño + Lime.',
  'avocado-hummus': 'Creamy green hummus enriched with fresh avocado. Battle: 1.7 FP/s, provides shield protection on placement. Recipe: Chickpeas + Avocado + Lime.',
  'herb-hummus': 'Aromatic hummus infused with fresh basil herbs. Battle: 1.8 FP/s, gains power from adjacent vegetables. Recipe: Chickpeas + Basil + Garlic.',
  'pumpkin-nutmeg-hummus': 'Seasonal hummus with roasted pumpkin and warm nutmeg. Battle: 1.7 FP/s, provides burst boost to next ally action. Recipe: Chickpeas + Pumpkin + Nutmeg.',
  'coconut-lime-hummus': 'Tropical hummus with coconut richness and lime zest. Battle: 1.8 FP/s, reduces burn damage for entire team. Recipe: Chickpeas + Coconut + Lime.'
};

// Helper function to get item type
export const getItemType = (itemId: string): string => {
  return ITEM_TYPES[itemId] || 'Unknown';
};

// Helper function to get item description with selling info
export const getItemDescription = (item: { id: string; name: string }): string => {
  let description = ITEM_DESCRIPTIONS[item.id] || 'A mysterious item...';
  
  // Add type information at the beginning
  const itemType = getItemType(item.id);
  description = `[${itemType}] ${description}`;
  
  // Add selling info for sellable items (not seeds, spices, or water)
  if (!item.id.endsWith('-seeds') && !['garlic', 'nutmeg', 'basil', 'sugar', 'cajun', 'water'].includes(item.id)) {
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
      'grape-jelly', 'orange-marmalade', 'kiwi-lime-jam', 'pineapple-preserves',
      'hummus', 'pepper-hummus', 'jalapeno-lime-hummus', 'avocado-hummus', 'herb-hummus', 
      'pumpkin-nutmeg-hummus', 'coconut-lime-hummus'
    ];
    
    if (twoIngredientDishes.includes(item.id)) {
      description += ` • Sells for 11 gold each`;
    } else if (threeIngredientDishes.includes(item.id)) {
      description += ` • Sells for 15 gold each`;
    } else {
      // Spices sell for 50% of their purchase price
      const spicePrices: { [key: string]: number } = {
        'garlic': 2, // Sold for 1 gold (50% of 2)
        'nutmeg': 3, // Sold for 1.5 gold (50% of 3) - round to 2
        'basil': 2, // Sold for 1 gold (50% of 2)
        'sugar': 2, // Sold for 1 gold (50% of 2)
        'cajun': 4 // Sold for 2 gold (50% of 4)
      };
      
      if (spicePrices[item.id]) {
        const sellPrice = Math.round(spicePrices[item.id] * 0.5);
        description += ` • Sells for ${sellPrice} gold each`;
      } else {
        // Grown crops sell for double their seed price
        const seedPrices: { [key: string]: number } = {
          'apple': 2, 'banana': 3, 'blackberry': 4, 'black-cherry': 5, 'blueberry': 3,
          'soybean': 4, 'grape': 4, 'cherry': 3, 'golden-apple': 6, 'dragonfruit': 7,
          'coconut': 5, 'kiwi': 4, 'lime': 3, 'green-grape': 4, 'green-apple': 2,
          'lemon': 3, 'strawberry': 3, 'raspberry': 4, 'watermelon': 5, 'pineapple': 6,
          'orange': 3, 'eggplant': 4, 'green-chile-pepper': 3, 'avocado': 5, 'chili-pepper': 4,
          'green-bell-pepper': 3, 'red-bell-pepper': 3, 'onion': 2, 'jalapeno': 4,
          'pumpkin': 6, 'red-onion': 3, 'tomato': 3, 'yellow-bell-pepper': 3, 'wheat': 4,
          'chickpeas': 4
        };
        const sellPrice = seedPrices[item.id] ? seedPrices[item.id] * 2 : 1;
        description += ` • Sells for ${sellPrice} gold each`;
      }
    }
  }
  
  return description;
};
