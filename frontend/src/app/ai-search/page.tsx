"use client";

import { useState, useEffect, useMemo } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { mockDb, MockProduct } from "@/utils/mockDb";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "@/store/slices/cartSlice";
import { Search, Sparkles, AlertCircle, ShoppingBag, Mic, MicOff } from "lucide-react";

export default function AISearchPage() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
  const [retailerPrices, setRetailerPrices] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<MockProduct[]>([]);
  const [isListening, setIsListening] = useState(false);

  const allProducts = useMemo(() => mockDb.getProducts({}), []);

  useEffect(() => {
    if (allProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(allProducts[0] || null);
    }
  }, [allProducts, selectedProduct]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const results = mockDb.getProducts({ search: query });
      setSuggestions(results.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  useEffect(() => {
    if (selectedProduct) {
      const price = selectedProduct.price;
      setRetailerPrices({
        amazon: Math.round(price * 1.09),
        flipkart: Math.round(price * 1.06),
        myntra: Math.round(price * 1.14),
        croma: Math.round(price * 1.01),
        reliance: Math.round(price * 1.04),
        nexus: price
      });
    }
  }, [selectedProduct]);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      const matches = mockDb.getProducts({ search: transcript });
      if (matches.length > 0) {
        setSelectedProduct(matches[0] || null);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
            Silicon Index Gateways
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            Universal AI Search Engine
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Compute pricing differentials and check live retail channel configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <div className="flex items-center bg-black/60 rounded-2xl border border-white/10 focus-within:border-[#ff9900] px-4 py-3 h-14 transition-all">
                <Search className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Query keywords: 'iphone 16', 'xps', 'razer'..."
                  className="w-full bg-transparent border-none text-white placeholder:text-gray-500 text-sm focus:outline-none"
                />
                
                <button
                  onClick={startVoiceSearch}
                  className={`p-2 rounded-lg transition-colors cursor-pointer mr-2 ${
                    isListening ? "text-red-500 animate-pulse bg-red-500/10" : "text-gray-500 hover:text-white"
                  }`}
                  title="Voice Search"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#ff9900]" />}
                </button>

                {query && (
                  <button onClick={() => setQuery("")} className="text-gray-500 hover:text-white font-mono text-xs uppercase cursor-pointer">
                    Clear
                  </button>
                )}
              </div>

              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-[#0d121f] border border-white/15 rounded-xl shadow-2xl z-40 overflow-hidden divide-y divide-white/5 text-left">
                  {suggestions.map((prod) => (
                    <div
                      key={prod._id}
                      onClick={() => {
                        setSelectedProduct(prod);
                        setQuery(prod.name);
                        setSuggestions([]);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-white flex items-center justify-center p-1 overflow-hidden shrink-0">
                        <img src={prod.images?.[0] || ""} alt={prod.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 font-mono text-xs">
                        <h4 className="font-bold text-white truncate capitalize">{prod.name}</h4>
                        <span className="text-[10px] text-[#ff9900]">{prod.brand}</span>
                      </div>
                      <span className="font-mono text-xs text-[#ff9900] font-bold">${prod.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedProduct && retailerPrices && (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 text-left">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-1 shrink-0">
                    <img src={selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#ff9900] font-mono font-bold block">{selectedProduct.brand}</span>
                    <h3 className="text-sm font-black capitalize text-white leading-tight">{selectedProduct.name}</h3>
                    <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{selectedProduct.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { platform: "Amazon", price: retailerPrices.amazon, rating: 4.6, stock: "In Stock" },
                    { platform: "Flipkart", price: retailerPrices.flipkart, rating: 4.4, stock: "In Stock" },
                    { platform: "Myntra", price: retailerPrices.myntra, rating: 4.2, stock: "Out of Stock" },
                    { platform: "Croma", price: retailerPrices.croma, rating: 4.5, stock: "In Stock" },
                    { platform: "Reliance Digital", price: retailerPrices.reliance, rating: 4.3, stock: "In Stock" },
                    { platform: "Nexus Store", price: retailerPrices.nexus, rating: 4.9, stock: "Priority Delivery", best: true }
                  ].map((item) => (
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
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block">{item.platform}</span>
                        <span className={`text-lg font-black block ${item.best ? "text-[#ff9900] text-glow-primary" : "text-white"}`}>
                          ${item.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[9px] border-t border-white/5 pt-2">
                        <span className="text-gray-500">Rating: {item.rating} ★</span>
                        <span className={item.stock.includes("Out") ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                          {item.stock}
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

              {selectedProduct ? (
                <div className="space-y-3 font-mono text-[11px] text-gray-300">
                  <p className="leading-relaxed font-light">
                    &gt; Pricing indexes analyzed. <strong>Nexus Store</strong> features the lowest rate at <strong>${selectedProduct.price}</strong>, saving <strong>9%</strong> compared to traditional platforms.
                  </p>
                  <div className="p-3 bg-[#ff9900]/5 border border-[#ff9900]/20 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-[#ff9900] font-bold block mb-1">Ecosystem Verdict:</span>
                    Optimal purchasing conditions met. 1-day shipping is enabled.
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center text-gray-600">
                  <AlertCircle className="w-8 h-8 mb-2 text-gray-600 animate-pulse" />
                  <span>Specify search keys to compute intelligence scores.</span>
                </div>
              )}
            </div>

            {selectedProduct && (
              <button
                onClick={() => {
                  dispatch(addToCartAction({
                    id: selectedProduct._id,
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    quantity: 1,
                    image: selectedProduct.images?.[0] || ""
                  }));
                  alert(`${selectedProduct.name} added to cart!`);
                }}
                className="w-full mt-4 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer font-mono"
              >
                Buy Direct (Save 9%)
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
