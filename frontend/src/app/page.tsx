"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "@/store/slices/cartSlice";
import { ProductCard } from "@/components/ui/ProductCard";
import { 
  Search, Cpu, Sparkles, ChevronDown, Filter, 
  X, ShoppingCart, ShieldCheck, Star, HelpCircle, Package, 
  ArrowRight, Scale, Sliders, Check, AlertTriangle, ChevronRight,
  Zap, Smartphone, Monitor, LayoutGrid, Heart, Eye
} from "lucide-react";
import { RootState } from "@/store/store";
import { mockDb } from "@/utils/mockDb";
import { NavBar } from "@/components/ui/NavBar";
import { useDebounce } from "@/hooks/useDebounce";

const CATEGORIES = [
  "All", "AI Devices", "Gaming", "Laptops", "Monitors", "Smartphones", 
  "Smart Home", "Accessories", "Workstations", "VR Tech"
];

interface WorkstationComponent {
  id: string;
  name: string;
  price: number;
  specs: string;
}

const BUILDER_PARTS = {
  cpu: [
    { id: "cpu-1", name: "Intel Core i9-14900K", price: 589, specs: "24 Cores / 32 Threads / 6.0 GHz" },
    { id: "cpu-2", name: "AMD Ryzen 9 7950X", price: 649, specs: "16 Cores / 32 Threads / 5.7 GHz" },
    { id: "cpu-3", name: "Intel Xeon W9-3495X", price: 999, specs: "56 Cores / 112 Threads / Workstation" }
  ],
  gpu: [
    { id: "gpu-1", name: "NVIDIA GeForce RTX 5090", price: 1999, specs: "32GB GDDR7 VRAM / Next-Gen" },
    { id: "gpu-2", name: "NVIDIA GeForce RTX 4090", price: 1599, specs: "24GB GDDR6X VRAM / Ray Tracing" },
    { id: "gpu-3", name: "NVIDIA RTX 6000 Ada", price: 2899, specs: "48GB GDDR6 VRAM / Professional" }
  ],
  ram: [
    { id: "ram-1", name: "64GB DDR5 Dual-Channel", price: 249, specs: "6400 MT/s CL32 Corsair" },
    { id: "ram-2", name: "128GB DDR5 Quad-Channel", price: 549, specs: "6000 MT/s ECC G.Skill" },
    { id: "ram-3", name: "256GB DDR5 High-Capacity Array", price: 1199, specs: "5600 MT/s Crucial System" }
  ],
  cooling: [
    { id: "cool-1", name: "Liquid AIO Cooler 360mm", price: 159, specs: "Triple Silent PWM Fans" },
    { id: "cool-2", name: "Custom Hard-Tubing Loop", price: 299, specs: "Dual Radiator / D5 Pump Reservoir" },
    { id: "cool-3", name: "Phase Change Sub-Zero Cooling", price: 699, specs: "Automated Condensation Control" }
  ],
  storage: [
    { id: "ssd-1", name: "2TB PCIe Gen5 NVMe M.2 SSD", price: 189, specs: "Crucial T700 / 12,400 MB/s" },
    { id: "ssd-2", name: "4TB PCIe Gen5 NVMe M.2 SSD", price: 349, specs: "Sabrent Rocket / 12,400 MB/s" },
    { id: "ssd-3", name: "8TB NVMe Enterprise RAID Array", price: 899, specs: "ASUS Hyper M.2 / PCIe Gen5" }
  ]
};

function ShopPageContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 50);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(5000);
  const [sortOption, setSortOption] = useState("AI Relevance");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [jobMatchOnly, setJobMatchOnly] = useState(false);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [viewLayout, setViewLayout] = useState<"grid" | "list">("grid");
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // Quick View Drawer State
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");

  // Product Comparison States
  const [compareProducts, setCompareProducts] = useState<any[]>([]);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);

  // Custom Workstation Builder States
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderSelections, setBuilderSelections] = useState({
    cpu: BUILDER_PARTS.cpu[0],
    gpu: BUILDER_PARTS.gpu[0],
    ram: BUILDER_PARTS.ram[0],
    cooling: BUILDER_PARTS.cooling[0],
    storage: BUILDER_PARTS.storage[0]
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Sync URL search params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchText(searchParam);
    }
  }, [searchParams]);

  // Extract unique brands from catalog
  useEffect(() => {
    const allItems = mockDb.getProducts({});
    const uniqueBrands = Array.from(new Set(allItems.map(p => p.brand).filter(Boolean)));
    setAllBrands(uniqueBrands);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:4000/api/products?maxPrice=${priceRange}`;
        if (selectedCategory && selectedCategory !== "All") {
          url += `&category=${selectedCategory}`;
        }
        if (debouncedSearchText) {
          url += `&search=${encodeURIComponent(debouncedSearchText)}`;
        }
        if (selectedBrand) {
          url += `&brand=${encodeURIComponent(selectedBrand)}`;
        }
        if (sortOption.includes("Low")) {
          url += `&sort=price-low`;
        } else if (sortOption.includes("High")) {
          url += `&sort=price-high`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("API responded with an error");
        const data = await res.json();
        
        let filtered = data;
        if (jobMatchOnly && user?.jobTitle) {
          filtered = data.filter((p: any) => p.idealUserType === user.jobTitle);
        }
        if (selectedRating > 0) {
          filtered = filtered.filter((p: any) => (p.rating || 4.5) >= selectedRating);
        }
        setProducts(filtered);
        setIsFallbackActive(false);
      } catch (err) {
        console.warn("API offline. Fetching from local mock db...", err);
        
        // Simulating loading delays for instant search
        if (debouncedSearchText) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        const fallbackData = mockDb.getProducts({
          category: selectedCategory,
          search: debouncedSearchText,
          maxPrice: priceRange,
          sort: sortOption,
          brand: selectedBrand || undefined
        });
        
        let filtered = fallbackData;
        if (jobMatchOnly && user?.jobTitle) {
          filtered = fallbackData.filter((p: any) => p.idealUserType === user.jobTitle);
        }
        if (selectedRating > 0) {
          filtered = filtered.filter((p: any) => (p.rating || 4.5) >= selectedRating);
        }
        setProducts(filtered);
        setIsFallbackActive(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, debouncedSearchText, priceRange, sortOption, jobMatchOnly, user, selectedBrand, selectedRating]);

  const handleAddToCart = useCallback((product: any) => {
    dispatch(
      addToCartAction({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || "",
      })
    );
  }, [dispatch]);

  const openQuickView = useCallback((product: any) => {
    setQuickViewProduct(product);
    if (product.features && product.features.length > 0) {
      setSelectedVariant(product.features[0].split(":")[0] || "");
    }
  }, []);

  const handleToggleCompare = useCallback((product: any) => {
    setCompareProducts(prev => {
      const exists = prev.some(p => p._id === product._id);
      if (exists) {
        return prev.filter(p => p._id !== product._id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  }, []);

  const customRigPrice = useMemo(() => {
    return (
      builderSelections.cpu.price +
      builderSelections.gpu.price +
      builderSelections.ram.price +
      builderSelections.cooling.price +
      builderSelections.storage.price
    );
  }, [builderSelections]);

  const compatibilityScore = useMemo(() => {
    let score = 100;
    if (builderSelections.cpu.id === "cpu-1" && builderSelections.ram.id === "ram-3") {
      score -= 10; 
    }
    if (builderSelections.gpu.id === "gpu-3" && builderSelections.cooling.id === "cool-1") {
      score -= 15; 
    }
    return score;
  }, [builderSelections]);

  const handleCompileCustomRig = useCallback(() => {
    const customRig = {
      _id: `custom-rig-${Date.now()}`,
      name: "Custom Workspace Workstation",
      price: customRigPrice,
      images: ["from-gray-800 to-gray-900"],
      category: "Workstations",
      description: `Custom Workspace Workstation: CPU: ${builderSelections.cpu.name}, GPU: ${builderSelections.gpu.name}, RAM: ${builderSelections.ram.name}, Cooling: ${builderSelections.cooling.name}, Storage: ${builderSelections.storage.name}.`,
    };
    dispatch(
      addToCartAction({
        id: customRig._id,
        name: customRig.name,
        price: customRig.price,
        quantity: 1,
        image: "",
      })
    );
    setBuilderOpen(false);
  }, [customRigPrice, builderSelections, dispatch]);

  const renderedProducts = useMemo(() => {
    if (viewLayout === "list") {
      return products.map((product, i) => (
        <div key={product._id} className="relative group flex flex-col md:flex-row gap-6 p-5 border border-white/10 rounded-2xl bg-[#0f172a]/60 backdrop-blur-md hover:border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.03)] hover:shadow-[0_0_20px_rgba(0,240,255,0.05)] transition-all w-full text-left">
          {/* Compare Checkbox */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 shadow-sm">
            <input
              type="checkbox"
              checked={compareProducts.some(p => p._id === product._id)}
              onChange={() => handleToggleCompare(product)}
              className="w-3.5 h-3.5 accent-[#ff9900] rounded cursor-pointer border border-white/20 bg-black/40"
            />
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">Compare</span>
          </div>

          {/* Product Image Container */}
          <div className="w-full md:w-48 h-48 bg-[#070a13] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-3 relative flex-shrink-0">
            <img src={product.images?.[0] || ""} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            {product.stock < 5 && (
              <span className="absolute bottom-2 left-2 text-[8px] font-bold bg-red-950/80 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider animate-pulse">Low Stock</span>
            )}
          </div>

          {/* Product Info details */}
          <div className="flex-1 flex flex-col justify-between py-1 text-left min-w-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded uppercase font-mono tracking-widest">{product.category}</span>
                <span className="text-[9px] text-[#00f0ff] font-bold font-mono uppercase tracking-widest">{product.brand}</span>
              </div>
              <h3 className="text-sm font-black text-white capitalize truncate group-hover:text-[#00f0ff] transition-colors">{product.name}</h3>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed line-clamp-2">{product.description}</p>
              
              {/* Ratings */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className={`w-3 h-3 ${si < Math.round(product.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                ))}
                <span className="text-[10px] text-gray-400 font-mono ml-1">({product.numReviews || 24} reviews)</span>
              </div>
            </div>

            {/* Price Box & Actions */}
            <div className="flex flex-row items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-[#ff9900] text-lg font-black">${product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-[10px] text-gray-500 line-through">${product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Configure
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="px-3.5 py-1.5 bg-[#ff9900] hover:bg-[#f3a847] text-black font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ));
    }
    return products.map((product, i) => (
      <div key={product._id} className="relative group">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
          <input
            type="checkbox"
            checked={compareProducts.some(p => p._id === product._id)}
            onChange={() => handleToggleCompare(product)}
            className="w-3.5 h-3.5 accent-[#febd69] rounded cursor-pointer border border-gray-300 dark:border-white/20 bg-white dark:bg-black/40"
          />
          <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Compare</span>
        </div>

        <ProductCard 
          id={product._id}
          title={product.name}
          category={product.category}
          price={product.price}
          image={product.images?.[0] || ""}
          delay={i * 0.02}
          rating={product.rating}
          numReviews={product.numReviews}
          originalPrice={product.originalPrice}
          stock={product.stock}
          deliveryDays={product.deliveryDays}
          onView={() => router.push(`/product/${product._id}`)}
          onQuickView={() => openQuickView(product)}
          onAddToCart={() => handleAddToCart(product)}
        />
      </div>
    ));
  }, [products, compareProducts, handleToggleCompare, router, openQuickView, handleAddToCart, viewLayout]);

  const skeletonCards = useMemo(() => {
      return Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="border border-gray-200 rounded-2xl bg-white h-[400px] p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="h-52 w-full skeleton rounded-xl" />
          <div className="h-3 w-1/3 skeleton rounded" />
          <div className="h-5 w-full skeleton rounded" />
          <div className="h-3 w-1/2 skeleton rounded" />
        </div>
        <div className="h-10 w-full skeleton rounded-full" />
      </div>
    ));
  }, []);

  // Holographic Loader Component for Dynamic Database Synthesis
  const CompilationLoader = useCallback(() => {
    const [step, setStep] = useState(0);
    const steps = [
      "Initializing Neural Catalog Probe...",
      "Querying Silicon Grid Networks...",
      "Synthesizing Graphene Product Matrices...",
      "Resolving High-Fidelity Unsplash Portals...",
      "Compiling 2050 Quantum Specifications...",
      "Securing Session Key Authorization..."
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setStep(s => (s < steps.length - 1 ? s + 1 : s));
      }, 180);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center border border-[#00f0ff]/20 rounded-2xl bg-[#111827]/40 backdrop-blur-md p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.05)] text-left">
        {/* Futuristic background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Holographic scanning laser bar */}
        <motion.div 
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_15px_#00f0ff] z-10 pointer-events-none"
        />

        <div className="z-10 text-center space-y-6 max-w-sm">
          {/* Animated Glowing Ring */}
          <div className="relative w-20 h-20 mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#00f0ff]/40"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-double border-[#ff9900]/40"
            />
            <div className="absolute inset-4 rounded-full bg-black/80 flex items-center justify-center border border-white/5">
              <Cpu className="w-6 h-6 text-[#00f0ff] animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#00f0ff] text-glow-cyan font-mono">QUANTUM DB SYNTHESIS</h3>
            <div className="h-6 flex items-center justify-center">
              <motion.span 
                key={step}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block"
              >
                &gt; {steps[step]}
              </motion.span>
            </div>
          </div>

          {/* Synthesis loading bar */}
          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 mx-auto">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#ff9900] to-[#00f0ff]"
            />
          </div>
        </div>
      </div>
    );
  }, []);

  // Dynamic ambient background gradient based on active category selection
  const bgGradient = useMemo(() => {
    switch (selectedCategory) {
      case "Smartphones":
        return "from-[#00f0ff]/15 via-[#0b0f19] to-transparent";
      case "Workstations":
        return "from-[#ff9900]/12 via-[#0b0f19] to-transparent";
      case "Gaming":
        return "from-[#ff007f]/12 via-[#0b0f19] to-transparent";
      case "AI Devices":
        return "from-[#8a2be2]/12 via-[#0b0f19] to-transparent";
      case "Laptops":
        return "from-[#00ff87]/12 via-[#0b0f19] to-transparent";
      default:
        return "from-amber-500/5 via-[#0b0f19] to-transparent";
    }
  }, [selectedCategory]);

  return (
    <main className="relative w-screen h-screen bg-[#070a13] overflow-hidden flex flex-col font-sans">
      {/* Animated Ambient Background Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br ${bgGradient} blur-[120px] opacity-70 transition-all duration-1000`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#00f0ff]/5 via-[#0b0f19] to-transparent blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <NavBar />

      <div className="flex-grow flex overflow-hidden h-[calc(100vh-64px)] w-full z-10 relative">
        
        {/* LEFT COLUMN: FILTER SIDEBAR */}
        <aside className="w-80 h-full flex flex-col border-r border-white/10 bg-[#0f172a]/60 backdrop-blur-md overflow-y-auto custom-scrollbar p-5 flex-shrink-0">
          
          {/* Category Icon Helper */}
          {(() => {
            const getCategoryIcon = (cat: string) => {
              switch (cat) {
                case "All": return Sliders;
                case "AI Devices": return Sparkles;
                case "Gaming": return Zap;
                case "Laptops": return Cpu;
                case "Monitors": return Monitor;
                case "Smartphones": return Smartphone;
                case "Smart Home": return ShieldCheck;
                case "Accessories": return ShoppingCart;
                case "Workstations": return Cpu;
                case "VR Tech": return Eye;
                default: return Package;
              }
            };

            return (
              <div className="p-5 border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl mb-4 text-left shadow-[0_0_15px_rgba(0,240,255,0.03)]">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                  <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white">
                    <Filter className="w-4 h-4 text-[#ff9900]" />
                    Filters
                  </h2>
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchText("");
                      setSelectedCategory("All");
                      setPriceRange(5000);
                      setSortOption("AI Relevance");
                      setJobMatchOnly(false);
                      setSelectedBrand("");
                      setSelectedRating(0);
                    }}
                    className="text-[9px] text-[#ff9900] hover:underline font-mono uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>

                {/* Custom Workstation Builder Trigger */}
                <button
                  type="button"
                  onClick={() => setBuilderOpen(true)}
                  className="w-full mb-5 py-3 bg-[#ff9900]/10 border border-[#ff9900]/30 hover:bg-[#ff9900]/20 text-[#ff9900] text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(255,153,0,0.05)]"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#ff9900]" />
                  Workstation Configurator
                </button>

                {/* Job Match Toggle */}
                {user?.jobTitle && (
                  <div 
                    onClick={() => setJobMatchOnly(!jobMatchOnly)}
                    className={`p-3 rounded-lg border mb-5 cursor-pointer transition-all duration-300 ${
                      jobMatchOnly 
                        ? "bg-[#ff9900]/10 border-[#ff9900]/40 shadow-[0_0_10px_rgba(255,153,0,0.05)]" 
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#ff9900] animate-pulse" />
                        <div className="text-left">
                          <span className="text-[11px] font-bold text-white tracking-wider block">Job Preferences</span>
                          <span className="text-[8px] text-gray-500 font-mono">Matches {user.jobTitle}</span>
                        </div>
                      </div>
                      <div className={`w-7 h-3.5 rounded-full relative transition-colors ${jobMatchOnly ? "bg-[#ff9900]" : "bg-white/10"}`}>
                        <div className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full transition-all ${jobMatchOnly ? "right-0.5" : "left-0.5"}`} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Selector */}
                <div className="mb-5 text-left">
                  <h3 className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-mono mb-3">Product Category</h3>
                  <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar text-xs">
                    {CATEGORIES.map((cat) => {
                      const CatIcon = getCategoryIcon(cat);
                      return (
                        <label 
                          key={cat} 
                          onClick={() => setSelectedCategory(cat)}
                          className="flex items-center gap-3 py-1 px-2 rounded hover:bg-white/5 cursor-pointer group select-none text-left transition-colors"
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                            selectedCategory === cat ? "border-[#ff9900]" : "border-white/15 group-hover:border-white/30"
                          }`}>
                            {selectedCategory === cat && <div className="w-2 h-2 bg-[#ff9900] rounded-sm" />}
                          </div>
                          <span className={`tracking-wider flex items-center gap-2 transition-colors ${
                            selectedCategory === cat ? "text-white font-bold text-[#ff9900]" : "text-gray-400 group-hover:text-gray-200"
                          }`}>
                            <CatIcon className={`w-3.5 h-3.5 ${selectedCategory === cat ? "text-[#ff9900]" : "text-gray-500 group-hover:text-gray-400"}`} />
                            <span>{cat}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="mb-5 border-t border-white/5 pt-4">
                  <h3 className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-mono mb-3">Max Budget</h3>
                  <input 
                    type="range" 
                    min="100" 
                    max="5000" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#ff9900] bg-white/5 rounded-lg appearance-none h-1 cursor-pointer" 
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                    <span>$100</span>
                    <span className="text-[#ff9900] font-bold">${priceRange.toLocaleString()} max</span>
                  </div>
                </div>

                {/* Ratings Filter Chest */}
                <div className="mb-5 text-left border-t border-white/5 pt-4">
                  <h3 className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-mono mb-3">Ratings Chest</h3>
                  <div className="flex flex-col gap-2.5 text-xs">
                    {[0, 4, 3, 2].map((stars) => (
                      <label 
                        key={stars} 
                        onClick={() => setSelectedRating(stars)}
                        className="flex items-center gap-3 cursor-pointer group select-none text-left font-mono"
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                          selectedRating === stars ? "border-[#ff9900]" : "border-white/15 group-hover:border-white/30"
                        }`}>
                          {selectedRating === stars && <div className="w-2 h-2 bg-[#ff9900] rounded-sm" />}
                        </div>
                        <span className={`tracking-wider flex items-center gap-1.5 transition-colors ${
                          selectedRating === stars ? "text-white font-bold" : "text-gray-400 group-hover:text-gray-200"
                        }`}>
                          {stars === 0 ? "All Ratings" : (
                            <>
                              <span>{stars}+ Stars</span>
                              <span className="flex text-yellow-400">
                                {Array.from({ length: stars }).map((_, si) => (
                                  <Star key={si} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                ))}
                              </span>
                            </>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-5 text-left border-t border-white/5 pt-4">
                  <h3 className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-mono mb-3">Filter by Brand</h3>
                  <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar text-xs">
                    <label 
                      onClick={() => setSelectedBrand("")}
                      className="flex items-center gap-3 py-1 px-2 rounded hover:bg-white/5 cursor-pointer group select-none text-left"
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                        selectedBrand === "" ? "border-[#ff9900]" : "border-white/15"
                      }`}>
                        {selectedBrand === "" && <div className="w-2 h-2 bg-[#ff9900] rounded-sm" />}
                      </div>
                      <span className={`tracking-wider transition-colors ${
                        selectedBrand === "" ? "text-white font-bold text-[#ff9900]" : "text-gray-400"
                      }`}>
                        All Brands
                      </span>
                    </label>
                    {allBrands.map((b) => (
                      <label 
                        key={b} 
                        onClick={() => setSelectedBrand(b)}
                        className="flex items-center gap-3 py-1 px-2 rounded hover:bg-white/5 cursor-pointer group select-none text-left transition-colors"
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                          selectedBrand === b ? "border-[#ff9900]" : "border-white/15 group-hover:border-white/30"
                        }`}>
                          {selectedBrand === b && <div className="w-2 h-2 bg-[#ff9900] rounded-sm" />}
                        </div>
                        <span className={`tracking-wider transition-colors ${
                          selectedBrand === b ? "text-white font-bold text-[#ff9900]" : "text-gray-400 group-hover:text-gray-200"
                        }`}>
                          {b}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Sync indicator */}
          {isFallbackActive && (
            <div className="p-4 border border-emerald-500/20 bg-black/45 rounded-xl text-left">
               <h3 className="text-[#00ff87] text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 animate-pulse" /> Local Fallback Secure
               </h3>
               <p className="text-[9px] text-gray-400 leading-relaxed font-light font-mono">
                 Serving catalog details from local memory cache buffers. Transactions remain functional.
               </p>
            </div>
          )}

        </aside>

        {/* RIGHT COLUMN: MAIN PRODUCT CATALOG */}
        <section className="flex-1 h-full overflow-y-auto custom-scrollbar p-5 relative flex flex-col gap-4">
          
          {/* Header Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111827]/40 border border-gray-200 dark:border-white/5 rounded-xl p-4 flex-shrink-0 text-left">
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-gray-800 dark:text-white">Workspace Devices</h1>
              <p className="text-[9px] text-gray-400 tracking-widest uppercase font-mono mt-0.5">
                {loading ? "Searching inventory..." : `Displaying ${products.length} products`}
              </p>
            </div>

            {/* Keyword Search */}
            <div className="w-full sm:w-80 relative flex items-center bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 transition-all focus-within:border-[#febd69]">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search premium products..." 
                className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none placeholder:text-gray-400 text-xs"
              />
              {searchText && (
                <button 
                  type="button"
                  onClick={() => setSearchText("")}
                  className="text-[9px] text-gray-400 hover:text-black dark:hover:text-white uppercase font-mono cursor-pointer ml-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Layout & Sort Controls */}
            <div className="flex items-center gap-4 flex-shrink-0 z-30">
              {/* Layout Switcher */}
              <div className="flex border border-white/10 rounded-lg p-0.5 bg-black/40">
                <button
                  type="button"
                  onClick={() => setViewLayout("grid")}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    viewLayout === "grid" 
                      ? "bg-[#ff9900]/25 text-[#ff9900] border border-[#ff9900]/30 shadow-sm shadow-[#ff9900]/5" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewLayout("list")}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    viewLayout === "list" 
                      ? "bg-[#ff9900]/25 text-[#ff9900] border border-[#ff9900]/30 shadow-sm shadow-[#ff9900]/5" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  List
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <div 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors font-mono select-none"
                >
                  Sort by: <span className="text-[#ff9900] font-bold">{sortOption}</span> <ChevronDown className="w-4 h-4 text-[#ff9900]" />
                </div>

                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-[#02040a] border border-gray-200 dark:border-white/10 rounded-lg p-1 shadow-2xl font-mono text-[9px] z-50 text-left"
                    >
                      {["AI Relevance", "price-low", "price-high"].map((opt) => (
                        <div 
                          key={opt}
                          onClick={() => { 
                            setSortOption(opt === "price-low" ? "Price: Low-High" : opt === "price-high" ? "Price: High-Low" : "AI Relevance"); 
                            setShowSortDropdown(false); 
                          }}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#ff9900] dark:hover:text-[#00f0ff] rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
                        >
                          {opt === "price-low" ? "Price: Low to High" : opt === "price-high" ? "Price: High to Low" : "AI Relevance"}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 min-h-0">
            {loading ? (
              debouncedSearchText ? (
                <CompilationLoader />
              ) : (
                <div className={viewLayout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-16" : "flex flex-col gap-4 pb-16"}>
                  {skeletonCards}
                </div>
              )
            ) : products.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl bg-black/10 py-20">
                <HelpCircle className="w-8 h-8 text-gray-500 mb-2 animate-pulse" />
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">No products match current filters.</p>
              </div>
            ) : (
              <div className={viewLayout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-16" : "flex flex-col gap-4 pb-16"}>
                {renderedProducts}
              </div>
            )}
          </div>

        </section>

      </div>

      {/* FLOAT BAR: COMPARISON CONTROLS */}
      <AnimatePresence>
        {compareProducts.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto bg-white dark:bg-black border border-gray-200 dark:border-white/10 px-6 py-3.5 rounded-xl flex items-center gap-5 shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#e47911]" />
              <span className="text-xs font-mono text-gray-800 dark:text-white">
                <strong className="text-[#e47911]">{compareProducts.length}</strong> / 3 selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCompareDrawerOpen(true)}
                className="px-3.5 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-black font-bold uppercase tracking-widest text-[9px] rounded-lg transition-all cursor-pointer border border-[#a88734]"
              >
                Compare Specs
              </button>
              <button
                type="button"
                onClick={() => setCompareProducts([])}
                className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg text-[9px] uppercase tracking-widest font-bold transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAWERS FOR DETAILED SHEETS & CUSTOM BUILDER */}
      <AnimatePresence>
        
        {/* Backdrop for builders & comparisons */}
        {(quickViewProduct || builderOpen || compareDrawerOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setQuickViewProduct(null);
              setBuilderOpen(false);
              setCompareDrawerOpen(false);
            }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
        )}

        {/* WORKSTATION BUILDER DRAWER */}
        {builderOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-white/10 p-6 shadow-2xl z-50 overflow-y-auto flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/5 pb-4 text-left">
                <div>
                  <h2 className="text-base font-black text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#e47911]" />
                    Custom Configurator
                  </h2>
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block mt-0.5 font-bold">Configure workstation rig</span>
                </div>
                <button 
                  onClick={() => setBuilderOpen(false)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step Parameters */}
              <div className="space-y-5 text-left">
                
                {/* CPU Selector */}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2 font-mono">CPU Core</span>
                  <div className="space-y-2">
                    {BUILDER_PARTS.cpu.map((c) => (
                      <div 
                        key={c.id}
                        onClick={() => setBuilderSelections(prev => ({ ...prev, cpu: c }))}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          builderSelections.cpu.id === c.id 
                            ? "bg-[#febd69]/10 border-[#febd69] text-[#e47911]" 
                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{c.name}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{c.specs}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#b12704] dark:text-[#ff9900]">+${c.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GPU Selector */}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2 font-mono">Graphics Card</span>
                  <div className="space-y-2">
                    {BUILDER_PARTS.gpu.map((g) => (
                      <div 
                        key={g.id}
                        onClick={() => setBuilderSelections(prev => ({ ...prev, gpu: g }))}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          builderSelections.gpu.id === g.id 
                            ? "bg-[#febd69]/10 border-[#febd69] text-[#e47911]" 
                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{g.name}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{g.specs}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#b12704] dark:text-[#ff9900]">+${g.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RAM Selector */}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2 font-mono">RAM Memory</span>
                  <div className="space-y-2">
                    {BUILDER_PARTS.ram.map((r) => (
                      <div 
                        key={r.id}
                        onClick={() => setBuilderSelections(prev => ({ ...prev, ram: r }))}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          builderSelections.ram.id === r.id 
                            ? "bg-[#febd69]/10 border-[#febd69] text-[#e47911]" 
                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{r.name}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{r.specs}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#b12704] dark:text-[#ff9900]">+${r.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooling Selector */}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2 font-mono">Thermal Loop</span>
                  <div className="space-y-2">
                    {BUILDER_PARTS.cooling.map((co) => (
                      <div 
                        key={co.id}
                        onClick={() => setBuilderSelections(prev => ({ ...prev, cooling: co }))}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          builderSelections.cooling.id === co.id 
                            ? "bg-[#febd69]/10 border-[#febd69] text-[#e47911]" 
                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{co.name}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{co.specs}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#b12704] dark:text-[#ff9900]">+${co.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage Selector */}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2 font-mono">SSD Storage</span>
                  <div className="space-y-2">
                    {BUILDER_PARTS.storage.map((s) => (
                      <div 
                        key={s.id}
                        onClick={() => setBuilderSelections(prev => ({ ...prev, storage: s }))}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          builderSelections.storage.id === s.id 
                            ? "bg-[#febd69]/10 border-[#febd69] text-[#e47911]" 
                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{s.name}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{s.specs}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#b12704] dark:text-[#ff9900]">+${s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Builder Footer */}
            <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-6 flex flex-col gap-4 text-left">
              
              {/* Compatibility score */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-black/60 p-3 rounded-xl border border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-2">
                  {compatibilityScore < 90 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  )}
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono block font-bold">Specs Match Rate</span>
                    <span className="text-[11px] text-gray-600 dark:text-gray-400 font-light font-mono">
                      {compatibilityScore < 90 ? "Suboptimal pairing detected" : "All parts are verified compatible"}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold ${compatibilityScore < 90 ? "text-amber-500" : "text-green-500"}`}>
                  {compatibilityScore}% Score
                </span>
              </div>

              {/* Total aggregated price */}
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Aggregated Cost</span>
                <span className="text-[#b12704] dark:text-[#ff9900] text-2xl font-black font-mono">${customRigPrice.toLocaleString()}</span>
              </div>

              {/* Submit Custom Rig */}
              <button
                type="button"
                onClick={handleCompileCustomRig}
                className="w-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-black border border-[#a88734] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all rounded-lg active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                Add Custom Workstation
              </button>
            </div>
          </motion.div>
        )}

        {/* COMPARISON SLIDE SHEET */}
        {compareDrawerOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-auto max-h-[85vh] bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-white/10 p-6 shadow-2xl z-50 overflow-y-auto rounded-t-3xl flex flex-col text-left"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-white/5 pb-3">
              <div>
                <h2 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#e47911]" />
                  Specs Comparison Matrix
                </h2>
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block font-bold">Analyze specs side-by-side</span>
              </div>
              <button 
                onClick={() => setCompareDrawerOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Spec Sheet Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse min-w-[600px] text-gray-800 dark:text-gray-200">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/5">
                    <th className="py-3 text-[10px] text-gray-400 uppercase tracking-widest font-mono w-1/4">Metric</th>
                    {compareProducts.map(p => (
                      <th key={p._id} className="py-3 px-4 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider w-1/4">
                        <div className="flex justify-between items-start">
                          <span className="truncate max-w-[150px] capitalize">{p.name}</span>
                          <button
                            onClick={() => handleToggleCompare(p)}
                            className="text-red-500 hover:text-red-700 text-[8px] uppercase font-mono cursor-pointer font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - compareProducts.length) }).map((_, idx) => (
                      <th key={idx} className="py-3 px-4 text-gray-400 font-mono text-[9px] uppercase tracking-wider w-1/4">
                        Slot empty
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
                  
                  {/* Category */}
                  <tr>
                    <td className="py-3 text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold">Category</td>
                    {compareProducts.map(p => (
                      <td key={p._id} className="py-3 px-4 text-gray-700 dark:text-gray-300 font-mono uppercase text-[10px]">{p.category}</td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={i} className="py-3 px-4" />)}
                  </tr>

                  {/* Price */}
                  <tr>
                    <td className="py-3 text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold">Price</td>
                    {compareProducts.map(p => (
                      <td key={p._id} className="py-3 px-4 text-[#b12704] dark:text-[#ff9900] font-bold font-mono text-sm">${p.price.toLocaleString()}</td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={i} className="py-3 px-4" />)}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="py-3 text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold">Rating Score</td>
                    {compareProducts.map(p => (
                      <td key={p._id} className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-mono text-gray-900 dark:text-gray-100 font-bold">{p.rating || 4.5}</span>
                          <span className="text-[9px] text-gray-400 font-mono">({p.numReviews || 24} reviews)</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={i} className="py-3 px-4" />)}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td className="py-3 text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold">Overview</td>
                    {compareProducts.map(p => (
                      <td key={p._id} className="py-3 px-4 text-gray-500 dark:text-gray-400 text-[10px] leading-relaxed line-clamp-3 w-1/4 h-24 overflow-hidden block">{p.description}</td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={i} className="py-3 px-4" />)}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="py-3 text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold">Checkout Action</td>
                    {compareProducts.map(p => (
                      <td key={p._id} className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(p)}
                          className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] border border-[#a88734] text-black font-bold uppercase rounded-lg text-[9px] transition-colors cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={i} className="py-3 px-4" />)}
                  </tr>

                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* QUICK VIEW SLIDE OVER DRAWER */}
        {quickViewProduct && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-white/10 p-6 shadow-2xl z-50 overflow-y-auto flex flex-col justify-between text-left"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
                <div>
                  <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider capitalize">
                    {quickViewProduct.name}
                  </h2>
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block mt-0.5 font-bold">Quick Overview</span>
                </div>
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Visual & Details */}
              <div className="space-y-6">
                <div className="h-56 bg-white rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm">
                  {quickViewProduct.images?.[0] ? (
                    <img src={quickViewProduct.images[0]} alt={quickViewProduct.name} className="h-48 w-full object-contain p-4" />
                  ) : (
                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{quickViewProduct.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900 dark:text-gray-100 font-mono">{quickViewProduct.rating || 4.5}</span>
                      <span className="text-[9px] text-gray-500 font-mono">({quickViewProduct.numReviews || 24} reviews)</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[11px] font-light">
                    {quickViewProduct.description}
                  </p>
                </div>

                {/* Specs/Features lists */}
                {quickViewProduct.features && quickViewProduct.features.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block font-mono">Product Features</span>
                    <div className="flex flex-col gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                      {quickViewProduct.features.map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 py-1.5 px-3 bg-gray-50 dark:bg-white/2 rounded-lg border border-gray-100 dark:border-white/5">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="font-light">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Quick View Footer */}
            <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-6 flex flex-col gap-4">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">List Price</span>
                <span className="text-[#b12704] dark:text-[#ff9900] text-xl font-black font-mono">${quickViewProduct.price.toLocaleString()}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 py-3 bg-[#febd69] hover:bg-[#f3a847] border border-[#a88734] text-black font-bold uppercase tracking-widest text-xs rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/product/${quickViewProduct._id}`)}
                  className="px-4 py-3 border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 rounded-lg transition-all cursor-pointer"
                >
                  Specs Page
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen bg-[#0b0f19] flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#ff9900] border-t-transparent animate-spin" />
        <span className="text-xs text-gray-500 font-mono">Loading Nexus Workspace listings...</span>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
