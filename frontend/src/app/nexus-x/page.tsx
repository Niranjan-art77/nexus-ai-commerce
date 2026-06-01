"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { mockDb } from "@/utils/mockDb";
import { NavBar } from "@/components/ui/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Terminal, Activity, Zap, Shield, GitBranch, MessageSquare, Briefcase,
  UserCheck, Search, ShoppingBag, TrendingUp, AlertCircle, Play, Sliders, ShieldAlert,
  ArrowRight, Check, Heart, Cpu, Compass, HelpCircle, Layers, Globe2, Database, RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid
} from "recharts";

export default function NexusXDetailedDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  // Active section for sidebar jumping
  const [activeHUDSection, setActiveHUDSection] = useState("COMMAND");

  // Proxy Negotiator States
  const [budgetPriority, setBudgetPriority] = useState(80);
  const [qualityPriority, setQualityPriority] = useState(70);
  const [assetClass, setAssetClass] = useState("ServerCore");
  const [vendorPrice, setVendorPrice] = useState(320);
  const [targetPrice, setTargetPrice] = useState(180);
  const [negotiating, setNegotiating] = useState(false);
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeStatus, setActiveStatus] = useState("Idle");

  // Telemetry Dashboard States
  const [telemetry, setTelemetry] = useState({
    neuralSync: 98.4,
    activeAgents: 1420,
    quantumLoad: 42,
    simulatedTimelines: 120539
  });

  // 1. Universal Product Intelligence Engine States
  const [searchQuery, setSearchQuery] = useState("Quantum Phone");
  const [searchReport, setSearchReport] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // 2. AI Command Center Logging Feed State
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "[09:12:04] [SYSTEM_BOOT] Nexus AI Commerce Operating System v4.12 initialized.",
    "[09:12:05] [NEURAL_LINK] Brainwave telemetry calibrated. Sync established.",
    "[09:12:06] [QUANTUM_GRID] Parallel futures projected; 1,294 scenarios resolved.",
    "[09:12:08] [COGNITIVE_TWIN] Autonomous negotiator running concession loops on Amazon endpoints.",
  ]);

  // 3. Agent Battle Arena States
  const [arenaQuery, setArenaQuery] = useState("Purchase Nexus AeroBook Pro");
  const [arenaMessages, setArenaMessages] = useState<any[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [consensusScore, setConsensusScore] = useState(50);
  const [arenaStep, setArenaStep] = useState(0);

  // 4. Future Self Simulator States
  const [timelineValue, setTimelineValue] = useState(5);
  const [simulatorData, setSimulatorData] = useState<any>({
    year: 2031,
    career: "Neuro-Cybernetics Architect",
    skills: ["Synaptic Interface Mapping", "Biological Logic Grids", "Quantum Computing v2"],
    procurements: [
      { name: "AeroBook Pro", desc: "Core neural processing rig", price: "$2,499" },
      { name: "Quest VR Node", desc: "Immersion development node", price: "$1,199" }
    ],
    graph: [
      { name: "2026", worth: 85, aura: 60 },
      { name: "2031", worth: 180, aura: 85 },
      { name: "2036", worth: 320, aura: 110 },
      { name: "2041", worth: 680, aura: 145 },
      { name: "2046", worth: 1200, aura: 190 },
      { name: "2051", worth: 2400, aura: 240 }
    ]
  });

  // 5. Digital Twin Lab States
  const [twinConfig, setTwinConfig] = useState({
    riskAppetite: 70,
    ethicalBias: 85,
    budgetBuffer: 15,
  });
  const [twinLogs, setTwinLogs] = useState([
    "Dispatched negotiating proxy for Memory module.",
    "Refused Croma-Seller-A deal due to high carbon score.",
    "Synchronized browsing history. Shifted interest weight to VR/AR.",
    "Locked in 8% discount on secondary computing unit."
  ]);

  // 6. Opportunity Radar States
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>({
    title: "14% Discount on Nexus VR Headset",
    type: "Product Arbitrage",
    desc: "Active arbitrage found. Pre-negotiated discount on Nexus Store. Resell potential on Myntra yields 18% net margin.",
    action: "Deploy Twin to Buy",
    x: 40,
    y: 35
  });

  // 7. Reality Sandbox States
  const [sandboxProduct, setSandboxProduct] = useState("Nexus AeroBook Pro");
  const [sandboxInvestment, setSandboxInvestment] = useState(12); // months amortization
  const [sandboxMetrics, setSandboxMetrics] = useState<any[]>([
    { name: "Capital Worth", before: 80, after: 68 },
    { name: "Skill Acceleration", before: 40, after: 88 },
    { name: "Cognitive Load", before: 30, after: 65 },
    { name: "Aura / Peer Status", before: 50, after: 90 }
  ]);

  // 8. Global Market Radar Ticker Feed
  const [marketTrends, setMarketTrends] = useState([
    { code: "NEXUS", val: "+14.8%", status: "up" },
    { code: "AMZN", val: "+2.4%", status: "up" },
    { code: "FLIP", val: "-1.1%", status: "down" },
    { code: "MYNT", val: "+4.2%", status: "up" },
    { code: "RELIANCE", val: "-0.5%", status: "down" }
  ]);

  // 9. Autonomous Shopping Engine States
  const [autoBuyProduct, setAutoBuyProduct] = useState("Nexus Companion Hub");
  const [autoBuyTarget, setAutoBuyTarget] = useState(500);
  const [autoBuyStatus, setAutoBuyStatus] = useState<string>("INACTIVE");

  // 10. Nexus Intelligence Feed Alerts
  const [alertsFeed, setAlertsFeed] = useState([
    { id: 1, title: "Supply Chain Congestion Alert", msg: "AeroBook Pro processors experiencing logistics delays in Chennai node. Price volatility incoming." },
    { id: 2, title: "Career Path Arbitrage Detected", msg: "Demand for Synaptic Interface developers increased by 42%. Aligning simulator purchase path." },
    { id: 3, title: "Consolidated Discount Triggered", msg: "8 other user twins have combined bids for VR headset. Bulk discount rate of 18% available now." }
  ]);

  // Telemetry loop & log loop
  useEffect(() => {
    setMounted(true);
    handleProductSearch("Quantum Phone");

    const telemetryInterval = setInterval(() => {
      setTelemetry(prev => ({
        neuralSync: parseFloat((98.0 + Math.random() * 1.5).toFixed(2)),
        activeAgents: prev.activeAgents + (Math.random() > 0.55 ? 1 : -1),
        quantumLoad: Math.floor(35 + Math.random() * 18),
        simulatedTimelines: prev.simulatedTimelines + Math.floor(Math.random() * 8)
      }));
    }, 2000);

    const logs = [
      "[NEURAL_LINK] Sync convergence stable at alpha waves.",
      "[COGNITIVE_TWIN] Simulated buy of Laptops. Output ROI converged at +12%.",
      "[GLOBAL_RADAR] Monitored Myntra prices. Trend margin converging.",
      "[ARENA] Debating purchase node user-10294; waiting for Finance agent response.",
      "[QUANTUM_GRID] Simulation matrix complete for career node: Quantum Engineer.",
      "[AUTONOMOUS] Dispatched wait-bid for Companion Hub."
    ];

    const logInterval = setInterval(() => {
      const time = new Date().toTimeString().split(' ')[0];
      const randomLog = logs[Math.floor(Math.random() * logs.length)]!;
      setSystemLogs(prev => [`[${time}] ${randomLog}`, ...prev.slice(0, 15)]);
    }, 4500);

    // Opportunity Radar rotation animation loop
    const radarInterval = setInterval(() => {
      setRadarSweepAngle(prev => (prev + 3) % 360);
    }, 50);

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(logInterval);
      clearInterval(radarInterval);
    };
  }, []);

  // Intersection Observer for Sidebar Scroll Spy
  useEffect(() => {
    if (!mounted) return;

    const sectionIds = [
      "COMMAND", "INTELLIGENCE", "ARENA", "NEGOTIATOR", "DESTINY",
      "TWIN", "RADAR", "SANDBOX", "GLOBAL", "AUTONOMOUS", "FEED"
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveHUDSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [mounted]);

  // 1. Search Logic
  const handleProductSearch = (query: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const results = mockDb.getProducts({ search: query });
      let matchedProd = results[0];

      if (!matchedProd) {
        matchedProd = mockDb.getProducts({})[0];
      }

      if (matchedProd) {
        const basePrice = matchedProd.price;
        const discountPercentage = matchedProd.discount || 10;
        const orgPrice = Math.round(basePrice / (1 - discountPercentage / 100));

        setSearchReport({
          product: matchedProd,
          nexusPrice: basePrice,
          amazonPrice: Math.round(basePrice * 1.18),
          flipkartPrice: Math.round(basePrice * 1.15),
          reliancePrice: Math.round(basePrice * 1.20),
          dropChance: 75 + Math.floor(Math.random() * 20),
          dropTime: "3-5 days",
          aiScore: 92,
          priceHistory: [
            { month: "Mar", price: orgPrice * 1.05 },
            { month: "Apr", price: orgPrice },
            { month: "May (Current)", price: basePrice },
            { month: "Jun (Predict)", price: basePrice * 0.9 }
          ],
          aiVerdict: `Highly Recommended. Buying this item directly via Nexus saves up to 18% compared to standard Amazon listings. The built-in AI Copilot has pre-negotiated priority delivery.`
        });
      }
      setIsSearching(false);
    }, 800);
  };

  // 3. Agent Battle Debate Sequence
  const debateSteps = [
    {
      agent: "Finance Agent",
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
      text: "The current pricing structure takes 14% of user liquidity buffer. I recommend waiting for the predicted 10% price drop on Friday.",
      impact: -5
    },
    {
      agent: "Tech Agent",
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      text: "This hardware upgrade features a custom liquid-cooled neural chip, increasing workflow compilation speeds by 40%. The technical debt payoff is instant.",
      impact: 18
    },
    {
      agent: "Future Self Agent",
      color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
      text: "Simulations reveal that acquiring this hardware boosts high-yield career path trajectories by 14 months. ROI timeline is highly validated.",
      impact: 15
    },
    {
      agent: "Deal Hunter Agent",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      text: "I found a parallel buyer pool in the Bangalore node. If we group our orders, the seller agent will trigger a bulk 12% cash-back rebate.",
      impact: 10
    },
    {
      agent: "Sustainability Agent",
      color: "text-lime-400 border-lime-500/20 bg-lime-500/5",
      text: "Constructed using 85% post-consumer composites and shipped via carbon-offset autonomous grids. Overall ecosystem score is rated A+.",
      impact: 5
    }
  ];

  const runAgentDebate = () => {
    setIsDebating(true);
    setArenaMessages([]);
    setConsensusScore(50);
    let step = 0;

    const interval = setInterval(() => {
      if (step < debateSteps.length) {
        const nextMsg = debateSteps[step]!;
        setArenaMessages(prev => [...prev, nextMsg]);
        setConsensusScore(prev => Math.min(100, Math.max(0, prev + nextMsg.impact)));
        step++;
      } else {
        clearInterval(interval);
        setIsDebating(false);
      }
    }, 1800);
  };

  // 4. Future Self Timeline Slider Change
  const handleTimelineChange = (val: number) => {
    setTimelineValue(val);
    const targetYear = 2026 + val;
    let career = "Tech Support Specialist";
    let skills: string[] = [];
    let procurements: any[] = [];
    let scaleMultiplier = 1;

    if (val < 8) {
      career = "Lead Synthetic Interface Designer";
      skills = ["Synaptic Mapping", "React Quantum Frameworks", "Node UI Structuring"];
      procurements = [
        { name: "AeroBook Pro", desc: "Core neural processing rig", price: "$2,499" },
        { name: "Quest VR Node", desc: "Immersion development node", price: "$1,199" }
      ];
      scaleMultiplier = 1.2;
    } else if (val < 16) {
      career = "Autonomous System Architect";
      skills = ["Multi-Agent Protocol Orchestration", "Decentralized Liquidity Staking", "LLM Model Compilation"];
      procurements = [
        { name: "Nexus Workstation Pro", desc: "64-Core master compiler node", price: "$4,299" },
        { name: "Haptic Sensor Suit", desc: "Reality simulator bio-feedback link", price: "$1,899" }
      ];
      scaleMultiplier = 2.4;
    } else {
      career = "Reality Intelligence Director";
      skills = ["Temporal Timeline Vectoring", "Simulated Economics Regulation", "Synthetic Species Orchestration"];
      procurements = [
        { name: "Nexus Quantum Core Terminal", desc: "Entanglement link grid node", price: "$8,990" },
        { name: "Bio-Neural Interface Kit", desc: "Direct cerebral network adapter", price: "$3,499" }
      ];
      scaleMultiplier = 5.8;
    }

    setSimulatorData({
      year: targetYear,
      career,
      skills,
      procurements,
      graph: [
        { name: "2026", worth: 85 * scaleMultiplier, aura: 60 * scaleMultiplier },
        { name: "2031", worth: 180 * scaleMultiplier, aura: 85 * scaleMultiplier },
        { name: "2036", worth: 320 * scaleMultiplier, aura: 110 * scaleMultiplier },
        { name: "2041", worth: 680 * scaleMultiplier, aura: 145 * scaleMultiplier },
        { name: "2046", worth: 1200 * scaleMultiplier, aura: 190 * scaleMultiplier },
        { name: "2051", worth: 2400 * scaleMultiplier, aura: 240 * scaleMultiplier }
      ]
    });
  };

  // 6. Opportunity Radar Click
  const handleRadarClick = (x: number, y: number, name: string, type: string, desc: string, action: string) => {
    setSelectedOpportunity({ title: name, type, desc, action, x, y });
  };

  // 7. Reality Sandbox Simulation Run
  const runSandboxSimulation = () => {
    const isHighInvestment = sandboxInvestment > 10;
    const factor = isHighInvestment ? 1.3 : 0.85;

    setSandboxMetrics([
      { name: "Capital Worth", before: 80, after: Math.round(80 - (20 * (12 / sandboxInvestment))) },
      { name: "Skill Acceleration", before: 40, after: Math.round(Math.min(98, 40 + (35 * factor))) },
      { name: "Cognitive Load", before: 30, after: Math.round(30 + (25 * factor)) },
      { name: "Aura / Peer Status", before: 50, after: Math.round(Math.min(95, 50 + (30 * factor))) }
    ]);
  };

  // Dispatch Auto-buy
  const dispatchAutoBuy = () => {
    setAutoBuyStatus("ACTIVE");
    setTimeout(() => {
      setAutoBuyStatus("MONITORING (Twin active)");
      setSystemLogs(prev => [`[${new Date().toTimeString().split(' ')[0]}] [AUTONOMOUS] Configured buy limit at $${autoBuyTarget} on ${autoBuyProduct}.`, ...prev]);
    }, 1000);
  };

  // Add to cart callback helper
  const handleAddProcurement = (item: any) => {
    dispatch(addToCart({
      id: "procurement-" + Math.random().toString(36).substring(2, 7),
      name: item.name,
      price: parseFloat(item.price.replace('$', '').replace(',', '')),
      quantity: 1,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80"
    }));
    alert(`${item.name} added to your procurement cart.`);
  };

  // 11. Proxy Negotiator simulation runner
  const runNegotiation = () => {
    setNegotiating(true);
    setChatLog([]);
    setChartData([]);
    setActiveStatus("Analyzing Priorities");

    let round = 1;
    let twinCurrentBid = targetPrice;
    let vendorCurrentAsk = vendorPrice;

    const assetName = assetClass === "ServerCore" ? "GPU Compute Core Node" : "Vector Database Index Shards";

    const conversationFlow = [
      {
        sender: "twin" as const,
        text: `Initializing handshake telemetry. Requesting access to ${assetName}. Valued at $${twinCurrentBid} based on historical sharding records. We propose immediate deal.`,
        bidOffset: 0,
        askOffset: 0
      },
      {
        sender: "vendor" as const,
        text: `Handshake validated. However, node capacity limits price cuts. Strict minimum boundary sits at $${vendorCurrentAsk}.`,
        bidOffset: 0,
        askOffset: 0
      },
      {
        sender: "twin" as const,
        text: `Evaluating quality factors. High active node strain observed. Conceding proposal to $${twinCurrentBid + 25}.`,
        bidOffset: 25,
        askOffset: 0
      },
      {
        sender: "vendor" as const,
        text: `Adjusting load index. Reducing ask threshold to $${vendorCurrentAsk - 30}.`,
        bidOffset: 0,
        askOffset: -30
      },
      {
        sender: "twin" as const,
        text: `Budget metrics constrained (Priority: ${budgetPriority}%). Final convergence proposed at $235.`,
        bidOffset: 30,
        askOffset: 0
      },
      {
        sender: "vendor" as const,
        text: `Agreement criteria achieved. Initializing contract seal at $235. Lock complete.`,
        bidOffset: 0,
        askOffset: -55
      }
    ];

    const executeRound = () => {
      if (round <= conversationFlow.length) {
        const step = conversationFlow[round - 1]!;
        setActiveStatus(`Running Round ${Math.ceil(round / 2)}`);

        twinCurrentBid += step.bidOffset;
        vendorCurrentAsk += step.askOffset;

        setChatLog(prev => [...prev, {
          sender: step.sender,
          text: step.text,
          round: Math.ceil(round / 2)
        }]);

        setChartData(prev => [
          ...prev,
          {
            round: Math.ceil(round / 2),
            twinBid: twinCurrentBid,
            vendorAsk: vendorCurrentAsk
          }
        ]);

        round++;
        setTimeout(executeRound, 2000);
      } else {
        setActiveStatus("Deal Complete");
        setNegotiating(false);
        setSystemLogs(prev => [`[${new Date().toTimeString().split(' ')[0]}] [PROXY_NEGOTIATOR] Concluded contract for ${assetName} at $235. Savings: $${vendorPrice - 235}.`, ...prev]);
      }
    };

    setTimeout(executeRound, 1000);
  };



  const renderNegotiator = () => {
    const assetDetails = assetClass === "ServerCore" 
      ? { name: "Futuristic GPU-Compute Core Node", icon: Cpu }
      : { name: "Vector Database Sub-Shards Index", icon: Database };
    const AssetIcon = assetDetails.icon;

    return (
      <section id="NEGOTIATOR" className="scroll-mt-28 w-full">
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">Proxy Negotiator Playground</h2>
                  <p className="text-[10px] text-gray-400">Train your digital twin to bargain asset prices with vendor agents</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400">{activeStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sliders & Configuration */}
              <div className="space-y-4 text-left font-mono">
                <div>
                  <span className="block text-[8px] font-black uppercase tracking-widest text-gray-500 mb-2">Priority Vectors</span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Budget Optimization</span>
                        <span className="text-cyan-400">{budgetPriority}%</span>
                      </div>
                      <input
                        type="range"
                        value={budgetPriority}
                        onChange={(e) => setBudgetPriority(parseInt(e.target.value))}
                        disabled={negotiating}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Quality Threshold</span>
                        <span className="text-cyan-400">{qualityPriority}%</span>
                      </div>
                      <input
                        type="range"
                        value={qualityPriority}
                        onChange={(e) => setQualityPriority(parseInt(e.target.value))}
                        disabled={negotiating}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="block text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Asset & Contract</span>
                  <div className="space-y-2">
                    <select
                      value={assetClass}
                      onChange={(e) => setAssetClass(e.target.value)}
                      disabled={negotiating}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="ServerCore">GPU Compute Core Node</option>
                      <option value="DataRegistry">Vector Database Index Shards</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[7px] text-gray-500 block mb-0.5">Initial Ask ($)</span>
                        <input
                          type="number"
                          value={vendorPrice}
                          onChange={(e) => setVendorPrice(parseInt(e.target.value) || 0)}
                          disabled={negotiating}
                          className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <span className="text-[7px] text-gray-500 block mb-0.5">Target Bid ($)</span>
                        <input
                          type="number"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
                          disabled={negotiating}
                          className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={runNegotiation}
                  disabled={negotiating}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-black bg-[#00f0ff] hover:bg-[#00d0df] disabled:bg-gray-800 disabled:text-gray-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)] font-mono"
                >
                  {negotiating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
                  {negotiating ? "Running Negotiations" : "Launch Proxy Agent"}
                </button>
              </div>

              {/* Terminal Logs & Chart */}
              <div className="space-y-4">
                <div className="border border-white/5 bg-black/60 rounded-2xl overflow-hidden flex flex-col h-44">
                  <div className="bg-[#111827] px-3 py-1.5 border-b border-white/5 flex items-center justify-between font-mono text-[8px]">
                    <span className="text-gray-400">PROX_NEGOTIATOR_SHELL v1.42</span>
                    <span className="text-cyan-400">{activeStatus}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-mono text-[9px] custom-scrollbar">
                    {chatLog.length === 0 && !negotiating ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                        <Cpu className="w-6 h-6 mb-1 animate-pulse" />
                        <span>Console ready. Click Launch.</span>
                      </div>
                    ) : (
                      chatLog.map((log, index) => (
                        <div key={index} className={`p-2 rounded bg-white/5 border border-white/5 text-left`}>
                          <div className="flex justify-between border-b border-white/5 pb-0.5 mb-1 font-bold">
                            <span className={log.sender === "twin" ? "text-cyan-400" : "text-rose-400"}>
                              {log.sender === "twin" ? "PROX_TWIN" : "VENDOR_NODE"}
                            </span>
                            <span className="text-gray-500">Round {log.round}</span>
                          </div>
                          <p className="text-gray-300">{log.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="h-28 bg-[#111827]/40 p-2 rounded-2xl border border-white/5">
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block mb-1 text-left">Convergence Map</span>
                  {mounted && chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="80%">
                      <LineChart data={chartData} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                        <XAxis dataKey="round" stroke="#4b5563" fontSize={7} />
                        <YAxis stroke="#4b5563" fontSize={7} />
                        <Line type="monotone" dataKey="twinBid" stroke="#00f0ff" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="vendorAsk" stroke="#ef4444" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[9px] font-mono text-gray-600">
                      Convergence chart ready to plot...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className="w-full bg-[#030712] min-h-screen text-white font-sans flex flex-col relative overflow-x-hidden">
      {/* Top Navbar */}
      <NavBar />

      {/* Main Dashboard Shell */}
      <div className="w-full max-w-[1720px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 relative z-10 flex-1">
        
        {/* HUD SIDEBAR NAVIGATION DECK */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none sticky top-24 z-20">
          <div className="flex lg:flex-col w-full gap-2 bg-slate-950/80 backdrop-blur-xl border border-white/5 p-3 rounded-2xl shadow-2xl">
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 border-b border-white/5 mb-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">
                OS NAVIGATION
              </span>
            </div>

            {[
              { id: "COMMAND", label: "Command Center", icon: Terminal },
              { id: "INTELLIGENCE", label: "Product Intel", icon: Search },
              { id: "ARENA", label: "Agent Arena", icon: MessageSquare },
              { id: "NEGOTIATOR", label: "Proxy Negotiator", icon: Briefcase },
              { id: "DESTINY", label: "Destiny Simulator", icon: GitBranch },
              { id: "TWIN", label: "Digital Twin Lab", icon: UserCheck },
              { id: "RADAR", label: "Opportunity Radar", icon: Compass },
              { id: "SANDBOX", label: "Reality Sandbox", icon: Layers },
              { id: "GLOBAL", label: "Global Radar", icon: Globe2 },
              { id: "AUTONOMOUS", label: "Auto-Shopping", icon: Cpu },
              { id: "FEED", label: "System Alerts", icon: AlertCircle }
            ].map(sec => {
              const Icon = sec.icon;
              const isActive = activeHUDSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveHUDSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border text-left flex-shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-500"}`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* HUD CONTENT BOARD */}
        <div className="flex-1 space-y-8 min-w-0">
          


          {/* SECTION 2: AI COMMAND CENTER (HERO VIEW) */}
          <section id="COMMAND" className="scroll-mt-28">
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.05)]">
              {/* Outer grid decor */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 font-mono">
                        REALITY OVERLORD PROJ ACTIVE
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
                      NEXUS X <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">COMMERCE OPERATING SYSTEM</span>
                    </h1>
                    <p className="text-gray-400 text-xs mt-2 max-w-2xl leading-relaxed">
                      Orchestrating multi-agent purchase debates, simulating parallel lifetime career branches, and utilizing autonomous opportunity arbitrage twins. Rejecting traditional storefront grids for direct reality optimization.
                    </p>
                  </div>

                  {/* Telemetry metrics bar */}
                  <div className="flex flex-wrap gap-4 bg-slate-950/80 p-4 rounded-2xl border border-white/5 shadow-inner font-mono">
                    <div className="px-4 border-r border-white/5">
                      <div className="text-[8px] text-gray-500 uppercase tracking-widest">Neural Sync</div>
                      <div className="text-sm font-black text-cyan-400">{telemetry.neuralSync}%</div>
                    </div>
                    <div className="px-4 border-r border-white/5">
                      <div className="text-[8px] text-gray-500 uppercase tracking-widest">Active Agents</div>
                      <div className="text-sm font-black text-white">{telemetry.activeAgents}</div>
                    </div>
                    <div className="px-4 border-r border-white/5">
                      <div className="text-[8px] text-gray-500 uppercase tracking-widest">CPU LOAD</div>
                      <div className="text-sm font-black text-amber-500">{telemetry.quantumLoad}%</div>
                    </div>
                    <div className="px-4">
                      <div className="text-[8px] text-gray-500 uppercase tracking-widest">TEMPORAL SCRIPTS</div>
                      <div className="text-sm font-black text-purple-400">{telemetry.simulatedTimelines.toLocaleString()}</div>
                    </div>
                  </div>
                </div>



                {/* System logs feed console */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white font-mono">System Live telemetry feed</h4>
                  </div>
                  <div className="font-mono text-[10px] text-cyan-500/80 space-y-2 bg-black/60 p-4 rounded-xl border border-white/5 h-[140px] overflow-y-auto custom-scrollbar select-none">
                    {systemLogs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-cyan-600 shrink-0">&gt;&gt;</span>
                        <span className="break-all">{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TWO-COLUMN GRID OF FUNCTION WIDGETS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* MODULE 1: UNIVERSAL PRODUCT INTELLIGENCE ENGINE */}
            <section id="INTELLIGENCE" className="scroll-mt-28">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <Search className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Universal Product Intelligence</h2>
                            <p className="text-[10px] text-gray-400">Search globally across Amazon, Flipkart, Myntra, Croma, Nexus</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Enter product keyword (e.g. Phone, Laptop)"
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white font-mono"
                        />
                        <button
                          onClick={() => handleProductSearch(searchQuery)}
                          disabled={isSearching}
                          className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {isSearching ? "Crawling..." : "Inspect Engine"}
                        </button>
                      </div>

                      {searchReport && (
                        <div className="space-y-4 pt-2 text-left">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <h3 className="text-xs font-bold text-cyan-400 uppercase truncate max-w-[70%]">{searchReport.product.name}</h3>
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                              AI SCORE: {searchReport.aiScore}%
                            </span>
                          </div>

                          {/* Retailer price rows */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                            {[
                              { name: "Nexus Buy", price: `$${searchReport.nexusPrice}`, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 font-black" },
                              { name: "Amazon", price: `$${searchReport.amazonPrice}`, color: "text-gray-400 border-white/5 bg-white/5" },
                              { name: "Flipkart", price: `$${searchReport.flipkartPrice}`, color: "text-gray-400 border-white/5 bg-white/5" },
                              { name: "Croma Retail", price: `$${searchReport.reliancePrice}`, color: "text-gray-400 border-white/5 bg-white/5" }
                            ].map((ret, rIdx) => (
                              <div key={rIdx} className={`p-2.5 rounded-xl border ${ret.color} flex flex-col justify-center`}>
                                <span className="text-[9px] text-gray-500 uppercase tracking-wider">{ret.name}</span>
                                <span className="text-xs mt-1">{ret.price}</span>
                              </div>
                            ))}
                          </div>

                          {/* Drop probability & prediction graph */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center justify-between font-mono">
                              <div>
                                <span className="text-[8px] text-gray-500 uppercase tracking-widest block block">Drop Probability</span>
                                <span className="text-base font-black text-amber-500">{searchReport.dropChance}%</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] text-gray-500 uppercase tracking-widest block block">Expected within</span>
                                <span className="text-xs text-white">{searchReport.dropTime}</span>
                              </div>
                            </div>

                            {/* Recharts graph */}
                            <div className="h-[90px] w-full">
                              {mounted && (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={searchReport.priceHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id="priceGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 8 }} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 8 }} />
                                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10 }} />
                                    <Area type="monotone" dataKey="price" stroke="#06b6d4" fillOpacity={1} fill="url(#priceGlow)" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>

                          <div className="bg-slate-900/60 p-3 rounded-xl border border-cyan-500/10 text-[10px] text-gray-300 leading-relaxed font-mono">
                            <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider block mb-1">COGNITIVE RECOMMENDATION OVERVIEW:</span>
                            {searchReport.aiVerdict}
                          </div>
                        </div>
                      )}
                    </div>

                    {searchReport && (
                      <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-4">
                        <Link
                          href={`/product/${searchReport.product._id}`}
                          className="px-4 py-2 border border-white/10 hover:border-white/30 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
                        >
                          Specifications Report
                        </Link>
                        <button
                          onClick={() => {
                            dispatch(addToCart({
                              id: searchReport.product._id,
                              name: searchReport.product.name,
                              price: searchReport.nexusPrice,
                              quantity: 1,
                              image: searchReport.product.images?.[0] || ""
                            }));
                            alert("Added to cart.");
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 text-black font-black rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all"
                        >
                          Instant Procure
                        </button>
                      </div>
                    )}
                  </div>
            </section>

            {/* MODULE 3: AGENT BATTLE ARENA */}
            <section id="ARENA" className="scroll-mt-28">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Agentic purchase Battle Arena</h2>
                            <p className="text-[10px] text-gray-400">Launch real-time debates between five specialized agents</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={arenaQuery}
                          onChange={(e) => setArenaQuery(e.target.value)}
                          placeholder="Define purchase target"
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 text-white font-mono"
                        />
                        <button
                          onClick={runAgentDebate}
                          disabled={isDebating}
                          className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {isDebating ? "Debating..." : "Orchestrate Arena"}
                        </button>
                      </div>

                      {/* Consensus Meter */}
                      <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 text-left font-mono">
                        <div className="flex justify-between items-center text-[9px] text-gray-500 uppercase mb-1.5 font-bold">
                          <span>PURCHASE Consensus Rating</span>
                          <span className={`${consensusScore > 65 ? "text-emerald-400 animate-pulse" : "text-amber-500"}`}>{consensusScore}% Approval</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
                            animate={{ width: `${consensusScore}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {/* Arena messages log */}
                      <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar p-1 text-left font-mono">
                        <AnimatePresence>
                          {arenaMessages.map((msg, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-3 rounded-2xl border text-[10px] leading-relaxed ${msg.color}`}
                            >
                              <div className="font-black text-[9px] uppercase mb-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {msg.agent}
                              </div>
                              <div>{msg.text}</div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {isDebating && (
                          <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase tracking-widest pl-2">
                            <Zap className="w-3.5 h-3.5 animate-spin" />
                            <span>Agents formulating rebuttals...</span>
                          </div>
                        )}
                        {arenaMessages.length === 0 && !isDebating && (
                          <div className="text-[10px] text-gray-600 text-center py-8">
                            Define purchase above and orchestrate to launch agent audit stream.
                          </div>
                        )}
                      </div>
                    </div>

                    {arenaMessages.length > 0 && !isDebating && (
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500 mt-4">
                        <span>Audit complete. Consensus Converged.</span>
                        <button
                          onClick={() => setArenaMessages([])}
                          className="text-red-400 hover:underline cursor-pointer"
                        >
                          Clear Arena
                        </button>
                      </div>
                    )}
                  </div>
            </section>

          </div>

          {/* MODULE: PROXY NEGOTIATOR PLAYGROUND */}
          <div className="w-full max-w-4xl mx-auto">
            {renderNegotiator()}
          </div>

          {/* SIMULATION & HORIZONS ROW */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* MODULE 4: FUTURE SELF SIMULATOR */}
            <section id="DESTINY" className="scroll-mt-28">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <GitBranch className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Future Self Destiny Simulator</h2>
                            <p className="text-[10px] text-gray-400">Slide timeline to project career growth and required purchases</p>
                          </div>
                        </div>
                      </div>

                      {/* Year slider slider */}
                      <div className="bg-black/30 p-4 rounded-2xl border border-white/5 text-left font-mono">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2">
                          <span>Timeline projection shift</span>
                          <span className="text-purple-400 font-bold">Year: {simulatorData.year} (+{timelineValue} Years)</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="25"
                          value={timelineValue}
                          onChange={(e) => handleTimelineChange(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-mono">
                        {/* Projection Details */}
                        <div className="space-y-3">
                          <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5">
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-0.5">Projected Career Title</span>
                            <span className="text-xs font-bold text-purple-400">{simulatorData.career}</span>
                          </div>

                          <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5">
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Required Skill Nodes</span>
                            <div className="flex flex-wrap gap-1.5">
                              {simulatorData.skills.map((sk: string, sIdx: number) => (
                                <span key={sIdx} className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Chart mapping timeline */}
                        <div className="h-[120px] bg-black/30 p-3 rounded-2xl border border-white/5">
                          <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Projected net worth trajectory ($k)</span>
                          {mounted && (
                            <ResponsiveContainer width="100%" height="85%">
                              <LineChart data={simulatorData.graph}>
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={8} />
                                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9 }} />
                                <Line type="monotone" dataKey="worth" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7" }} />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>

                      {/* Procurements list */}
                      <div className="text-left font-mono">
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-2">Required physical resource acquisitions:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {simulatorData.procurements.map((proc: any, pIdx: number) => (
                            <div key={pIdx} className="p-3 bg-slate-900/50 rounded-2xl border border-purple-500/10 flex justify-between items-center group">
                              <div>
                                <span className="text-[10px] font-bold text-white block group-hover:text-purple-400 transition-colors">{proc.name}</span>
                                <span className="text-[8px] text-gray-500">{proc.desc}</span>
                              </div>
                              <button
                                onClick={() => handleAddProcurement(proc)}
                                className="bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-black p-2 rounded-xl text-[10px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 font-mono"
                              >
                                {proc.price} <ShoppingBag className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 text-left mt-4">
                      Adjust slider to dynamically vector life projections.
                    </div>
                  </div>
            </section>

            {/* MODULE 5: DIGITAL TWIN LAB */}
            <section id="TWIN" className="scroll-mt-28">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Personal Digital Twin Lab</h2>
                            <p className="text-[10px] text-gray-400">Monitor and fine-tune your autonomous procurement agent</p>
                          </div>
                        </div>
                      </div>

                      {/* Twin Settings Configuration sliders */}
                      <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3 font-mono text-left">
                        <h3 className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2 border-b border-white/5 pb-1">Cognitive Bias Parameters</h3>
                        
                        {[
                          { key: "riskAppetite", label: "Speculative Risk appetite", labelVal: `${twinConfig.riskAppetite}%` },
                          { key: "ethicalBias", label: "Ethical / carbon audit bias", labelVal: `${twinConfig.ethicalBias}%` },
                          { key: "budgetBuffer", label: "Autonomous Liquidity buffer", labelVal: `${twinConfig.budgetBuffer}%` }
                        ].map(slider => (
                          <div key={slider.key} className="space-y-1">
                            <div className="flex justify-between text-[9px] text-gray-400">
                              <span>{slider.label}</span>
                              <span className="text-emerald-400 font-bold">{slider.labelVal}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={(twinConfig as any)[slider.key]}
                              onChange={(e) => setTwinConfig(prev => ({ ...prev, [slider.key]: parseInt(e.target.value) }))}
                              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Twin Activity list */}
                      <div className="text-left font-mono">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span className="text-[8px] text-gray-500 uppercase tracking-widest">Twin background action telemetry:</span>
                        </div>
                        <div className="space-y-1.5 h-[120px] overflow-y-auto custom-scrollbar bg-slate-900/40 p-3 rounded-2xl border border-white/5">
                          {twinLogs.map((log, lIdx) => (
                            <div key={lIdx} className="text-[9px] flex items-center gap-2 text-gray-300">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                              <span className="break-all">{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-500 mt-4">
                      <span>Twin Synchronized. Biometric synced.</span>
                      <button
                        onClick={() => {
                          setTwinLogs(prev => ["Dispatched neural search optimizer.", ...prev]);
                          alert("Twin recalibrated.");
                        }}
                        className="text-emerald-400 hover:underline cursor-pointer"
                      >
                        Force Recalibration
                      </button>
                    </div>
                  </div>
            </section>

          </div>

          {/* SONAR RADAR & SIMULATOR GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* MODULE 6: OPPORTUNITY RADAR */}
            <section id="RADAR" className="scroll-mt-28">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <Compass className="w-5 h-5 animate-pulse" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Live Opportunity Radar</h2>
                            <p className="text-[10px] text-gray-400">Click sonar ping locations to inspect market arbitrage anomalies</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        {/* SVG Sonar Canvas */}
                        <div className="relative aspect-square max-w-[200px] mx-auto w-full bg-black/60 rounded-full border border-cyan-500/10 flex items-center justify-center overflow-hidden">
                          {/* Grid concentric rings */}
                          <div className="absolute w-[80%] h-[80%] rounded-full border border-cyan-500/5" />
                          <div className="absolute w-[60%] h-[60%] rounded-full border border-cyan-500/5" />
                          <div className="absolute w-[40%] h-[40%] rounded-full border border-cyan-500/5" />
                          <div className="absolute w-[20%] h-[20%] rounded-full border border-cyan-500/5" />
                          {/* X/Y Crosshairs */}
                          <div className="absolute w-full h-[1px] bg-cyan-500/5" />
                          <div className="absolute h-full w-[1px] bg-cyan-500/5" />

                          {/* Rotating sweeping line */}
                          <div
                            className="absolute top-1/2 left-1/2 w-[50%] h-[50%] origin-top-left bg-gradient-to-tr from-cyan-500/0 to-cyan-500/30"
                            style={{ transform: `rotate(${radarSweepAngle}deg) translate(-100%, -100%)` }}
                          />

                          {/* Opportunity Radar Hotspots */}
                          {[
                            { name: "14% Discount on VR headset", type: "Product Arbitrage", desc: "Active arbitrage found. Buy via Nexus Store, resell on Myntra yields 18% margin.", action: "Deploy Twin", x: 40, y: 35, color: "bg-cyan-400" },
                            { name: "Quantum Arch course", type: "Career Opportunity", desc: "Synaptic Developer demand up 30%. Acquiring this unlocks timeline path 8 months early.", action: "Pre-Register", x: 120, y: 60, color: "bg-purple-500" },
                            { name: "Amazon liquid memory sale", type: "Arbitrage Discount", desc: "Wholesale seller selling computing blocks at $85. standard value is $120.", action: "Acquire block", x: 75, y: 140, color: "bg-amber-400" }
                          ].map((dot, dIdx) => (
                            <button
                              key={dIdx}
                              onClick={() => handleRadarClick(dot.x, dot.y, dot.name, dot.type, dot.desc, dot.action)}
                              className={`absolute w-3 h-3 rounded-full ${dot.color} cursor-pointer border border-white hover:scale-150 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.8)]`}
                              style={{ left: `${dot.x}px`, top: `${dot.y}px` }}
                            />
                          ))}
                        </div>

                        {/* Opportunity description box */}
                        {selectedOpportunity && (
                          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-left font-mono space-y-3">
                            <div className="border-b border-white/5 pb-2">
                              <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold uppercase block w-max mb-1">
                                {selectedOpportunity.type}
                              </span>
                              <h3 className="text-[11px] font-bold text-white">{selectedOpportunity.title}</h3>
                            </div>
                            <p className="text-[9px] text-gray-400 leading-relaxed">{selectedOpportunity.desc}</p>
                            <button
                              onClick={() => alert(`Initiating workflow: ${selectedOpportunity.action}`)}
                              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase text-[10px] py-1.5 rounded-lg transition-all font-mono tracking-widest cursor-pointer"
                            >
                              {selectedOpportunity.action}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 text-left mt-4 flex items-center justify-between">
                      <span>Concentric Sweep Radius: 200 light sec</span>
                      <span>3 Active anomalies detected</span>
                    </div>
                  </div>
            </section>

            {/* MODULE 7: REALITY SANDBOX */}
            <section id="SANDBOX" className="scroll-mt-28">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Temporal Reality Sandbox</h2>
                            <p className="text-[10px] text-gray-400">Simulate structural impacts of purchase decisions on your profile</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-mono">
                        <div className="space-y-3">
                          <div>
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Select simulated target</span>
                            <select
                              value={sandboxProduct}
                              onChange={(e) => setSandboxProduct(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                            >
                              <option value="Nexus AeroBook Pro">Nexus AeroBook Pro ($2,499)</option>
                              <option value="Quest VR Node">Nexus Quest VR Node ($1,199)</option>
                              <option value="Nexus Companion Hub">Nexus Companion Hub ($699)</option>
                            </select>
                          </div>

                          <div>
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Amortized life impact period</span>
                            <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                              <span>Timeline window:</span>
                              <span className="text-indigo-400 font-bold">{sandboxInvestment} months</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="24"
                              value={sandboxInvestment}
                              onChange={(e) => setSandboxInvestment(parseInt(e.target.value))}
                              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          <button
                            onClick={runSandboxSimulation}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-2 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer font-mono"
                          >
                            Run Sandbox Impact
                          </button>
                        </div>

                        {/* Recharts chart mapping sandbox impact */}
                        <div className="h-[150px] bg-black/40 p-2 rounded-2xl border border-white/5">
                          <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Simulated profile metrics impact</span>
                          {mounted && (
                            <ResponsiveContainer width="100%" height="90%">
                              <BarChart data={sandboxMetrics} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 8 }} />
                                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9 }} />
                                <Bar dataKey="before" fill="#475569" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="after" fill="#6366f1" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between text-[9px] font-mono text-gray-500 text-left mt-4">
                      <span>Gray: Pre-purchase metric | Indigo: Post-purchase projection</span>
                    </div>
                  </div>
            </section>

          </div>

          {/* TICKERS & AUTONOMOUS ENGINE */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* MODULE 8: GLOBAL MARKET RADAR */}
            <section id="GLOBAL" className="scroll-mt-28">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            <Globe2 className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
                          </div>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Global Market Volatility Radar</h2>
                            <p className="text-[10px] text-gray-400">Real-time trade flow indexes and market ticker telemetry</p>
                          </div>
                        </div>
                      </div>

                      {/* Market Heatmap grid simulator */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
                        {marketTrends.map((trend, tIdx) => (
                          <div key={tIdx} className="p-3 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                            <span className="text-[10px] text-white font-bold">{trend.code}</span>
                            <span className={`text-[9px] mt-1 font-bold ${trend.status === "up" ? "text-emerald-400" : "text-red-400"}`}>
                              {trend.val}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Volatility Trend chart */}
                      <div className="h-[120px] bg-black/30 p-3.5 rounded-2xl border border-white/5 text-left font-mono">
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Global Logistics Congestion Index (Vol)</span>
                        {mounted && (
                          <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={[
                              { name: "09:00", index: 12 },
                              { name: "10:00", index: 15 },
                              { name: "11:00", index: 14 },
                              { name: "12:00", index: 21 },
                              { name: "13:00", index: 18 },
                              { name: "14:00", index: 28 },
                              { name: "15:00", index: 24 }
                            ]}>
                              <XAxis dataKey="name" stroke="#6b7280" fontSize={8} />
                              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9 }} />
                              <Line type="monotone" dataKey="index" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 text-left mt-4">
                      Aggregating logistics metrics across Chennai, Rotterdam, Shenzhen ports.
                    </div>
                  </div>
            </section>

            {/* MODULE 9: AUTONOMOUS SHOPPING ENGINE */}
            <section id="AUTONOMOUS" className="scroll-mt-28">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <Cpu className="w-5 h-5 animate-pulse" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-sm font-black uppercase tracking-wider text-white">Autonomous Shopping Engine</h2>
                            <p className="text-[10px] text-gray-400">Configure twin buying limits for automatic deal locking</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 text-left font-mono">
                        <div>
                          <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Target product SKU</span>
                          <input
                            type="text"
                            value={autoBuyProduct}
                            onChange={(e) => setAutoBuyProduct(e.target.value)}
                            placeholder="e.g. Nexus Companion Hub"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Price limit limit ($)</span>
                            <input
                              type="number"
                              value={autoBuyTarget}
                              onChange={(e) => setAutoBuyTarget(parseInt(e.target.value) || 0)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                            />
                          </div>
                          <div>
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Autonomous Status</span>
                            <span className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs block font-bold text-rose-400 text-center animate-pulse">
                              {autoBuyStatus}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={dispatchAutoBuy}
                          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-2 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer font-mono"
                        >
                          Authorize Auto-Procurement limit
                        </button>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 text-[9px] text-gray-400 leading-relaxed font-mono text-left">
                        <span className="text-[8px] text-rose-400 uppercase font-black tracking-wider block mb-1">DECISION LOGIC MATRIX:</span>
                        If price drops below target limit, matching twin triggers escrow payment. Else, maintains monitor sweeps. Alternate target recommendation: <span className="text-rose-400 underline cursor-pointer">Nexus Phone X mini</span> ($499).
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 text-left mt-4 flex items-center justify-between">
                      <span>Direct API Escrow status: INACTIVE</span>
                    </div>
                  </div>
            </section>

          </div>

          {/* MODULE 10: NEXUS INTELLIGENCE ALERTS FEED */}
          <div className="w-full max-w-4xl mx-auto">
            <section id="FEED" className="scroll-mt-28">
                <div className="rounded-3xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <AlertCircle className="w-5 h-5 animate-bounce" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-black uppercase tracking-wider text-white">Nexus Intelligence alerts feed</h2>
                      <p className="text-[10px] text-gray-400">Continuous AI-generated market opportunities and alerts</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-left">
                    {alertsFeed.map((alertItem) => (
                      <div key={alertItem.id} className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2 flex flex-col justify-between hover:border-cyan-500/20 transition-colors">
                        <div>
                          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-cyan-400 mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Market Signal
                          </div>
                          <h4 className="text-[11px] font-bold text-white mb-1.5 leading-tight">{alertItem.title}</h4>
                          <p className="text-[9px] text-gray-400 leading-relaxed">{alertItem.msg}</p>
                        </div>
                        <div className="pt-3 border-t border-white/5 mt-3 flex justify-end">
                          <button
                            onClick={() => alert(`Optimizing: ${alertItem.title}`)}
                            className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            Authorize Optimization &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

        </div>
      </div>
    </main>
  );
}
