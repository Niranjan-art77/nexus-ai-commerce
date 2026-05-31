// 2050 Quantum Local Database & API Simulator
// Persists records in localStorage to ensure all marketplace actions remain active client-side.

export interface MockReview {
  _id: string;
  user: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface MockQuestion {
  _id: string;
  user: string;
  question: string;
  answer?: string;
  createdAt: string;
}

export interface MockProduct {
  _id: string;
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  numReviews: number;
  stock: number;
  seller: string;
  images: string[];
  specifications: Record<string, string>;
  tags: string[];
  reviews: MockReview[];
  questions?: MockQuestion[];
  // Legacy fields for backward compatibility with UI rendering
  features?: string[];
  aiSummary?: string;
  aiPros?: string[];
  aiCons?: string[];
  idealUserType?: string;
  originalPrice?: number;
  deliveryDays?: number;
  approvalStatus?: "Approved" | "Pending" | "Rejected";
}

// Curated seed products to satisfy specific searches perfectly (e.g. iphone, laptop, dell, macbook)
const CURATED_SEEDS: Partial<MockProduct>[] = [
  // iPhones & Accessories
  {
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    description: "Experience the next level of mobile computing with the iPhone 15 Pro. Featuring an aerospace-grade titanium design, the groundbreaking A17 Pro chip, a customizable Action button, and a powerful 48MP main camera system.",
    price: 999,
    discount: 10,
    rating: 4.8,
    seller: "Apple Authorized Retail",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1565849906660-f86a6034f40f?auto=format&fit=crop&w=600&q=80"
    ],
    specifications: {
      "Display": "6.1-inch Super Retina XDR OLED",
      "Processor": "Apple A17 Pro (3nm)",
      "Camera": "Triple 48MP + 12MP + 12MP with 3x optical zoom",
      "Battery": "Up to 23 hours video playback",
      "Weight": "187 grams",
      "Storage": "128GB / 256GB / 512GB / 1TB"
    },
    tags: ["iphone", "apple", "phone", "ios", "smartphone", "mobile", "iphone 15", "pro"]
  },
  {
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "Smartphones",
    description: "The ultimate iPhone experience. Boasting a larger 6.9-inch display, the state-of-the-art A18 Pro chip, advanced Camera Control, and the best battery life ever in an iPhone.",
    price: 1199,
    discount: 5,
    rating: 4.9,
    seller: "Apple Authorized Retail",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551645121-d1034da75057?auto=format&fit=crop&w=600&q=80"
    ],
    specifications: {
      "Display": "6.9-inch Super Retina XDR OLED (120Hz)",
      "Processor": "Apple A18 Pro",
      "Camera": "48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto",
      "Battery": "Up to 33 hours video playback",
      "Weight": "227 grams",
      "Colors": "Desert Titanium, Natural Titanium, White, Black"
    },
    tags: ["iphone", "apple", "phone", "ios", "smartphone", "mobile", "iphone 16", "pro max"]
  },
  {
    name: "iPhone MagSafe Protective Case",
    brand: "Apple",
    category: "Accessories",
    description: "Crafted from premium silicone, this MagSafe-compatible protective case offers shock protection and clean charging convenience for your iPhone.",
    price: 49,
    discount: 15,
    rating: 4.5,
    seller: "Spigen Outlet Store",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9fc?auto=format&fit=crop&w=600&q=80"
    ],
    specifications: {
      "Material": "Silicone and microfibre lining",
      "Compatibility": "iPhone 15 / iPhone 16",
      "Wireless Charging": "MagSafe and Qi compatible",
      "Colors": "Charcoal Black, Midnight Blue, Stone Grey"
    },
    tags: ["iphone cases", "iphone case", "apple case", "cover", "silicone case", "accessories", "iphone"]
  },
  {
    name: "iPhone Fast USB-C Charger 30W",
    brand: "Anker",
    category: "Accessories",
    description: "Compact wall adapter utilizing GaN technology to safely quick-charge your iPhones and iPads up to 3 times faster than standard chargers.",
    price: 29,
    discount: 20,
    rating: 4.7,
    seller: "Anker Direct",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80"
    ],
    specifications: {
      "Wattage": "30W Power Delivery",
      "Port Type": "USB-C",
      "Technology": "GaNPrime Tech",
      "Size": "Compact folding plug design"
    },
    tags: ["iphone chargers", "iphone charger", "anker charger", "power brick", "fast charger", "accessories", "iphone"]
  },

  // Dell & Laptops
  {
    name: "Dell XPS 15 Creator Edition",
    brand: "Dell",
    category: "Laptops",
    description: "Fuel your creative projects with this Dell XPS 15 laptop. Packed with a stunning 4K OLED touch display, a powerful Intel Core i9 processor, and dedicated NVIDIA studio graphics inside a carbon fiber deck.",
    price: 2299,
    discount: 12,
    rating: 4.8,
    seller: "Dell Retail Services",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
    ],
    specifications: {
      "Screen": "15.6-inch 4K OLED InfinityEdge Touch (500 nits)",
      "CPU": "Intel Core i9-13900H (14-Core, up to 5.4 GHz)",
      "RAM": "32GB DDR5 Dual-Channel",
      "Storage": "1TB PCIe Gen4 NVMe SSD",
      "GPU": "NVIDIA GeForce RTX 4060 (8GB GDDR6)",
      "Battery": "86Whr integrated battery"
    },
    tags: ["dell", "laptop", "xps", "creator edition", "notebook", "pc", "windows laptop"]
  },
  {
    name: "MacBook Pro 16-inch M3 Max",
    brand: "Apple",
    category: "Laptops",
    description: "The ultimate laptop for developers and creative pros. Equipped with the revolutionary M3 Max chip, a gorgeous Liquid Retina XDR display, up to 22 hours of battery life, and professional connectivity ports.",
    price: 3499,
    discount: 8,
    rating: 4.9,
    seller: "Apple Authorized Retail",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=600&q=80"
    ],
    specifications: {
      "Display": "16.2-inch Liquid Retina XDR (3456 x 2234)",
      "Processor": "Apple M3 Max (16-Core CPU, 40-Core GPU)",
      "RAM": "48GB Unified Memory",
      "Storage": "1TB Superfast SSD",
      "Battery": "Up to 22 hours runtime",
      "Ports": "Thunderbolt 4, HDMI, SDXC, MagSafe 3"
    },
    tags: ["macbook pro", "apple", "laptop", "m3 max", "notebook", "macos", "creator tool"]
  },

  // Gaming
  {
    name: "Razer DeathAdder V3 Pro Wireless",
    brand: "Razer",
    category: "Gaming",
    description: "Designed with professional esports players, this ultra-lightweight ergonomic mouse features the Razer Focus Pro 30K Optical Sensor and zero latency HyperSpeed wireless connectivity.",
    price: 149,
    discount: 15,
    rating: 4.7,
    seller: "Razer Store Official",
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80"
    ],
    specifications: {
      "Sensor": "Focus Pro 30K Optical Sensor",
      "Weight": "63 grams (Ultra-lightweight)",
      "Battery Life": "Up to 90 hours",
      "Switch Type": "Optical Mouse Switches Gen-3",
      "Polling Rate": "Supports up to 4000Hz"
    },
    tags: ["razer", "gaming", "mouse", "deathadder", "wireless mouse", "gaming mouse"]
  },
  {
    name: "PlayStation 5 Pro Slim",
    brand: "Sony",
    category: "Gaming",
    description: "Experience lightning-fast loading speeds, deeper immersion with haptic feedback, 3D audio tech, and an all-new generation of incredible PlayStation games in a sleek, slim format.",
    price: 499,
    discount: 10,
    rating: 4.8,
    seller: "Sony Entertainment",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
    ],
    specifications: {
      "Storage": "1TB Custom High-Speed SSD",
      "Ray Tracing": "Yes, hardware accelerated",
      "Resolution": "Supports 4K 120Hz / 8K outputs",
      "Haptics": "DualSense Wireless Controller included"
    },
    tags: ["ps5", "sony", "console", "gaming console", "gaming", "playstation"]
  }
];

