"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, GitBranch, Shield, Zap, TrendingUp, AlertTriangle, X, DollarSign, Heart, FileText
} from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/ui/NavBar";

interface TimelineNode {
  id: string;
  label: string;
  cx: number;
  cy: number;
  type: "root" | "safe" | "moonshot" | "chaos";
  year: number;
  details: {
    income: string;
    biometrics: string;
    diary: string;
  };
}

export default function DestinyTimelineCanvas() {
  const [goal, setGoal] = useState("Transition to full-time AI builder");
  const [selectedNode, setSelectedNode] = useState<TimelineNode | null>(null);
  
  const nodes: TimelineNode[] = [
    {
      id: "root",
      label: "Decision State",
      cx: 150,
      cy: 200,
      type: "root",
      year: 0,
      details: {
        income: "$85,000/yr baseline",
        biometrics: "Cortisol: 14ug/dL, Heart Rate: 72bpm",
        diary: "Tension is high. Deciding whether to leave standard corporate path. Ready to initiate the simulation engines."
      }
    },
    
    // SAFE PATHWAY
    {
      id: "safe-y1",
      label: "Safe Transition",
      cx: 350,
      cy: 100,
      type: "safe",
      year: 1,
      details: {
        income: "$92,000/yr consulting",
        biometrics: "Cortisol: 11ug/dL, Sleep Efficiency: 90%",
        diary: "Contracting part-time. The transition is stable. Cash reserves are holding nicely. Free time spent drafting product code."
      }
    },
    {
      id: "safe-y5",
      label: "Established Agency",
      cx: 550,
      cy: 100,
      type: "safe",
      year: 5,
      details: {
        income: "$140,000/yr dividends",
        biometrics: "Cortisol: 12ug/dL, Heart Rate: 68bpm",
        diary: "Small team established. We have stable recurring contracts. Startup has moderate profitability, though the big payoff remains elusive."
      }
    },

    // MOONSHOT PATHWAY
    {
      id: "moon-y1",
      label: "Funded Launch",
      cx: 350,
      cy: 200,
      type: "moonshot",
      year: 1,
      details: {
        income: "$45,000/yr salary + Equity",
        biometrics: "Cortisol: 18ug/dL, Sleep Efficiency: 82%",
        diary: "Pre-seed closed. $500k in bank. Working 80 hour weeks. Heart rate fluctuates, but speed to market is incredible. Code is running."
      }
    },
    {
      id: "moon-y5",
      label: "Market Dominance",
      cx: 550,
      cy: 200,
      type: "moonshot",
      year: 5,
      details: {
        income: "$850,000/yr cash + $12M equity valuation",
        biometrics: "Cortisol: 15ug/dL, Peak VO2 Max: 48ml/kg",
        diary: "Series B secured. System load is high but business is thriving. We are processing B2B agent automation workloads at scale globally."
      }
    },

    // CHAOS PATHWAY
    {
      id: "chaos-y1",
      label: "Runway Crash",
      cx: 350,
      cy: 300,
      type: "chaos",
      year: 1,
      details: {
        income: "$12,000/yr debt draw",
        biometrics: "Cortisol: 24ug/dL, Stress Index: Critical",
        diary: "Runway depleted in month 8. Product launch failed to secure conversion markers. High anxiety. Looking for contract work to cover rent."
      }
    },
    {
      id: "chaos-y5",
      label: "Career Recovery",
      cx: 550,
      cy: 300,
      type: "chaos",
      year: 5,
      details: {
        income: "$110,000/yr corporate return",
        biometrics: "Cortisol: 13ug/dL, Heart Rate: 74bpm",
        diary: "Back in corporate. The startup attempt was a total loss, but the database and ML lessons learned helped land a senior staff role."
      }
    }
  ];

  const nodeConnections = [
    { from: "root", to: "safe-y1" },
    { from: "safe-y1", to: "safe-y5" },
    { from: "root", to: "moon-y1" },
    { from: "moon-y1", to: "moon-y5" },
    { from: "root", to: "chaos-y1" },
    { from: "chaos-y1", to: "chaos-y5" }
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case "root": return "fill-amber-500 stroke-amber-300";
      case "safe": return "fill-emerald-500 stroke-emerald-300";
      case "moonshot": return "fill-purple-500 stroke-purple-300";
      case "chaos": return "fill-rose-500 stroke-rose-300";
      default: return "fill-gray-500 stroke-gray-300";
    }
  };

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
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Destiny Timeline Canvas</h2>
            <div className="text-[10px] text-gray-500 font-mono">Module Gamma // Future Simulation & SVG mapping</div>
          </div>
        </div>
      </section>

      {/* CANVAS CONTAINER */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        {/* INPUT PANEL */}
        <div className="lg:col-span-1 border-r border-white/5 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar text-left">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Simulate Decision Fork</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Path Trajectory Key</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Conservative (High stability)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Moonshot (High volatility)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span>Chaos (Failure risk)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-500">
            Click on any SVG node point to open the parallel future's details, balance sheets, and simulated diary journals.
          </div>
        </div>

        {/* SVG CANVAS INTERFACE */}
        <div className="lg:col-span-3 bg-[#0c111c] relative flex items-center justify-center p-6 overflow-auto custom-scrollbar">
          {/* Backdrop map coordinates effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          
          <div className="relative w-[700px] h-[400px] bg-black/30 border border-white/5 rounded-3xl p-6 glass-panel overflow-hidden">
            {/* SVG Path lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodeConnections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from)!;
                const toNode = nodes.find(n => n.id === conn.to)!;
                const strokeColor = toNode.type === "safe" ? "#10b981" : 
                                    toNode.type === "moonshot" ? "#a855f7" : 
                                    "#f43f5e";
                
                return (
                  <g key={idx}>
                    <line
                      x1={fromNode.cx}
                      y1={fromNode.cy}
                      x2={toNode.cx}
                      y2={toNode.cy}
                      stroke={strokeColor}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      className="opacity-40"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Clickable SVG nodes */}
            {nodes.map((node) => {
              const ringColor = node.type === "safe" ? "group-hover:stroke-emerald-400" :
                                node.type === "moonshot" ? "group-hover:stroke-purple-400" :
                                node.type === "chaos" ? "group-hover:stroke-rose-400" :
                                "group-hover:stroke-amber-400";
              
              return (
                <div
                  key={node.id}
                  style={{ left: node.cx - 20, top: node.cy - 20 }}
                  onClick={() => setSelectedNode(node)}
                  className="absolute w-10 h-10 group cursor-pointer flex items-center justify-center"
                >
                  <svg className="w-full h-full">
                    {/* Pulsing ring */}
                    <circle
                      cx={20}
                      cy={20}
                      r={14}
                      className={`stroke-2 fill-none ${ringColor} transition-colors`}
                    />
                    {/* Inner core */}
                    <circle
                      cx={20}
                      cy={20}
                      r={8}
                      className={`${getNodeColor(node.type)}`}
                    />
                  </svg>
                  
                  {/* Floating label */}
                  <span className="absolute top-10 whitespace-nowrap text-[9px] font-mono font-bold text-gray-400 group-hover:text-white transition-colors">
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* FLOATING GLASS DRAWER OVERLAY */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute right-6 top-6 bottom-6 w-[340px] border border-white/10 bg-[#0f172a]/95 rounded-3xl p-6 shadow-2xl glass-panel text-left flex flex-col justify-between z-20"
              >
                <div>
                  <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase">{selectedNode.label}</h4>
                      <span className="text-[9px] font-mono text-purple-400 uppercase">Year {selectedNode.year} Forecast</span>
                    </div>
                    <button 
                      onClick={() => setSelectedNode(null)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Metric Row 1 */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-500 uppercase">Financial Balance</div>
                        <div className="text-xs font-bold text-white">{selectedNode.details.income}</div>
                      </div>
                    </div>

                    {/* Metric Row 2 */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-500 uppercase">Biometrics Index</div>
                        <div className="text-xs font-bold text-white">{selectedNode.details.biometrics}</div>
                      </div>
                    </div>

                    {/* Synthetic Diary */}
                    <div className="space-y-1.5 border-t border-white/5 pt-4 mt-2">
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Future Self Journal</span>
                      </div>
                      <p className="text-[10px] font-mono text-gray-300 bg-black/40 border border-white/5 rounded-2xl p-4 leading-relaxed h-[120px] overflow-y-auto custom-scrollbar">
                        "{selectedNode.details.diary}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-[8px] font-mono text-gray-600">
                  Consensus generated from historic micro-actions.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
