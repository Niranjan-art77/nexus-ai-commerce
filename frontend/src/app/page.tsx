"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { mockDb } from "@/utils/mockDb";
import { NavBar } from "@/components/ui/NavBar";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ShoppingBag, Star, Zap, Clock, ChevronLeft, ChevronRight, 
  ArrowRight, ShieldCheck, Mail, Check, Heart,
  Sparkles, Package, Truck, RotateCcw, Headphones, 
  TrendingUp, Award, Users, Globe, ChevronDown, Play
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const heroRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 34, seconds: 12 });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const [recentlyViewedProds, setRecentlyViewedProds] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  const heroBanners = [
    {
      title: "Nexus Quantum Phone X",
      subtitle: "True quantum entanglement communication. Holographic projection. Zero latency.",
      bg: "from-[#0a0015] via-[#1a0035] to-[#000d26]",
      accent: "#a855f7",
      cta: "Shop Smartphones",
      category: "Smartphones",
      badge: "NEW 2050",
      img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=90",
      price: "$1,499",
      features: ["Quantum Core", "6G Sub-THz", "Holographic Display"]
    },
    {
      title: "Nexus Workstation Pro",
      subtitle: "64-Core beast. 256GB unified memory. Engineered for the future of computing.",
      bg: "from-[#001020] via-[#002040] to-[#000d1a]",
      accent: "#00f0ff",
      cta: "Explore Workstations",
      category: "Workstations",
      badge: "BESTSELLER",
      img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=90",
      price: "$4,299",
      features: ["64-Core CPU", "256GB RAM", "Liquid Cooling"]
    },
    {
      title: "Nexus AeroBook Pro",
      subtitle: "Ultra-slim carbon fiber. Dual OLED display. 2050's thinnest powerhouse.",
      bg: "from-[#001a10] via-[#002a20] to-[#000d08]",
      accent: "#10b981",
      cta: "View Laptops",
      category: "Laptops",
      badge: "PRO PICK",
      img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=90",
      price: "$2,499",
      features: ["Dual OLED", "Carbon Fiber", "Mag Charging"]
    },
    {
      title: "AeroPhone Pro Max",
      subtitle: "Liquid metal frame. Folding OLED. AI companion chip. The phone of tomorrow.",
      bg: "from-[#1a0a00] via-[#2a1500] to-[#0d0500]",
      accent: "#f59e0b",
      cta: "Shop Smartphones",
      category: "Smartphones",
      badge: "FLASH SALE",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=90",
      price: "$1,299",
      features: ["Folding OLED", "AI Chip", "Nano-Charging"]
    }
  ];

  useEffect(() => {
    setMounted(true);
    const prods = mockDb.getProducts({});
    setProducts(prods);

    // Read browsing history from local storage
    if (typeof window !== "undefined") {
      const ids = JSON.parse(localStorage.getItem("nexus_recently_viewed") || "[]");
      if (ids.length > 0) {
        const items = ids.map((id: string) => mockDb.getProductById(id)).filter(Boolean);
        setRecentlyViewedProds(items);
        
        // Dynamic category matching AI recommendations
        const categories = Array.from(new Set(items.map((p: any) => p.category)));
        const filtered = prods.filter((p: any) => categories.includes(p.category) && !ids.includes(p._id));
        setRecommended(filtered.slice(0, 8));
      } else {
        // Fallback to top-rated
        setRecommended(prods.filter((p: any) => p.rating > 4.7).slice(0, 8));
      }
    }

    const rotationTimer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroBanners.length);
    }, 5000);

    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 11, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => { clearInterval(rotationTimer); clearInterval(countdownTimer); };
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || ""
    }));
    setAddedToCart(prev => new Set([...prev, product._id]));
    setTimeout(() => {
      setAddedToCart(prev => { const n = new Set(prev); n.delete(product._id); return n; });
    }, 2000);
  };

  const handleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlistedIds(prev => {
      const n = new Set(prev);
      if (n.has(productId)) n.delete(productId);
      else n.add(productId);
      return n;
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
  };

  // Category grid
  const gridCategories = [
    { title: "Smartphones", desc: "Holographic & Quantum Phones", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Smartphones", color: "#a855f7" },
    { title: "Workstations", desc: "Next-gen computing towers", img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Workstations", color: "#00f0ff" },
    { title: "Laptops", desc: "Ultra-slim carbon fiber books", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Laptops", color: "#10b981" },
    { title: "VR & AR Tech", desc: "Spatial computing headsets", img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80", link: "/shop?category=VR%20Tech", color: "#f59e0b" },
    { title: "Gaming Gear", desc: "Mechanical keyboards & mice", img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Gaming", color: "#ef4444" },
    { title: "AI Devices", desc: "Smart home & AI hubs", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80", link: "/shop?category=AI%20Devices", color: "#8b5cf6" },
    { title: "Monitors", desc: "Curved spatial displays", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Monitors", color: "#06b6d4" },
    { title: "Audio", desc: "Spatial audio headsets", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80", link: "/shop?category=Audio", color: "#f97316" }
  ];

  // Dynamic Product Filters for Homepage Categories
  const smartphones = products.filter(p => p.category === "Smartphones").slice(0, 6);
  const todayDeals = products.filter(p => p.discount > 0).slice(0, 8);
  const trendingProducts = products.filter(p => p.rating >= 4.7).slice(0, 8);
  const topRated = trendingProducts;
  const bestSellers = [...products].sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0)).slice(0, 8);
  const newArrivals = products.filter(p => p.name.includes("16") || p.name.includes("Pro") || p.specifications?.["Model Year"] === "2026").slice(0, 8);
  const flashSales = products.filter(p => p.discount >= 12).slice(0, 6);
  const flashDeals = flashSales;
  const continueShopping = recentlyViewedProds[0] || null;

  const activeBanner = heroBanners[heroIndex]!;

  return (
    <main className="w-full bg-[#0b0f19] min-h-screen text-white font-sans flex flex-col overflow-x-hidden">
      
      <NavBar />

      {/* HERO BANNER */}
      <section ref={heroRef} className="relative w-full h-[560px] md:h-[620px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-r ${activeBanner.bg}`}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {mounted && [...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full opacity-20 animate-pulse"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    background: activeBanner.accent,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`
                  }}
                />
              ))}
            </div>

            {/* Glow orbs */}
            <div
              className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
              style={{ background: activeBanner.accent }}
            />
            <div
              className="absolute bottom-[-100px] right-[200px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
              style={{ background: activeBanner.accent }}
            />

            <div className="relative z-10 h-full max-w-[1480px] mx-auto px-6 md:px-16 flex items-center">
              {/* Left content */}
              <div className="flex-1 max-w-xl space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span
                    className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 border"
                    style={{ color: activeBanner.accent, borderColor: `${activeBanner.accent}50`, background: `${activeBanner.accent}15` }}
                  >
                    {activeBanner.badge}
                  </span>
                  
                  <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white">
                    {activeBanner.title}
                  </h1>
                  
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-3 max-w-md">
                    {activeBanner.subtitle}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {activeBanner.features.map((feat, fi) => (
                      <span
                        key={fi}
                        className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
                        style={{ borderColor: `${activeBanner.accent}40`, color: activeBanner.accent, background: `${activeBanner.accent}10` }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <span className="text-3xl font-black" style={{ color: activeBanner.accent }}>
                      {activeBanner.price}
                    </span>
                    <Link
                      href={`/shop?category=${encodeURIComponent(activeBanner.category)}`}
                      className="group px-6 py-3 rounded-full font-bold text-sm text-black flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                      style={{ background: `linear-gradient(135deg, ${activeBanner.accent}, ${activeBanner.accent}cc)` }}
                    >
                      {activeBanner.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right product image */}
              <div className="hidden md:flex flex-1 items-center justify-center relative">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  className="relative"
                >
                  {/* Glow behind image */}
                  <div
                    className="absolute inset-0 blur-[60px] opacity-40 rounded-full scale-110"
                    style={{ background: activeBanner.accent }}
                  />
                  <img
                    src={activeBanner.img}
                    alt={activeBanner.title}
                    className="relative z-10 w-[320px] h-[380px] object-contain drop-shadow-2xl"
                    style={{ filter: `drop-shadow(0 0 40px ${activeBanner.accent}60)` }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <button
          onClick={() => setHeroIndex(prev => (prev - 1 + heroBanners.length) % heroBanners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setHeroIndex(prev => (prev + 1) % heroBanners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`rounded-full transition-all ${i === heroIndex ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/30"}`}
            />
          ))}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0b0f19] to-transparent z-10" />
      </section>

      {/* TRUST BADGES */}
      <section className="bg-[#111827] border-y border-white/5">
        <div className="max-w-[1480px] mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: "Free 1-Day Shipping", desc: "On orders over $299", color: "#00f0ff" },
            { icon: ShieldCheck, label: "Quantum Encrypted", desc: "Military-grade security", color: "#10b981" },
            { icon: RotateCcw, label: "30-Day Returns", desc: "Hassle-free returns", color: "#f59e0b" },
            { icon: Headphones, label: "24/7 AI Support", desc: "Instant AI assistance", color: "#a855f7" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{item.label}</div>
                <div className="text-[10px] text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-[1480px] mx-auto px-4 md:px-8 py-10 w-full space-y-12">

        {/* CATEGORY GRID */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#ff9900]" />
              Shop by Category
            </h2>
            <Link href="/shop" className="text-xs font-semibold text-[#00f0ff] hover:text-white transition-colors flex items-center gap-1">
              All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {gridCategories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={cat.link}
                  className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/20 transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer text-center"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white/20 transition-all" style={{ boxShadow: `0 0 0 0 ${cat.color}` }}>
                    <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white group-hover:text-[#ff9900] transition-colors">{cat.title}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5 hidden lg:block">{cat.desc}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CONTINUE SHOPPING & RECENTLY VIEWED PANEL */}
        {recentlyViewedProds.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
            {/* Continue Shopping */}
            {continueShopping && (
              <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono mb-2">Continue Shopping</h3>
                  <div className="h-32 w-full bg-white flex items-center justify-center p-2 rounded-xl mb-4 border border-gray-50">
                    <img src={continueShopping.images?.[0]} alt={continueShopping.name} className="h-28 object-contain" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">{continueShopping.name}</h4>
                  <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">{continueShopping.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="font-mono text-[#b12704] font-black text-sm">${continueShopping.price}</span>
                  <Link href={`/product/${continueShopping._id}`} className="text-xs text-[#00f0ff] hover:text-[#00c0cc] hover:underline font-bold flex items-center gap-0.5">Resume <ArrowRight className="w-3.5 h-3.5"/></Link>
                </div>
              </div>
            )}
            
            {/* Recently Viewed */}
            <div className={`${continueShopping ? "lg:col-span-3" : "lg:col-span-4"} bg-[#111827] rounded-2xl p-5 border border-white/5`}>
              <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono mb-4">Your Browsing History</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentlyViewedProds.slice(0, 4).map((prod) => (
                  <Link 
                    key={prod._id}
                    href={`/product/${prod._id}`}
                    className="flex flex-col bg-white p-3 rounded-xl border border-gray-100 hover:border-[#ff9900]/40 transition-all h-full"
                  >
                    <div className="h-24 w-full flex items-center justify-center p-1 bg-white">
                      <img src={prod.images?.[0]} alt={prod.name} className="h-20 object-contain" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 truncate mt-2 block">{prod.name}</span>
                    <span className="text-[10px] text-[#b12704] font-mono font-bold mt-1 block">${prod.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
          {/* TODAY'S DEALS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#ff9900] to-[#ff6600]" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Today&apos;s Deals</h2>
                <span className="text-[10px] font-black bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Top Savings
                </span>
              </div>
              <Link href="/shop" className="text-xs font-semibold text-[#ff9900] hover:text-white transition-colors flex items-center gap-1">
                View All Deals <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {todayDeals.slice(0, 6).map((prod, i) => (
                <motion.div
                  key={prod._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    key={prod._id}
                    href={`/product/${prod._id}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#ff9900]/40 hover:shadow-xl transition-all cursor-pointer h-full"
                  >
                    <div className="bg-white p-4 flex items-center justify-center h-48 relative">
                      <img
                        src={prod.images?.[0]}
                        alt={prod.name}
                        className="h-36 w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                      <button
                        onClick={(e) => handleWishlist(e, prod._id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 hover:border-red-300 transition-all z-10"
                      >
                        <Heart className={`w-4 h-4 ${wishlistedIds.has(prod._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </button>
                      {prod.discount > 0 && (
                        <span className="absolute top-3 left-3 bg-[#b12704] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          -{prod.discount}% OFF
                        </span>
                      )}
                    </div>
                    
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col flex-1">
                      <div className="text-[9px] text-[#ff9900] font-black uppercase tracking-wider mb-1">{prod.category}</div>
                      <h3 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#ff9900] transition-colors leading-snug flex-1">{prod.name}</h3>
                      <div className="flex items-center gap-1 mt-1.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} className={`w-2.5 h-2.5 ${si < Math.floor(prod.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        ))}
                        <span className="text-[9px] text-gray-400 ml-0.5">({prod.numReviews})</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                        <div>
                          <span className="text-sm font-black text-gray-900">${prod.price.toLocaleString()}</span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[9px] text-gray-400 line-through ml-1 block">${prod.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, prod)}
                        className={`w-full mt-2.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                          addedToCart.has(prod._id)
                            ? "bg-green-500 text-white"
                            : "bg-[#ff9900] hover:bg-[#f3a847] text-black border border-[#a88734]"
                        }`}
                      >
                        {addedToCart.has(prod._id) ? "✓ Added" : "Add to Cart"}
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        {/* FLASH SALE TIMER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a0010] via-[#2a0020] to-[#1a0010] border border-[#ff007f]/20 p-6 md:p-8">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full blur-[80px] opacity-30 bg-[#ff007f]" />
            <div className="absolute bottom-[-50px] right-[100px] w-[200px] h-[200px] rounded-full blur-[60px] opacity-20 bg-[#ff9900]" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Zap className="w-5 h-5 text-[#ff007f] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff007f] bg-[#ff007f]/10 px-3 py-1 rounded-full border border-[#ff007f]/30">
                  Lightning Flash Deal
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Double Quantum Points
              </h3>
              <p className="text-sm text-gray-400 max-w-md">
                Every order placed in this window earns 2× loyalty points. Stack rewards across Nexus ecosystem.
              </p>
              <Link href="/shop" className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 bg-gradient-to-r from-[#ff007f] to-[#ff4d94] text-white font-bold text-sm rounded-full hover:scale-105 transition-all">
                Shop Flash Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest hidden md:block">ENDS IN</span>
              <div className="flex gap-2 font-mono">
                {[
                  { val: countdown.hours, label: "HRS" },
                  { val: countdown.minutes, label: "MIN" },
                  { val: countdown.seconds, label: "SEC" }
                ].map((unit, ui) => (
                  <div key={ui} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-black/40 rounded-2xl border border-[#ff007f]/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,127,0.15)]">
                      <span className="text-2xl font-black text-[#ff007f]">{String(unit.val).padStart(2, "0")}</span>
                    </div>
                    <span className="text-[8px] text-gray-500 uppercase mt-1 tracking-widest">{unit.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TOP RATED PRODUCTS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#ff9900] to-[#ff6600]" />
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Top Rated</h2>
              <TrendingUp className="w-5 h-5 text-[#ff9900]" />
            </div>
            <Link href="/shop" className="text-xs font-semibold text-[#ff9900] hover:text-white transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {topRated.slice(0, 8).map((prod, i) => (
              <motion.div
                key={prod._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/product/${prod._id}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#ff9900]/40 hover:shadow-[0_8px_30px_rgba(255,153,0,0.15)] transition-all cursor-pointer h-full"
                >
                  <div className="bg-white p-4 flex items-center justify-center h-44 relative">
                    <img
                      src={prod.images?.[0]}
                      alt={prod.name}
                      className="h-32 w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    />
                    <button
                      onClick={(e) => handleWishlist(e, prod._id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 hover:border-red-300 transition-all"
                    >
                      <Heart className={`w-4 h-4 ${wishlistedIds.has(prod._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </button>
                    {i === 0 && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                        #1 BESTSELLER
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-gray-50 flex flex-col flex-1">
                    <div className="text-[9px] text-[#ff9900] font-black uppercase tracking-wider mb-1">{prod.category}</div>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#ff9900] transition-colors leading-snug flex-1">{prod.name}</h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} className={`w-2.5 h-2.5 ${si < Math.floor(prod.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                      <span className="text-[9px] text-gray-400 ml-0.5">({prod.numReviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <div>
                        <div className="text-sm font-black text-gray-900">${prod.price.toLocaleString()}</div>
                        {prod.originalPrice > prod.price && (
                          <div className="text-[9px] text-gray-400 line-through">${prod.originalPrice}</div>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, prod)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                          addedToCart.has(prod._id)
                            ? "bg-green-500 text-white"
                            : "bg-[#ff9900] hover:bg-[#f3a847] text-black border border-[#a88734]"
                        }`}
                      >
                        {addedToCart.has(prod._id) ? "✓" : "+ Cart"}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI RECOMMENDATION BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#000d26] via-[#001a3d] to-[#000d26] border border-[#00f0ff]/20 p-6 md:p-10">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full blur-[100px] opacity-20 bg-[#00f0ff]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00f0ff] to-[#0080ff] flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.4)]">
                <Sparkles className="w-10 h-10 text-black" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-[10px] font-black text-[#00f0ff] uppercase tracking-widest mb-2">AI-Powered Recommendations</div>
              <h3 className="text-2xl font-black text-white mb-2">Your Personalized Workspace Profile</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                Our Quantum AI analyzes your job role, browsing patterns, and hardware requirements to curate a perfectly matched workspace. Products tailored just for you.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#0080ff] text-black font-black text-sm hover:scale-105 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isAuthenticated ? "View My Picks" : "Get Started"}
              </Link>
            </div>
          </div>
        </div>

        {/* RECOMMENDED FOR YOU */}
        {recommended.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00f0ff] to-[#0080ff]" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Recommended For You</h2>
                <span className="text-[10px] font-black bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI Selected
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.slice(0, 4).map((prod, i) => (
                <motion.div
                  key={prod._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/product/${prod._id}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#00f0ff]/40 hover:shadow-xl transition-all cursor-pointer h-full"
                  >
                    <div className="bg-white p-4 flex items-center justify-center h-44 relative">
                      <img
                        src={prod.images?.[0]}
                        alt={prod.name}
                        className="h-32 w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                      <button
                        onClick={(e) => handleWishlist(e, prod._id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 hover:border-red-300 transition-all z-10"
                      >
                        <Heart className={`w-4 h-4 ${wishlistedIds.has(prod._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </button>
                    </div>
                    
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col flex-1">
                      <div className="text-[9px] text-[#0080ff] font-black uppercase tracking-wider mb-1">{prod.category}</div>
                      <h3 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#0080ff] transition-colors leading-snug flex-1">{prod.name}</h3>
                      <div className="flex items-center gap-1 mt-1.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} className={`w-2.5 h-2.5 ${si < Math.floor(prod.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        ))}
                        <span className="text-[9px] text-gray-400 ml-0.5">({prod.numReviews})</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                        <span className="text-sm font-black text-gray-900">${prod.price.toLocaleString()}</span>
                        <button
                          onClick={(e) => handleAddToCart(e, prod)}
                          className={`px-3 py-1 bg-[#ff9900] hover:bg-[#f3a847] text-black text-[10px] font-black uppercase rounded-full border border-[#a88734] transition-all`}
                        >
                          + Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FLASH DEALS GRID */}
        {flashDeals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#ef4444] to-[#b91c1c]" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Flash Deals</h2>
                <span className="text-[10px] font-black bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Limited Time
                </span>
              </div>
              <Link href="/shop" className="text-xs font-semibold text-[#ef4444] hover:text-white transition-colors flex items-center gap-1">
                All Deals <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {flashDeals.map((prod, i) => {
                const discount = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);
                return (
                  <motion.div
                    key={prod._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/product/${prod._id}`}
                      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#ef4444]/40 hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all cursor-pointer"
                    >
                      <div className="absolute top-3 left-3 z-10 bg-[#b12704] text-white text-[10px] font-black px-2 py-1 rounded-lg">
                        -{discount}%
                      </div>
                      <div className="bg-white p-4 flex items-center justify-center h-40">
                        <img
                          src={prod.images?.[0]}
                          alt={prod.name}
                          className="h-28 w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3 border-t border-gray-50">
                        <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">{prod.category}</div>
                        <h3 className="text-[11px] font-bold text-gray-900 line-clamp-2 group-hover:text-[#ef4444] transition-colors leading-snug">{prod.name}</h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-black text-[#b12704]">${prod.price.toLocaleString()}</span>
                          <span className="text-[9px] text-gray-400 line-through">${prod.originalPrice}</span>
                        </div>
                        {/* Urgency bar */}
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#ef4444] to-[#f59e0b] rounded-full"
                            style={{ width: `${35 + ((i * 17) % 45)}%` }}
                          />
                        </div>
                        <div className="text-[8px] text-gray-400 mt-1 font-bold">{prod.stock} left in stock</div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, stat: "2.4M+", label: "Active Customers", color: "#00f0ff" },
            { icon: Package, stat: "50K+", label: "Products Listed", color: "#10b981" },
            { icon: Award, stat: "4.9★", label: "Average Rating", color: "#f59e0b" },
            { icon: Globe, stat: "180+", label: "Countries Served", color: "#a855f7" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-[#111827] border border-white/5 p-5 text-center group hover:border-white/15 transition-all"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"
                style={{ background: `radial-gradient(circle at center, ${item.color}, transparent)` }}
              />
              <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: item.color }} />
              <div className="text-2xl font-black text-white">{item.stat}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* NEWSLETTER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0d1117] border border-white/10 p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.05),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <Mail className="w-10 h-10 text-[#ff9900] mx-auto" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Join the Nexus Matrix</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Get exclusive access to early product drops, quantum hardware upgrades, and double-points events. Zero spam, all signal.
            </p>
            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] text-sm font-bold">
                <Check className="w-4 h-4" /> Subscribed! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="operator@nexus.com"
                  className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-full text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff9900] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-black font-black text-sm rounded-full hover:scale-105 transition-all cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d1117] border-t border-white/5 text-white">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-full py-4 bg-[#161b22] hover:bg-[#21262d] text-center text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer border-b border-white/5"
        >
          ↑ Back to Top
        </button>

        <div className="max-w-[1480px] mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-b border-white/5">
          {[
            {
              title: "Company",
              links: [
                { label: "About Nexus", href: "/" },
                { label: "Careers", href: "/" },
                { label: "Press Room", href: "/" },
                { label: "Sustainability", href: "/" }
              ]
            },
            {
              title: "Sell on Nexus",
              links: [
                { label: "Seller Portal", href: "/login" },
                { label: "Advertise Products", href: "/" },
                { label: "Partner Network", href: "/" },
                { label: "Affiliate Program", href: "/" }
              ]
            },
            {
              title: "Nexus Pay",
              links: [
                { label: "Nexus Wallet", href: "/dashboard" },
                { label: "Quantum Points", href: "/dashboard" },
                { label: "Pay Later", href: "/" },
                { label: "Gift Cards", href: "/" }
              ]
            },
            {
              title: "Customer Help",
              links: [
                { label: "Your Account", href: "/dashboard" },
                { label: "Track Orders", href: "/orders" },
                { label: "Support Center", href: "/dashboard" },
                { label: "Returns Policy", href: "/" }
              ]
            }
          ].map((col, ci) => (
            <div key={ci} className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, li) => (
                  <li key={li}>
                    <Link href={link.href} className="text-[11px] text-gray-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-600">
            <ShieldCheck className="w-4 h-4 text-[#ff9900]" />
            <span className="font-mono">NEXUS COMMERCE X © 2050 — ALL SYSTEMS ACTIVE</span>
          </div>
          <div className="flex justify-center gap-6 text-[10px] text-gray-600">
            <Link href="/" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
