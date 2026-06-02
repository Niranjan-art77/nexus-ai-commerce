"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartAction } from "@/store/slices/cartSlice";
import { NavBar } from "@/components/ui/NavBar";
import { mockDb, MockProduct } from "@/utils/mockDb";
import { RootState } from "@/store/store";
import { 
  Sparkles, Cpu, Search, ShoppingBag, Star, Heart, 
  ChevronRight, X, ShieldCheck, Zap, Sliders, Monitor, 
  Smartphone, Play, ArrowRight, Check, TrendingUp, 
  AlertCircle, Mic, MicOff, Info, HelpCircle, Layers,
  Terminal, Globe2, Database, BookOpen, User, Flame, 
  Activity, Settings, MessageSquare, Briefcase, Plus, CheckCircle2
} from "lucide-react";

export default function RedesignedHomepage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // States for universal AI Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchProduct, setSelectedSearchProduct] = useState<MockProduct | null>(null);
  const [crossPlatformPrices, setCrossPlatformPrices] = useState<any>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<MockProduct[]>([]);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([
    "Amazon", "Flipkart", "Myntra", "Croma", "Reliance Digital", "Nexus Store"
  ]);

  const bestRetailerOffer = useMemo(() => {
    if (!selectedSearchProduct || !crossPlatformPrices) return null;
    const offers = [
      { platform: "Amazon", price: crossPlatformPrices.amazon, rating: 4.6 },
      { platform: "Flipkart", price: crossPlatformPrices.flipkart, rating: 4.4 },
      { platform: "Myntra", price: crossPlatformPrices.myntra, rating: 4.2 },
      { platform: "Croma", price: crossPlatformPrices.croma, rating: 4.5 },
      { platform: "Reliance Digital", price: crossPlatformPrices.reliance, rating: 4.3 },
      { platform: "Nexus Store", price: crossPlatformPrices.nexus, rating: 4.9 }
    ];
    const activeOffers = offers.filter(o => selectedRetailers.includes(o.platform));
    if (activeOffers.length === 0) return null;
    activeOffers.sort((a, b) => a.price - b.price);
    return activeOffers[0]!;
  }, [selectedSearchProduct, crossPlatformPrices, selectedRetailers]);

  // States for voice shopping
  const [isListening, setIsListening] = useState(false);
  const [voiceNotification, setVoiceNotification] = useState("");

  // States for comparison tool
  const [compareProduct1Id, setCompareProduct1Id] = useState("");
  const [compareProduct2Id, setCompareProduct2Id] = useState("");
  const [compareResult, setCompareResult] = useState<any>(null);

  // States for AI shopping assistant (copilot widget)
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotHistory, setCopilotHistory] = useState<any[]>([
    { sender: "ai", text: "Hello! I am your AI Shopping Copilot. Try asking me for 'best laptop under $2000' or 'gaming mouse for pro setups'!" }
  ]);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // States for Workstation Builder
  const [buildProfession, setBuildProfession] = useState("Software Engineer");
  const [buildBudget, setBuildBudget] = useState(2500);
  const [buildPurpose, setBuildPurpose] = useState("AI Development & Compilation");
  const [workstationBundle, setWorkstationBundle] = useState<any[]>([]);

  // Career hub state
  const [selectedCareer, setSelectedCareer] = useState("Software Engineer");

  // Developer & Creator mode specs
  const [devCpuBrand, setDevCpuBrand] = useState("Apple M3 Max");
  const [devRamSize, setDevRamSize] = useState(32);
  const [devStorageSize, setDevStorageSize] = useState(1);
  const [devDockerScore, setDevDockerScore] = useState(90);

  const [creatorGpu, setCreatorGpu] = useState("NVIDIA RTX 5090");
  const [creatorRam, setCreatorRam] = useState(64);

  // Price drops states
  const [selectedPredictionProduct, setSelectedPredictionProduct] = useState<MockProduct | null>(null);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertConfigured, setAlertConfigured] = useState(false);

  // Personalized states
  const [userInterests, setUserInterests] = useState<string[]>(["AI Devices", "Laptops"]);

  // Tech news feed filters
  const [selectedNewsCategory, setSelectedNewsCategory] = useState("All");

  // Load first products for default selects
  const allProducts = useMemo(() => mockDb.getProducts({}), []);
  
  useEffect(() => {
    if (allProducts.length > 0) {
      setSelectedSearchProduct(allProducts[0] || null);
      setSelectedPredictionProduct(allProducts[1] || allProducts[0] || null);
      setCompareProduct1Id(allProducts[0]?._id || "");
      setCompareProduct2Id(allProducts[1]?._id || allProducts[0]?._id || "");
    }
  }, [allProducts]);

  // Load voice commands help
  const runVoiceCommand = useCallback((commandText: string) => {
    const text = commandText.toLowerCase().trim();
    setVoiceNotification(`Voice Input: "${commandText}"`);
    
    if (text.includes("search") || text.includes("find")) {
      const query = text.replace("search", "").replace("find", "").trim();
      setSearchQuery(query);
      const matches = mockDb.getProducts({ search: query });
      if (matches.length > 0) {
        setSelectedSearchProduct(matches[0] || null);
      }
    } else if (text.includes("compare")) {
      // Toggle compare
      const matches = mockDb.getProducts({});
      if (matches.length >= 2) {
        setCompareProduct1Id(matches[0]?._id || "");
        setCompareProduct2Id(matches[1]?._id || "");
      }
    } else if (text.includes("clear") || text.includes("reset")) {
      setSearchQuery("");
      setSelectedSearchProduct(allProducts[0] || null);
    } else if (text.includes("cart") || text.includes("checkout")) {
      router.push("/cart");
    } else {
      // Default to copilot query
      setCopilotQuery(commandText);
      handleCopilotSubmit(commandText);
    }
    
    setTimeout(() => setVoiceNotification(""), 4000);
  }, [allProducts, router]);

  // Speech Recognition hook
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported by your browser. Please try Google Chrome.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceNotification("Listening for commands...");
    };
    
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      runVoiceCommand(transcript);
    };
    
    recognition.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
      setVoiceNotification("Speech error. Try again.");
      setTimeout(() => setVoiceNotification(""), 3000);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  // Cross-Retailer Pricing simulator
  useEffect(() => {
    if (selectedSearchProduct) {
      const price = selectedSearchProduct.price;
      setCrossPlatformPrices({
        amazon: Math.round(price * 1.08),
        flipkart: Math.round(price * 1.05),
        myntra: Math.round(price * 1.12),
        croma: Math.round(price * 1.02),
        reliance: Math.round(price * 1.06),
        nexus: price
      });
    }
  }, [selectedSearchProduct]);

  // Suggestions search logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = mockDb.getProducts({ search: searchQuery });
      setSearchSuggestions(results.slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const selectSuggestion = (product: MockProduct) => {
    setSelectedSearchProduct(product);
    setSearchQuery(product.name);
    setSearchSuggestions([]);
  };

  // Product Comparison trigger
  useEffect(() => {
    if (compareProduct1Id && compareProduct2Id) {
      const p1 = mockDb.getProductById(compareProduct1Id);
      const p2 = mockDb.getProductById(compareProduct2Id);
      
      if (p1 && p2) {
        // Score generator
        const score1 = Math.round(p1.rating * 20);
        const score2 = Math.round(p2.rating * 20);
        const value1 = Math.round((p1.rating * 10) / (p1.price / 400));
        const value2 = Math.round((p2.rating * 10) / (p2.price / 400));
        
        setCompareResult({
          product1: p1,
          product2: p2,
          scores: { p1: score1, p2: score2 },
          valueScores: { p1: Math.min(100, Math.max(30, value1)), p2: Math.min(100, Math.max(30, value2)) },
          specKeys: Array.from(new Set([...Object.keys(p1.specifications), ...Object.keys(p2.specifications)])),
          choice: p1.price < p2.price ? p1 : p2,
          premiumChoice: p1.price >= p2.price ? p1 : p2,
          budgetChoice: p1.price < p2.price ? p1 : p2
        });
      }
    }
  }, [compareProduct1Id, compareProduct2Id]);

  // AI Shopping Assistant Submit
  const handleCopilotSubmit = async (queryText?: string) => {
    const q = queryText || copilotQuery;
    if (!q.trim()) return;
    
    setCopilotHistory(prev => [...prev, { sender: "user", text: q }]);
    setCopilotQuery("");
    setCopilotLoading(true);

    // Simulate agent search
    setTimeout(() => {
      const results = mockDb.getProducts({ search: q });
      let responseText = "";
      let recommendations: MockProduct[] = [];
      
      if (results.length > 0) {
        recommendations = results.slice(0, 3);
        responseText = `I searched the Nexus inventory database and located ${results.length} products matching your criteria. Here are the top configurations I recommend based on your preferences:`;
      } else {
        // Fallback recommendations
        recommendations = mockDb.getProducts({ category: "Laptops" }).slice(0, 2);
        responseText = `I couldn't find exact matches for your query, but here are some of our top-rated premium workstations that fits coding and high-performance requirements:`;
      }

      setCopilotHistory(prev => [
        ...prev, 
        { 
          sender: "ai", 
          text: responseText,
          products: recommendations
        }
      ]);
      setCopilotLoading(false);
    }, 1200);
  };

  // Compile workstation rigs
  const buildWorkstationBundle = useCallback(() => {
    let budgetShare = buildBudget;
    const categoryMapping: Record<string, string> = {
      "Software Engineer": "Laptops",
      "ML Engineer": "Workstations",
      "Video Editor": "Workstations",
      "Cybersecurity Analyst": "Laptops",
      "Data Scientist": "Workstations",
      "Student": "Laptops"
    };
    
    const primeCategory = categoryMapping[buildProfession] || "Laptops";
    const allPrime = mockDb.getProducts({ category: primeCategory });
    const primeItem = allPrime.find(p => p.price <= budgetShare * 0.6) || allPrime[0];

    const accessories = mockDb.getProducts({ category: "Accessories" });
    const monitors = mockDb.getProducts({ category: "Monitors" });
    
    const primaryMonitor = monitors.find(m => m.price <= budgetShare * 0.25) || monitors[0];
    const primeAccessory = accessories.find(a => a.price <= budgetShare * 0.1) || accessories[0];
    const secAccessory = accessories.find(a => a.price <= budgetShare * 0.05 && a._id !== primeAccessory?._id) || accessories[1];
    
    const bundle = [primeItem, primaryMonitor, primeAccessory, secAccessory].filter(Boolean);
    setWorkstationBundle(bundle);
  }, [buildProfession, buildBudget]);

  useEffect(() => {
    buildWorkstationBundle();
  }, [buildProfession, buildBudget, buildWorkstationBundle]);

  const addBundleToCart = () => {
    workstationBundle.forEach(item => {
      dispatch(addToCartAction({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.images?.[0] || ""
      }));
    });
    alert("Full workstation bundle successfully added to your cart!");
  };

  // Developer mode details
  const developerSpecs = useMemo(() => {
    const dockerOk = devRamSize >= 16;
    const virtualizationOk = devCpuBrand.toLowerCase().includes("m3") || devCpuBrand.toLowerCase().includes("amd") || devCpuBrand.toLowerCase().includes("xeon");
    const aiScore = Math.min(100, Math.round((devRamSize * 1.5) + (devStorageSize * 10) + (virtualizationOk ? 30 : 10)));
    
    return {
      docker: dockerOk ? "Fully Supported" : "Limited (Minimum 16GB RAM recommended)",
      ramScore: devRamSize >= 32 ? "Optimal" : devRamSize >= 16 ? "Acceptable" : "Strained",
      virtualization: virtualizationOk ? "Hardware Enabled" : "Software Emulated",
      aiWorkload: aiScore
    };
  }, [devCpuBrand, devRamSize, devStorageSize]);

  // Creator mode details
  const creatorSpecs = useMemo(() => {
    const isUltraGpu = creatorGpu.includes("5090") || creatorGpu.includes("4090") || creatorGpu.includes("Ada");
    const editScore = Math.min(100, Math.round(creatorRam * 1.1 + (isUltraGpu ? 30 : 15)));
    const renderScore = Math.min(100, Math.round(creatorRam * 0.9 + (isUltraGpu ? 40 : 10)));
    const streamScore = Math.min(100, Math.round(creatorRam * 1.2 + 20));
    
    return {
      editing: editScore,
      rendering: renderScore,
      streaming: streamScore,
      overall: Math.round((editScore + renderScore + streamScore) / 3)
    };
  }, [creatorGpu, creatorRam]);

  // Live Best Deals logic
  const liveBestDeals = useMemo(() => {
    const all = mockDb.getProducts({});
    const deals = all.filter(p => p.discount > 0);
    // Sort by discount rate
    deals.sort((a, b) => b.discount - a.discount);
    return deals.slice(0, 6).map((item, idx) => {
      const score = Math.round(item.discount * 2.5 + item.rating * 10);
      const urgency = item.stock < 10 ? "HIGH" : item.discount > 15 ? "MEDIUM" : "LOW";
      return {
        ...item,
        dealScore: Math.min(100, score),
        urgency
      };
    });
  }, []);

  // Career hub recommendations generator
  const careerData = useMemo(() => {
    const mappings: Record<string, { desc: string; devices: string[]; courses: string[]; tools: string[] }> = {
      "Software Engineer": {
        desc: "Build highly reliable desktop, mobile, and web products. Prioritize multi-core compile speeds and memory buffers.",
        devices: ["Dell XPS 15 Creator Edition", "MacBook Pro 16-inch M3 Max"],
        courses: ["Advanced System Architect Certification", "React Design & Microservices Architectures"],
        tools: ["Docker Desktop Enterprise", "VS Code Pro Cloud Compiler"]
      },
      "ML Engineer": {
        desc: "Train deep models and optimize transformers. Prioritize massive GPU VRAM counts and local fast SSD caches.",
        devices: ["Intel Xeon Multi-GPU Server Build", "NVIDIA RTX 6000 Ada Workstation"],
        courses: ["Deep Learning & LLM Fine-Tuning Labs", "PyTorch GPU Sharding Architectures"],
        tools: ["JupyterLab Pro Sandbox", "Hugging Face Enterprise Client"]
      },
      "Video Editor": {
        desc: "Produce cinematic renders and grade multi-layer raw files. Prioritize 4K color-accurate screens and GPU decoders.",
        devices: ["Mac Studio M2 Ultra Studio Set", "LG OLED Curved Spatial Display"],
        courses: ["DaVinci Resolve Color Grading Masterclass", "Premiere Pro Rendering Optimization"],
        tools: ["Adobe Creative Suite Pro Key", "100TB High-Speed NAS Cache Node"]
      },
      "Cybersecurity Analyst": {
        desc: "Audit networks, compile kernel modules, and simulate intrusions. Prioritize hyper-threaded CPUs and hardware virtualization blocks.",
        devices: ["Lenovo ThinkPad P1 Custom Rig", "Anker Multi-port Hub Shield"],
        courses: ["CompTIA Security+ Lab Exercises", "Ethical Hacking & Sandbox Construction"],
        tools: ["Kali Linux Enterprise Sandbox Key", "Hardware USB Rubber Ducky Node"]
      },
      "Data Scientist": {
        desc: "Perform statistical inference, clean datasets, and deploy visualization nodes. Prioritize balanced RAM arrays and fast storage.",
        devices: ["Dell XPS 15 Creator Edition", "Mac Studio M2 Ultra Studio Set"],
        courses: ["Apache Spark Clusters Masterclass", "Applied Bayesian Inference & Stan Models"],
        tools: ["Tableau Developer License Key", "PostgreSQL Cloud Sharded Index"]
      },
      "Student": {
        desc: "Tackle projects, join lectures, and learn system foundations. Prioritize battery efficiency and long durability warranties.",
        devices: ["iPhone 15 Pro", "Dell XPS 15 Creator Edition"],
        courses: ["Computer Science Foundations Certification", "Modern App Development Basics"],
        tools: ["Notion Pro Academic Key", "GitHub Student Developer Pack Access"]
      }
    };
    return mappings[selectedCareer] || mappings["Software Engineer"]!;
  }, [selectedCareer]);

  // Tech news feed data
  const techNews = [
    { category: "AI", title: "OpenAI GPT-5 leaks show massive logic reasoning leap", time: "1 hour ago", content: "Insider reports suggest the next-generation model achieves 99.2% on logical reasoning benchmarks, enabling autonomous coding agents to run multi-file compiles with zero errors." },
    { category: "Laptop", title: "Dell updates XPS laptop range with custom neural engines", time: "3 hours ago", content: "The newest Dell XPS creator line ships with custom 40 NPU chips, speeding up on-device LLM queries and lowering compilation energy consumption." },
    { category: "Hardware", title: "NVIDIA RTX 5090 sets new bandwidth benchmarks with GDDR7", time: "Yesterday", content: "The next-generation GPU architecture introduces double the memory speed using GDDR7 modules, cutting machine learning training pipelines in half." },
    { category: "Software", title: "Docker Desktop 5 introduces zero-config virtualization limits", time: "2 days ago", content: "A new lightweight engine allows developers to sandbox multi-container apps with only 512MB RAM overhead, freeing memory for local LLMs." }
  ];

  const filteredNews = useMemo(() => {
    if (selectedNewsCategory === "All") return techNews;
    return techNews.filter(n => n.category === selectedNewsCategory);
  }, [selectedNewsCategory]);

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#ff9900]/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00f0ff]/3 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#ff9900]/2 blur-[150px] pointer-events-none z-0" />

      {/* Voice Assistant Notifications */}
      <AnimatePresence>
        {voiceNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 glass-effect border border-[#ff9900]/30 rounded-xl px-5 py-3 shadow-[0_0_20px_rgba(255,153,0,0.15)] flex items-center gap-3 font-mono text-xs text-[#ff9900]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>{voiceNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <NavBar />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center justify-center min-h-[500px] z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff9900]/10 to-[#00f0ff]/10 border border-[#ff9900]/20 px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-[#ff9900] animate-pulse" />
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#ff9900] uppercase">NEXUS COMMERCE V4 ACTIVE</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight">
            The AI Shopping Ecosystem <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] via-[#ffd000] to-[#00f0ff]">
              Designed for Builders.
            </span>
          </h1>

          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Universal product searches, live cross-retailer audits, career-aligned workstation engineering, and deep price trend intelligence. All fully operational client-side.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => document.getElementById("ai-search-anchor")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3.5 bg-gradient-to-r from-[#ff9900] to-[#ffb300] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(255,153,0,0.4)] active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
            >
              Start Universal AI Search
            </button>
            
            <button
              onClick={() => document.getElementById("workstation-builder-anchor")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              Build Custom Workspace
            </button>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: AI UNIVERSAL SEARCH */}
      <section id="ai-search-anchor" className="w-full max-w-7xl mx-auto px-6 py-12 z-10">
        <div className="glass-effect rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#00f0ff]/5 blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-6 mb-6">
            <div className="text-left space-y-1">
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Search className="w-6 h-6 text-[#ff9900]" />
                Universal AI Product Search
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Compare price, rating, seller details, and stock live across Amazon, Flipkart, Myntra, Croma, Reliance Digital, and Nexus Store.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-stretch lg:self-auto">
              <button 
                onClick={startSpeechRecognition}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer ${
                  isListening 
                    ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#ff9900]" />}
                <span>{isListening ? "Listening..." : "Voice Search"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Search bar */}
              <div className="relative">
                <div className="flex items-center bg-black/60 rounded-2xl border border-white/10 focus-within:border-[#ff9900] px-4 py-3 h-14 transition-all">
                  <Search className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords: 'iphone 16', 'macbook', 'razer', 'dell'..."
                    className="w-full bg-transparent border-none text-white placeholder:text-gray-500 text-sm focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-gray-500 hover:text-white font-mono text-xs uppercase cursor-pointer">
                      Clear
                    </button>
                  )}
                </div>

                {/* Search suggestions */}
                <AnimatePresence>
                  {searchSuggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-2 bg-[#0d121f] border border-white/15 rounded-xl shadow-2xl z-40 overflow-hidden divide-y divide-white/5 text-left"
                    >
                      {searchSuggestions.map((prod) => (
                        <div
                          key={prod._id}
                          onClick={() => selectSuggestion(prod)}
                          className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded bg-white flex items-center justify-center p-1 overflow-hidden shrink-0">
                            <img src={prod.images?.[0] || ""} alt={prod.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate capitalize">{prod.name}</h4>
                            <p className="text-[10px] text-gray-500 truncate">{prod.category} by {prod.brand}</p>
                          </div>
                          <span className="font-mono text-xs text-[#ff9900] font-bold">${prod.price}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Retailer Checklist Selector */}
                <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-[9px] uppercase text-gray-400 select-none text-left">
                  <span className="font-bold text-white">Index Sources:</span>
                  {["Amazon", "Flipkart", "Myntra", "Croma", "Reliance Digital", "Nexus Store"].map((r) => {
                    const isChecked = selectedRetailers.includes(r);
                    return (
                      <label key={r} className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedRetailers(prev => 
                              prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
                            );
                          }}
                          className="w-3 h-3 accent-[#ff9900] bg-black rounded border border-white/20"
                        />
                        <span>{r}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Universal Pricing Grid */}
              {selectedSearchProduct && crossPlatformPrices && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 shrink-0">
                      <img src={selectedSearchProduct.images?.[0]} alt={selectedSearchProduct.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-mono text-[#ff9900] font-bold">{selectedSearchProduct.brand}</span>
                      <h3 className="text-sm font-black capitalize text-white leading-tight">{selectedSearchProduct.name}</h3>
                      <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{selectedSearchProduct.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { platform: "Amazon", price: crossPlatformPrices.amazon, rating: 4.6, delivery: "In Stock" },
                      { platform: "Flipkart", price: crossPlatformPrices.flipkart, rating: 4.4, delivery: "In Stock" },
                      { platform: "Myntra", price: crossPlatformPrices.myntra, rating: 4.2, delivery: "Out of Stock" },
                      { platform: "Croma", price: crossPlatformPrices.croma, rating: 4.5, delivery: "In Stock" },
                      { platform: "Reliance Digital", price: crossPlatformPrices.reliance, rating: 4.3, delivery: "In Stock" },
                      { platform: "Nexus Store", price: crossPlatformPrices.nexus, rating: 4.9, delivery: "Express delivery", best: true }
                    ].filter(item => selectedRetailers.includes(item.platform)).map((item) => (
                      <div 
                        key={item.platform}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between font-mono relative overflow-hidden transition-all ${
                          item.best 
                            ? "bg-gradient-to-b from-[#ff9900]/10 to-[#ff9900]/5 border-[#ff9900]/30 shadow-[0_0_15px_rgba(255,153,0,0.08)]" 
                            : "bg-black/40 border-white/5 hover:border-white/10"
                        }`}
                      >
                        {item.best && (
                          <div className="absolute top-0 right-0 bg-[#ff9900] text-black text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl">
                            BEST OFFER
                          </div>
                        )}
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-bold block">{item.platform}</span>
                          <span className={`text-lg font-black block ${item.best ? "text-[#ff9900] text-glow-primary" : "text-white"}`}>
                            ${item.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[9px] border-t border-white/5 pt-2">
                          <span className="text-gray-500">Rating: {item.rating} ★</span>
                          <span className={item.delivery.includes("Out") ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                            {item.delivery}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Recommendation Sidebar */}
            <div className="glass-panel border border-white/5 rounded-3xl p-5 text-left flex flex-col justify-between h-full min-h-[300px]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Sparkles className="w-5 h-5 text-[#ff9900]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black text-gray-300">AI Recommendation Engine</span>
                </div>

                {selectedSearchProduct && bestRetailerOffer ? (
                  <div className="space-y-3 font-mono text-[11px] text-gray-300">
                    <p className="leading-relaxed font-light">
                      &gt; Deep auditing of pricing history completed. Across active index channels, <strong>{bestRetailerOffer.platform}</strong> features the absolute lowest price at <strong>${bestRetailerOffer.price.toLocaleString()}</strong>, yielding a net savings of <strong>{Math.round((crossPlatformPrices.amazon - bestRetailerOffer.price) / crossPlatformPrices.amazon * 100)}%</strong> compared to standard listings.
                    </p>
                    <div className="p-3 bg-[#ff9900]/5 border border-[#ff9900]/20 rounded-xl">
                      <span className="text-[9px] uppercase tracking-wider text-[#ff9900] font-bold block mb-1">Ecosystem Verdict:</span>
                      Highly Recommended. Direct priority dispatch available via {bestRetailerOffer.platform} gateway API.
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center text-gray-600">
                    <AlertCircle className="w-8 h-8 mb-2 text-gray-600 animate-pulse" />
                    <span>Search or select a product and enable retailer channels to generate AI recommendations.</span>
                  </div>
                )}
              </div>

              {selectedSearchProduct && bestRetailerOffer && (
                <button
                  onClick={() => {
                    dispatch(addToCartAction({
                      id: selectedSearchProduct._id,
                      name: selectedSearchProduct.name,
                      price: bestRetailerOffer.price,
                      quantity: 1,
                      image: selectedSearchProduct.images?.[0] || "",
                      routedRetailer: bestRetailerOffer.platform
                    }));
                    alert(`${selectedSearchProduct.name} routed via ${bestRetailerOffer.platform} added to cart!`);
                  }}
                  className="w-full mt-4 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer font-mono"
                >
                  Buy via {bestRetailerOffer.platform}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRENDING PRODUCTS */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500 animate-bounce" />
              Trending Workspace Products
            </h2>
            <p className="text-xs text-gray-400">High computational setups and premium peripherals highly sought after this week.</p>
          </div>
          <button 
            onClick={() => router.push("/shop")}
            className="text-xs text-[#ff9900] hover:underline font-mono uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer"
          >
            Explore Shop <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.slice(0, 4).map((prod) => (
            <div 
              key={prod._id}
              className="relative group p-4 border border-white/10 rounded-2xl bg-[#0f172a]/40 backdrop-blur-sm hover:border-[#ff9900]/30 transition-all flex flex-col justify-between h-[380px] shadow-sm hover:shadow-[0_0_20px_rgba(255,153,0,0.05)] text-left"
            >
              <div>
                <div className="w-full h-44 rounded-xl bg-[#070a13] border border-white/5 flex items-center justify-center p-3 relative overflow-hidden shrink-0">
                  <img src={prod.images?.[0]} alt={prod.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 text-[8px] bg-[#ff9900]/10 border border-[#ff9900]/25 text-[#ff9900] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-widest">
                    {prod.brand}
                  </span>
                </div>
                
                <div className="mt-4 space-y-1">
                  <span className="text-[8px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded font-mono uppercase tracking-wider">{prod.category}</span>
                  <h3 className="text-sm font-black capitalize text-white group-hover:text-[#ff9900] transition-colors truncate">{prod.name}</h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className={`w-3 h-3 ${si < Math.round(prod.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                    ))}
                    <span className="text-[9px] text-gray-500 font-mono ml-1">({prod.numReviews})</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between">
                <span className="text-[#ff9900] font-mono font-black text-lg">${prod.price}</span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => router.push(`/product/${prod._id}`)}
                    className="p-2 border border-white/10 hover:border-white/20 text-white rounded-lg transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      dispatch(addToCartAction({
                        id: prod._id,
                        name: prod.name,
                        price: prod.price,
                        quantity: 1,
                        image: prod.images?.[0] || ""
                      }));
                      alert(`${prod.name} added to cart!`);
                    }}
                    className="px-3.5 py-1.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase text-[9px] tracking-wider rounded-lg font-mono transition-all cursor-pointer"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: LIVE BEST DEALS */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="mb-6">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#ff9900] animate-pulse" />
            Live Best Deals
          </h2>
          <p className="text-xs text-gray-400">Ranked workspace items filtered live by discount scores and urgency metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveBestDeals.map((deal) => (
            <div 
              key={deal._id}
              className="p-5 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-sm flex gap-4 text-left font-mono relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center p-2 shrink-0">
                <img src={deal.images?.[0]} alt={deal.name} className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] bg-red-950 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    -{deal.discount}% OFF
                  </span>
                  <span className={`text-[8px] border px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    deal.urgency === "HIGH" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}>
                    Urgency: {deal.urgency}
                  </span>
                </div>
                
                <h3 className="text-xs font-black capitalize text-white truncate">{deal.name}</h3>
                
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-[#ff9900] text-sm font-black">${deal.price}</span>
                  <span className="text-[10px] text-gray-500 line-through">${deal.originalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-[9px] border-t border-white/5 pt-2 mt-2">
                  <span className="text-gray-400">Deal Score: <strong className="text-[#ff9900]">{deal.dealScore}</strong></span>
                  <button 
                    onClick={() => {
                      dispatch(addToCartAction({
                        id: deal._id,
                        name: deal.name,
                        price: deal.price,
                        quantity: 1,
                        image: deal.images?.[0] || ""
                      }));
                      alert(`${deal.name} added to cart!`);
                    }}
                    className="text-[#ff9900] hover:underline uppercase font-bold tracking-wider cursor-pointer"
                  >
                    Claim Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: PRODUCT COMPARISON CENTER */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="glass-effect rounded-3xl p-6 md:p-8 border border-white/10">
          <div className="mb-6 border-b border-white/5 pb-4">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[#ff9900]" />
              AI Product Comparison Center
            </h2>
            <p className="text-xs text-gray-400">Compare products side-by-side. Generate value ratios and direct choice recommendations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-1.5 text-left font-mono">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Select Product A</label>
              <select
                value={compareProduct1Id}
                onChange={(e) => setCompareProduct1Id(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff9900]"
              >
                {allProducts.map(p => (
                  <option key={p._id} value={p._id}>{p.brand} - {p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-left font-mono">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Select Product B</label>
              <select
                value={compareProduct2Id}
                onChange={(e) => setCompareProduct2Id(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff9900]"
              >
                {allProducts.map(p => (
                  <option key={p._id} value={p._id}>{p.brand} - {p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl w-full text-left font-mono text-[10px] text-gray-400">
                AI Agent calculates dynamic value ratios based on specifications and ratings.
              </div>
            </div>
          </div>

          {compareResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
              {/* Product A */}
              <div className="p-5 border border-white/5 bg-black/40 rounded-3xl text-left space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase text-[#ff9900] font-bold block">{compareResult.product1.brand}</span>
                    <h3 className="text-sm font-black text-white capitalize">{compareResult.product1.name}</h3>
                  </div>
                  <span className="text-lg font-black text-white">${compareResult.product1.price}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-500">Spec Rating</span>
                    <span className="text-emerald-400 font-bold">{compareResult.product1.rating} ★</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-500">Performance Score</span>
                    <span className="text-white font-bold">{compareResult.scores.p1} pts</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-500">Ecosystem Value Index</span>
                    <span className="text-white font-bold">{compareResult.valueScores.p1}/100</span>
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block">AI Pros & Cons</span>
                  <div className="text-[10px] text-emerald-400">✓ Highly customizable specifications</div>
                  <div className="text-[10px] text-red-400">✗ High upfront capital layout</div>
                </div>
              </div>

              {/* Product B */}
              <div className="p-5 border border-white/5 bg-black/40 rounded-3xl text-left space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase text-[#ff9900] font-bold block">{compareResult.product2.brand}</span>
                    <h3 className="text-sm font-black text-white capitalize">{compareResult.product2.name}</h3>
                  </div>
                  <span className="text-lg font-black text-white">${compareResult.product2.price}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-500">Spec Rating</span>
                    <span className="text-emerald-400 font-bold">{compareResult.product2.rating} ★</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-500">Performance Score</span>
                    <span className="text-white font-bold">{compareResult.scores.p2} pts</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-500">Ecosystem Value Index</span>
                    <span className="text-white font-bold">{compareResult.valueScores.p2}/100</span>
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block">AI Pros & Cons</span>
                  <div className="text-[10px] text-emerald-400">✓ Solid budget amortization rates</div>
                  <div className="text-[10px] text-red-400">✗ Slightly lower core GPU clock speeds</div>
                </div>
              </div>

              {/* Verdict Card */}
              <div className="p-5 border border-[#ff9900]/20 bg-[#ff9900]/5 rounded-3xl text-left space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#ff9900]/20 pb-2">
                    <Sparkles className="w-5 h-5 text-[#ff9900]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-white">AI Verdict Log</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-300">
                    Deep vector comparison suggests that <strong>{compareResult.choice.name}</strong> offers the best value architecture. 
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="p-2 bg-black/60 rounded border border-white/5">
                      <span className="text-gray-500 block">Premium Choice</span>
                      <span className="text-white font-bold truncate block">{compareResult.premiumChoice.name}</span>
                    </div>
                    <div className="p-2 bg-black/60 rounded border border-white/5">
                      <span className="text-gray-500 block">Budget Choice</span>
                      <span className="text-white font-bold truncate block">{compareResult.budgetChoice.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      dispatch(addToCartAction({
                        id: compareResult.choice._id,
                        name: compareResult.choice.name,
                        price: compareResult.choice.price,
                        quantity: 1,
                        image: compareResult.choice.images?.[0] || ""
                      }));
                      alert(`${compareResult.choice.name} added to cart!`);
                    }}
                    className="flex-1 py-2 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase text-[9px] tracking-wider rounded-xl transition-all cursor-pointer font-mono text-center"
                  >
                    Buy Verdict Choice
                  </button>
                  <button
                    onClick={() => router.push(`/compare?p1=${compareProduct1Id}&p2=${compareProduct2Id}`)}
                    className="py-2 px-3 border border-white/10 hover:bg-white/5 rounded-xl transition-all font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Deep Matrix
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: AI SHOPPING COPILOT */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="glass-effect rounded-3xl p-6 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#ff9900]/5 blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Sparkles className="w-5 h-5 text-[#ff9900]" />
            <span className="text-[10px] font-mono uppercase tracking-widest font-black text-gray-300">AI Shopping Copilot Chat</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Chat history panel */}
            <div className="lg:col-span-2 border border-white/5 bg-black/60 rounded-2xl p-4 flex flex-col justify-between h-[360px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar text-xs">
                {copilotHistory.map((chat, idx) => (
                  <div key={idx} className={`flex flex-col ${chat.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-left space-y-2 ${
                      chat.sender === "user" 
                        ? "bg-[#ff9900]/10 border border-[#ff9900]/20 text-white" 
                        : "bg-white/5 border border-white/5 text-gray-300"
                    }`}>
                      <p className="leading-relaxed font-mono text-[11px]">{chat.text}</p>
                      
                      {chat.products && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/5">
                          {chat.products.map((p: MockProduct) => (
                            <div key={p._id} className="p-2 bg-black/50 border border-white/5 rounded-xl flex flex-col justify-between text-left">
                              <span className="text-[8px] text-gray-500 font-bold block truncate capitalize">{p.brand}</span>
                              <h4 className="text-[10px] font-bold text-white truncate capitalize">{p.name}</h4>
                              <span className="text-[10px] text-[#ff9900] font-black font-mono mt-1 block">${p.price}</span>
                              <button
                                onClick={() => {
                                  dispatch(addToCartAction({
                                    id: p._id,
                                    name: p.name,
                                    price: p.price,
                                    quantity: 1,
                                    image: p.images?.[0] || ""
                                  }));
                                  alert(`${p.name} added to cart!`);
                                }}
                                className="mt-2 py-1 bg-[#ff9900]/20 hover:bg-[#ff9900] hover:text-black text-[#ff9900] text-[8px] font-bold uppercase rounded font-mono transition-all cursor-pointer"
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {copilotLoading && (
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
                    <span>Agent querying database indexes...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 border-t border-white/5 pt-4">
                <input
                  type="text"
                  value={copilotQuery}
                  onChange={(e) => setCopilotQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCopilotSubmit()}
                  placeholder="Ask copilot: 'best phone for gaming', 'laptop under $1000'..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff9900]"
                />
                <button
                  onClick={() => handleCopilotSubmit()}
                  className="px-4 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer font-mono"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Right: Quick suggestions list */}
            <div className="space-y-4">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold block border-b border-white/5 pb-2">
                Copilot Quick Commands
              </span>
              <div className="flex flex-col gap-2.5 text-xs font-mono">
                {[
                  "Find best laptop under $1000",
                  "Recommend smartphone with A18 chip",
                  "Compare Dell and Apple laptops",
                  "Suggest gaming setup peripherals"
                ].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setCopilotQuery(cmd);
                      handleCopilotSubmit(cmd);
                    }}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-[#ff9900]/30 hover:bg-white/10 transition-all text-left text-gray-300 hover:text-white cursor-pointer"
                  >
                    &gt; {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CAREER-BASED RECOMMENDATIONS */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="mb-6">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#ff9900]" />
            Career-Based Recommendations
          </h2>
          <p className="text-xs text-gray-400 font-mono">Select your career path node to view curated hardware lists, accessory stacks, and training programs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar selector */}
          <div className="space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none shrink-0 font-mono text-[10px] uppercase">
            {[
              "Software Engineer", "ML Engineer", "Video Editor", 
              "Cybersecurity Analyst", "Data Scientist", "Student"
            ].map((role) => {
              const active = selectedCareer === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedCareer(role)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border text-left shrink-0 cursor-pointer ${
                    active
                      ? "bg-[#ff9900]/10 border-[#ff9900]/40 text-[#ff9900]"
                      : "bg-transparent border-transparent text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>{role}</span>
                </button>
              );
            })}
          </div>

          {/* Details output board */}
          <div className="lg:col-span-3 glass-panel border border-white/5 rounded-3xl p-6 text-left space-y-6">
            <div className="space-y-1 border-b border-white/5 pb-4">
              <span className="text-[9px] uppercase tracking-widest text-[#ff9900] font-mono font-bold block">Career Focus Node</span>
              <h3 className="text-lg font-black text-white uppercase">{selectedCareer}</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">{careerData.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px]">
              {/* Devices */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Recommended Hardware</span>
                <div className="space-y-2">
                  {careerData.devices.map(dev => (
                    <div 
                      key={dev} 
                      onClick={() => {
                        const results = mockDb.getProducts({ search: dev });
                        if (results.length > 0) {
                          router.push(`/product/${results[0]?._id}`);
                        }
                      }}
                      className="p-2.5 rounded-xl border border-white/5 bg-black/40 hover:border-[#ff9900]/30 transition-all cursor-pointer text-white font-bold"
                    >
                      {dev}
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Training Modules</span>
                <div className="space-y-2">
                  {careerData.courses.map(course => (
                    <div 
                      key={course}
                      onClick={() => alert(`Launching mock sandbox course: "${course}"`)}
                      className="p-2.5 rounded-xl border border-white/5 bg-black/40 hover:border-cyan-500/30 transition-all text-gray-300 cursor-pointer"
                    >
                      {course}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Software & Sandboxes</span>
                <div className="space-y-2">
                  {careerData.tools.map(tool => (
                    <div 
                      key={tool}
                      onClick={() => alert(`Adding software token to cart: "${tool}"`)}
                      className="p-2.5 rounded-xl border border-white/5 bg-black/40 hover:border-[#ff9900]/30 transition-all text-gray-300 cursor-pointer"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: WORKSTATION BUILDER */}
      <section id="workstation-builder-anchor" className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="glass-effect rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />
          
          <div className="mb-6 border-b border-white/5 pb-4">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[#ff9900]" />
              Workstation Bundle Builder
            </h2>
            <p className="text-xs text-gray-400">Configure complete, performance-aligned workstation packages matching budget limits.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input config */}
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Target Profession</label>
                <select
                  value={buildProfession}
                  onChange={(e) => setBuildProfession(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ff9900]"
                >
                  {["Software Engineer", "ML Engineer", "Video Editor", "Cybersecurity Analyst", "Data Scientist", "Student"].map((prof) => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  <span>Max Budget Pool</span>
                  <span className="text-[#ff9900] font-black">${buildBudget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="8000"
                  step="250"
                  value={buildBudget}
                  onChange={(e) => setBuildBudget(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff9900]"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Workspace Purpose</label>
                <input
                  type="text"
                  value={buildPurpose}
                  onChange={(e) => setBuildPurpose(e.target.value)}
                  placeholder="e.g. Docker, Unreal Engine, Gaming..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ff9900]"
                />
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] text-gray-400 text-left leading-relaxed">
                ✓ AI bundle compiler references product tag indices, filtering accessories and custom computational nodes to align hardware performance with purpose.
              </div>
            </div>

            {/* Compiled output items */}
            <div className="lg:col-span-2 space-y-4">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold block border-b border-white/5 pb-2">
                Compiled Bundle Specs
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workstationBundle.map((item, idx) => (
                  <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-3 text-left font-mono relative overflow-hidden">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shrink-0">
                      <img src={item?.images?.[0]} alt={item?.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] text-[#ff9900] font-bold block uppercase">{item?.brand}</span>
                      <h4 className="text-xs font-black text-white truncate capitalize">{item?.name}</h4>
                      <span className="text-xs text-white font-bold block mt-0.5">${item?.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="font-mono text-left">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Total Bundle Cost</span>
                  <span className="text-xl font-black text-[#ff9900] text-glow-primary">
                    ${workstationBundle.reduce((acc, curr) => acc + (curr?.price || 0), 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={addBundleToCart}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer font-mono"
                  >
                    Purchase Bundle
                  </button>
                  <button
                    onClick={() => router.push(`/build-workstation?profession=${buildProfession}&budget=${buildBudget}`)}
                    className="px-4 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl transition-all font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Custom Build
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: STUDENT ZONE */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="glass-panel border border-[#ff9900]/20 bg-[#ff9900]/2 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest">
              Student Zone Verified
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Academic Hardware Incentives</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light font-mono">
              Are you currently enrolled? Link your academic institution ID to unlock flat 10% cash rebates, access student developer starter hubs, and receive extended 3-year hardware warranties on all laptops.
            </p>
          </div>

          <div className="flex gap-3 shrink-0 font-mono text-[10px] uppercase font-bold w-full md:w-auto">
            <button
              onClick={() => alert("Verification portal coming soon. Connect academic credentials.")}
              className="flex-1 md:flex-initial px-6 py-3 bg-[#ff9900] hover:bg-[#ffb700] text-black rounded-xl transition-all cursor-pointer"
            >
              Verify School ID
            </button>
            <button
              onClick={() => router.push("/shop?category=Laptops")}
              className="flex-1 md:flex-initial px-6 py-3 border border-white/10 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              Browse Student Gear
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 10: DEVELOPER ZONE */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="glass-effect rounded-3xl p-6 border border-white/10">
          <div className="mb-6 border-b border-white/5 pb-4">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
              Developer Performance Mode
            </h2>
            <p className="text-xs text-gray-400">Configure memory buffers and kernel profiles to compute virtualization and Docker readiness scores.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4 font-mono text-xs text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">CPU Core Series</label>
                <select
                  value={devCpuBrand}
                  onChange={(e) => setDevCpuBrand(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Apple M3 Max">Apple M3 Max (16 Cores)</option>
                  <option value="AMD Ryzen 9 7950X">AMD Ryzen 9 (16 Cores)</option>
                  <option value="Intel Core i9-14900K">Intel Core i9 (24 Cores)</option>
                  <option value="Intel Xeon W9">Intel Xeon (56 Cores)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <span>RAM Capacity</span>
                  <span className="text-cyan-400 font-black">{devRamSize} GB DDR5</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="256"
                  step="8"
                  value={devRamSize}
                  onChange={(e) => setDevRamSize(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <span>PCIe NVMe SSD</span>
                  <span className="text-cyan-400 font-black">{devStorageSize} TB</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={devStorageSize}
                  onChange={(e) => setDevStorageSize(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px]">
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-left space-y-1">
                <span className="text-[9px] uppercase text-gray-500 font-bold block">Docker Container Sandbox Support</span>
                <span className={`text-sm font-black block ${devRamSize >= 16 ? "text-emerald-400" : "text-amber-500"}`}>
                  {developerSpecs.docker}
                </span>
                <p className="text-[9px] text-gray-500 mt-1">Estimates virtual interface binding speeds and memory overhead limits.</p>
              </div>

              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-left space-y-1">
                <span className="text-[9px] uppercase text-gray-500 font-bold block">RAM Suitability Buffer</span>
                <span className={`text-sm font-black block ${devRamSize >= 32 ? "text-emerald-400" : devRamSize >= 16 ? "text-cyan-400" : "text-red-400"}`}>
                  {developerSpecs.ramScore}
                </span>
                <p className="text-[9px] text-gray-500 mt-1">Calculates compile caching potentials under high concurrent threads.</p>
              </div>

              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-left space-y-1">
                <span className="text-[9px] uppercase text-gray-500 font-bold block">Virtualization Engine Support</span>
                <span className="text-sm font-black text-white block">
                  {developerSpecs.virtualization}
                </span>
                <p className="text-[9px] text-gray-500 mt-1">Hardware assisted hypervisor support checks completed.</p>
              </div>

              {/* AI Workload Score card */}
              <div className="p-4 border border-cyan-500/20 bg-cyan-500/5 rounded-2xl text-left flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase text-cyan-400 font-bold block">AI Inference Suite Score</span>
                  <span className="text-xl font-black text-cyan-400 text-glow-cyan mt-1 block">
                    {developerSpecs.aiWorkload} / 100
                  </span>
                </div>
                <p className="text-[9px] text-gray-500 leading-normal mt-2">
                  Ready to compile and shard local deep models, transformers, and neural networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: CREATOR ZONE */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="glass-effect rounded-3xl p-6 border border-white/10">
          <div className="mb-6 border-b border-white/5 pb-4">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[#ff9900]" />
              Creator Production Mode
            </h2>
            <p className="text-xs text-gray-400">Evaluate rendering latency, hardware encoders, and stream output parameters.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4 font-mono text-xs text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Dedicated GPU Card</label>
                <select
                  value={creatorGpu}
                  onChange={(e) => setCreatorGpu(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ff9900]"
                >
                  <option value="NVIDIA RTX 5090">NVIDIA RTX 5090 (32GB GDDR7)</option>
                  <option value="NVIDIA RTX 4090">NVIDIA RTX 4090 (24GB GDDR6X)</option>
                  <option value="NVIDIA RTX 6000 Ada">NVIDIA RTX 6000 Ada (48GB)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <span>Unified system memory</span>
                  <span className="text-[#ff9900] font-black">{creatorRam} GB</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="128"
                  step="16"
                  value={creatorRam}
                  onChange={(e) => setCreatorRam(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff9900]"
                />
              </div>
            </div>

            {/* Creator Score Matrix */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center space-y-1">
                <span className="text-[9px] uppercase text-gray-500 font-bold block">Video Editing</span>
                <span className="text-lg font-black text-white block">{creatorSpecs.editing}%</span>
                <span className="text-[8px] text-gray-500 block">4K Multi-layer ProRes</span>
              </div>

              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center space-y-1">
                <span className="text-[9px] uppercase text-gray-500 font-bold block">3D Rendering</span>
                <span className="text-lg font-black text-white block">{creatorSpecs.rendering}%</span>
                <span className="text-[8px] text-gray-500 block">Octane / Blender Cycles</span>
              </div>

              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center space-y-1">
                <span className="text-[9px] uppercase text-gray-500 font-bold block">Live Streaming</span>
                <span className="text-lg font-black text-white block">{creatorSpecs.streaming}%</span>
                <span className="text-[8px] text-gray-500 block">AV1 / NVENC Broadcast</span>
              </div>

              <div className="p-4 border border-[#ff9900]/20 bg-[#ff9900]/5 rounded-2xl text-center space-y-1">
                <span className="text-[9px] uppercase text-[#ff9900] font-bold block">Overall index</span>
                <span className="text-lg font-black text-[#ff9900] block">{creatorSpecs.overall}%</span>
                <span className="text-[8px] text-gray-400 block">Ready to produce</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: PRICE PREDICTION CENTER */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="glass-effect rounded-3xl p-6 md:p-8 border border-white/10">
          <div className="mb-6 border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#ff9900]" />
                Price Prediction Center
              </h2>
              <p className="text-xs text-gray-400 font-mono">Use AI predictions to identify historical price trends and locate the absolute best purchase window.</p>
            </div>

            <div className="font-mono text-xs w-full sm:w-64">
              <select
                value={selectedPredictionProduct?._id || ""}
                onChange={(e) => {
                  const p = mockDb.getProductById(e.target.value);
                  setSelectedPredictionProduct(p);
                  setAlertConfigured(false);
                }}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff9900]"
              >
                {allProducts.slice(0, 10).map(p => (
                  <option key={p._id} value={p._id}>{p.brand} - {p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedPredictionProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
              <div className="lg:col-span-2 p-5 border border-white/5 bg-black/40 rounded-3xl text-left space-y-4">
                <h3 className="text-xs uppercase text-gray-400 font-bold">Amortized Price Chart (3-Month Windows)</h3>
                
                {/* Visual Chart Grid */}
                <div className="h-44 flex items-end justify-between border-b border-l border-white/10 p-2 relative">
                  <div className="absolute top-2 right-2 text-[8px] bg-red-950 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                    PREDICTED DROP WEEK
                  </div>
                  
                  {/* Chart plot columns */}
                  {[
                    { label: "Mar", price: selectedPredictionProduct.price * 1.15, height: "70%" },
                    { label: "Apr", price: selectedPredictionProduct.price * 1.05, height: "60%" },
                    { label: "May (Current)", price: selectedPredictionProduct.price, height: "50%" },
                    { label: "Jun (Predict)", price: selectedPredictionProduct.price * 0.9, height: "40%", drop: true }
                  ].map((col, cIdx) => (
                    <div key={cIdx} className="flex flex-col items-center gap-2 w-1/4">
                      <span className={`text-[10px] font-bold ${col.drop ? "text-[#ff9900]" : "text-white"}`}>
                        ${Math.round(col.price)}
                      </span>
                      <div 
                        className={`w-12 rounded-t-lg transition-all duration-1000 ${
                          col.drop ? "bg-gradient-to-t from-[#ff9900] to-[#ffb700] animate-pulse" : "bg-white/15"
                        }`}
                        style={{ height: `${parseInt(col.height) * 2}px` }}
                      />
                      <span className="text-[9px] text-gray-500">{col.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Alerts Configuration */}
              <div className="p-5 border border-[#ff9900]/20 bg-[#ff9900]/5 rounded-3xl text-left flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#ff9900]/20 pb-2">
                    <AlertCircle className="w-5 h-5 text-[#ff9900]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-white">Smart Price Alert</span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-gray-300">
                    Set a threshold target price. The AI agent will auto-message you immediately when the deal converges.
                  </p>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[8px] text-gray-500 uppercase block mb-1">Target Price Threshold ($)</label>
                      <input
                        type="number"
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(e.target.value)}
                        placeholder={`e.g. ${Math.round(selectedPredictionProduct.price * 0.85)}`}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ff9900]"
                      />
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input type="checkbox" id="stockAlert" defaultChecked className="accent-[#ff9900]" />
                      <label htmlFor="stockAlert" className="text-[10px] text-gray-400 cursor-pointer">Notify when stock drops below 5 units</label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!alertPrice.trim()) {
                      alert("Please specify a target threshold price.");
                      return;
                    }
                    setAlertConfigured(true);
                    alert(`Alert target registered! We will ping you when price drop satisfies limits.`);
                  }}
                  className={`w-full mt-4 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all font-mono text-center cursor-pointer ${
                    alertConfigured 
                      ? "bg-emerald-500 text-black hover:bg-emerald-600" 
                      : "bg-[#ff9900] text-black hover:bg-[#ffb700]"
                  }`}
                >
                  {alertConfigured ? "✓ Price Tracker Activated" : "Configure Live Tracker"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 13: SMART WISHLIST */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="glass-effect rounded-3xl p-6 border border-white/10">
          <div className="mb-4 border-b border-white/5 pb-3">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              Smart Wishlist Tracking
            </h2>
            <p className="text-xs text-gray-400 font-mono">Real-time status updates on tracked inventory files.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {[
              { name: "MacBook Pro 16-inch M3 Max", price: 3499, expected: 3200, targetDate: "June 8, 2026", stock: "14 units available" },
              { name: "iPhone 16 Pro Max", price: 1199, expected: 1150, targetDate: "Immediate Buy", stock: "3 units left" }
            ].map((item, index) => (
              <div key={index} className="p-4 border border-white/5 bg-black/40 rounded-2xl flex justify-between items-center text-left">
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-white">{item.name}</h3>
                  <div className="flex gap-3 text-[10px] text-gray-400">
                    <span>Target Price: <strong className="text-[#ff9900]">${item.expected}</strong></span>
                    <span>Best Date: {item.targetDate}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-white font-bold block">${item.price}</span>
                  <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">{item.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 14: PERSONALIZED RECOMMENDATIONS */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 z-10 text-left">
        <div className="mb-6">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <User className="w-6 h-6 text-[#ff9900]" />
            Personalized Hub Recommendations
          </h2>
          <p className="text-xs text-gray-400 font-mono">Custom items calibrated for your profile ({user?.name || "Software Developer"}).</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.slice(4, 7).map((prod) => (
            <div 
              key={prod._id}
              className="p-4 border border-white/5 bg-[#0f172a]/20 backdrop-blur-md rounded-2xl flex flex-col justify-between h-[180px] text-left font-mono relative overflow-hidden"
            >
              <div>
                <span className="text-[8px] bg-[#ff9900]/10 border border-[#ff9900]/25 text-[#ff9900] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  MATCH RATE: 96%
                </span>
                <h3 className="text-xs font-black capitalize text-white truncate mt-2">{prod.name}</h3>
                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed mt-1 font-light">{prod.description}</p>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-3">
                <span className="text-xs font-black text-white">${prod.price}</span>
                <button
                  onClick={() => {
                    dispatch(addToCartAction({
                      id: prod._id,
                      name: prod.name,
                      price: prod.price,
                      quantity: 1,
                      image: prod.images?.[0] || ""
                    }));
                    alert(`${prod.name} added to cart!`);
                  }}
                  className="text-[#ff9900] text-[10px] uppercase font-bold hover:underline cursor-pointer"
                >
                  Buy Config
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 15: TECH INTELLIGENCE FEED */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 z-10 text-left">
        <div className="glass-effect rounded-3xl p-6 md:p-8 border border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#ff9900]" />
                Tech Intelligence Feed
              </h2>
              <p className="text-xs text-gray-400">Keep up to date with verified industry updates and hardware benchmarks.</p>
            </div>

            <div className="flex gap-2 font-mono text-[9px] uppercase font-bold overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
              {["All", "AI", "Laptop", "Hardware", "Software"].map((cat) => {
                const active = selectedNewsCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedNewsCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                      active
                        ? "bg-[#ff9900]/10 border-[#ff9900]/40 text-[#ff9900]"
                        : "bg-transparent border-white/5 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNews.map((news, idx) => (
              <div 
                key={idx}
                className="p-5 border border-white/5 bg-black/40 rounded-2xl text-left space-y-2 relative overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded uppercase font-mono font-bold tracking-wider">
                    {news.category}
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">{news.time}</span>
                </div>
                
                <h3 className="text-sm font-black text-white uppercase tracking-tight leading-snug">{news.title}</h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed font-mono text-[11px]">{news.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 16: FOOTER */}
      <footer className="w-full border-t border-white/10 bg-[#02040a]/95 text-xs text-gray-400 font-mono py-12 px-6 mt-12 z-10">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#ff9900] flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-sm font-black text-white uppercase tracking-widest text-glow-primary text-[#ff9900]">
                NEXUS
              </span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed font-light">
              World's most advanced AI-powered workspace compiler and hardware sharding marketplace.
            </p>
          </div>

          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-4">Marketplace Products</h4>
            <ul className="space-y-2 text-[10px]">
              <li><button onClick={() => router.push("/shop?category=Smartphones")} className="hover:text-white transition-colors cursor-pointer text-left">Smartphones & Terminals</button></li>
              <li><button onClick={() => router.push("/shop?category=Workstations")} className="hover:text-white transition-colors cursor-pointer text-left">Enterprise Rigs</button></li>
              <li><button onClick={() => router.push("/shop?category=Laptops")} className="hover:text-white transition-colors cursor-pointer text-left">Developer Laptops</button></li>
              <li><button onClick={() => router.push("/shop?category=Accessories")} className="hover:text-white transition-colors cursor-pointer text-left">Workspace Accessories</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-4">Ecosystem Gateways</h4>
            <ul className="space-y-2 text-[10px]">
              <li><button onClick={() => router.push("/ai-search")} className="hover:text-white transition-colors cursor-pointer text-left">Universal Search Sandbox</button></li>
              <li><button onClick={() => router.push("/compare")} className="hover:text-white transition-colors cursor-pointer text-left">AI Spec Comparison</button></li>
              <li><button onClick={() => router.push("/nexus-ai-lab")} className="hover:text-[#ff9900] transition-colors cursor-pointer font-bold text-left">Nexus AI Lab Playground</button></li>
              <li><button onClick={() => router.push("/support")} className="hover:text-white transition-colors cursor-pointer text-left">System Client Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-4">Security Verification</h4>
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] text-gray-500 leading-normal space-y-1">
              <span className="text-[#00ff87] font-bold block">✓ GATEWAY SECURED</span>
              All sandbox computations are processed locally and validated using cryptographically signed packages.
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[9px] text-gray-600">&copy; 2026 NEXUS COMMERCE INC. ALL SCENARIOS SECURED.</span>
          <div className="flex gap-4 text-[9px] text-gray-600">
            <button onClick={() => alert("Terms of system access verified.")} className="hover:underline cursor-pointer">Terms of Service</button>
            <button onClick={() => alert("Ecosystem encryption policy confirmed.")} className="hover:underline cursor-pointer">Privacy Policy</button>
          </div>
        </div>
      </footer>
    </main>
  );
}
