export type DietaryTag = 'GF' | 'EF' | 'DF' | 'Vegan' | 'Grassfed' | 'Tanpa Tepung' | 'Organik' | 'Halal';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  price: number;
  portion?: string;
  isAvailable: boolean;
  dietaryTags: DietaryTag[];
  notes?: string;
  brand?: string;
}

export interface CategoryGroup {
  key: string;
  title: string;
  description?: string;
  iconName: string;
  disclaimer?: string;
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { key: 'dessert-jar-300', title: 'Dessert Jar 300ml', description: 'Artisanal gluten-free cake jar mewah 300ml', iconName: 'Cake' },
  { key: 'petite-dessert-100', title: 'PETITE Dessert Jar 100ml', description: 'Ukuran petite personal pas untuk tester & camilan sehat', iconName: 'Coffee' },
  { key: 'sweet-tooth-non-vegan', title: 'Sweet Tooth non Vegan', description: 'Brownie cheesecake, slice cake, dan muffin kaya keju alami', iconName: 'Cookie' },
  { key: 'vegan-ef-df-gf-cake', title: 'Vegan, EF, DF, GF Cake', description: '100% Plant-based, bebas telur, bebas susu sapi, dan gluten-free', iconName: 'Sparkles' },
  { key: 'enrich-sourdough-bun', title: 'Enrich Sourdough Bun', description: 'Roti bun fermentasi alami sourdough kaya nutrisi', iconName: 'Flame' },
  { key: 'bread-loaf', title: 'Bread Loaf (Roti Tawar)', description: 'Roti tawar shokupan grassfed & varian vegan', iconName: 'Sandwich', disclaimer: 'Roti sourdough bisa disimpan freezer dan reheat kembali (kukus) sebelum dimakan -+ 5 menit agar fluffy kembali.' },
  { key: 'beverages', title: 'Beverages', description: 'Kombucha artisanal, raw milk grassfed, dan jamu herbal seduh', iconName: 'GlassWater' },
  { key: 'frozen-egg-free', title: 'Homemade Frozen Food (Bebas Telur)', description: 'Nugget, karaage, luncheon, siomay & dimsum aman alergi telur', iconName: 'Snowflake' },
  { key: 'frozen-food', title: 'Homemade Frozen Food', description: 'Bakso sapi tanpa tepung, pempek tenggiri GF, risol, dan dimsum', iconName: 'PackageCheck' },
  { key: 'lauk', title: 'LAUK Siap Saji', description: 'Ayam rempah, opor, bacem, rica, dan rendang tanpa MSG', iconName: 'UtensilsCrossed' },
  { key: 'hati', title: 'Olahan Hati Ayam', description: 'Hati ayam kaya zat besi dimasak bumbu rempah tradisional', iconName: 'HeartHandshake' },
  { key: 'sate', title: 'Sate & Baceman', description: 'Baceman kulit ayam gurih khas dengan bumbu meresap', iconName: 'Flame' },
  { key: 'ikan', title: 'Olahan Ikan & Seafood', description: 'Sarden, manyung asap, rica tongkol, dan teri medan', iconName: 'Fish' },
  { key: 'mie-kit', title: 'EF GF Mie & Racik Kit', description: 'Japchae grassfed beef & paketan racik mie bakso komplit', iconName: 'Soup' },
  { key: 'sapi', title: 'Olahan Daging Sapi', description: 'Daging semur, empal gepuk, rendang & mercon empuk', iconName: 'Beef' },
  { key: 'pepes', title: 'Pepes Tradisional', description: 'Pepes daun pisang aroma rempah kukus lembut', iconName: 'Leaf' },
  { key: 'sambal', title: 'Sambal & Lado', description: 'Sambal cumi, tongkol, terasi & krecek pedas mantap', iconName: 'Flame' },
  { key: 'sauce-kimchi', title: 'Homemade Sauce & Kimchi', description: 'Chili oil non-RBD, kimchi probiotik alami, dan BBQ sauce', iconName: 'Jar' },
  { key: 'snacks', title: 'Homemade Healthy Snacks', description: 'Peyek, banana chips raw cocoa, chizzy bites, dan kering tempe', iconName: 'Popcorn' },
  { key: 'others', title: 'Mentega & Produk Khusus', description: 'Grassfed butter, whipping cream, vegan butter, dan tape singkong', iconName: 'Milk' },
  { key: 'kitchen-raw-materials', title: 'Kitchen Raw Material', description: 'Bumbu dasar Rarumi, kecap kelapa, garam laut alami & bihun', iconName: 'ChefHat' },
  { key: 'organic-meat', title: 'Ayam & Daging Organik', description: 'Daging sapi grassfed potongan dan ayam berkah probiotik', iconName: 'Layers' },
  { key: 'supplements', title: 'Suplementasi Organik & Lokal', description: 'Ashwagandha, moringa, charcoal, sambiloto & temulawak murni', iconName: 'ShieldPlus' }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // 1. Dessert Jar 300ml
  { id: 'dj-1', name: 'Purple Ubeechiz Cake', category: 'Dessert Jar 300ml', categoryKey: 'dessert-jar-300', price: 100000, portion: '300ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'dj-2', name: 'Mangochiz Cake', category: 'Dessert Jar 300ml', categoryKey: 'dessert-jar-300', price: 105000, portion: '300ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'dj-3', name: 'Mixed Berrychiz Cake', category: 'Dessert Jar 300ml', categoryKey: 'dessert-jar-300', price: 110000, portion: '300ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'dj-4', name: 'Chocochiz Cake', category: 'Dessert Jar 300ml', categoryKey: 'dessert-jar-300', price: 115000, portion: '300ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'dj-5', name: 'Choco Cashew Cake', category: 'Dessert Jar 300ml', categoryKey: 'dessert-jar-300', price: 120000, portion: '300ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'dj-6', name: 'Pistachio Coklad Cake', category: 'Dessert Jar 300ml', categoryKey: 'dessert-jar-300', price: 130000, portion: '300ml', isAvailable: false, dietaryTags: ['GF'] },

  // 2. PETITE Dessert Jar 100ml
  { id: 'pd-1', name: 'Purple Ubeechiz Cake', category: 'PETITE Dessert Jar 100ml', categoryKey: 'petite-dessert-100', price: 35000, portion: '100ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'pd-2', name: 'Mangochiz Cake', category: 'PETITE Dessert Jar 100ml', categoryKey: 'petite-dessert-100', price: 40000, portion: '100ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'pd-3', name: 'Mixed Berrychiz Cake', category: 'PETITE Dessert Jar 100ml', categoryKey: 'petite-dessert-100', price: 40000, portion: '100ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'pd-4', name: 'Chocochiz Cake', category: 'PETITE Dessert Jar 100ml', categoryKey: 'petite-dessert-100', price: 40000, portion: '100ml', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'pd-5', name: 'Pistachio Coklad Cake', category: 'PETITE Dessert Jar 100ml', categoryKey: 'petite-dessert-100', price: 45000, portion: '100ml', isAvailable: false, dietaryTags: ['GF'] },

  // 3. Sweet Tooth non Vegan
  { id: 'st-1', name: 'GF Minibites fudge brownie cheese cake kecil', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 45000, portion: 'Ukuran Kecil', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'st-2', name: 'GF Minibites fudge brownie cheese cake sedang', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 65000, portion: 'Ukuran Sedang', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'st-3', name: 'GF Gamchi Natural Cheese', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 45000, isAvailable: true, dietaryTags: ['GF'] },
  { id: 'st-4', name: 'GF Double Coklad 10x10cm', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 185000, portion: '10x10cm', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'st-5', name: 'GF Carrot Slice Cake', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 65000, portion: '1 Slice', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'st-6', name: 'GF Chocochiz Slice Cake', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 65000, portion: '1 Slice', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'st-7', name: 'GF Double Coklad Slice Cake', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 65000, portion: '1 Slice', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'st-8', name: 'GF Guava Cheese slice Cake', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 65000, portion: '1 Slice', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'st-9', name: 'GF Beet Root Cheese Slice Cake', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 65000, portion: '1 Slice', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'st-10', name: 'GF FF Basque Burnt Cheese Slice Cake', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 60000, portion: '1 Slice', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'st-11', name: 'EF GF London Slice Cake', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 55000, portion: '1 Slice', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'st-12', name: 'EF GF Muffin Banana cheese isi 2', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 45000, portion: 'isi 2', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'st-13', name: 'EF GF Banana Cheese 10x10cm', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 80000, portion: '10x10cm', isAvailable: false, dietaryTags: ['EF', 'GF'] },
  { id: 'st-14', name: 'GF Wingko Babat isi 10pcs', category: 'Sweet Tooth non Vegan', categoryKey: 'sweet-tooth-non-vegan', price: 30000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['GF'] },

  // 4. Vegan, EF, DF, GF Cake
  { id: 'vg-1', name: 'Muffin Banana Original isi 2', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 35000, portion: 'isi 2', isAvailable: true, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },
  { id: 'vg-2', name: 'Muffin Choco Banana isi 2', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 40000, portion: 'isi 2', isAvailable: true, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },
  { id: 'vg-3', name: 'Double coklad Slice Cake', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 75000, portion: '1 Slice', isAvailable: false, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },
  { id: 'vg-4', name: 'Double coklad cake 10x10cm', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 190000, portion: '10x10cm', isAvailable: false, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },
  { id: 'vg-5', name: 'Banana Cake 10x10cm', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 70000, portion: '10x10cm', isAvailable: false, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },
  { id: 'vg-6', name: 'Banana Cake 22x10cm', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 135000, portion: '22x10cm', isAvailable: false, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },
  { id: 'vg-7', name: 'Proll Tape 10x10cm', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 70000, portion: '10x10cm', isAvailable: false, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },
  { id: 'vg-8', name: 'Soft Kukis Double Coklad', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 25000, isAvailable: false, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },
  { id: 'vg-9', name: 'Soft Kukis Matcha', category: 'Vegan, EF, DF, GF Cake', categoryKey: 'vegan-ef-df-gf-cake', price: 30000, isAvailable: false, dietaryTags: ['Vegan', 'EF', 'DF', 'GF'] },

  // 5. Enrich Sourdough Bun
  { id: 'sb-1', name: 'Earl grey', category: 'Enrich Sourdough Bun', categoryKey: 'enrich-sourdough-bun', price: 20000, isAvailable: false, dietaryTags: ['Halal'] },
  { id: 'sb-2', name: 'Matcha cheese', category: 'Enrich Sourdough Bun', categoryKey: 'enrich-sourdough-bun', price: 22000, isAvailable: false, dietaryTags: ['Halal'] },
  { id: 'sb-3', name: 'Double coklad', category: 'Enrich Sourdough Bun', categoryKey: 'enrich-sourdough-bun', price: 20000, isAvailable: false, dietaryTags: ['Halal'] },
  { id: 'sb-4', name: 'Piscok Roll', category: 'Enrich Sourdough Bun', categoryKey: 'enrich-sourdough-bun', price: 22000, isAvailable: true, dietaryTags: ['Halal'] },
  { id: 'sb-5', name: 'Chicken bun', category: 'Enrich Sourdough Bun', categoryKey: 'enrich-sourdough-bun', price: 20000, isAvailable: false, dietaryTags: ['Halal'] },
  { id: 'sb-6', name: 'Beef Bbq', category: 'Enrich Sourdough Bun', categoryKey: 'enrich-sourdough-bun', price: 20000, isAvailable: false, dietaryTags: ['Halal'] },
  { id: 'sb-7', name: 'EF Pizza', category: 'Enrich Sourdough Bun', categoryKey: 'enrich-sourdough-bun', price: 75000, isAvailable: false, dietaryTags: ['EF', 'Halal'] },

  // 6. Bread Loaf (Roti Tawar)
  { id: 'bl-1', name: 'Grassfed Butter Shokupan', category: 'Bread Loaf (Roti Tawar)', categoryKey: 'bread-loaf', price: 70000, isAvailable: true, dietaryTags: ['Grassfed', 'Halal'] },
  { id: 'bl-2', name: 'Cheese', category: 'Bread Loaf (Roti Tawar)', categoryKey: 'bread-loaf', price: 65000, isAvailable: true, dietaryTags: ['Halal'] },
  { id: 'bl-3', name: 'Vegan Original', category: 'Bread Loaf (Roti Tawar)', categoryKey: 'bread-loaf', price: 55000, isAvailable: true, dietaryTags: ['Vegan', 'DF', 'EF'] },
  { id: 'bl-4', name: 'Vegan Whole Wheat', category: 'Bread Loaf (Roti Tawar)', categoryKey: 'bread-loaf', price: 60000, isAvailable: true, dietaryTags: ['Vegan', 'DF', 'EF'] },
  { id: 'bl-5', name: 'Vegan Coklat', category: 'Bread Loaf (Roti Tawar)', categoryKey: 'bread-loaf', price: 65000, isAvailable: true, dietaryTags: ['Vegan', 'DF', 'EF'] },

  // 7. Beverages
  { id: 'bv-1', name: 'Kombucha fermented black tea 250ml', category: 'Beverages', categoryKey: 'beverages', price: 16000, portion: '250ml', isAvailable: true, dietaryTags: ['Vegan', 'GF', 'Organik'] },
  { id: 'bv-2', name: 'Kombucha fermented black tea 1L', category: 'Beverages', categoryKey: 'beverages', price: 55000, portion: '1L', isAvailable: true, dietaryTags: ['Vegan', 'GF', 'Organik'] },
  { id: 'bv-3', name: 'Grassfed Raw Milk Coklat', category: 'Beverages', categoryKey: 'beverages', price: 15000, isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'bv-4', name: 'Grassfed Raw Milk Plain 1 liter', category: 'Beverages', categoryKey: 'beverages', price: 25000, portion: '1 Liter', isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'bv-5', name: 'Grassfed Raw Goat Milk Plain 1 liter', category: 'Beverages', categoryKey: 'beverages', price: 55000, portion: '1 Liter', isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'bv-6', name: 'Grassfed Raw Goat Milk Plain 200ml', category: 'Beverages', categoryKey: 'beverages', price: 15000, portion: '200ml', isAvailable: true, dietaryTags: ['Grassfed'] },
  { id: 'bv-7', name: 'Sucangjo 1 liter', category: 'Beverages', categoryKey: 'beverages', price: 55000, portion: '1 Liter', isAvailable: true, dietaryTags: ['Vegan', 'Organik'] },
  { id: 'bv-8', name: 'Sucangjo 250ml', category: 'Beverages', categoryKey: 'beverages', price: 15000, portion: '250ml', isAvailable: true, dietaryTags: ['Vegan', 'Organik'] },
  { id: 'bv-9', name: 'Digestive Tea 250ml', category: 'Beverages', categoryKey: 'beverages', price: 15000, portion: '250ml', isAvailable: true, dietaryTags: ['Vegan', 'Organik'] },
  { id: 'bv-10', name: 'Kunyit Asem 250ml', category: 'Beverages', categoryKey: 'beverages', price: 15000, portion: '250ml', isAvailable: true, dietaryTags: ['Vegan', 'Organik'] },
  { id: 'bv-11', name: 'Lemon Sereh 250ml', category: 'Beverages', categoryKey: 'beverages', price: 15000, portion: '250ml', isAvailable: true, dietaryTags: ['Vegan', 'Organik'] },

  // 8. Homemade Frozen Food (Bebas Telur)
  { id: 'ff-ef-1', name: 'EF GF Nugget Ayam isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 40000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF', 'Tanpa Tepung'] },
  { id: 'ff-ef-2', name: 'EF GF Nugget Ayam isi 15pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 65000, portion: 'isi 15pcs', isAvailable: true, dietaryTags: ['EF', 'GF', 'Tanpa Tepung'] },
  { id: 'ff-ef-3', name: 'EF GF Ayam Keju isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 50000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-4', name: 'EF GF Chicken Karaage 250gr', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 40000, portion: '250gr', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-5', name: 'EF GF Slice Luncheon 150gr', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 45000, portion: '150gr', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-6', name: 'EF GF Block Luncheon 200gr', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 55000, portion: '200gr', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-7', name: 'GF EF Dimsum Ayam Seaweed isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 50000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-8', name: 'EF GF Lumpia Ayam Kulit Tahu isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 50000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-9', name: 'EF GF Sosis Ayam 200-225gr', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 50000, portion: '200-225gr', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-10', name: 'EF GF Cireng Natural Cheese isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 50000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-11', name: 'EF GF Cireng Ayam tidak pedas isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 40000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-12', name: 'EF GF Cireng Ayam pedas isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 45000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-13', name: 'EF GF Cireng Daging pedas isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 50000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-14', name: 'EF GF Siomay 250gr', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 40000, portion: '250gr', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-15', name: 'EF GF Batagor Ayam Tahu isi 8-10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 40000, portion: 'isi 8-10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-16', name: 'EF GF Combro Oncom Pedas isi 5pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 25000, portion: 'isi 5pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-17', name: 'EF GF Combro Daging isi 5pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 35000, portion: 'isi 5pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-18', name: 'EF GF Cilok isi ayam suwir 200gr', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 35000, portion: '200gr', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-19', name: 'Lemper isi 5pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 40000, portion: 'isi 5pcs', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-ef-20', name: 'Arem2 isi Daging isi 3pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 40000, portion: 'isi 3pcs', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-ef-21', name: 'Arem2 isi Daging isi 5pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 55000, portion: 'isi 5pcs', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-ef-22', name: 'Arem2 isi Semur Ati ayam isi 3pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 40000, portion: 'isi 3pcs', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-ef-23', name: 'EF GF Onde Cangjo isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 55000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-24', name: 'EF GF Onde Ubeechizmeltz isi 10pcs', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 55000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['EF', 'GF'] },
  { id: 'ff-ef-25', name: 'Uli Ketan Kelapa 500gr', category: 'Homemade Frozen Food (Bebas Telur)', categoryKey: 'frozen-egg-free', price: 55000, portion: '500gr', isAvailable: true, dietaryTags: ['GF', 'Vegan'] },

  // 9. Homemade Frozen Food
  { id: 'ff-1', name: 'Bakso Urat Besar tanpa tepung', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 60000, isAvailable: true, dietaryTags: ['Tanpa Tepung', 'GF'] },
  { id: 'ff-2', name: 'Bakso Mercon Besar tanpa tepung', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 60000, isAvailable: true, dietaryTags: ['Tanpa Tepung', 'GF'] },
  { id: 'ff-3', name: 'Bakso Sapi tanpa tepung isi 50pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 75000, portion: 'isi 50pcs', isAvailable: true, dietaryTags: ['Tanpa Tepung', 'GF'] },
  { id: 'ff-4', name: 'Bakso Sapi tanpa tepung isi 25pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 45000, portion: 'isi 25pcs', isAvailable: true, dietaryTags: ['Tanpa Tepung', 'GF'] },
  { id: 'ff-5', name: 'Pentol Bakso Sapi tanpa tepung isi 100pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 70000, portion: 'isi 100pcs', isAvailable: true, dietaryTags: ['Tanpa Tepung', 'GF'] },
  { id: 'ff-6', name: 'Tahu Bakso Sapi tanpa tepung isi 10pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 45000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['Tanpa Tepung', 'GF'] },
  { id: 'ff-7', name: 'GF Eggroll 300gr', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 40000, portion: '300gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-8', name: 'GF Pempek Dos', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 30000, isAvailable: false, dietaryTags: ['GF'] },
  { id: 'ff-9', name: 'GF Pempek Ikan Tenggiri isi Natural Cheese', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 60000, isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-10', name: 'GF Pempek Ikan Tenggiri Mix (Adaan + Kulit + Lenjer + Kapal Selam)', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 60000, portion: 'Mix Komplit', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-11', name: 'GF Pempek Kapsel', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 55000, isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-12', name: 'GF Pempek Adaan Kulit', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 60000, isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-13', name: 'GF Pempek Kulit', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 60000, isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-14', name: 'GF Pempek Adaan', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 60000, isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-15', name: 'GF Risol Ragout Daging Grassfed isi 5pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 50000, portion: 'isi 5pcs', isAvailable: true, dietaryTags: ['GF', 'Grassfed'] },
  { id: 'ff-16', name: 'GF Risol Daging Grassfed Sayur isi 5pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 50000, portion: 'isi 5pcs', isAvailable: true, dietaryTags: ['GF', 'Grassfed'] },
  { id: 'ff-17', name: 'GF Risol Creamy Beef Bbq isi 3 pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 45000, portion: 'isi 3 pcs', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'ff-18', name: 'GF Sosis Solo isi 5pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 40000, portion: 'isi 5pcs', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-19', name: 'GF Lumpia Ayam Udang Kulit Tahu isi 10pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 50000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-20', name: 'GF Lumpia Ayam Udang Kulit Tahu isi 20pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 90000, portion: 'isi 20pcs', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-21', name: 'GF Dimsum nori roll isi 15pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 60000, portion: 'isi 15pcs', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ff-22', name: 'Dimsum kulitnya gluten isi 10pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 45000, portion: 'isi 10pcs', isAvailable: true, dietaryTags: ['Halal'], notes: 'Kulit mengandung gluten' },
  { id: 'ff-23', name: 'Dimsum kulitnya gluten isi 15pcs', category: 'Homemade Frozen Food', categoryKey: 'frozen-food', price: 70000, portion: 'isi 15pcs', isAvailable: true, dietaryTags: ['Halal'], notes: 'Kulit mengandung gluten' },

  // 10. LAUK
  { id: 'lk-1', name: 'Ayam Rempah fillet 250gr', category: 'LAUK', categoryKey: 'lauk', price: 35000, portion: '250gr', isAvailable: true, dietaryTags: ['GF', 'Tanpa Tepung'] },
  { id: 'lk-2', name: 'Ayam Opor 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-3', name: 'Ayam Rica2 non Pedas 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'lk-4', name: 'Ayam Rica2 Pedas 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'lk-5', name: 'Ayam Ungkep + sambal 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-6', name: 'Ayam Panggang + sambal 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-7', name: 'Ayam Semur 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-8', name: 'Ayam Bacem + sambal 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-9', name: 'Ayam Daun Jeruk + sambal 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 60000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-10', name: 'Ayam Bumbu Bali 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-11', name: 'Ayam Gongso 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-12', name: 'Garlic Chicken 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 60000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-13', name: 'Ayam kecap non Pedas 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-14', name: 'Ayam Kecap pedas 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 65000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-15', name: 'Ayam Rendang 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 70000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'lk-16', name: 'Bebek Bumbu Rempah 1/2 ekor', category: 'LAUK', categoryKey: 'lauk', price: 85000, portion: '1/2 ekor', isAvailable: true, dietaryTags: ['GF'] },

  // 11. Hati
  { id: 'ht-1', name: 'Hati Ayam Semur 250gr', category: 'Hati', categoryKey: 'hati', price: 45000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ht-2', name: 'Hati Ayam Pesmol 250gr', category: 'Hati', categoryKey: 'hati', price: 45000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ht-3', name: 'Hati Ayam Bumbu rempah 250gr', category: 'Hati', categoryKey: 'hati', price: 45000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ht-4', name: 'Hati Ayam Rica 250gr', category: 'Hati', categoryKey: 'hati', price: 45000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },

  // 12. Sate
  { id: 'st-kulit-1', name: 'Baceman Sate Kulit Ayam', category: 'Sate', categoryKey: 'sate', price: 40000, isAvailable: true, dietaryTags: ['GF'] },
  { id: 'st-kulit-2', name: 'Baceman Sate Kulit Ayam + Sambal', category: 'Sate', categoryKey: 'sate', price: 45000, isAvailable: true, dietaryTags: ['GF'] },

  // 13. Ikan
  { id: 'ik-1', name: 'Sarden Ikan 250gr', category: 'Ikan', categoryKey: 'ikan', price: 55000, portion: '250gr', isAvailable: false, dietaryTags: ['GF'] },
  { id: 'ik-2', name: 'Mangut Ikan Manyung Asap', category: 'Ikan', categoryKey: 'ikan', price: 65000, isAvailable: false, dietaryTags: ['GF'] },
  { id: 'ik-3', name: 'Rica Tongkol Suwir Kemangi non pedas 150gr', category: 'Ikan', categoryKey: 'ikan', price: 35000, portion: '150gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'ik-4', name: 'Kering Teri Medan non pedas 150gr', category: 'Ikan', categoryKey: 'ikan', price: 65000, portion: '150gr', isAvailable: true, dietaryTags: ['GF'] },

  // 14. EF GF Mie
  { id: 'mie-1', name: 'EF GF Japchae with grassfed Beef 250gr (GF Mie ala Korea)', category: 'EF GF Mie', categoryKey: 'mie-kit', price: 25000, portion: '250gr', isAvailable: true, dietaryTags: ['EF', 'GF', 'Grassfed'] },
  { id: 'mie-2', name: 'Paketan Racik GF Mie Ayam Bakso', category: 'EF GF Mie', categoryKey: 'mie-kit', price: 115000, portion: '1 Paket Komplit', isAvailable: true, dietaryTags: ['GF', 'Tanpa Tepung'], notes: '1 pax GF Mie isi 12 keping + Bakso Sapi Tanpa Tepung isi 25pcs + Ayam Fillet Rempah 250gr' },

  // 15. Sapi
  { id: 'sp-1', name: 'Daging Sapi Semur 250gr', category: 'Sapi', categoryKey: 'sapi', price: 80000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sp-2', name: 'Daging & Iga Sapi Mercon 250gr', category: 'Sapi', categoryKey: 'sapi', price: 85000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sp-3', name: 'Daging Sapi Empal Gepuk 250gr', category: 'Sapi', categoryKey: 'sapi', price: 80000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sp-4', name: 'Daging Sapi Rendang 250gr', category: 'Sapi', categoryKey: 'sapi', price: 88000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sp-5', name: 'Daging Sapi Gongso 250gr', category: 'Sapi', categoryKey: 'sapi', price: 80000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },

  // 16. Pepes
  { id: 'pp-1', name: 'Ayam Songkem isi 2 ptg', category: 'Pepes', categoryKey: 'pepes', price: 45000, portion: 'isi 2 ptg', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'pp-2', name: 'Pepes Belut 300gr', category: 'Pepes', categoryKey: 'pepes', price: 55000, portion: '300gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'pp-3', name: 'Pepes Ayam isi 3 ptg', category: 'Pepes', categoryKey: 'pepes', price: 55000, portion: 'isi 3 ptg', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'pp-4', name: 'Pepes Teri Nasi + Tahu + Telur 200gr', category: 'Pepes', categoryKey: 'pepes', price: 35000, portion: '200gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'pp-5', name: 'Pepes Ikan Kembung isi 1 ekor', category: 'Pepes', categoryKey: 'pepes', price: 35000, portion: 'isi 1 ekor', isAvailable: true, dietaryTags: ['GF'] },

  // 17. Sambal
  { id: 'sm-1', name: 'Sambal Krecek Hati Ayam 300gr', category: 'Sambal', categoryKey: 'sambal', price: 45000, portion: '300gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sm-2', name: 'Sambal Tongkol Kemangi 150gr', category: 'Sambal', categoryKey: 'sambal', price: 35000, portion: '150gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sm-3', name: 'Sambal Cumi Lado 150gr', category: 'Sambal', categoryKey: 'sambal', price: 35000, portion: '150gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sm-4', name: 'Cumi Cabai Ijo 150gr', category: 'Sambal', categoryKey: 'sambal', price: 35000, portion: '150gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sm-5', name: 'Sambal Terasi 100gr', category: 'Sambal', categoryKey: 'sambal', price: 15000, portion: '100gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sm-6', name: 'Sambal Terasi 200gr', category: 'Sambal', categoryKey: 'sambal', price: 25000, portion: '200gr', isAvailable: true, dietaryTags: ['GF'] },

  // 18. Homemade Sauce & Kimchi
  { id: 'sc-1', name: 'Homemade Chili Oil with cco non rbd 60ml', category: 'Homemade Sauce & Kimchi', categoryKey: 'sauce-kimchi', price: 20000, portion: '60ml', isAvailable: true, dietaryTags: ['GF', 'Vegan'] },
  { id: 'sc-2', name: 'Homemade Bbq Sauce', category: 'Homemade Sauce & Kimchi', categoryKey: 'sauce-kimchi', price: 35000, isAvailable: true, dietaryTags: ['GF', 'Vegan'] },
  { id: 'sc-3', name: 'Homemade Blackpepper Sauce', category: 'Homemade Sauce & Kimchi', categoryKey: 'sauce-kimchi', price: 35000, isAvailable: true, dietaryTags: ['GF', 'Vegan'] },
  { id: 'sc-4', name: 'Homemade Saus Cabai Pedas Rarumi 250ml', category: 'Homemade Sauce & Kimchi', categoryKey: 'sauce-kimchi', price: 35000, portion: '250ml', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Rarumi' },
  { id: 'sc-5', name: 'Homemade Kimchi 250gr', category: 'Homemade Sauce & Kimchi', categoryKey: 'sauce-kimchi', price: 30000, portion: '250gr', isAvailable: true, dietaryTags: ['GF', 'Vegan', 'Organik'] },
  { id: 'sc-6', name: 'Homemade Kimchi 500gr', category: 'Homemade Sauce & Kimchi', categoryKey: 'sauce-kimchi', price: 55000, portion: '500gr', isAvailable: true, dietaryTags: ['GF', 'Vegan', 'Organik'] },
  { id: 'sc-7', name: 'Homemade Kimchi 1kg', category: 'Homemade Sauce & Kimchi', categoryKey: 'sauce-kimchi', price: 95000, portion: '1kg', isAvailable: true, dietaryTags: ['GF', 'Vegan', 'Organik'] },

  // 19. Homemade Snacks
  { id: 'sn-1', name: 'Peyek Kacang 250gr', category: 'Homemade Snacks', categoryKey: 'snacks', price: 55000, portion: '250gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sn-2', name: 'Peyek Rebon 200gr', category: 'Homemade Snacks', categoryKey: 'snacks', price: 60000, portion: '200gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sn-3', name: 'Chizzy Bites 120gr', category: 'Homemade Snacks', categoryKey: 'snacks', price: 35000, portion: '120gr', isAvailable: true, dietaryTags: ['GF'] },
  { id: 'sn-4', name: 'Banana Chips Ori 250gr', category: 'Homemade Snacks', categoryKey: 'snacks', price: 35000, portion: '250gr', isAvailable: true, dietaryTags: ['Vegan', 'GF'] },
  { id: 'sn-5', name: 'Banana Chips Raw Cocoa 125gr', category: 'Homemade Snacks', categoryKey: 'snacks', price: 25000, portion: '125gr', isAvailable: true, dietaryTags: ['Vegan', 'GF'] },
  { id: 'sn-6', name: 'Kering Tempe 150gr', category: 'Homemade Snacks', categoryKey: 'snacks', price: 25000, portion: '150gr', isAvailable: true, dietaryTags: ['Vegan', 'GF'] },
  { id: 'sn-7', name: 'Kering Tempe 300gr', category: 'Homemade Snacks', categoryKey: 'snacks', price: 45000, portion: '300gr', isAvailable: true, dietaryTags: ['Vegan', 'GF'] },
  { id: 'sn-8', name: 'Kering Kentang Mustofa 150gr', category: 'Homemade Snacks', categoryKey: 'snacks', price: 30000, portion: '150gr', isAvailable: false, dietaryTags: ['Vegan', 'GF'] },

  // 20. Others
  { id: 'ot-1', name: 'Grassfed Whipping Cream', category: 'Others', categoryKey: 'others', price: 125000, isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'ot-2', name: 'Grassfed Butter 1kg', category: 'Others', categoryKey: 'others', price: 225000, portion: '1kg', isAvailable: true, dietaryTags: ['Grassfed'] },
  { id: 'ot-3', name: 'Organik Vegan Butter 1kg', category: 'Others', categoryKey: 'others', price: 205000, portion: '1kg', isAvailable: true, dietaryTags: ['Vegan', 'DF', 'Organik'] },
  { id: 'ot-4', name: 'Tape Singkong Mentega 500gr', category: 'Others', categoryKey: 'others', price: 18000, portion: '500gr', isAvailable: false, dietaryTags: ['Vegan'] },

  // 21. Kitchen Raw Material
  { id: 'km-1', name: 'Rarumi - Bumbu Jimbaran 200gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 35000, portion: '200gr', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Rarumi' },
  { id: 'km-2', name: 'Rarumi - Bumbu Pepes 200gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 35000, portion: '200gr', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Rarumi' },
  { id: 'km-3', name: 'Rarumi - Bumbu Soto Semarang 200gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 35000, portion: '200gr', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Rarumi' },
  { id: 'km-4', name: 'Rarumi - Bumbu SOP Bakso, Ayam, Daging 200gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 35000, portion: '200gr', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Rarumi' },
  { id: 'km-5', name: 'Rarumi - Bumbu Nasi Goreng 150gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 25000, portion: '150gr', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Rarumi' },
  { id: 'km-6', name: 'Rarumi - Bawang Goreng non Tepung CCO non RBD 60gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 40000, portion: '60gr', isAvailable: false, dietaryTags: ['GF', 'Tanpa Tepung', 'Vegan'], brand: 'Rarumi' },
  { id: 'km-7', name: 'Rarumi - Bawang Goreng non Tepung CCO non RBD 100gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 60000, portion: '100gr', isAvailable: true, dietaryTags: ['GF', 'Tanpa Tepung', 'Vegan'], brand: 'Rarumi' },
  { id: 'km-8', name: 'Rarumi - CCO non RBD 1L', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 55000, portion: '1L', isAvailable: true, dietaryTags: ['Vegan', 'Organik'], brand: 'Rarumi' },
  { id: 'km-9', name: 'Rarumi - CCO non RBD 500ml', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 30000, portion: '500ml', isAvailable: true, dietaryTags: ['Vegan', 'Organik'], brand: 'Rarumi' },
  { id: 'km-10', name: 'Gea Mie Block isi 12pcs', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 38000, portion: 'isi 12pcs', isAvailable: true, dietaryTags: ['Halal'], brand: 'Gea' },
  { id: 'km-11', name: 'Srunen - Saus Cabai Pedas 140ml', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 28000, portion: '140ml', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Srunen' },
  { id: 'km-12', name: 'Srunen - Saus Tomat Cabai 140ml', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 25000, portion: '140ml', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Srunen' },
  { id: 'km-13', name: 'Srunen - Saus Tomat 140ml', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 25000, portion: '140ml', isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Srunen' },
  { id: 'km-14', name: 'Srunen - Saus Tiram', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 30000, isAvailable: true, dietaryTags: ['GF'], brand: 'Srunen' },
  { id: 'km-15', name: 'Srunen - Kecap Manis Kelapa', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 25000, isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Srunen' },
  { id: 'km-16', name: 'Srunen - Kecap Asin Kelapa', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 25000, isAvailable: true, dietaryTags: ['GF', 'Vegan'], brand: 'Srunen' },
  { id: 'km-17', name: 'Nucifera - Coconut Milk Powder', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 47000, isAvailable: false, dietaryTags: ['Vegan', 'DF'], brand: 'Nucifera' },
  { id: 'km-18', name: 'Nucifera - Natural Sea Salt 500gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 28000, portion: '500gr', isAvailable: false, dietaryTags: ['Vegan', 'Organik'], brand: 'Nucifera' },
  { id: 'km-19', name: 'Nucifera - Kecap Kelapa 300ml', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 30000, portion: '300ml', isAvailable: false, dietaryTags: ['GF', 'Vegan'], brand: 'Nucifera' },
  { id: 'km-20', name: 'Nucifera - Kecap Kelapa 140ml', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 20000, portion: '140ml', isAvailable: false, dietaryTags: ['GF', 'Vegan'], brand: 'Nucifera' },
  { id: 'km-21', name: 'Lingkar Organik - Kecap Kedelai 300ml', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 28000, portion: '300ml', isAvailable: false, dietaryTags: ['Organik', 'Vegan'], brand: 'Lingkar Organik' },
  { id: 'km-22', name: 'Lingkar Organik - Kecap Kedelai 140ml', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 20000, portion: '140ml', isAvailable: false, dietaryTags: ['Organik', 'Vegan'], brand: 'Lingkar Organik' },
  { id: 'km-23', name: 'Lingkar Organik - Maseko Ayam', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 20000, isAvailable: false, dietaryTags: ['Organik'], brand: 'Lingkar Organik' },
  { id: 'km-24', name: 'Lingkar Organik - Maseko Sapi', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 20000, isAvailable: false, dietaryTags: ['Organik'], brand: 'Lingkar Organik' },
  { id: 'km-25', name: 'Lingkar Organik - Bihun Singkong', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 17000, isAvailable: true, dietaryTags: ['GF', 'Vegan', 'Organik'], brand: 'Lingkar Organik' },
  { id: 'km-26', name: 'Bihun Beras', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 23000, isAvailable: true, dietaryTags: ['GF', 'Vegan'] },
  { id: 'km-27', name: 'Bihun Ubi / Dangmyeon / Japchae 1kg', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 90000, portion: '1kg', isAvailable: true, dietaryTags: ['GF', 'Vegan'] },
  { id: 'km-28', name: 'Bihun Ubi / Dangmyeon / Japchae 500gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 50000, portion: '500gr', isAvailable: true, dietaryTags: ['GF', 'Vegan'] },
  { id: 'km-29', name: 'Bihun Ubi / Dangmyeon / Japchae 250gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 25000, portion: '250gr', isAvailable: true, dietaryTags: ['GF', 'Vegan'] },
  { id: 'km-30', name: 'Gula Tebu Organik 1kg', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 50000, portion: '1kg', isAvailable: true, dietaryTags: ['Vegan', 'Organik'] },
  { id: 'km-31', name: 'Gula Aren Organik Rarumi 1kg', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 50000, portion: '1kg', isAvailable: false, dietaryTags: ['Vegan', 'Organik'], brand: 'Rarumi' },
  { id: 'km-32', name: 'Bread Crumb Gluten Free', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 37000, isAvailable: true, dietaryTags: ['GF'] },
  { id: 'km-33', name: 'Natural Mirit Sea Salt 500gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 28000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'km-34', name: 'Natural kusamba Sea Salt 500gr', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 28000, portion: '500gr', isAvailable: true, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'km-35', name: 'Teri Asin Natural non formalin non p p p p', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 20000, isAvailable: false, dietaryTags: ['GF'] },
  { id: 'km-36', name: 'Teri Tawar Natural non formalin non p p p p', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 20000, isAvailable: false, dietaryTags: ['GF'] },
  { id: 'km-37', name: 'Cumi Asin Natural non p p p p', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 28000, isAvailable: false, dietaryTags: ['GF'] },
  { id: 'km-38', name: 'Dendeng Japuh Natural non formalin non p p p p', category: 'Kitchen Raw Material', categoryKey: 'kitchen-raw-materials', price: 18000, isAvailable: false, dietaryTags: ['GF'] },

  // 22. Ayam & Daging Organik
  { id: 'og-1', name: 'Ayam utuh polo', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 55000, portion: '1 Ekor', isAvailable: false, dietaryTags: ['Organik'] },
  { id: 'og-2', name: 'Daging slice veal grassfed 500gr', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 85000, portion: '500gr', isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'og-3', name: 'Daging slice shortplate premium grassfed 500gr', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 92000, portion: '500gr', isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'og-4', name: 'Daging Giling grassfed 500gr', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 68000, portion: '500gr', isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'og-5', name: 'Daging Sapi Muda grassfed 500gr', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 85000, portion: '500gr', isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'og-6', name: 'Shortrib grassfed 500gr', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 75000, portion: '500gr', isAvailable: false, dietaryTags: ['Grassfed'] },
  { id: 'og-7', name: 'Paha atas 1kg berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 75000, portion: '1kg', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-8', name: 'Paha atas 500gr berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 40000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-9', name: 'Paha bawah 1kg berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 75000, portion: '1kg', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-10', name: 'Paha bawah 500gr berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 40000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-11', name: 'Sayap 1kg berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 65000, portion: '1kg', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-12', name: 'Sayap 500gr berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 35000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-13', name: 'Wing Stick 500gr', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 48000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik'] },
  { id: 'og-14', name: 'Ati ampela 1kg berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 58000, portion: '1kg', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-15', name: 'Ati ampela 500gr berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 30000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-16', name: 'Ceker 1kg berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 63000, portion: '1kg', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-17', name: 'Ceker 500gr berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 35000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-18', name: 'Fillet paha 1kg chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 98000, portion: '1kg', isAvailable: false, dietaryTags: ['Organik'] },
  { id: 'og-19', name: 'Fillet paha 500gr', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 55000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik'] },
  { id: 'og-20', name: 'Fillet dada 1kg berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 95000, portion: '1kg', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },
  { id: 'og-21', name: 'Fillet dada 500gr berkah chicken', category: 'Ayam & Daging Organik', categoryKey: 'organic-meat', price: 52000, portion: '500gr', isAvailable: false, dietaryTags: ['Organik'], brand: 'Berkah Chicken' },

  // 23. Suplementasi Organik & Lokal
  { id: 'sp-sup-1', name: 'blood purifier', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 145000, isAvailable: false, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'sp-sup-2', name: 'ashwaganda', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 105000, isAvailable: true, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'sp-sup-3', name: 'sambiloto', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 95000, isAvailable: true, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'sp-sup-4', name: 'charcoal', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 95000, isAvailable: true, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'sp-sup-5', name: 'colloidal silver', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 120000, isAvailable: false, dietaryTags: ['Organik'] },
  { id: 'sp-sup-6', name: 'moringa', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 95000, isAvailable: true, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'sp-sup-7', name: 'temulawak', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 95000, isAvailable: true, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'sp-sup-8', name: 'extract papaya', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 95000, isAvailable: true, dietaryTags: ['Organik', 'Vegan'] },
  { id: 'sp-sup-9', name: 'minuman sari tradisi 120gr', category: 'Suplementasi Organik & Lokal', categoryKey: 'supplements', price: 145000, portion: '120gr', isAvailable: true, dietaryTags: ['Organik', 'Vegan'] }
];

// Helper to format Indonesian Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Helper to format short price (e.g. "45k" or "115k")
export function formatShortPrice(amount: number): string {
  if (amount % 1000 === 0) {
    return `${amount / 1000}k`;
  }
  return formatRupiah(amount);
}

// Generate the exact WhatsApp broadcast format from a list of items
export function generateBroadcastText(items: MenuItem[]): string {
  let text = `Bismillahirrahmannirrahim Ready today\n\n`;

  for (const group of CATEGORY_GROUPS) {
    const categoryItems = items.filter(item => item.categoryKey === group.key);
    if (categoryItems.length === 0) continue;

    text += `*${group.title}*\n`;
    for (const item of categoryItems) {
      const priceStr = formatShortPrice(item.price);
      const soldOutMarker = item.isAvailable ? '' : ' ❎️';
      text += `- ${item.name} ${priceStr}${soldOutMarker}\n`;
    }

    if (group.disclaimer) {
      text += `\nDisclaimer:\n${group.disclaimer}\n`;
    }
    text += `\n`;
  }

  return text.trim();
}