// Seed names, adjectives, specs to programmatically generate 1050 items
const BRANDS: Record<string, string[]> = {
  "Smartphones": ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Nexus"],
  "Laptops": ["Dell", "Apple", "HP", "Lenovo", "ASUS", "Razer", "Nexus"],
  "Gaming": ["Razer", "Logitech", "Corsair", "Sony", "Microsoft", "ASUS", "SteelSeries"],
  "Monitors": ["LG", "Samsung", "Dell", "ASUS", "BenQ", "Acer", "Nexus"],
  "AI Devices": ["Nexus", "Rabbit", "Humane", "OpenAI", "Meta", "Google"],
  "Smart Home": ["Google Nest", "Amazon Ring", "Philips Hue", "Ecobee", "Yale", "Lutron"],
  "VR Tech": ["Meta Quest", "Apple Vision", "HTC Vive", "Valve Index", "Nexus"],
  "Workstations": ["Nexus", "Threadripper", "Intel Xeon", "Mac Studio", "HP Z-Book"],
  "Accessories": ["Anker", "Apple", "Spigen", "Belkin", "Logitech", "Satechi"]
};

const CATEGORIES = [
  "Smartphones", "Laptops", "Gaming", "Monitors", "AI Devices", 
  "Smart Home", "VR Tech", "Workstations", "Accessories"
];

