"use client";

import { useState, useEffect, useMemo } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { mockDb, MockProduct } from "@/utils/mockDb";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "@/store/slices/cartSlice";
import { Sliders, Sparkles, AlertCircle, Trash2, Plus } from "lucide-react";

export default function ComparePage() {
  const dispatch = useDispatch();
  const allProducts = useMemo(() => mockDb.getProducts({}), []);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pre-populate with first two items
  useEffect(() => {
    if (allProducts.length >= 2 && selectedIds.length === 0) {
      setSelectedIds([allProducts[0]?._id || "", allProducts[1]?._id || ""]);
    }
  }, [allProducts, selectedIds]);

  const itemsToCompare = useMemo(() => {
    return selectedIds.map(id => mockDb.getProductById(id)).filter(Boolean) as MockProduct[];
  }, [selectedIds, allProducts]);

  const allSpecKeys = useMemo(() => {
    const keys = new Set<string>();
    itemsToCompare.forEach(item => {
      Object.keys(item.specifications || {}).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }, [itemsToCompare]);

  // Compute recommendation markers
  const recommendationIndicators = useMemo(() => {
    if (itemsToCompare.length < 2) return null;
    
    // Sort items by price
    const sortedByPrice = [...itemsToCompare].sort((a, b) => a.price - b.price);
    const sortedByRating = [...itemsToCompare].sort((a, b) => b.rating - a.rating);

    return {
      budgetChoice: sortedByPrice[0],
      premiumChoice: sortedByPrice[sortedByPrice.length - 1],
      bestChoice: sortedByRating[0]
    };
  }, [itemsToCompare]);

  const handleAddId = () => {
    const unselected = allProducts.find(p => !selectedIds.includes(p._id));
    if (unselected) {
      setSelectedIds(prev => [...prev, unselected._id]);
    }
  };

  const handleRemoveId = (idx: number) => {
    if (selectedIds.length <= 1) {
      alert("Please maintain at least one product for specification auditing.");
      return;
    }
    setSelectedIds(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSelectChange = (val: string, idx: number) => {
    setSelectedIds(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
              Spec Auditing Engine
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Sliders className="w-8 h-8 text-[#ff9900]" />
              AI Specification Matrix
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Audit and compare technical parameters across multiple hardware modules concurrently.
            </p>
          </div>

          <button
            onClick={handleAddId}
            disabled={selectedIds.length >= 4}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#ff9900]" />
            Add Product Column
          </button>
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {selectedIds.map((id, idx) => (
            <div key={idx} className="p-4 border border-white/5 bg-black/40 rounded-2xl flex gap-2 items-center">
              <select
                value={id}
                onChange={(e) => handleSelectChange(e.target.value, idx)}
                className="flex-1 bg-transparent border-none text-white focus:outline-none capitalize truncate"
              >
                {allProducts.map(p => (
                  <option key={p._id} value={p._id} className="bg-[#0f172a] text-white">{p.brand} - {p.name}</option>
                ))}
              </select>
              <button 
                onClick={() => handleRemoveId(idx)}
                className="p-1 hover:text-red-400 text-gray-500 cursor-pointer transition-colors"
                title="Remove Column"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Matrix Grid */}
        {itemsToCompare.length > 0 && (
          <div className="glass-panel border border-white/10 rounded-3xl p-6 overflow-x-auto custom-scrollbar">
            <table className="w-full font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-2 text-left text-gray-500 uppercase text-[10px] w-48">Parameter</th>
                  {itemsToCompare.map((item, idx) => (
                    <th key={idx} className="py-4 px-4 text-left w-64 min-w-[200px]">
                      <span className="text-[9px] uppercase tracking-widest text-[#ff9900] font-bold block">{item.brand}</span>
                      <h4 className="text-sm font-black capitalize text-white truncate">{item.name}</h4>
                      <span className="text-xs text-gray-400 mt-0.5 block">${item.price}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Meta details */}
                <tr>
                  <td className="py-3 px-2 text-gray-500 font-bold uppercase text-[9px]">Platform Rating</td>
                  {itemsToCompare.map((item, idx) => (
                    <td key={idx} className="py-3 px-4 text-white font-bold">
                      {item.rating} ★ <span className="text-gray-500 font-normal">({item.numReviews} audits)</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-2 text-gray-500 font-bold uppercase text-[9px]">AI Quality Score</td>
                  {itemsToCompare.map((item, idx) => (
                    <td key={idx} className="py-3 px-4">
                      <span className="text-emerald-400 font-black">{Math.round(item.rating * 20)} / 100</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-2 text-gray-500 font-bold uppercase text-[9px]">Value Index</td>
                  {itemsToCompare.map((item, idx) => {
                    const valIndex = Math.min(100, Math.max(30, Math.round((item.rating * 10) / (item.price / 400))));
                    return (
                      <td key={idx} className="py-3 px-4 font-bold text-white">
                        {valIndex} / 100
                      </td>
                    );
                  })}
                </tr>

                {/* Specs */}
                {allSpecKeys.map((key) => (
                  <tr key={key}>
                    <td className="py-3 px-2 text-gray-500 capitalize">{key}</td>
                    {itemsToCompare.map((item, idx) => (
                      <td key={idx} className="py-3 px-4 text-gray-300">
                        {item.specifications?.[key] || "Not Specified"}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Actions Row */}
                <tr>
                  <td className="py-4 px-2 text-gray-500 uppercase text-[9px]">Ecosystem Actions</td>
                  {itemsToCompare.map((item, idx) => (
                    <td key={idx} className="py-4 px-4">
                      <button
                        onClick={() => {
                          dispatch(addToCartAction({
                            id: item._id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                            image: item.images?.[0] || ""
                          }));
                          alert(`${item.name} added to cart!`);
                        }}
                        className="px-4 py-2 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase text-[9px] tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Claim Spec
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* AI Recommendations Cards */}
        {recommendationIndicators && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl text-left space-y-2">
              <span className="text-[9px] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded font-bold">
                AI BEST RATING CHOICE
              </span>
              <h4 className="text-sm font-black text-white capitalize">{recommendationIndicators.bestChoice?.name}</h4>
              <p className="text-gray-400 text-[11px] font-light leading-normal">
                Features the highest rating density score ({recommendationIndicators.bestChoice?.rating} ★) compiled in verified customer reviews.
              </p>
            </div>

            <div className="p-5 border border-cyan-500/20 bg-cyan-500/5 rounded-3xl text-left space-y-2">
              <span className="text-[9px] uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded font-bold">
                AI premium CHOICE
              </span>
              <h4 className="text-sm font-black text-white capitalize">{recommendationIndicators.premiumChoice?.name}</h4>
              <p className="text-gray-400 text-[11px] font-light leading-normal">
                The ultimate configuration. Packs high bandwidth architectures and massive VRAM limits.
              </p>
            </div>

            <div className="p-5 border border-[#ff9900]/20 bg-[#ff9900]/5 rounded-3xl text-left space-y-2">
              <span className="text-[9px] uppercase bg-[#ff9900]/10 border border-[#ff9900]/20 text-[#ff9900] px-2.5 py-0.5 rounded font-bold">
                AI VALUE / BUDGET CHOICE
              </span>
              <h4 className="text-sm font-black text-white capitalize">{recommendationIndicators.budgetChoice?.name}</h4>
              <p className="text-gray-400 text-[11px] font-light leading-normal">
                Offers solid compile outputs while maintaining low amortization and investment scales.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
