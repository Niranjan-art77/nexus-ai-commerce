"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, Terminal, Activity, Zap, Shield, GitBranch, MessageSquare, Briefcase, UserCheck
} from "lucide-react";
import { NavBar } from "@/components/ui/NavBar";

export default function NexusXDashboard() {
  const [telemetry, setTelemetry] = useState({
    neuralSync: 98.4,
    activeAgents: 1420,
    quantumLoad: 42,
    simulatedTimelines: 120539
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        neuralSync: parseFloat((98.0 + Math.random() * 1.5).toFixed(2)),
        activeAgents: prev.activeAgents + (Math.random() > 0.5 ? 1 : -1),
        quantumLoad: Math.floor(35 + Math.random() * 15),
        simulatedTimelines: prev.simulatedTimelines + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const modules = [
    {
      title: "Agentic Debate Arena",
      desc: "Assemble specialized AI agents to debate, audit, and validate critical life decisions in real-time.",
      path: "/nexus-x/debate",
      icon: MessageSquare,
      color: "from-amber-500 to-orange-600",
      accent: "#ff9900",
      badge: "ACTIVE AGENTS"
    },
    {
      title: "Proxy Negotiator Playground",
      desc: "Train your digital twin to negotiate custom asset and service prices with counterparty vendor agents.",
      path: "/nexus-x/negotiator",
      icon: Terminal,
      color: "from-cyan-500 to-blue-600",
      accent: "#00f0ff",
      badge: "SANDBOX READY"
    },
    {
      title: "Destiny Timeline Canvas",
      desc: "Explore parallel futures with interactive SVG trajectory mapping, clustering safe, high-growth, and chaotic paths.",
      path: "/nexus-x/destiny",
      icon: GitBranch,
      color: "from-purple-500 to-indigo-600",
      accent: "#a855f7",
      badge: "100k+ SIMULATIONS"
    },
    {
      title: "Cognitive Persona Matrix",
      desc: "Monitor your digital twin's cognitive telemetry and configure self-evolving interface adaptation parameters.",
      path: "/nexus-x/persona",
      icon: UserCheck,
      color: "from-emerald-500 to-teal-600",
      accent: "#10b981",
      badge: "BIOMETRIC SYNC"
    }
  ];

  return (
    <main className="w-full bg-[#0b0f19] min-h-screen text-white font-sans flex flex-col overflow-y-auto custom-scrollbar pb-12">
      <NavBar />

      {/* DASHBOARD HEADER */}
      <section className="max-w-[1480px] mx-auto w-full px-6 pt-8 pb-4 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                SYSTEM ACTIVE
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              NEXUS X <span className="text-[#ff9900] text-glow-primary">Control Center</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Reality Intelligence System. Oversee temporal projections, orchestrate multi-agent negotiations, and review your digital twin's cognitive telemetry.
            </p>
          </div>

          {/* TELEMETRY BAR */}
          <div className="flex flex-wrap gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 glass-panel">
            <div className="px-4 border-r border-white/10">
              <div className="text-[9px] font-mono text-gray-500 uppercase">Neural Sync</div>
              <div className="text-sm font-black text-cyan-400">{telemetry.neuralSync}%</div>
            </div>
            <div className="px-4 border-r border-white/10">
              <div className="text-[9px] font-mono text-gray-500 uppercase">Active Agents</div>
              <div className="text-sm font-black text-white">{telemetry.activeAgents}</div>
            </div>
            <div className="px-4 border-r border-white/10">
              <div className="text-[9px] font-mono text-gray-500 uppercase">Quantum Load</div>
              <div className="text-sm font-black text-amber-500">{telemetry.quantumLoad}%</div>
            </div>
            <div className="px-4">
              <div className="text-[9px] font-mono text-gray-500 uppercase">Timelines Simulated</div>
              <div className="text-sm font-black text-[#a855f7]">{telemetry.simulatedTimelines.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE MODULES GRID */}
      <section className="max-w-[1480px] mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 p-6 md:p-8 flex flex-col justify-between h-[280px] glass-panel group cursor-pointer"
            >
              {/* Dynamic decorative backdrop glow */}
              <div 
                className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20"
                style={{ background: mod.accent }}
              />

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${mod.color} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span 
                    className="text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md border"
                    style={{ borderColor: `${mod.accent}30`, color: mod.accent, background: `${mod.accent}10` }}
                  >
                    {mod.badge}
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-black uppercase text-white group-hover:text-glow-primary transition-all">
                    {mod.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-lg">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end">
                <Link
                  href={mod.path}
                  className="px-6 py-2.5 rounded-full font-bold text-xs text-black transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  style={{ background: `linear-gradient(135deg, ${mod.accent}, ${mod.accent}cc)` }}
                >
                  Enter Module <Zap className="w-3.5 h-3.5 fill-black" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* QUICK SYSTEM LOGS */}
      <section className="max-w-[1480px] mx-auto w-full px-6 mt-8">
        <div className="bg-[#111827] rounded-3xl border border-white/5 p-6 text-left">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-black uppercase tracking-widest text-white">System Feed Logs</h4>
          </div>
          <div className="font-mono text-[10px] text-gray-500 space-y-2 bg-black/30 p-4 rounded-2xl border border-white/5 h-[120px] overflow-y-auto custom-scrollbar">
            <div>[09:18:01] [QUANTUM_GRID] Pre-compiling timeline projections for node user-10294.</div>
            <div>[09:18:02] [AGENTIC_DEBATE] Agent FinancialPlanner-A and RiskAuditor-B synchronized states.</div>
            <div>[09:18:03] [PROXY_NEGOTIATOR] Completed 43 sandbox transaction runs; average savings rate converged at 14.2%.</div>
            <div>[09:18:04] [COGNITIVE_TWIN] Biometric interface syncing complete. Baseline cortisol matched at 12ug/dL.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
