"use client";

import { useState, useMemo } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { mockDb, MockProduct } from "@/utils/mockDb";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "@/store/slices/cartSlice";
import { Flame, Star, ShoppingBag, ShieldAlert, Cpu } from "lucide-react";

export default function DealsPage() {
  const dispatch = useDispatch();
  const [filterCategory, setFilterCategory] = useState("All");

  const deals = useMemo(() => {
    const all = mockDb.getProducts({});
    const items = all.filter(p => p.discount > 0);
    items.sort((a, b) => b.discount - a.discount);
    return items.map((item, idx) => {
      const dealScore = Math.min(100, Math.round(item.discount * 2.2 + item.rating * 10));
      const urgency = item.stock < 8 ? "CRITICAL" : item.discount > 18 ? "HIGH" : "MODERATE";
      return {
        ...item,
        dealScore,
        urgency,
        rank: idx + 1
      };
    });
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(deals.map(d => d.category)))];
  }, [deals]);

  const filteredDeals = useMemo(() => {
    if (filterCategory === "All") return deals;
    return deals.filter(d => d.category === filterCategory);
  }, [deals, filterCategory]);

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
            Deal Intelligence Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
            Live Deal Rankings
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Analyzing pricing elasticity and competitor retail rates live across global silicon nodes.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 font-mono text-[9px] uppercase font-bold overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                filterCategory === cat
                  ? "bg-[#ff9900]/10 border-[#ff9900]/40 text-[#ff9900]"
                  : "bg-transparent border-white/5 text-gray-400 hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Deals Matrix List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDeals.map((deal) => (
            <div 
              key={deal._id}
              className="p-5 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md flex gap-4 text-left font-mono relative overflow-hidden group hover:border-[#ff9900]/30 transition-all"
            >
              <div className="absolute top-0 right-0 bg-[#ff9900] text-black text-[9px] font-black uppercase px-3 py-1 rounded-bl">
                Rank #{deal.rank}
              </div>

              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center p-2.5 shrink-0 self-center">
                <img src={deal.images?.[0]} alt={deal.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
              </div>

              <div className="flex-1 space-y-2 min-w-0 pr-12">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[8px] bg-red-950 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    -{deal.discount}% OFF
                  </span>
                  <span className={`text-[8px] border px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    deal.urgency === "CRITICAL" ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}>
                    Urgency: {deal.urgency}
                  </span>
                </div>

                <span className="text-[8px] uppercase tracking-widest text-[#ff9900] font-bold block">{deal.brand}</span>
                <h3 className="text-sm font-black capitalize text-white truncate leading-tight">{deal.name}</h3>

                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-[#ff9900] text-lg font-black">${deal.price}</span>
                  <span className="text-[10px] text-gray-500 line-through">${deal.originalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-[9px] border-t border-white/5 pt-2 mt-2">
                  <span className="text-gray-400">Deal Score: <strong className="text-[#ff9900]">{deal.dealScore}/100</strong></span>
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
                    className="px-3 py-1 bg-[#ff9900] hover:bg-[#ffb700] text-black rounded font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredDeals.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500 font-mono text-xs">
              No live deals match your category criteria.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
