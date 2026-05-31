"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout, loginSuccess } from "@/store/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { mockDb } from "@/utils/mockDb";
import { 
  ShoppingBag, Heart, User, LogOut, Cpu, Settings, 
  Menu, X, Sparkles, ChevronDown, ChevronRight, Package, Terminal, 
  Search, Mic, ShieldCheck, MapPin, Globe, Grid, 
  Layers, Volume2, CreditCard, HelpCircle, Clock
} from "lucide-react";

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const wishlistItems = useSelector((state: any) => state.wishlist?.items || []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useState("New York, USA");
  
  const searchRef = useRef<HTMLFormElement>(null);
  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  // Categories for the dropdown
  const categories = [
    "All", "Smartphones", "Workstations", "Gaming", "AI Devices", "Laptops", 
    "Monitors", "VR Tech", "Smart Home", "Creator Tools", 
    "Audio", "Accessories", "Networking", "Wearables"
  ];

  // Language options
  const [language, setLanguage] = useState("EN");

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const trendingSearches = ["iPhone 16 Pro Max", "Dell XPS 15", "Razer DeathAdder", "OLED Monitor", "Quest 3", "Accessories"];

  // Track click outside search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load search history on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const history = JSON.parse(localStorage.getItem("nexus_search_history") || "[]");
      setSearchHistory(history);
    }
  }, []);

  // Update suggestions when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = mockDb.getProducts({ 
        search: searchQuery, 
        category: searchCategory === "All" ? undefined : searchCategory 
      });
      setSearchSuggestions(filtered.slice(0, 6));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, searchCategory]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    
    if (searchQuery.trim()) {
      const cleanQuery = searchQuery.trim();
      const updatedHistory = [cleanQuery, ...searchHistory.filter(h => h !== cleanQuery)].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem("nexus_search_history", JSON.stringify(updatedHistory));
    }
    
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(searchCategory)}`);
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = searchHistory.filter(h => h !== item);
    setSearchHistory(updated);
    localStorage.setItem("nexus_search_history", JSON.stringify(updated));
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSearchHistory([]);
    localStorage.setItem("nexus_search_history", JSON.stringify([]));
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Chrome.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setMicActive(true);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event);
      setMicActive(false);
    };
    
    recognition.onend = () => {
      setMicActive(false);
    };
    
    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setSearchQuery(speechToText);
      setMicActive(false);
      // Immediately run search and redirect
      router.push(`/shop?search=${encodeURIComponent(speechToText)}`);
    };
    
    recognition.start();
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleRoleBypass = (role: 'customer' | 'admin' | 'seller' | 'superadmin') => {
    // If not authenticated, login as default
    let defaultEmail = "niharjan8@gmail.com";
    if (role === 'admin') defaultEmail = "admin@nexus.com";
    if (role === 'seller') defaultEmail = "seller@nexus.com";
    if (role === 'superadmin') defaultEmail = "superadmin@nexus.com";

    // Call mock auth or bypass directly
    const mockUser = {
      _id: `user-${role}`,
      name: role.toUpperCase() + " User",
      email: defaultEmail,
      role: role === 'superadmin' ? 'admin' : role, // Treat superadmin as admin with flag, or support it directly
      jobTitle: "Software Engineer",
      createdAt: new Date().toISOString()
    };
    if (role === 'superadmin') {
      (mockUser as any).isSuperAdmin = true;
    }
    
    localStorage.setItem("currentUser", JSON.stringify(mockUser));
    dispatch(loginSuccess({ user: mockUser, token: token || "mock_bypass_token" }));
    setUserDropdownOpen(false);
    router.push("/dashboard");
  };

  return (
    <header className="w-full glass-effect text-white sticky top-0 z-50 text-xs font-sans border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Top primary Amazon bar */}
      <div className="flex items-center justify-between px-4 py-2 gap-4 h-14">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 px-2 py-1 border border-transparent hover:border-[#ff9900]/50 hover:bg-white/5 rounded-sm transition-all group">
          <div className="w-8 h-8 rounded box-glow-primary bg-gradient-to-tr from-[#ff9900] to-[#ffb700] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-wider text-glow-primary text-[#ff9900]">
              NEXUS
            </span>
            <span className="text-[8px] font-mono tracking-widest text-gray-400 font-bold group-hover:text-gray-300 transition-colors">COMMERCE</span>
          </div>
        </Link>

        {/* LOCATION SELECTOR */}
        <div 
          onClick={() => {
            const locs = ["London, UK", "New York, USA", "Tokyo, Japan", "Berlin, Germany"];
            const next = locs[Math.floor(Math.random() * locs.length)];
            setLocation(next!);
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight text-left"
        >
          <MapPin className="w-4 h-4 text-[#ff9900] flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-light">Deliver to</span>
            <span className="font-bold text-gray-100 truncate w-24">{location}</span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <form 
          ref={searchRef}
          onSubmit={handleSearchSubmit} 
          className="flex-1 max-w-3xl flex items-center bg-white rounded-lg overflow-hidden relative shadow-md h-10 text-black focus-within:ring-2 focus-within:ring-[#ff9900]"
        >
          {/* Department Selector */}
          <div className="relative h-full">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="h-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 pr-8 rounded-l-md border-r border-gray-300 font-medium text-xs focus:outline-none appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Input text */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search Amazon-inspired premium tech devices..."
            className="flex-1 h-full px-3 text-sm focus:outline-none placeholder:text-gray-400 font-sans"
          />

          {/* Voice Search Mic */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-2 hover:bg-gray-100 transition-colors h-full flex items-center ${
              micActive ? "text-red-500 animate-pulse" : "text-gray-500"
            }`}
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Search Button */}
          <button 
            type="submit" 
            className="bg-[#febd69] hover:bg-[#f3a847] text-[#111] px-6 h-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5 text-gray-900" />
          </button>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 right-0 top-11 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden text-left p-4 max-h-[480px] overflow-y-auto"
              >
                {/* CASE 1: Query is empty - Show History and Trending */}
                {searchQuery.trim().length === 0 ? (
                  <div className="space-y-4">
                    {/* Search History */}
                    {searchHistory.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Recent Searches</span>
                          <button 
                            type="button"
                            onClick={handleClearHistory}
                            className="text-[10px] text-red-500 hover:underline cursor-pointer"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-col">
                          {searchHistory.map((item, index) => (
                            <div 
                              key={index}
                              onClick={() => { setSearchQuery(item); router.push(`/shop?search=${encodeURIComponent(item)}`); setShowSuggestions(false); }}
                              className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors text-xs text-gray-700"
                            >
                              <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-gray-400" /> {item}</span>
                              <button 
                                type="button"
                                onClick={(e) => handleRemoveHistoryItem(e, item)}
                                className="p-1 hover:text-red-500 text-gray-400 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Searches */}
                    <div>
                      <div className="pb-2 border-b border-gray-100 mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Trending Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {trendingSearches.map((item, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => { setSearchQuery(item); router.push(`/shop?search=${encodeURIComponent(item)}`); setShowSuggestions(false); }}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs rounded-full cursor-pointer transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CASE 2: Query has text - Show matching items and categories suggestions */
                  <div className="space-y-3">
                    {/* Category quick link suggestion */}
                    <div className="border-b border-gray-100 pb-2">
                      <div 
                        onClick={() => handleSearchSubmit()}
                        className="text-xs text-gray-600 hover:text-[#ff9900] cursor-pointer py-1 flex items-center justify-between"
                      >
                        <span>Search for &quot;<strong className="text-gray-900">{searchQuery}</strong>&quot; in All Departments</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                      {searchCategory !== "All" && (
                        <div 
                          onClick={() => {
                            router.push(`/shop?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(searchCategory)}`);
                            setShowSuggestions(false);
                          }}
                          className="text-xs text-gray-600 hover:text-[#ff9900] cursor-pointer py-1 flex items-center justify-between"
                        >
                          <span>Search for &quot;<strong className="text-gray-900">{searchQuery}</strong>&quot; in <strong className="text-[#ff9900]">{searchCategory}</strong></span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Products Suggestions */}
                    <div>
                      <div className="pb-1 mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Product Matches</span>
                      </div>
                      {searchSuggestions.length > 0 ? (
                        <div className="space-y-2">
                          {searchSuggestions.map((prod) => (
                            <Link
                              key={prod._id}
                              href={`/product/${prod._id}`}
                              onClick={() => {
                                // Save to search history when clicked
                                const updatedHistory = [prod.name, ...searchHistory.filter(h => h !== prod.name)].slice(0, 10);
                                setSearchHistory(updatedHistory);
                                localStorage.setItem("nexus_search_history", JSON.stringify(updatedHistory));
                                setShowSuggestions(false);
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 border border-gray-100 rounded-md transition-colors"
                            >
                              <div className="w-10 h-10 rounded overflow-hidden border border-gray-100 bg-white flex-shrink-0 flex items-center justify-center p-1">
                                <img src={prod.images?.[0]} alt={prod.name} className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-gray-900 capitalize truncate">{prod.name}</div>
                                <div className="text-[10px] text-gray-400 truncate mt-0.5">{prod.description}</div>
                              </div>
                              <span className="text-xs font-mono font-bold text-[#b12704]">${prod.price}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 py-2">No matching products found.</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* LANGUAGE / REGION */}
        <div className="relative">
          <button 
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="hidden lg:flex items-center gap-1 px-3 py-2.5 border border-transparent hover:border-white rounded-sm cursor-pointer"
          >
            <Globe className="w-4 h-4 text-gray-300" />
            <span className="font-bold">{language}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          
          <AnimatePresence>
            {langDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 text-black rounded shadow-xl z-50 p-1"
              >
                {["EN", "ES", "DE", "FR"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 hover:bg-gray-100 text-xs rounded ${
                      language === lang ? "font-bold text-[#ff9900]" : "text-gray-700"
                    }`}
                  >
                    {lang === "EN" ? "English" : lang === "ES" ? "Español" : lang === "DE" ? "Deutsch" : "Français"}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACCOUNTS & LISTS DROPDOWN */}
        <div className="relative">
          {isAuthenticated && user ? (
            <div>
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex flex-col items-start px-3 py-1.5 border border-transparent hover:border-white rounded-sm cursor-pointer text-left leading-tight"
              >
                <span className="text-[10px] text-gray-400 font-light">Hello, {user.name || "Operator"}</span>
                <span className="font-bold flex items-center gap-1">
                  Account & Lists <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </span>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 text-black rounded-lg shadow-2xl z-50 p-4"
                  >
                    <div className="pb-3 border-b border-gray-100 mb-3">
                      <p className="text-[10px] text-gray-400 font-mono">AUTHORIZED PLATFORM SESSION</p>
                      <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">{user.email}</h4>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-[8px] bg-amber-100 text-[#ff9900] px-2 py-0.5 rounded border border-amber-200 font-bold uppercase tracking-wider">
                          Role: {user.isSuperAdmin ? "Super Admin" : user.role}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Left: Lists */}
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 mb-2 border-b border-gray-100 pb-1">Your Lists</h4>
                        <ul className="space-y-1.5 text-[11px] text-gray-600">
                          <li><Link href="/wishlist" className="hover:text-[#ff9900] hover:underline flex items-center gap-1"><Heart className="w-3 h-3 text-[#ff007f]"/> Wishlist</Link></li>
                          <li><Link href="/shop" className="hover:text-[#ff9900] hover:underline">Recent Views</Link></li>
                          <li><Link href="/shop" className="hover:text-[#ff9900] hover:underline">Recommends</Link></li>
                        </ul>
                      </div>
                      
                      {/* Right: Account */}
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 mb-2 border-b border-gray-100 pb-1">Your Account</h4>
                        <ul className="space-y-1.5 text-[11px] text-gray-600">
                          <li><Link href="/dashboard" className="hover:text-[#ff9900] hover:underline flex items-center gap-1"><Cpu className="w-3 h-3 text-purple-600"/> Go to Dashboard</Link></li>
                          <li><Link href="/orders" className="hover:text-[#ff9900] hover:underline flex items-center gap-1"><Package className="w-3 h-3 text-blue-600"/> Tracking Logs</Link></li>
                          <li><Link href="/profile" className="hover:text-[#ff9900] hover:underline flex items-center gap-1"><User className="w-3 h-3 text-emerald-600"/> Profile Edit</Link></li>
                        </ul>
                      </div>
                    </div>

                    {/* Developer Overrides */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-1.5">Developer Role Overrides</p>
                      <div className="grid grid-cols-4 gap-1 text-[8px] font-bold">
                        <button onClick={() => handleRoleBypass("customer")} className="py-1 px-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded cursor-pointer">CUST</button>
                        <button onClick={() => handleRoleBypass("seller")} className="py-1 px-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded cursor-pointer">SELL</button>
                        <button onClick={() => handleRoleBypass("admin")} className="py-1 px-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded cursor-pointer">ADMIN</button>
                        <button onClick={() => handleRoleBypass("superadmin")} className="py-1 px-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded cursor-pointer">S_ADM</button>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full mt-4 py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] hover:from-[#f5d78e] hover:to-[#eeb933] text-black text-[10px] font-bold uppercase rounded-md tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> De-Authorize System
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              href="/login"
              className="flex flex-col px-3 py-1.5 border border-transparent hover:border-white rounded-sm text-left leading-tight"
            >
              <span className="text-[10px] text-gray-400 font-light">Hello, Sign in</span>
              <span className="font-bold">Account & Lists</span>
            </Link>
          )}
        </div>

        {/* RETURNS & ORDERS */}
        <Link 
          href="/orders" 
          className="hidden sm:flex flex-col px-3 py-1.5 border border-transparent hover:border-white rounded-sm text-left leading-tight"
        >
          <span className="text-[10px] text-gray-400 font-light">Returns</span>
          <span className="font-bold">& Orders</span>
        </Link>

        {/* SHOPPING BASKET */}
        <Link 
          href="/cart" 
          className="flex items-center gap-1.5 px-3 py-1.5 border border-transparent hover:border-white rounded-sm relative group cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-7 h-7 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-xs font-black text-[#ff9900] bg-[#131921] px-1 rounded-full leading-none z-10 min-w-4 text-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="font-bold hidden md:inline mt-2">Cart</span>
        </Link>

      </div>

      {/* Sub bar: Mega Menu Categories Navigation */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-black/40 backdrop-blur-md border-b border-white/5 text-xs select-none shadow-inner">
        <div className="flex items-center gap-4">
          {/* Mega menu toggle */}
          <button 
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            className="flex items-center gap-1 font-bold px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>All Departments</span>
          </button>

          <Link href="/shop?category=Smartphones" className="px-2 py-1 border border-transparent hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 rounded-sm text-[#00f0ff] font-semibold transition-all">Smartphones</Link>
          <Link href="/shop?category=Workstations" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Workstations</Link>
          <Link href="/shop?category=AI%20Devices" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">AI Devices</Link>
          <Link href="/shop?category=Laptops" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Laptops</Link>
          <Link href="/shop?category=Gaming" className="px-2 py-1 border border-transparent hover:border-white rounded-sm">Gaming</Link>
          <Link href="/shop" className="px-2 py-1 border border-transparent hover:border-white rounded-sm text-[#febd69]">Today's Deals</Link>
          <Link href="/ai-copilot" className="px-2 py-1 border border-transparent hover:border-white rounded-sm text-glow-primary font-bold flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#ff007f]"/> AI Copilot</Link>
        </div>

        {/* Live system state notifier */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-0.5 rounded border border-white/5 bg-white/5 font-mono text-[9px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SECURE GATEWAY ENCRYPTED</span>
        </div>
      </div>

      {/* MEGA MENU DRAWER POPUP */}
      <AnimatePresence>
        {megaMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMegaMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 top-[88px]"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-[88px] bottom-0 w-80 bg-white text-black z-50 p-6 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Grid className="w-5 h-5 text-[#ff9900]" />
                    <span className="font-bold text-sm text-gray-900 uppercase tracking-wider">Product Categories</span>
                  </div>
                  <button onClick={() => setMegaMenuOpen(false)} className="text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">Departments</h4>
                    <nav className="flex flex-col gap-1.5 font-medium text-gray-600 text-xs">
                      {categories.filter(c => c !== "All").map((cat) => (
                        <Link 
                          key={cat}
                          href={`/shop?category=${encodeURIComponent(cat)}`}
                          onClick={() => setMegaMenuOpen(false)}
                          className="py-2 px-3 hover:bg-gray-50 hover:text-[#ff9900] rounded-lg transition-colors flex items-center justify-between"
                        >
                          <span>{cat}</span>
                          <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-400">View</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              {/* Mega menu footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                <HelpCircle className="w-4 h-4 text-[#ff9900]" />
                <span>Need support? Contact client support.</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
