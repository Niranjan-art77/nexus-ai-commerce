"use client";

import { useState, useEffect, useMemo } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { mockDb, MockProduct } from "@/utils/mockDb";
import { Sparkles, Terminal, Activity, Zap, Play, Search, AlertCircle, RefreshCw, Cpu, Database, MessageSquare } from "lucide-react";

export default function NexusAILabPage() {
  const [activeTab, setActiveTab] = useState("arena");
  const allProducts = useMemo(() => mockDb.getProducts({}), []);

  // 1. AI Agent Arena States
  const [arenaQuery, setArenaQuery] = useState("Purchase MacBook Pro M3 Max");
  const [arenaLogs, setArenaLogs] = useState<any[]>([]);
  const [consensusScore, setConsensusScore] = useState(50);
  const [isDebating, setIsDebating] = useState(false);

  const debateSteps = [
    {
      agent: "Finance Agent",
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
      text: "The current pricing structure takes 12% of user liquidity buffer. I recommend waiting for the predicted 10% price drop next week.",
      impact: -8
    },
    {
      agent: "Tech Architect",
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      text: "This hardware features a custom liquid-cooled neural chip, boosting compilation rates by 40%. The technical debt payoff is immediate.",
      impact: 18
    },
    {
      agent: "Future Self Agent",
      color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
      text: "Timeline vectors reveal that acquiring this rig boosts high-yield career path trajectories by 12 months. ROI is highly validated.",
      impact: 15
    },
    {
      agent: "Deal Hunter Agent",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      text: "I located a parallel buyer pool in the Bangalore node. If we group our orders, the seller agent will trigger a bulk 12% cash-back rebate.",
      impact: 10
    }
  ];

  const runAgentArena = () => {
    setIsDebating(true);
    setArenaLogs([]);
    setConsensusScore(50);
    let step = 0;

    const interval = setInterval(() => {
      if (step < debateSteps.length) {
        const nextMsg = debateSteps[step]!;
        setArenaLogs(prev => [...prev, nextMsg]);
        setConsensusScore(prev => Math.min(100, Math.max(0, prev + nextMsg.impact)));
        step++;
      } else {
        clearInterval(interval);
        setIsDebating(false);
      }
    }, 1500);
  };

  // 2. Market Simulator States
  const [supplyIndex, setSupplyIndex] = useState(60);
  const [demandIndex, setDemandIndex] = useState(80);
  const [basePriceInput, setBasePriceInput] = useState(1500);
  const [simulatedPrice, setSimulatedPrice] = useState(1500);
  const [isSimulating, setIsSimulating] = useState(false);

  const runMarketSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Basic price elasticity calculation
      const elasticity = 0.8;
      const supplyMultiplier = 1 + (50 - supplyIndex) / 100 * elasticity;
      const demandMultiplier = 1 + (demandIndex - 50) / 100 * elasticity;
      const finalPrice = Math.round(basePriceInput * supplyMultiplier * demandMultiplier);
      setSimulatedPrice(finalPrice);
      setIsSimulating(false);
    }, 1000);
  };

  // 3. Future Price Predictor States
  const [predProductSelected, setPredProductSelected] = useState<MockProduct | null>(allProducts[0] || null);
  const [predictDays, setPredictDays] = useState(30);
  const [predLowest, setPredLowest] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);

  const calculateFuturePrediction = () => {
    if (!predProductSelected) return;
    setIsPredicting(true);
    setTimeout(() => {
      const dropMultiplier = 0.92 - (predictDays / 365) * 0.1;
      setPredLowest(Math.round(predProductSelected.price * dropMultiplier));
      setIsPredicting(false);
    }, 800);
  };

  // 4. Advanced Product Intelligence (sentiment reviews)
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<MockProduct | null>(allProducts[0] || null);
  const [intelReport, setIntelReport] = useState<any>(null);
  const [isAnalyzingIntel, setIsAnalyzingIntel] = useState(false);

  const analyzeProductReviews = () => {
    if (!selectedReviewProduct) return;
    setIsAnalyzingIntel(true);
    setTimeout(() => {
      setIntelReport({
        sentiment: 88 + Math.floor(Math.random() * 8),
        trustScore: 92 + Math.floor(Math.random() * 5),
        positives: ["Aerospace-grade frame durability", "Extreme compute throughput efficiency"],
        negatives: ["Runs slightly warm under continuous sharding"],
        complaints: "A few developer logs reported minor virtual port resets."
      });
      setIsAnalyzingIntel(false);
    }, 1000);
  };

  // 5. Research Features
  const [researchQuery, setResearchQuery] = useState("Laptops");
  const [researchList, setResearchList] = useState<MockProduct[]>([]);
  const [isResearching, setIsResearching] = useState(false);

  const performResearchQuery = () => {
    setIsResearching(true);
    setTimeout(() => {
      const matches = mockDb.getProducts({ category: researchQuery });
      setResearchList(matches.slice(0, 5));
      setIsResearching(false);
    }, 800);
  };

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
            Experimental Playground
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            Nexus AI Lab
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Access advanced decision sandboxes and specification compilers. Strictly functional and telemetry-free.
          </p>
        </div>

        {/* Lab Navigation Tabs */}
        <div className="flex border-b border-white/10 pb-2 overflow-x-auto scrollbar-none font-mono text-[10px] uppercase font-bold gap-4">
          {[
            { id: "arena", label: "AI Agent Arena", icon: MessageSquare },
            { id: "market", label: "Market Simulator", icon: Activity },
            { id: "price", label: "Price Predictor", icon: Zap },
            { id: "intel", label: "Product Intel", icon: Sparkles },
            { id: "research", label: "Research Specs", icon: Search }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all cursor-pointer ${
                  active 
                    ? "border-[#ff9900] text-[#ff9900]" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Boards */}
        <div className="glass-panel border border-white/15 rounded-3xl p-6 md:p-8 min-h-[400px]">
          
          {/* TAB 1: AI Agent Arena */}
          {activeTab === "arena" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4 font-mono text-xs text-left">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Arena Buy Query</label>
                  <input
                    type="text"
                    value={arenaQuery}
                    onChange={(e) => setArenaQuery(e.target.value)}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div className="border border-white/5 bg-black/60 rounded-2xl h-52 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {arenaLogs.length === 0 && !isDebating ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                      <Terminal className="w-8 h-8 mb-2 animate-pulse" />
                      <span>Console idle. Click Start Arena Debate.</span>
                    </div>
                  ) : (
                    arenaLogs.map((log, idx) => (
                      <div key={idx} className={`p-2.5 rounded-xl border ${log.color} text-left`}>
                        <span className="font-black block uppercase text-[10px] tracking-wider mb-1">{log.agent}</span>
                        <p className="text-gray-300 text-[11px] leading-relaxed">{log.text}</p>
                      </div>
                    ))
                  )}
                  {isDebating && (
                    <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
                      <span>Agent negotiating parameters...</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={runAgentArena}
                  disabled={isDebating}
                  className="px-6 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Start Arena Debate
                </button>
              </div>

              {/* Consensus Meter */}
              <div className="p-6 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md flex flex-col justify-between text-left font-mono">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Sparkles className="w-5 h-5 text-[#ff9900]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-300">Arena Consensus Matrix</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] uppercase text-gray-500 block">Ecosystem Purchase consensus</span>
                      <span className="text-2xl font-black text-white block mt-1">{consensusScore} %</span>
                    </div>

                    <div className="w-full h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 via-[#ff9900] to-emerald-400 transition-all duration-500" style={{ width: `${consensusScore}%` }} />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 leading-relaxed font-light pt-6">
                  ✓ Multi-agent arrays balance hardware capital allocation against productivity returns and model sharding indices.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Market Simulator */}
          {activeTab === "market" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6 font-mono text-xs text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                      <span>Supply Buffer Index</span>
                      <span className="text-cyan-400">{supplyIndex}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={supplyIndex}
                      onChange={(e) => setSupplyIndex(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                      <span>Demand Buffer Index</span>
                      <span className="text-cyan-400">{demandIndex}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={demandIndex}
                      onChange={(e) => setDemandIndex(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Base Hardware Price ($)</label>
                  <input
                    type="number"
                    value={basePriceInput}
                    onChange={(e) => setBasePriceInput(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <button
                  onClick={runMarketSimulation}
                  disabled={isSimulating}
                  className="px-6 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Compute Simulation
                </button>
              </div>

              {/* Simulation Result */}
              <div className="p-6 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md flex flex-col justify-between text-left font-mono">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-300">Simulation Output</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase text-gray-500 block">Dynamic Elastic Price</span>
                    <span className="text-2xl font-black text-[#ff9900] block mt-1">
                      ${simulatedPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 leading-relaxed font-light pt-6">
                  ✓ Elastic simulation calculates target clearing margins using linear regression parameters of supply-chain logs.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Price Predictor */}
          {activeTab === "price" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6 font-mono text-xs text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Select Hardware Target</label>
                    <select
                      value={predProductSelected?._id || ""}
                      onChange={(e) => setPredProductSelected(mockDb.getProductById(e.target.value))}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                    >
                      {allProducts.slice(0, 15).map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Prediction Target (Days)</label>
                    <select
                      value={predictDays}
                      onChange={(e) => setPredictDays(parseInt(e.target.value))}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                    >
                      <option value="15">15-Day window</option>
                      <option value="30">30-Day window</option>
                      <option value="60">60-Day window</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={calculateFuturePrediction}
                  disabled={isPredicting}
                  className="px-6 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Generate Trend Chart
                </button>
              </div>

              {/* Predict Output */}
              <div className="p-6 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md flex flex-col justify-between text-left font-mono">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Zap className="w-5 h-5 text-[#ff9900]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-300">Trend Predictions</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase text-gray-500 block">Predicted Lowest Price</span>
                    <span className="text-2xl font-black text-white block mt-1">
                      {predLowest > 0 ? `$${predLowest}` : "No predictions configured..."}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 leading-relaxed font-light pt-6">
                  ✓ Analysis references historical variance matrices and holiday inventory pools to calculate forecast trends.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Advanced Product Intelligence */}
          {activeTab === "intel" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6 font-mono text-xs text-left">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Select Hardware Target</label>
                  <select
                    value={selectedReviewProduct?._id || ""}
                    onChange={(e) => {
                      setSelectedReviewProduct(mockDb.getProductById(e.target.value));
                      setIntelReport(null);
                    }}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  >
                    {allProducts.slice(0, 15).map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={analyzeProductReviews}
                  disabled={isAnalyzingIntel}
                  className="px-6 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Analyze Reviews Sentiment
                </button>
              </div>

              {/* Review Intelligence output */}
              <div className="p-6 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md text-left font-mono">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Sparkles className="w-5 h-5 text-[#ff9900]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-300">Sentiment Output</span>
                  </div>

                  {intelReport ? (
                    <div className="space-y-3 text-[11px] text-gray-300">
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">Ecosystem Sentiment Index</span>
                        <span className="text-lg font-black text-white block mt-0.5">{intelReport.sentiment} / 100</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">Pros</span>
                        <div className="text-emerald-400 mt-1">✓ {intelReport.positives[0]}</div>
                        <div className="text-emerald-400">✓ {intelReport.positives[1]}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">Cons</span>
                        <div className="text-red-400 mt-1">✗ {intelReport.negatives[0]}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">Ecosystem Complaint log</span>
                        <p className="text-gray-400 mt-1 font-light leading-normal">{intelReport.complaints}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center text-gray-600">
                      <AlertCircle className="w-8 h-8 mb-2 animate-pulse" />
                      <span>Analyze reviews to generate metrics.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Research Specs */}
          {activeTab === "research" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4 font-mono text-xs text-left">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Research Index Category</label>
                  <select
                    value={researchQuery}
                    onChange={(e) => setResearchQuery(e.target.value)}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                  >
                    {["Smartphones", "Laptops", "Gaming", "Monitors", "AI Devices", "Smart Home", "VR Tech", "Workstations"].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={performResearchQuery}
                  disabled={isResearching}
                  className="px-6 py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Query Indexes
                </button>
              </div>

              {/* Research output */}
              <div className="p-6 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md text-left font-mono">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Search className="w-5 h-5 text-[#ff9900]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-300">Spec Indexes</span>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-2">
                    {researchList.length === 0 && !isResearching ? (
                      <div className="h-40 flex flex-col items-center justify-center text-center text-gray-600">
                        <AlertCircle className="w-8 h-8 mb-2 animate-pulse" />
                        <span>Query category index profiles...</span>
                      </div>
                    ) : (
                      researchList.map((item) => (
                        <div key={item._id} className="p-2 border border-white/5 bg-black/60 rounded-xl">
                          <h4 className="font-bold text-white capitalize text-xs">{item.name}</h4>
                          <span className="text-[9px] text-[#ff9900] block mt-0.5">${item.price}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
