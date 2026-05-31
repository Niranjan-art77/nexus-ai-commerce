"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Brain, UserCheck, Activity, Eye, Zap, RefreshCw, BarChart2
} from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/ui/NavBar";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function CognitivePersonaMatrix() {
  const [focalLoad, setFocalLoad] = useState(65);
  const [fatigueLevel, setFatigueLevel] = useState(25);
  const [neurologicalSync, setNeurologicalSync] = useState(94.2);
  const [telemetryState, setTelemetryState] = useState<"Hyper-Active" | "Exhausted">("Hyper-Active");
  
  const [focusData, setFocusData] = useState<{ time: string; focus: number }[]>([]);

  useEffect(() => {
    // Scaffold initial chart data
    const initialData = Array.from({ length: 10 }).map((_, i) => ({
      time: `-${10 - i}m`,
      focus: Math.floor(70 + Math.random() * 20)
    }));
    setFocusData(initialData);

    const interval = setInterval(() => {
      setFocusData(prev => {
        const next = [...prev.slice(1), {
          time: "now",
          focus: telemetryState === "Hyper-Active" ? Math.floor(80 + Math.random() * 15) : Math.floor(40 + Math.random() * 15)
        }];
        // Correct time labels
        return next.map((d, i) => ({
          ...d,
          time: i === 9 ? "now" : `-${9 - i}m`
        }));
      });

      setNeurologicalSync(prev => parseFloat((93.5 + Math.random() * 2.0).toFixed(2)));
    }, 4000);

    return () => clearInterval(interval);
  }, [telemetryState]);

  const handleStateToggle = (state: "Hyper-Active" | "Exhausted") => {
    setTelemetryState(state);
    if (state === "Hyper-Active") {
      setFocalLoad(85);
      setFatigueLevel(15);
    } else {
      setFocalLoad(35);
      setFatigueLevel(75);
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
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Cognitive Persona Matrix</h2>
            <div className="text-[10px] text-gray-500 font-mono">Module Delta // Cognitive Telemetry & Layout Adaptation</div>
          </div>
        </div>
      </section>

      {/* INTERFACE GRID */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* TELEMETRY INPUT CONTROLS */}
        <div className="lg:col-span-1 border-r border-white/5 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar text-left">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Set User State Simulator</label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStateToggle("Hyper-Active")}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-all ${
                    telemetryState === "Hyper-Active" 
                      ? "bg-cyan-500/10 border-cyan-400 text-cyan-400" 
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                  }`}
                >
                  Hyper-Active (Focused)
                </button>
                <button
                  onClick={() => handleStateToggle("Exhausted")}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-all ${
                    telemetryState === "Exhausted" 
                      ? "bg-emerald-500/10 border-emerald-400 text-emerald-400" 
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                  }`}
                >
                  Exhausted (Low Energy)
                </button>
              </div>
            </div>

            {/* TELEMETRY STATS */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Biometric Vectors</span>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                    <span>Focal Processing Load</span>
                    <span>{focalLoad}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${focalLoad}%` }}
                      className="bg-cyan-400 h-full rounded-full" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                    <span>System Fatigue Index</span>
                    <span>{fatigueLevel}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${fatigueLevel}%` }}
                      className="bg-amber-500 h-full rounded-full" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                    <span>Neurological Sync Rate</span>
                    <span>{neurologicalSync}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${neurologicalSync}%` }}
                      className="bg-purple-500 h-full rounded-full" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-500">
            Nexus X automatically adapts typographic scale, copywriting tone, and content sparsity metrics to match cognitive states.
          </div>
        </div>

        {/* MORPHING DYNAMIC PANEL VIEW */}
        <div className="lg:col-span-2 bg-[#0c111c] p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

          {/* TELEMETRY CHART */}
          <div className="bg-[#111827] rounded-3xl border border-white/5 p-6 mb-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Real-Time Cognitive Sync Chart</h4>
              </div>
              <span className="font-mono text-[10px] text-purple-400 font-bold">Neural Flux Stream</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={focusData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#4b5563" fontSize={8} />
                  <YAxis domain={[0, 100]} stroke="#4b5563" fontSize={8} />
                  <Tooltip contentStyle={{ background: "#111827", borderColor: "#374151", fontSize: 10 }} />
                  <Area type="monotone" dataKey="focus" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SELF-EVOLVING PORTAL VIEW (MORPHS REAL-TIME) */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {telemetryState === "Hyper-Active" ? (
                <motion.div
                  key="hyper"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/40 border border-cyan-500/20 p-6 rounded-3xl text-left space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.05)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                      Cognitive Alignment: HYPER-ACTIVE DENSE MODEL
                    </span>
                  </div>

                  <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                    Real-Time System Log Matrix
                  </h3>
                  
                  {/* Dense data table */}
                  <div className="grid grid-cols-3 gap-3 font-mono text-[9px] text-gray-400 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div>
                      <div className="text-gray-600 mb-1">NODE_ID</div>
                      <div className="text-white font-bold">NEX-X-1092</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">BANDWIDTH</div>
                      <div className="text-emerald-400 font-bold">4.2 GB/s</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">LATENCY</div>
                      <div className="text-cyan-400 font-bold">0.82 ms</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                    Telemetry metrics dictate high focal engagement patterns. Text presentation set to technical shorthand specs. Visual arrays displayed at 100% density layout profiles.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="exhausted"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#042f2e]/20 border border-emerald-500/20 p-8 rounded-3xl text-left space-y-6 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                      Calming Minimalist Profile Active
                    </span>
                  </div>

                  <h3 className="text-3xl font-black uppercase text-white tracking-tight">
                    Take a Moment to Rest.
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    Our sensors indicate you have been working heavily. We have simplified your interface view, muted technical telemetry feeds, and optimized contrast layers to reduce ocular strain.
                  </p>

                  <div className="flex justify-start">
                    <button className="px-6 py-2.5 rounded-full text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-colors">
                      Mute System Audio
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
