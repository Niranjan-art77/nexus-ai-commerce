"use client";

import { useState, useMemo, useEffect } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { mockDb, MockProduct } from "@/utils/mockDb";
import { TrendingUp, AlertCircle, HelpCircle } from "lucide-react";

export default function PriceTrackerPage() {
  const allProducts = useMemo(() => mockDb.getProducts({}), []);
  
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
  const [targetPrice, setTargetPrice] = useState("");
  const [discountThreshold, setDiscountThreshold] = useState("10");
  const [alertType, setAlertType] = useState("email");
  const [alertConfigured, setAlertConfigured] = useState(false);

  useEffect(() => {
    if (allProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(allProducts[0] || null);
    }
  }, [allProducts, selectedProduct]);

  const predictions = useMemo(() => {
    if (!selectedProduct) return null;
    const price = selectedProduct.price;
    return {
      current: price,
      predictedLowest: Math.round(price * 0.88),
      confidence: 85 + Math.floor(Math.random() * 12),
      bestTimeToBuy: "Next week (Predicted drop incoming)",
      history: [
        { label: "March", price: Math.round(price * 1.15) },
        { label: "April", price: Math.round(price * 1.05) },
        { label: "May (Current)", price },
        { label: "June (Predict)", price: Math.round(price * 0.88), drop: true }
      ]
    };
  }, [selectedProduct]);

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
              Price Intelligence Engine
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-[#ff9900]" />
              Price Prediction Center
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Configure smart price alert thresholds and inspect historical pricing amortization cycles.
            </p>
          </div>

          <div className="font-mono text-xs w-full sm:w-72">
            <select
              value={selectedProduct?._id || ""}
              onChange={(e) => {
                const p = mockDb.getProductById(e.target.value);
                setSelectedProduct(p);
                setAlertConfigured(false);
              }}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            >
              {allProducts.slice(0, 20).map(p => (
                <option key={p._id} value={p._id}>{p.brand} - {p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedProduct && predictions && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel border border-white/15 rounded-3xl p-6 text-left space-y-4">
                <h3 className="text-xs font-mono uppercase text-gray-400 font-bold">Historical & Predicted Price Trajectory</h3>

                <div className="h-48 flex items-end justify-between border-b border-l border-white/10 p-2 relative font-mono text-xs">
                  <div className="absolute top-2 right-2 text-[8px] bg-red-950 text-red-400 border border-red-500/20 px-2 py-0.5 rounded animate-pulse">
                    BUY SIGNAL STABLE
                  </div>

                  {predictions.history.map((col, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 w-1/4">
                      <span className={`text-[10px] font-bold ${col.drop ? "text-[#ff9900]" : "text-white"}`}>
                        ${col.price}
                      </span>
                      <div 
                        className={`w-12 rounded-t-lg transition-all duration-1000 ${
                          col.drop ? "bg-gradient-to-t from-[#ff9900] to-[#ffb700] shadow-[0_0_15px_rgba(255,153,0,0.1)]" : "bg-white/15"
                        }`}
                        style={{ height: `${Math.round(col.price / (selectedProduct.price * 1.3) * 120)}px` }}
                      />
                      <span className="text-[9px] text-gray-500">{col.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail specs prediction indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-left">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Expected lowest price</span>
                  <span className="text-lg font-black text-white block mt-1">${predictions.predictedLowest}</span>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-left">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Confidence Percentage</span>
                  <span className="text-lg font-black text-white block mt-1">{predictions.confidence}%</span>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-left">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Best purchase date</span>
                  <span className="text-[10px] font-bold text-[#ff9900] block mt-1.5">{predictions.bestTimeToBuy}</span>
                </div>
              </div>
            </div>

            {/* Smart Alerts configurations */}
            <div className="p-6 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md flex flex-col justify-between text-left font-mono h-full min-h-[350px]">
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <AlertCircle className="w-5 h-5 text-[#ff9900]" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-gray-300">Target Alerts Portal</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] text-gray-500 block mb-1">Target Price Alert ($)</label>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder={`e.g. ${Math.round(selectedProduct.price * 0.85)}`}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-500 block mb-1">Target Discount Alert (%)</label>
                    <select
                      value={discountThreshold}
                      onChange={(e) => setDiscountThreshold(e.target.value)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
                    >
                      <option value="5">Exceeds 5% off</option>
                      <option value="10">Exceeds 10% off</option>
                      <option value="15">Exceeds 15% off</option>
                      <option value="20">Exceeds 20% off</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-500 block mb-1">Notification gateway</label>
                    <div className="flex gap-2">
                      {["email", "sms", "browser"].map(type => (
                        <button
                          key={type}
                          onClick={() => setAlertType(type)}
                          className={`flex-1 py-1.5 border rounded-lg uppercase text-[9px] font-bold text-center cursor-pointer transition-all ${
                            alertType === type 
                              ? "bg-[#ff9900]/10 border-[#ff9900]/40 text-[#ff9900]" 
                              : "bg-transparent border-white/5 text-gray-400 hover:bg-white/5"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!targetPrice.trim()) {
                    alert("Please specify a target threshold price.");
                    return;
                  }
                  setAlertConfigured(true);
                  alert(`Alert successfully configured via standard ${alertType} gateway!`);
                }}
                className={`w-full mt-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer text-center ${
                  alertConfigured 
                    ? "bg-emerald-500 text-black" 
                    : "bg-[#ff9900] text-black hover:bg-[#ffb700]"
                }`}
              >
                {alertConfigured ? "✓ Tracker Active" : "Initialize Price Alert"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
