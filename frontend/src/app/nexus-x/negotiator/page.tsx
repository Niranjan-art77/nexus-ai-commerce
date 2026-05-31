"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Terminal, Play, RefreshCw, BarChart2, ShieldAlert, Cpu, Database, User
} from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/ui/NavBar";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Dialogue {
  sender: "twin" | "vendor" | "system";
  text: string;
  round: number;
}

export default function ProxyNegotiatorPlayground() {
  const [budgetPriority, setBudgetPriority] = useState(80);
  const [qualityPriority, setQualityPriority] = useState(70);
  const [assetClass, setAssetClass] = useState("ServerCore");
  const [vendorPrice, setVendorPrice] = useState(320);
  const [targetPrice, setTargetPrice] = useState(180);
  const [negotiating, setNegotiating] = useState(false);
  
  const [chatLog, setChatLog] = useState<Dialogue[]>([]);
  const [chartData, setChartData] = useState<{ round: number; twinBid: number; vendorAsk: number }[]>([]);
  const [activeStatus, setActiveStatus] = useState("Idle");

  const bottomRef = useRef<HTMLDivElement>(null);

  const getAssetDetails = () => {
    switch(assetClass) {
      case "ServerCore": return { name: "Futuristic GPU-Compute Core Node", icon: Cpu };
      case "DataRegistry": return { name: "Vector Database Sub-Shards Index", icon: Database };
      default: return { name: "Standard AI Resource Tier", icon: Database };
    }
  };

  const runNegotiation = () => {
    setNegotiating(true);
    setChatLog([]);
    setChartData([]);
    setActiveStatus("Analyzing Priorities");

    let round = 1;
    let twinCurrentBid = targetPrice;
    let vendorCurrentAsk = vendorPrice;

    // Compile dynamic custom responses based on budget priority
    const conversationFlow = [
      {
        sender: "twin" as const,
        text: `Initializing handshake telemetry. Requesting access to ${getAssetDetails().name}. Analyzing historical transaction sharding records, our valuation model positions this asset at $${twinCurrentBid}. We propose an immediate transaction at this rate.`,
        bidOffset: 0,
        askOffset: 0
      },
      {
        sender: "vendor" as const,
        text: `Handshake validated. However, our node capacity yields high reliability performance indicators. We cannot approve a concession to $${twinCurrentBid}. Our strict minimum boundary threshold sits at $${vendorCurrentAsk}.`,
        bidOffset: 0,
        askOffset: 0
      },
      {
        sender: "twin" as const,
        text: `Ingesting resource quality. Our configuration telemetry shows your active network strain is elevated, yielding lower efficiency parameters. Accounting for this, we can concession our proposal to $${twinCurrentBid + 25}.`,
        bidOffset: 25,
        askOffset: 0
      },
      {
        sender: "vendor" as const,
        text: `Evaluating system telemetry. Adjusting active load markers. We can execute a linear concession rate. We reduce our ask threshold to $${vendorCurrentAsk - 30}.`,
        bidOffset: 0,
        askOffset: -30
      },
      {
        sender: "twin" as const,
        text: `Our client's budget metrics are highly constrained (Priority parameter set at ${budgetPriority}%). We are authorized to propose a final convergence target of $235. This is our peak threshold limit.`,
        bidOffset: 30,
        askOffset: 0
      },
      {
        sender: "vendor" as const,
        text: `Compromise matrix matching. Analyzing liquidity margins. Agreement criteria achieved. Initializing contract seal at $235. Lock complete.`,
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

        // Push data to chart
        setChartData(prev => [
          ...prev,
          {
            round: Math.ceil(round / 2),
            twinBid: twinCurrentBid,
            vendorAsk: vendorCurrentAsk
          }
        ]);

        round++;
        setTimeout(executeRound, 4000);
      } else {
        setActiveStatus("Deal Complete");
        setNegotiating(false);
      }
    };

    setTimeout(executeRound, 1500);
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatLog]);

  const AssetIcon = getAssetDetails().icon;

  return (
    <main className="w-full bg-[#0b0f19] h-screen text-white font-sans flex flex-col overflow-hidden">
      <NavBar />

      {/* SUB-HEADER */}
      <section className="bg-[#111827] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/nexus-x" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Proxy Negotiator Playground</h2>
            <div className="text-[10px] text-gray-500 font-mono">Module Beta // Agent Bargaining Sandbox</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{activeStatus}</span>
        </div>
      </section>

      {/* MATRIX LAYOUT */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* PROFILE SETTINGS & SLIDERS */}
        <div className="lg:col-span-1 border-r border-white/5 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Train Twin Priority Vectors</label>
              
              {/* SLIDERS */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                    <span>Budget Optimization</span>
                    <span>{budgetPriority}%</span>
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
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                    <span>Quality Threshold</span>
                    <span>{qualityPriority}%</span>
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

            {/* TRANSACTION CONFIG */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Select Asset Class</label>
                <select
                  value={assetClass}
                  onChange={(e) => setAssetClass(e.target.value)}
                  disabled={negotiating}
                  className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="ServerCore">GPU Compute Core Node</option>
                  <option value="DataRegistry">Vector Database Index Shards</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Initial Ask ($)</label>
                  <input
                    type="number"
                    value={vendorPrice}
                    onChange={(e) => setVendorPrice(parseInt(e.target.value))}
                    disabled={negotiating}
                    className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Target Bid ($)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseInt(e.target.value))}
                    disabled={negotiating}
                    className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={runNegotiation}
              disabled={negotiating}
              className="w-full py-3 rounded-2xl font-bold text-xs text-black bg-[#00f0ff] hover:bg-[#00d0df] disabled:bg-gray-700 disabled:text-gray-400 transition-all flex items-center justify-center gap-2"
            >
              {negotiating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
              {negotiating ? "Running Negotiations" : "Launch Proxy Agent"}
            </button>
          </div>

          {/* REAL-TIME CHART AREA */}
          <div className="bg-[#111827] rounded-2xl border border-white/5 p-4 space-y-3 mt-6">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white">
              <span>Price Convergence Map</span>
              <span className="font-mono text-cyan-400">Live</span>
            </div>
            
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                  <XAxis dataKey="round" stroke="#4b5563" fontSize={8} />
                  <YAxis stroke="#4b5563" fontSize={8} />
                  <Tooltip contentStyle={{ background: "#111827", borderColor: "#374151", fontSize: 10 }} />
                  <Line type="monotone" dataKey="twinBid" stroke="#00f0ff" strokeWidth={2} name="Twin Bid" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="vendorAsk" stroke="#ef4444" strokeWidth={2} name="Vendor Ask" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* LOG TERMINAL PLATFORM */}
        <div className="lg:col-span-2 bg-[#0c111c] flex flex-col justify-between overflow-hidden relative p-6">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          {/* ACTIVE TERMINAL WINDOW */}
          <div className="flex-1 border border-white/5 bg-black/40 rounded-3xl overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#111827] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-white">PROX_NEGOTIATOR_SHELL v1.42</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
            </div>

            {/* Scrolling log container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {chatLog.length === 0 && !negotiating && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <Cpu className="w-12 h-12 text-gray-600 animate-pulse" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase">Console Ready</h5>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-xs leading-relaxed">
                      Configure your priority parameters on the left and click launch to run negotiations.
                    </p>
                  </div>
                </div>
              )}

              {chatLog.length === 0 && negotiating && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mb-3" />
                  <div className="text-[10px] font-mono text-gray-400">Calibrating priority parameters...</div>
                </div>
              )}

              <AnimatePresence>
                {chatLog.map((log, i) => {
                  const alignment = log.sender === "twin" ? "text-left" : "text-left bg-white/5";
                  const label = log.sender === "twin" ? "YOU (PROX_TWIN_AGENT)" : "VENDOR_NODE_AGENT";
                  const color = log.sender === "twin" ? "text-cyan-400" : "text-rose-400";
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-xl border border-white/5 font-mono text-[10px] leading-relaxed text-left ${alignment}`}
                    >
                      <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
                        <span className={`font-black ${color}`}>{label}</span>
                        <span className="text-gray-500">Round {log.round}</span>
                      </div>
                      <p className="text-gray-300 font-medium">{log.text}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
