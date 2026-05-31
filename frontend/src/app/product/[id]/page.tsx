"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Sparkles, 
  AlertCircle, Send, Star, HelpCircle,
  Package, Check, Heart, Scale, Eye, Zap, Share2, Gift, Cpu, Info, Award, X
} from "lucide-react";
import { RootState } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { mockDb } from "@/utils/mockDb";
import { NavBar } from "@/components/ui/NavBar";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const id = params.id as string;

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Interactive reviews and upvotes
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [wishlisted, setWishlisted] = useState(false);

  // Gallery & 360
  const [activeImage, setActiveImage] = useState("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", backgroundPosition: "0% 0%" });
  const [viewMode, setViewMode] = useState<"gallery" | "360">("gallery");
  const [rotationDegrees, setRotationDegrees] = useState(0);

  // Q&A with Upvoting & Filtering
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [qaSearchQuery, setQaSearchQuery] = useState("");
  const [upvotesState, setUpvotesState] = useState<Record<string, number>>({});

  // Configuration variants updating pricing parameters
  const [selectedColor, setSelectedColor] = useState("Space Slate");
  const [selectedConfig, setSelectedConfig] = useState("Standard Core");

  // Shipping & Delivery speed adjustments
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express" | "drone">("standard");

  // Holographic Gift wrapping selections
  const [giftWrapping, setGiftWrapping] = useState<"none" | "circuit" | "quantum">("none");

  // Bundle checkboxes
  const [includeBundleItem1, setIncludeBundleItem1] = useState(true);
  const [includeBundleItem2, setIncludeBundleItem2] = useState(true);
  const [bundleItems, setBundleItems] = useState<any[]>([]);

  // Similar products and specifications comparison
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  // Real-time viewer count simulator
  const [viewersCount, setViewersCount] = useState(12);

  // AR Projection simulator modal
  const [showArPortal, setShowArPortal] = useState(false);
  const [arStep, setArStep] = useState(0);

  // Save viewed item to history
  useEffect(() => {
    if (product && product._id) {
      const recentlyViewed = JSON.parse(localStorage.getItem("nexus_recently_viewed") || "[]");
      const updated = [product._id, ...recentlyViewed.filter((x: string) => x !== product._id)].slice(0, 10);
      localStorage.setItem("nexus_recently_viewed", JSON.stringify(updated));
    }
  }, [product]);

  // Viewer simulation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(Math.floor(9 + Math.random() * 18));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchDetail = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = mockDb.getProductById(id);
      
      if (data) {
        setProduct(data);
        setReviews(data.reviews || []);
        setQuestions(data.questions || []);
        setActiveImage(data.images?.[0] || "");
        setImageList(data.images || []);

        // Fetch similar items for comparisons
        const similar = mockDb.getProducts({ category: data.category });
        setSimilarProducts(similar.filter(p => p._id !== data._id).slice(0, 3));

        // Fetch bundle accessories
        const allProds = mockDb.getProducts({});
        const accessories = allProds.filter(p => p._id !== data._id && p.category === "Accessories");
        setBundleItems(accessories.slice(0, 2));

        // Seed upvotes
        const upvoteSeed: Record<string, number> = {};
        (data.questions || []).forEach((q: any) => {
          upvoteSeed[q._id] = Math.floor(Math.random() * 8);
        });
        setUpvotesState(upvoteSeed);

      } else {
        setErrorMsg("Failed to resolve product coordinates.");
      }
    } catch (err) {
      setErrorMsg("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchDetail();
  }, [id, fetchDetail]);

  // Pricing math based on specs config & extra options
  const configOffset = selectedConfig === "Performance Threadripper Core" ? 500 : 0;
  const currentBasePrice = (product?.price || 0) + configOffset;
  const currentOriginalPrice = product?.originalPrice ? product.originalPrice + configOffset : Math.round(currentBasePrice / (1 - (product?.discount || 0) / 100));

  const shippingFee = deliverySpeed === "express" ? 25 : deliverySpeed === "drone" ? 45 : 0;
  const wrappingFee = giftWrapping === "circuit" ? 5 : giftWrapping === "quantum" ? 10 : 0;
  const finalBuyBoxPrice = currentBasePrice + shippingFee + wrappingFee;

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product._id,
        name: `${product.name} (${selectedConfig} - ${selectedColor})`,
        price: currentBasePrice,
        quantity: 1,
        image: activeImage,
      })
    );
    alert("Listing successfully loaded to secure quantum cart!");
  };

  const handleAddBundleToCart = () => {
    handleAddToCart();
    if (includeBundleItem1 && bundleItems[0]) {
      dispatch(addToCart({
        id: bundleItems[0]._id,
        name: bundleItems[0].name,
        price: bundleItems[0].price,
        quantity: 1,
        image: bundleItems[0].images?.[0] || ""
      }));
    }
    if (includeBundleItem2 && bundleItems[1]) {
      dispatch(addToCart({
        id: bundleItems[1]._id,
        name: bundleItems[1].name,
        price: bundleItems[1].price,
        quantity: 1,
        image: bundleItems[1].images?.[0] || ""
      }));
    }
    alert("Bundle successfully synchronized to cart!");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const userName = currentUser?.name || "Verified_Buyer";
    const res = mockDb.addReview(id, {
      rating: newRating,
      text: newReviewText,
      user: userName
    });

    if (res) {
      setReviews(res.reviews || []);
      setProduct(res);
      setNewReviewText("");
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const userName = currentUser?.name || "Anonymous_Buyer";
    const res = mockDb.addQuestion(id, {
      question: newQuestionText,
      user: userName
    });

    if (res) {
      setQuestions(prev => [res, ...prev]);
      setUpvotesState(prev => ({ ...prev, [res._id]: 0 }));
      setNewQuestionText("");
    }
  };

  const handleUpvoteQuestion = (qId: string) => {
    setUpvotesState(prev => ({
      ...prev,
      [qId]: (prev[qId] || 0) + 1
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", backgroundPosition: "0% 0%" });
  };

  const triggerArSimulator = () => {
    setShowArPortal(true);
    setArStep(1);
    setTimeout(() => setArStep(2), 2000);
  };

  // Filter Q&As
  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(qaSearchQuery.toLowerCase())
  );

  // Bundle calculations
  let totalBundlePrice = currentBasePrice;
  if (includeBundleItem1 && bundleItems[0]) totalBundlePrice += bundleItems[0].price;
  if (includeBundleItem2 && bundleItems[1]) totalBundlePrice += bundleItems[1].price;

  if (loading) {
    return (
      <main className="w-screen h-screen bg-[#070a13] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#ff9900] border-t-transparent animate-spin" />
        <span className="text-xs text-gray-500 font-mono">Synchronizing specifications...</span>
      </main>
    );
  }

  if (errorMsg || !product) {
    return (
      <main className="w-screen h-screen bg-[#070a13] flex flex-col items-center justify-center p-6 text-center text-white">
        <AlertCircle className="w-16 h-16 text-[#ff007f] mb-4 animate-pulse" />
        <h1 className="text-xl font-bold font-mono text-[#ff007f] mb-2">PRODUCT LOAD FAILURE</h1>
        <p className="text-gray-400 mb-6">{errorMsg || "Requested item coordinates not found."}</p>
        <button onClick={() => router.push("/shop")} className="px-6 py-3 bg-[#ff9900] text-black font-bold uppercase rounded-lg">
          Return to Catalog
        </button>
      </main>
    );
  }

  // Sentiment ratio (mock ratio based on rating distribution)
  const posCount = reviews.filter(r => r.rating >= 4).length;
  const negCount = reviews.filter(r => r.rating <= 2).length;
  const posPercentage = reviews.length > 0 ? Math.round((posCount / reviews.length) * 100) : 85;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : stars === 5 ? 70 : stars === 4 ? 20 : 10;
    return { stars, count, percentage };
  });

  return (
    <main className="w-full bg-[#070a13] min-h-screen text-gray-200 font-sans flex flex-col overflow-x-hidden relative">
      <NavBar />
      
      {/* Return Catalog Link */}
      <div className="max-w-[1480px] mx-auto w-full px-6 py-3 text-left z-10">
        <button 
          onClick={() => router.push("/shop")} 
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to catalog listings
        </button>
      </div>

      {/* CORE WORKSPACE GRID */}
      <section className="max-w-[1480px] mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-4 z-10">
        
        {/* LEFT COLUMN: IMAGES & THUMBNAILS (COL-SPAN-4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Gallery vs 360 View Selectors */}
          <div className="flex gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setViewMode("gallery")}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded border text-center transition-all cursor-pointer ${
                viewMode === "gallery" 
                  ? "bg-[#ff9900]/25 text-[#ff9900] border-[#ff9900]/30 shadow-[0_0_10px_rgba(255,153,0,0.15)] font-black"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              Gallery View
            </button>
            <button
              onClick={() => setViewMode("360")}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded border text-center transition-all cursor-pointer ${
                viewMode === "360"
                  ? "bg-[#ff9900]/25 text-[#ff9900] border-[#ff9900]/30 shadow-[0_0_10px_rgba(255,153,0,0.15)] font-black"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              360° Spin
            </button>
          </div>

          <div className="flex gap-4 h-auto">
            {viewMode === "gallery" ? (
              <>
                {/* Thumbnails list */}
                {imageList.length > 1 && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {imageList.map((img, idx) => (
                      <button 
                        key={idx}
                        onMouseEnter={() => setActiveImage(img)}
                        onClick={() => setActiveImage(img)}
                        className={`w-12 h-12 rounded border bg-[#0f172a] overflow-hidden p-0.5 cursor-pointer transition-colors ${
                          activeImage === img ? "border-[#ff9900] ring-1 ring-[#ff9900]" : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Large display with Hover Zoom Lens */}
                <div 
                  className="flex-grow bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-4 h-[380px] flex items-center justify-center relative zoom-container overflow-hidden shadow-2xl"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={activeImage} alt={product.name} className="w-full h-full object-contain zoom-image" />
                  
                  {/* Custom Lens zoom panel container overlay */}
                  <div 
                    className="absolute inset-0 z-30 pointer-events-none border border-white/10 bg-[#070a13]"
                    style={{
                      display: zoomStyle.display,
                      backgroundImage: `url(${activeImage})`,
                      backgroundSize: "220%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: zoomStyle.backgroundPosition
                    }}
                  />
                </div>
              </>
            ) : (
              /* Interactive 360 Rotator Display */
              <div className="flex-1 bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-6 h-[380px] flex flex-col items-center justify-between relative select-none shadow-2xl">
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono block">360° Interactive Rotator</span>
                  <span className="text-[9px] text-gray-500 font-light block">Drag the slider to rotate product chassis</span>
                </div>
                
                <div 
                  className="w-56 h-56 flex items-center justify-center overflow-hidden transition-transform duration-100 ease-out"
                  style={{ transform: `rotateY(${rotationDegrees}deg)` }}
                >
                  <img src={imageList[0] || activeImage} alt="360 View" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                </div>

                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[9px] font-mono text-gray-500">
                    <span>0° Front</span>
                    <span>180° Back</span>
                    <span>360° Front</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotationDegrees}
                    onChange={(e) => setRotationDegrees(Number(e.target.value))}
                    className="w-full accent-[#ff9900] cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: TITLE, SPECS, COMPARISON (COL-SPAN-5) */}
        <div className="lg:col-span-5 text-left space-y-5">
          <div className="border-b border-white/10 pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded text-cyan-400 font-bold uppercase tracking-wider font-mono">
                {product.category}
              </span>
              <span className="text-[10px] bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded text-purple-400 font-bold uppercase tracking-wider font-mono">
                Brand: {product.brand || "Nexus"}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-white capitalize leading-tight tracking-tight hover:text-[#ff9900] transition-colors cursor-default">
              {product.name}
            </h1>
            
            {/* Review stars */}
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? "fill-current" : "text-white/10"}`} />
                ))}
              </div>
              <span className="text-xs font-semibold text-cyan-400 hover:text-[#ff9900] hover:underline cursor-pointer">
                {reviews.length} Customer evaluations
              </span>
            </div>
          </div>

          {/* Pricing specs */}
          <div className="border-b border-white/10 pb-4 flex justify-between items-center">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] text-gray-400 font-bold font-mono">Price:</span>
                <span className="text-[#ff9900] text-2xl font-mono font-black">${currentBasePrice.toLocaleString()}</span>
                {currentOriginalPrice > currentBasePrice && (
                  <span className="text-gray-500 line-through text-sm font-mono">${currentOriginalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal font-mono">
                Specs setup: {selectedConfig} | Price includes tax.
              </p>
            </div>
            <button
              onClick={triggerArSimulator}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/35 rounded font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_10px_rgba(0,240,255,0.05)]"
            >
              <Sparkles className="w-3.5 h-3.5"/> AR Hologram View
            </button>
          </div>

          {/* VARIANTS SELECTORS */}
          <div className="space-y-4 border-b border-white/10 pb-4 text-xs font-medium">
            <div>
              <span className="text-gray-400 font-bold block mb-1.5">Color: <strong className="text-white">{selectedColor}</strong></span>
              <div className="flex gap-2">
                {["Space Slate", "Anodized Silver", "Bio Bronze"].map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                      selectedColor === col
                        ? "border-[#ff9900] bg-[#ff9900]/10 text-[#ff9900] font-black shadow-[0_0_8px_rgba(255,153,0,0.1)]"
                        : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-gray-400 font-bold block mb-1.5">Hardware Config: <strong className="text-white">{selectedConfig}</strong></span>
              <div className="flex flex-col sm:flex-row gap-2">
                {["Standard Core", "Performance Threadripper Core"].map((cfg) => (
                  <button
                    key={cfg}
                    onClick={() => setSelectedConfig(cfg)}
                    className={`px-3 py-2 rounded border text-left text-xs font-bold transition-all cursor-pointer ${
                      selectedConfig === cfg
                        ? "border-[#ff9900] bg-[#ff9900]/10 text-[#ff9900] font-black shadow-[0_0_8px_rgba(255,153,0,0.1)]"
                        : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{cfg}</span>
                      <span className="font-mono text-[10px] text-gray-500">{cfg.includes("Threadripper") ? "+$500" : "Free"}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Specs List */}
          <div className="space-y-2.5 text-xs">
            <span className="font-bold text-gray-300 block uppercase tracking-wider text-[10px] font-mono">Product Specifications</span>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 leading-relaxed font-light">
              {(product.features || []).map((feat: string, i: number) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* RIGHT COLUMN: BUY BOX (COL-SPAN-3) */}
        <div className="lg:col-span-3 bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-2xl text-left space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-500 font-mono block uppercase">Billing Details total</span>
            <span className="text-2xl font-black text-[#ff9900] font-mono block">${finalBuyBoxPrice.toLocaleString()}</span>
            
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> IN STOCK.</span>
              <span className="text-[10px] text-[#ff007f] font-mono bg-[#ff007f]/10 border border-[#ff007f]/20 px-2 py-0.5 rounded font-black animate-pulse flex items-center gap-1">
                <Eye className="w-3.5 h-3.5"/> {viewersCount} active
              </span>
            </div>
            
            {/* Visual stock gauge */}
            <div className="space-y-1 pt-1.5">
              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>Platform Stock Level:</span>
                <span>{product.stock || 24} units left</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${product.stock <= 5 ? "bg-red-500 animate-pulse" : "bg-[#ff9900]"}`}
                  style={{ width: `${Math.min(100, ((product.stock || 24) / 45) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[10px] text-gray-400 border-y border-white/5 py-3 font-mono leading-normal">
            <div className="flex justify-between">
              <span>Dispatched Depot:</span>
              <span className="font-bold text-gray-200">East Core Warehouse</span>
            </div>
            <div className="flex justify-between">
              <span>Verified Seller:</span>
              <span className="font-bold text-cyan-400 cursor-pointer">Nexus Wholesale Co.</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Valuation:</span>
              <span className="font-bold text-gray-300">Included (8.25%)</span>
            </div>
          </div>

          {/* Delivery speed selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-bold block uppercase font-mono">Logistics Dispatch Mode</span>
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold">
              {[
                { id: "standard", label: "Std", fee: "Free", days: "2-3d" },
                { id: "express", label: "Express", fee: "+$25", days: "1d" },
                { id: "drone", label: "Drone", fee: "+$45", days: "2h" }
              ].map((speed) => (
                <button
                  key={speed.id}
                  type="button"
                  onClick={() => setDeliverySpeed(speed.id as any)}
                  className={`p-1.5 border rounded cursor-pointer transition-colors text-center ${
                    deliverySpeed === speed.id
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-400"
                      : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="font-bold block">{speed.label}</div>
                  <div className="text-[8px] opacity-70 font-mono">{speed.fee}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gift wrapping selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-bold block uppercase font-mono">Holographic Gift Wrap</span>
            <select
              value={giftWrapping}
              onChange={(e) => setGiftWrapping(e.target.value as any)}
              className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-[10px] text-gray-300 font-bold font-mono"
            >
              <option value="none">No Special Wrapping</option>
              <option value="circuit">Circuit Board Pattern (+$5)</option>
              <option value="quantum">Quantum Gold Foil (+$10)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button 
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-[#ff9900] hover:bg-[#e08700] text-black font-black uppercase rounded-lg text-[10px] tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,153,0,0.15)]"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Secure to Cart
            </button>
            <button 
              onClick={() => { handleAddToCart(); router.push("/cart"); }}
              className="w-full py-2.5 bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold uppercase rounded-lg text-[10px] tracking-wider transition-colors cursor-pointer"
            >
              Express Checkout
            </button>
          </div>

          {/* Sentiment Analytics summary */}
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>Sentiment Ratio (AI):</span>
              <span className="text-emerald-400 font-bold">{posPercentage}% POSITIVE</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: `${posPercentage}%` }} />
              <div className="bg-red-500 h-full" style={{ width: `${100 - posPercentage}%` }} />
            </div>
          </div>
        </div>

      </section>

      {/* BOTTOM SECTIONS */}
      <section className="max-w-[1480px] mx-auto w-full px-6 py-6 border-t border-white/10 mt-6 space-y-10">
        
        {/* FREQUENTLY BOUGHT TOGETHER */}
        {bundleItems.length > 0 && (
          <div className="bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg text-left space-y-4">
            <h3 className="font-black text-sm text-white border-b border-white/5 pb-2 uppercase tracking-wider font-mono text-cyan-400">Bundle Accessory Builder</h3>
            
            <div className="flex flex-col lg:flex-row items-center gap-6 text-xs">
              {/* Product thumbnails + signs */}
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <div className="w-14 h-14 rounded border border-white/10 p-1 flex items-center justify-center bg-black/40 flex-shrink-0">
                  <img src={activeImage} alt="Core" className="w-full h-full object-cover" />
                </div>
                {includeBundleItem1 && bundleItems[0] && (
                  <>
                    <span className="text-gray-400 font-bold text-lg">+</span>
                    <div className="w-14 h-14 rounded border border-white/10 p-1 flex items-center justify-center bg-black/40 flex-shrink-0">
                      <img src={bundleItems[0].images?.[0]} alt="Accessory 1" className="w-full h-full object-cover" />
                    </div>
                  </>
                )}
                {includeBundleItem2 && bundleItems[1] && (
                  <>
                    <span className="text-gray-400 font-bold text-lg">+</span>
                    <div className="w-14 h-14 rounded border border-white/10 p-1 flex items-center justify-center bg-black/40 flex-shrink-0">
                      <img src={bundleItems[1].images?.[0]} alt="Accessory 2" className="w-full h-full object-cover" />
                    </div>
                  </>
                )}
              </div>

              {/* Price and buy action */}
              <div className="space-y-2.5 text-center lg:text-left">
                <div className="text-xs font-mono">
                  <span className="text-gray-500 font-medium">Bundle Price: </span>
                  <span className="text-[#ff9900] font-black text-base">${totalBundlePrice.toFixed(0)}</span>
                </div>
                <button
                  onClick={handleAddBundleToCart}
                  className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded-lg border border-[#a88734] transition-colors cursor-pointer text-[10px] tracking-wider"
                >
                  Purchase Bundle Pack
                </button>
              </div>

              {/* Checkboxes list */}
              <div className="flex-1 space-y-2 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-default">
                  <input type="checkbox" checked disabled className="rounded border-white/10 bg-white/5 text-[#ff9900] focus:ring-[#ff9900]" />
                  <span className="text-gray-300">Core: <strong>{product.name}</strong> <span className="text-[#ff9900] font-bold font-mono">${currentBasePrice}</span></span>
                </label>
                {bundleItems[0] && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeBundleItem1} onChange={(e) => setIncludeBundleItem1(e.target.checked)} className="rounded border-white/10 bg-white/5 text-[#ff9900] focus:ring-[#ff9900]" />
                    <span className="text-gray-300">Accessory: <strong>{bundleItems[0].name}</strong> <span className="text-[#ff9900] font-bold font-mono">${bundleItems[0].price}</span></span>
                  </label>
                )}
                {bundleItems[1] && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeBundleItem2} onChange={(e) => setIncludeBundleItem2(e.target.checked)} className="rounded border-white/10 bg-white/5 text-[#ff9900] focus:ring-[#ff9900]" />
                    <span className="text-gray-300">Backup: <strong>{bundleItems[1].name}</strong> <span className="text-[#ff9900] font-bold font-mono">${bundleItems[1].price}</span></span>
                  </label>
                )}
              </div>

            </div>
          </div>
        )}

        {/* DYNAMIC PRICE COMPARISON MATRIX */}
        {similarProducts.length > 0 && (
          <div className="bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg text-left space-y-4">
            <h3 className="font-black text-sm text-white border-b border-white/5 pb-2 uppercase tracking-wider font-mono text-cyan-400 flex items-center gap-1.5">
              <Scale className="w-4 h-4" /> Hardware Comparison Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono text-gray-300">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10 text-gray-500 font-bold">
                    <th className="p-3">Specification parameters</th>
                    <th className="p-3 text-cyan-400 font-bold">{product.name} (This Item)</th>
                    {similarProducts.map((p) => (
                      <th key={p._id} className="p-3">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Retail price</td>
                    <td className="p-3 text-[#ff9900] font-bold">${currentBasePrice}</td>
                    {similarProducts.map((p) => (
                      <td key={p._id} className="p-3">${p.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Brand node</td>
                    <td className="p-3">{product.brand || "Nexus"}</td>
                    {similarProducts.map((p) => (
                      <td key={p._id} className="p-3">{p.brand || "Nexus"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Manufacturer Warranty</td>
                    <td className="p-3">{product.specifications?.["Warranty"] || "1-Year Certified"}</td>
                    {similarProducts.map((p) => (
                      <td key={p._id} className="p-3">{p.specifications?.["Warranty"] || "1-Year Certified"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Model release Year</td>
                    <td className="p-3">{product.specifications?.["Model Year"] || "2026"}</td>
                    {similarProducts.map((p) => (
                      <td key={p._id} className="p-3">{p.specifications?.["Model Year"] || "2026"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SPECIFICATIONS GRID TABLE */}
        <div className="bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg text-left space-y-4">
          <h3 className="font-black text-sm text-white border-b border-white/5 pb-2 uppercase tracking-wider font-mono text-cyan-400">Specifications Grid</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs font-mono">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-500 font-bold uppercase">Seller Store</span>
              <span className="text-gray-200 font-bold capitalize">{product.seller || "Nexus Authorized"}</span>
            </div>
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500 font-bold uppercase">{key}</span>
                <span className="text-gray-200 font-bold text-right pl-4">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOMER QUESTIONS & ANSWERS */}
        <div className="bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg text-left space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-2">
            <h3 className="font-black text-sm text-white uppercase tracking-wider font-mono text-cyan-400">Customer Q&As</h3>
            <input 
              type="text"
              placeholder="Search community questions..."
              value={qaSearchQuery}
              onChange={(e) => setQaSearchQuery(e.target.value)}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-cyan-400 text-xs w-full sm:w-60 font-mono"
            />
          </div>
          
          {/* Ask Question Form */}
          <form onSubmit={handleAddQuestion} className="flex gap-2 text-xs font-mono">
            <input 
              type="text"
              required
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Have queries? Ask our community..."
              className="flex-grow px-3 py-2.5 bg-white/5 border border-white/10 rounded focus:border-[#ff9900] focus:outline-none placeholder:text-gray-500"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded-lg border border-[#a88734] cursor-pointer transition-colors"
            >
              Ask
            </button>
          </form>

          {/* Questions List */}
          <div className="space-y-4 pt-2">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => (
                <div key={q._id} className="text-xs space-y-1.5 border-b border-white/5 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-2 items-start">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/25 px-1.5 py-0.5 rounded font-black text-[9px] h-4 flex items-center font-mono">Q</span>
                      <span className="font-bold text-white">{q.question}</span>
                    </div>
                    {/* Upvote button */}
                    <button
                      onClick={() => handleUpvoteQuestion(q._id)}
                      className="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 rounded text-[9px] text-cyan-400 font-bold font-mono cursor-pointer transition-all flex items-center gap-1"
                    >
                      ▲ Upvote ({upvotesState[q._id] || 0})
                    </button>
                  </div>
                  <div className="flex gap-2 items-start pl-4 text-gray-300">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded font-black text-[9px] h-4 flex items-center font-mono">A</span>
                    <span>{q.answer || <em className="text-gray-500">Answer pending from community...</em>}</span>
                  </div>
                  <div className="text-[8px] text-gray-500 font-mono pl-8">
                    Asked by {q.user} on {new Date(q.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 font-mono">No matching questions resolved.</p>
            )}
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <div className="space-y-4 text-left">
            <h3 className="font-black text-sm text-white border-b border-white/5 pb-2 uppercase tracking-wider font-mono text-cyan-400">Similar Catalog Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarProducts.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p._id}`}
                  className="bg-[#0f172a]/60 backdrop-blur border border-white/10 hover:border-[#ff9900] p-4 rounded-xl flex items-center gap-4 transition-all shadow-md group"
                >
                  <div className="w-14 h-14 rounded border border-white/10 p-1 bg-black/40 overflow-hidden flex-shrink-0">
                    <img src={p.images?.[0] || p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs font-mono">
                    <span className="font-bold text-white block truncate capitalize group-hover:text-[#ff9900] font-sans">{p.name}</span>
                    <span className="text-[10px] text-gray-500 block truncate capitalize">{p.category}</span>
                    <span className="font-bold text-[#ff9900] mt-1 block">${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS & EVALUATIONS */}
        <div className="space-y-6 text-left">
          <h2 className="text-lg font-black uppercase tracking-tight text-white border-b border-white/10 pb-2 font-mono text-cyan-400">Customer Sentiment Evaluations</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Score breakdown charts */}
            <div className="lg:col-span-4 bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg space-y-4">
              <span className="font-bold text-gray-300 text-xs uppercase block font-mono">Rating Matrix Breakdown</span>
              
              <div className="flex items-baseline gap-2 mb-2 font-mono">
                <span className="text-[#ff9900] font-black text-3xl">{product.rating || "4.5"}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">out of 5.0 stars</span>
              </div>

              <div className="space-y-2">
                {ratingDistribution.map(({ stars, percentage, count }) => (
                  <div key={stars} className="flex items-center gap-3 text-[11px] text-gray-400 font-bold font-mono">
                    <span className="w-10 text-right">{stars} star</span>
                    <div className="flex-grow h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#ff9900] to-[#e08700] rounded-full transition-all duration-700" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-6 text-right">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review list */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Write Review Form */}
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg space-y-4">
                <h4 className="font-bold text-xs text-white border-b border-white/5 pb-1.5 uppercase font-mono">Write Customer Review</h4>
                <form onSubmit={handleAddReview} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block mb-1.5 font-bold text-gray-400">Select Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`w-8 h-8 rounded border flex items-center justify-center font-mono font-bold transition-colors cursor-pointer ${
                            newRating >= star 
                              ? "border-[#ff9900] text-[#ff9900] bg-[#ff9900]/10" 
                              : "border-white/10 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 font-bold text-gray-400">Review Message</label>
                    <textarea
                      required
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Share your experience using this hardware component..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded focus:border-[#ff9900] focus:outline-none placeholder:text-gray-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded cursor-pointer transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Review entries */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev._id} className="bg-[#0f172a]/60 backdrop-blur border border-white/10 rounded-xl p-4 shadow-lg text-xs space-y-1.5 text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white capitalize">{rev.user}</span>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-white/10"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 font-light leading-relaxed">{rev.text}</p>
                    <span className="text-[9px] text-gray-500 font-mono block">
                      {new Date(rev.createdAt).toLocaleDateString()} | Verified Operator Purchase
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* AR Simulation Overlay Modal */}
      {showArPortal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col text-left font-mono">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40">
              <span className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 animate-spin" /> Holographic AR Projection
              </span>
              <button onClick={() => setShowArPortal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4 text-center">
              {arStep === 1 ? (
                <div className="space-y-4 py-8">
                  <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                  <span className="text-xs text-cyan-400 block animate-pulse">Establishing Holo-Link to device camera...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-44 h-44 bg-cyan-950/20 border border-cyan-400/30 rounded-xl mx-auto flex items-center justify-center p-4 relative shadow-[inset_0_0_20px_rgba(0,240,255,0.15)] animate-pulse">
                    <div className="absolute top-2 left-2 text-[8px] text-cyan-500">FPS: 60</div>
                    <img src={activeImage} alt="AR" className="h-32 object-contain filter drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]" />
                  </div>
                  <div className="text-xs space-y-1.5 text-left text-gray-300 bg-white/5 p-3 rounded border border-white/5">
                    <div><strong>Matrix Align:</strong> SUCCESSFUL</div>
                    <div><strong>Rendering Model:</strong> {product.name}</div>
                    <div><strong>Simulated Scale:</strong> 1:1 Real-world Ratio</div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
              <button 
                onClick={() => setShowArPortal(false)}
                className="px-4 py-1.5 bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-400 font-bold uppercase rounded text-[10px] tracking-wider cursor-pointer transition-colors"
              >
                Close Projection
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