const UNSPLASH_POOL: Record<string, string[]> = {
  "Smartphones": [
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565849906660-f86a6034f40f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=600&q=80"
  ],
  "Laptops": [
    "https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80"
  ],
  "Gaming": [
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80"
  ],
  "Monitors": [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551645121-d1034da75057?auto=format&fit=crop&w=600&q=80"
  ],
  "AI Devices": [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&w=600&q=80"
  ],
  "Smart Home": [
    "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&w=600&q=80"
  ],
  "VR Tech": [
    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80"
  ],
  "Workstations": [
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9fc?auto=format&fit=crop&w=600&q=80"
  ]
};

const PRODUCT_ADJECTIVES = ["Quantum", "Apex", "Evolution", "Ultra", "Max", "Spectre", "Pro", "Elite", "Horizon", "Phantom", "Aero", "Nexus"];
const PRODUCT_NOUNS: Record<string, string[]> = {
  "Smartphones": ["Phone", "Node", "Cell", "Mobile Link", "Terminal X", "Comms Deck"],
  "Laptops": ["Laptop", "Book Pro", "Slate Book", "Work Deck", "Studio Laptop"],
  "Gaming": ["Mouse", "Tactile Keyboard", "Rig Pad", "GPU Engine", "Gamepad", "Headset X"],
  "Monitors": ["Spatial Display", "OLED Panel", "Curved Monitor", "Ultra Panel", "Infinite Screen"],
  "AI Devices": ["Companion Hub", "Cognitive Core", "Automation Brain", "Holo Projector", "r1 Sync Desk"],
  "Smart Home": ["Thermostat Unit", "Video Doorbell", "Lighting Hub", "Power Grid Link", "Security Lock"],
  "VR Tech": ["Quest Node", "Vision Shield", "Space Headset", "Trackband Core", "Haptic Gloves"],
  "Workstations": ["Render Station", "Computing Engine", "Database Rig", "Stack Architect Desk"],
  "Accessories": ["Power Delivery Block", "USB-C Multi-Hub", "Premium Protective Case", "Wireless Charger Pad", "Vertical Laptop Stand"]
};

// Seeding function generating 1000+ items
const generateSeededDatabase = (): MockProduct[] => {
  const list: MockProduct[] = [];

  // 1. Add curated seeds first to guarantee search correctness
  CURATED_SEEDS.forEach((seed, index) => {
    const defaultProduct: MockProduct = {
      _id: `prod-curated-${index}`,
      id: `prod-curated-${index}`,
      name: seed.name!,
      brand: seed.brand!,
      category: seed.category!,
      description: seed.description!,
      price: seed.price!,
      discount: seed.discount!,
      rating: seed.rating!,
      numReviews: 24 + Math.floor(Math.random() * 200),
      stock: 5 + Math.floor(Math.random() * 45),
      seller: seed.seller!,
      images: seed.images!,
      specifications: seed.specifications!,
      tags: seed.tags!,
      reviews: [
        { _id: "rev-1", user: "Neo K.", rating: 5, text: "Absolutely flawless experience. Build quality is premium and design is unmatched.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { _id: "rev-2", user: "Trinity V.", rating: 4, text: "Excellent specifications. High computational power, though runs a bit warm under stress.", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() }
      ],
      questions: [
        { _id: "q-1", user: "Morpheus A.", question: "Does this come with a worldwide manufacturer warranty?", answer: "Yes, all products sold directly by our certified sellers carry a comprehensive 1-year global warranty.", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        { _id: "q-2", user: "Cypher L.", question: "Is this model compatible with custom liquid cooling setups?", answer: "Yes, it supports standard layout modules.", createdAt: new Date(Date.now() - 86400000 * 8).toISOString() }
      ],
      features: Object.entries(seed.specifications!).map(([k, v]) => `${k}: ${v}`),
      aiSummary: `High-fidelity custom ${seed.name} built for optimized performance and workspace integration.`,
      aiPros: ["Extremely premium aesthetics", "Industry-leading performance output"],
      aiCons: ["Premium pricing tier"],
      idealUserType: "Software Architect",
      originalPrice: Math.round(seed.price! / (1 - seed.discount! / 100)),
      deliveryDays: 1 + Math.floor(Math.random() * 2),
      approvalStatus: "Approved"
    };
    list.push(defaultProduct);
  });

  // 2. Add programmatically generated variations to hit 1020 products (approx 110 per category)
  let count = list.length;
  CATEGORIES.forEach((cat) => {
    const baseBrands = BRANDS[cat] || ["Nexus"];
    const poolImages = UNSPLASH_POOL[cat] || ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"];
    const nounList = PRODUCT_NOUNS[cat] || ["Device"];
    
    // Generate 115 variations per category
    for (let i = 0; i < 115; i++) {
      const brand = baseBrands[i % baseBrands.length]!;
      const adj = PRODUCT_ADJECTIVES[(i + 3) % PRODUCT_ADJECTIVES.length]!;
      const noun = nounList[i % nounList.length]!;
      
      const isCuratedMatch = (brand === "Apple" && noun.includes("Phone")) || (brand === "Dell" && noun.includes("Laptop"));
      // Add a number to prevent duplicates
      const name = isCuratedMatch ? `${brand} ${adj} ${noun} Model ${i + 10}` : `${brand} ${adj} ${noun} ${i + 1}`;
      
      const price = Math.round(15 + Math.random() * 2400);
      const discount = Math.random() > 0.4 ? Math.floor(5 + Math.random() * 25) : 0;
      const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : price;
      
      const rating = Number((4.0 + Math.random() * 1.0).toFixed(1));
      const imageSubset = [
        poolImages[i % poolImages.length]!,
        poolImages[(i + 1) % poolImages.length]!,
        poolImages[(i + 2) % poolImages.length]!
      ];

      const specifications: Record<string, string> = {
        "Brand": brand,
        "Warranty": "1-Year Certified",
        "Color Options": "Charcoal Black, Platinum Silver",
        "Form Factor": "Modern Slim",
        "Model Year": "2026"
      };
      if (cat === "Laptops" || cat === "Workstations") {
        specifications["Processor"] = i % 2 === 0 ? "Intel Core Ultra" : "AMD Ryzen Threadripper";
        specifications["RAM"] = i % 3 === 0 ? "16GB LPDDR5" : "32GB Unified DDR5";
        specifications["Storage"] = "1TB PCIe Gen4 SSD";
      } else if (cat === "Smartphones") {
        specifications["OS Version"] = i % 2 === 0 ? "iOS 18 / Apple Intelligence" : "Android 15 / Synapse Core";
        specifications["Battery Capacity"] = "4800 mAh QuickCharge";
      }

      const tags = [
        brand.toLowerCase(), 
        cat.toLowerCase(), 
        noun.toLowerCase(), 
        adj.toLowerCase(),
        ...noun.split(" ").map(w => w.toLowerCase())
      ];
      if (cat === "Smartphones") tags.push("phone", "mobile", "cell");
      if (cat === "Laptops") tags.push("laptop", "notebook", "pc");
      if (brand === "Apple") tags.push("apple", "iphone", "macbook", "magsafe");

      const product: MockProduct = {
        _id: `prod-gen-${cat.replace(/\s+/g, "")}-${i}-${count++}`,
        id: `prod-gen-${cat.replace(/\s+/g, "")}-${i}-${count}`,
        name,
        brand,
        category: cat,
        description: `Premium grade commercial ${cat.toLowerCase()} hardware module engineered by ${brand}. Incorporates high-speed internal architectures, sleek frame ergonomics, and guaranteed system throughput compatibility. Ready for professional configurations.`,
        price,
        discount,
        rating,
        numReviews: Math.floor(5 + Math.random() * 120),
        stock: Math.floor(2 + Math.random() * 80),
        seller: `${brand} Store Authorized`,
        images: imageSubset,
        specifications,
        tags,
        reviews: [
          { _id: `rev-${count}-1`, user: "User A", rating: 5, text: "Excellent product, works exactly as described and high quality.", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
          { _id: `rev-${count}-2`, user: "User B", rating: 4, text: "Decent speed, though cooling could be improved under high workloads.", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() }
        ],
        questions: [
          { _id: `q-${count}-1`, user: "Buyer X", question: "Is this currently in stock for express 1-day delivery?", answer: "Yes, our fulfilment warehouse has units packaged for instant dispatch.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() }
        ],
        features: Object.entries(specifications).map(([k, v]) => `${k}: ${v}`),
        aiSummary: `A top-rated ${noun} engineered for workspace performance optimization.`,
        aiPros: ["High durability", "Great value metrics"],
        aiCons: ["None reported"],
        idealUserType: "Creative Professional",
        originalPrice,
        deliveryDays: 1 + Math.floor(Math.random() * 3),
        approvalStatus: "Approved"
      };

      list.push(product);
    }
  });

  return list;
};

// Initialize localStorage DB if missing or outdated database version
const initializeStorage = () => {
  if (typeof window === "undefined") return;

  const DB_KEY_PRODUCTS = "nexus_fallback_products_v3";
  const DB_KEY_USERS = "nexus_fallback_users_v3";
  const DB_KEY_ORDERS = "nexus_fallback_orders_v3";
  const DB_KEY_SEEDED_VERSION = "nexus_database_seeded_v4";

  // Force seed if version is outdated or if database is empty
  const isOutdated = localStorage.getItem(DB_KEY_SEEDED_VERSION) !== "v4_1000plus";
  const hasProducts = localStorage.getItem(DB_KEY_PRODUCTS);

  if (isOutdated || !hasProducts) {
    const list = generateSeededDatabase();
    localStorage.setItem(DB_KEY_PRODUCTS, JSON.stringify(list));
    // Synchronize older dashboard key as well to prevent dashboard mismatch!
    localStorage.setItem("nexus_fallback_products", JSON.stringify(list));

    const defaultUser = {
      _id: "user-niranjan",
      name: "Niranjan",
      email: "niharjan8@gmail.com",
      role: "customer",
      avatar: "N",
      jobTitle: "Software Engineer",
      createdAt: new Date().toISOString()
    };
    
    // Seed users
    const currentUsers = JSON.parse(localStorage.getItem(DB_KEY_USERS) || "[]");
    if (!currentUsers.some((u: any) => u.email === defaultUser.email)) {
      currentUsers.unshift(defaultUser);
    }
    localStorage.setItem(DB_KEY_USERS, JSON.stringify(currentUsers));
    localStorage.setItem("nexus_fallback_users", JSON.stringify(currentUsers));

    // Seed orders
    if (!localStorage.getItem(DB_KEY_ORDERS)) {
      localStorage.setItem(DB_KEY_ORDERS, JSON.stringify([]));
      localStorage.setItem("nexus_fallback_orders", JSON.stringify([]));
    }

    localStorage.setItem(DB_KEY_SEEDED_VERSION, "v4_1000plus");
  }
};

initializeStorage();

export const mockDb = {
  isFallbackActive: () => {
    return true;
  },

  // Retrieve products matching search filters
  getProducts: (filters: { category?: string; search?: string; maxPrice?: number; sort?: string; brand?: string }) => {
    initializeStorage();
    let list: MockProduct[] = JSON.parse(localStorage.getItem("nexus_fallback_products_v3") || "[]");
    if (list.length === 0) {
      list = JSON.parse(localStorage.getItem("nexus_fallback_products") || "[]");
    }

    // Category Filter
    if (filters.category && filters.category !== "All") {
      const qCat = filters.category.toLowerCase().trim();
      list = list.filter(p => {
        const cat = p.category.toLowerCase();
        // Allow general matches like VR Tech mapping to VR & AR, etc.
        return cat.includes(qCat) || qCat.includes(cat) || 
               (qCat === "vr tech" && cat === "vr & ar tech") ||
               (qCat === "gaming" && cat === "gaming gear");
      });
    }

    // Brand Filter
    if (filters.brand) {
      const qBrand = filters.brand.toLowerCase().trim();
      list = list.filter(p => p.brand.toLowerCase() === qBrand);
    }

    // Search Query Filter
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Price Filter
    if (filters.maxPrice) {
      list = list.filter(p => p.price <= filters.maxPrice!);
    }

    // Sort Options
    if (filters.sort) {
      if (filters.sort === "price-low" || filters.sort.includes("Low")) {
        list.sort((a, b) => a.price - b.price);
      } else if (filters.sort === "price-high" || filters.sort.includes("High")) {
        list.sort((a, b) => b.price - a.price);
      } else if (filters.sort.includes("Rated") || filters.sort.includes("Rating")) {
        list.sort((a, b) => b.rating - a.rating);
      }
    }
    return list;
  },

  getProductById: (id: string) => {
    initializeStorage();
    const list: MockProduct[] = JSON.parse(localStorage.getItem("nexus_fallback_products_v3") || "[]");
    const found = list.find(p => p._id === id || p.id === id);
    if (!found) return null;
    
    // Guarantee basic reviews array
    if (!found.reviews) {
      found.reviews = [];
    }
    if (!found.questions) {
      found.questions = [];
    }
    return found;
  },

  // Save product details (Add or Edit) - directly persists to localStorage collections
  saveProduct: (productData: Partial<MockProduct>) => {
    initializeStorage();
    const list: MockProduct[] = JSON.parse(localStorage.getItem("nexus_fallback_products_v3") || "[]");
    
    if (productData._id) {
      // Edit mode
      const idx = list.findIndex(p => p._id === productData._id);
      if (idx !== -1) {
        const existing = list[idx]!;
        const updated: MockProduct = {
          ...existing,
          ...productData,
          originalPrice: productData.price && productData.discount ? Math.round(productData.price / (1 - productData.discount / 100)) : (productData.price || existing.price)
        } as MockProduct;
        list[idx] = updated;
      }
    } else {
      // Add mode
      const newId = `prod-custom-${Math.random().toString(36).substring(2, 9)}`;
      const price = productData.price || 99;
      const discount = productData.discount || 0;
      const newProd: MockProduct = {
        _id: newId,
        id: newId,
        name: productData.name || "Custom Hardware Component",
        brand: productData.brand || "Nexus",
        category: productData.category || "Accessories",
        description: productData.description || "Custom configured high performance system hardware.",
        price,
        discount,
        rating: 5.0,
        numReviews: 0,
        stock: productData.stock || 10,
        seller: productData.seller || "Merchant Partner",
        images: productData.images && productData.images.length > 0 ? productData.images : ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"],
        specifications: productData.specifications || { "Form Factor": "Universal Module" },
        tags: productData.tags || ["custom", "hardware"],
        reviews: [],
        questions: [],
        features: productData.features || ["Custom configured Spec Layout"],
        idealUserType: "Creative Builder",
        originalPrice: Math.round(price / (1 - discount / 100)),
        deliveryDays: 2,
        approvalStatus: "Approved"
      };
      list.unshift(newProd);
    }
    
    localStorage.setItem("nexus_fallback_products_v3", JSON.stringify(list));
    localStorage.setItem("nexus_fallback_products", JSON.stringify(list));
    return list;
  },

  // Delete product
  deleteProduct: (id: string) => {
    initializeStorage();
    const list: MockProduct[] = JSON.parse(localStorage.getItem("nexus_fallback_products_v3") || "[]");
    const filtered = list.filter(p => p._id !== id && p.id !== id);
    localStorage.setItem("nexus_fallback_products_v3", JSON.stringify(filtered));
    localStorage.setItem("nexus_fallback_products", JSON.stringify(filtered));
    return filtered;
  },

  addReview: (productId: string, review: { user: string; rating: number; text: string }) => {
    initializeStorage();
    const list: MockProduct[] = JSON.parse(localStorage.getItem("nexus_fallback_products_v3") || "[]");
    const idx = list.findIndex(p => p._id === productId || p.id === productId);
    if (idx !== -1) {
      const p = list[idx]!;
      const reviews = p.reviews || [];
      const newReview = {
        _id: "rev-" + Math.random().toString(36).substring(2, 7),
        ...review,
        createdAt: new Date().toISOString()
      };
      p.reviews = [newReview, ...reviews];
      p.numReviews = p.reviews.length;
      
      const totalScore = p.reviews.reduce((acc, r) => acc + r.rating, 0);
      p.rating = Number((totalScore / p.reviews.length).toFixed(1));
      
      list[idx] = p;
      localStorage.setItem("nexus_fallback_products_v3", JSON.stringify(list));
      localStorage.setItem("nexus_fallback_products", JSON.stringify(list));
      return p;
    }
    return null;
  },

  // Questions and Answers Storage APIs
  getQuestions: (productId: string) => {
    initializeStorage();
    const p = mockDb.getProductById(productId);
    return p?.questions || [];
  },

  addQuestion: (productId: string, questionData: { user: string; question: string }) => {
    initializeStorage();
    const list: MockProduct[] = JSON.parse(localStorage.getItem("nexus_fallback_products_v3") || "[]");
    const idx = list.findIndex(p => p._id === productId || p.id === productId);
    if (idx !== -1) {
      const p = list[idx]!;
      const questions = p.questions || [];
      const newQ: MockQuestion = {
        _id: "q-" + Math.random().toString(36).substring(2, 7),
        user: questionData.user,
        question: questionData.question,
        createdAt: new Date().toISOString()
      };
      p.questions = [newQ, ...questions];
      list[idx] = p;
      localStorage.setItem("nexus_fallback_products_v3", JSON.stringify(list));
      localStorage.setItem("nexus_fallback_products", JSON.stringify(list));
      return newQ;
    }
    return null;
  },

  answerQuestion: (productId: string, questionId: string, answerText: string) => {
    initializeStorage();
    const list: MockProduct[] = JSON.parse(localStorage.getItem("nexus_fallback_products_v3") || "[]");
    const idx = list.findIndex(p => p._id === productId || p.id === productId);
    if (idx !== -1) {
      const p = list[idx]!;
      const questions = p.questions || [];
      const qIdx = questions.findIndex(q => q._id === questionId);
      if (qIdx !== -1) {
        questions[qIdx]!.answer = answerText;
        p.questions = questions;
        list[idx] = p;
        localStorage.setItem("nexus_fallback_products_v3", JSON.stringify(list));
        localStorage.setItem("nexus_fallback_products", JSON.stringify(list));
        return questions[qIdx]!;
      }
    }
    return null;
  },

  // Auth
  register: (name: string, email: string, password?: string) => {
    initializeStorage();
    let users = JSON.parse(localStorage.getItem("nexus_fallback_users_v3") || "[]");
    users = users.filter((u: any) => u.email !== email);
    
    const newUser = {
      _id: "user-" + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: "customer",
      avatar: name[0]?.toUpperCase() || "O",
      jobTitle: ["Software Engineer", "Cloud Architect", "UI/UX Designer", "Data Scientist"][Math.floor(Math.random() * 4)],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("nexus_fallback_users_v3", JSON.stringify(users));
    localStorage.setItem("nexus_fallback_users", JSON.stringify(users));
    
    const token = `mock_jwt_secure_${newUser._id}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    }
    
    return { user: newUser, token };
  },

  login: (email: string, password?: string) => {
    initializeStorage();
    const users = JSON.parse(localStorage.getItem("nexus_fallback_users_v3") || "[]");
    const found = users.find((u: any) => u.email === email);
    
    if (!found) {
      throw new Error("Invalid email or credentials not found.");
    }
    
    const token = `mock_jwt_secure_${found._id}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(found));
    }
    
    return { user: found, token };
  },

  getMe: (token: string) => {
    initializeStorage();
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        return JSON.parse(stored);
      }
    }
    const id = token.replace("mock_jwt_secure_", "");
    const users = JSON.parse(localStorage.getItem("nexus_fallback_users_v3") || "[]");
    return users.find((u: any) => u._id === id) || null;
  },

  // Orders
  createOrder: (orderItems: any[], shippingDetails: any, totalPrice: number) => {
    initializeStorage();
    const orders = JSON.parse(localStorage.getItem("nexus_fallback_orders_v3") || "[]");
    
    const newOrder = {
      _id: "order-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      items: orderItems,
      shipping: shippingDetails,
      totalPrice,
      status: "Processing",
      securityValidationCode: "SEC-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      createdAt: new Date().toISOString()
    };
    
    orders.unshift(newOrder);
    localStorage.setItem("nexus_fallback_orders_v3", JSON.stringify(orders));
    localStorage.setItem("nexus_fallback_orders", JSON.stringify(orders));
    return newOrder;
  },

  getOrders: () => {
    initializeStorage();
    let list = JSON.parse(localStorage.getItem("nexus_fallback_orders_v3") || "[]");
    if (list.length === 0) {
      list = JSON.parse(localStorage.getItem("nexus_fallback_orders") || "[]");
    }
    return list;
  },

  saveOrders: (ordersList: any[]) => {
    initializeStorage();
    localStorage.setItem("nexus_fallback_orders_v3", JSON.stringify(ordersList));
    localStorage.setItem("nexus_fallback_orders", JSON.stringify(ordersList));
  },

  // AI Copilot responses
  getAiResponse: (message: string) => {
    const q = message.toLowerCase();
    
    if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
      return "Hello! I'm your Nexus AI Copilot shopping assistant. I can recommend premium products, search specifications, or locate order details in your customer profile. What are you looking to customize today?";
    }
    if (q.includes("price") || q.includes("cost") || q.includes("expensive")) {
      return "I can query our active inventory to find options matching your price parameters. Our accessories range from $20 to $100, while premium laptops and custom workstations start from $799 up to $4,500. Let me know if you would like me to compile a filtered spec sheet.";
    }
    if (q.includes("iphone") || q.includes("apple")) {
      return "We have the brand new **iPhone 16 Pro Max** ($1,199) and **iPhone 15 Pro** ($999) in stock, as well as protective silicone MagSafe cases and 30W GaN fast chargers. Would you like me to add them to your comparisons table?";
    }
    if (q.includes("dell") || q.includes("laptop")) {
      return "For portability and workstation capability, I recommend the **Dell XPS 15 Creator Edition** ($2,299) with an Intel Core i9 CPU, 32GB RAM, and a 4K OLED touch display, or the **MacBook Pro 16-inch M3 Max** ($3,499) with 48GB unified memory. Let me know which processor class fits your active projects.";
    }
    if (q.includes("cart") || q.includes("buy") || q.includes("checkout")) {
      return "You can easily check out by clicking the Cart icon on the navigation header. Let me know if you would like me to review the compatibility of items in your active cart.";
    }
    
    return `I've analyzed your query: "${message}". I can search our catalog of 1,000+ items, check low stock statuses, track order routes, or answer system technical inquiries. Please clarify what catalog operation you would like to run.`;
  }
};
