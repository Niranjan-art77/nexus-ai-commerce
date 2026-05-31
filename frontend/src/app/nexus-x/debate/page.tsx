"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, MessageSquare, Terminal, HelpCircle, Shield, Brain, Heart, Play, RefreshCw, BarChart2
} from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/ui/NavBar";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface Message {
  agent: string;
  role: string;
  text: string;
  type: "financial" | "risk" | "lifestyle";
  avatar: any;
}

export default function AgenticDebateArena() {
  const [goal, setGoal] = useState("Should I quit my corporate job to build an AI agentic startup?");
  const [debating, setDebating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [consensusScore, setConsensusScore] = useState(50);
  const [chartData, setChartData] = useState<{ round: number; consensus: number }[]>([]);
  const [activeStep, setActiveStep] = useState<string>("Standby");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const debateScript = [
    {
      agent: "Aegis-9 (Risk Auditor)",
      role: "Risk Auditor",
      type: "risk" as const,
      avatar: Shield,
      text: "Analyzing baseline macro vectors. Initiating startup survival projections. Ninety-two percent of new technology ventures fail within 24 months. By leaving a stable corporate salary, you instantly delete a recurring cash flow line item, triggering a personal liquidity crunch in exactly 4.2 months based on your current savings rate. I advise extreme caution.",
      scoreOffset: -18
    },
    {
      agent: "Aurelius (Financial Planner)",
      role: "Financial Planner",
      type: "financial" as const,
      avatar: Brain,
      text: "I object to Aegis-9's default pessimism. The opportunity cost of remaining in a stagnant corporate role is immense. AI Agentic workflows represent a market expansion projection of $1.3T by 2030. Ingesting current SaaS pricing tiers, if you launch now and capture just 0.004% of local B2B automation demand, you generate $12,000 MRR in under 6 months. The financial reward vectors clearly outweigh the short-term capital draw.",
      scoreOffset: 25
    },
    {
      agent: "Lyra (Lifestyle Consultant)",
      role: "Lifestyle Consultant",
      type: "lifestyle" as const,
      avatar: Heart,
      text: "Let us review cognitive burnout telemetry. Corporate jobs provide predictable schedule patterns but severely limit creative agency, leading to chronic low-level stress spikes. However, starting a venture will push weekly active work hours from 40 to 75+. This will compromise sleep latency and cardiovascular reserves. We must structure an automated lifestyle buffer—such as strict daily downtime windows—to prevent system degradation.",
      scoreOffset: -5
    },
    {
      agent: "Aegis-9 (Risk Auditor)",
      role: "Risk Auditor",
      type: "risk" as const,
      avatar: Shield,
      text: "Lyra's concerns are valid but under-indexed. A startup requires immediate operational support. If you hit a burnout state, you have no redundancy. Aurelius assumes perfect market entry, but fails to model competitive pricing drops from larger LLM vendors releasing free integrated tools. If market entry costs spike 30%, your launch Runway drops from 6 months to 4.2 weeks. I suggest securing secondary funding commits before resigning.",
      scoreOffset: -12
    },
    {
      agent: "Aurelius (Financial Planner)",
      role: "Financial Planner",
      type: "financial" as const,
      avatar: Brain,
      text: "Aegis-9's concern is resolved by building custom workflows that larger models cannot quickly replicate. We can offset the startup risk by launching a Minimum Viable Product (MVP) over weekend sprints *before* formally leaving. This maintains your primary income stream while collecting actual buyer conversion signals. Proposing a Hybrid Transition Pathway.",
      scoreOffset: 30
    },
    {
      agent: "Lyra (Lifestyle Consultant)",
      role: "Lifestyle Consultant",
      type: "lifestyle" as const,
      avatar: Heart,
      text: "The Hybrid Transition Pathway is highly optimal. It keeps financial anxiety low while testing emotional resilience and workload capacity. I back Aurelius's hybrid structure. Conserving baseline energy before jumping is the healthiest route.",
      scoreOffset: 15
    }
  ];

  const startDebate = () => {
    setDebating(true);
    setMessages([]);
    setConsensusScore(50);
    setChartData([{ round: 0, consensus: 50 }]);
    setActiveStep("Initializing Agents");

    let currentMsgIdx = 0;
    
    const triggerNextMessage = () => {
      if (currentMsgIdx < debateScript.length) {
        const nextMsg = debateScript[currentMsgIdx]!;
        setActiveStep(`Agent ${nextMsg.role} Inputting`);
        
        setMessages(prev => [...prev, nextMsg]);
        setConsensusScore(score => {
          const newScore = Math.max(10, Math.min(99, score + nextMsg.scoreOffset));
          setChartData(chart => [...chart, { round: currentMsgIdx + 1, consensus: newScore }]);
          return newScore;
        });

        currentMsgIdx++;
        setTimeout(triggerNextMessage, 4500);
      } else {
        setActiveStep("Consensus Reached");
        setDebating(false);
      }
    };

    setTimeout(triggerNextMessage, 2000);
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Agentic Debate Arena</h2>
            <div className="text-[10px] text-gray-500 font-mono">Module Alpha // Decision Auditing</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">{activeStep}</span>
        </div>
      </section>

      {/* WORKSPACE PANELS */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* LEFT COLUMN: CONTROL INPUTS & GRAPHS */}
        <div className="lg:col-span-1 border-r border-white/5 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Define Your Critical Goal</label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={debating}
                className="w-full h-28 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 resize-none transition-colors"
                placeholder="E.g., Should I relocate to Japan to write a sci-fi novel?"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={startDebate}
                disabled={debating || !goal}
                className="flex-1 py-3 px-6 rounded-2xl font-bold text-xs text-black bg-[#ff9900] hover:bg-[#ffaa22] disabled:bg-gray-700 disabled:text-gray-400 transition-all flex items-center justify-center gap-2"
              >
                {debating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
                {debating ? "Arena In Session" : "Initiate Debate"}
              </button>
            </div>

            {/* CONSENSUS MATRIX DIAGRAM */}
            <div className="bg-[#111827] rounded-2xl border border-white/5 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Timeline Viability</span>
                </div>
                <span className="font-mono text-xs font-black text-cyan-400">{consensusScore}%</span>
              </div>
              
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorConsensus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9900" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ff9900" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="round" stroke="#374151" fontSize={8} />
                    <YAxis domain={[0, 100]} stroke="#374151" fontSize={8} />
                    <Tooltip contentStyle={{ background: "#111827", borderColor: "#374151", borderRadius: 12, fontSize: 10 }} />
                    <Area type="monotone" dataKey="consensus" stroke="#ff9900" fillOpacity={1} fill="url(#colorConsensus)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-500 text-left mt-6">
            Nexus X multi-agent systems compile decision audits using historical model trends, market projections, and personal risk thresholds.
          </div>
        </div>

        {/* RIGHT COLUMN: THE LIVE DEBATE TERMINAL FEED */}
        <div className="lg:col-span-2 bg-[#0c111c] flex flex-col justify-between overflow-hidden relative">
          {/* Faux overlay glows */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#ff9900] blur-[140px] opacity-5 pointer-events-none" />
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {messages.length === 0 && !debating && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <HelpCircle className="w-12 h-12 text-gray-600 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Arena Standby</h4>
                  <p className="text-[11px] text-gray-500 mt-1 max-w-sm leading-relaxed">
                    Set a goal on the left panel and click Initiate to watch specialized agents debate and audit your timeline.
                  </p>
                </div>
              </div>
            )}

            {messages.length === 0 && debating && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-[#ff9900] animate-spin" />
                <div className="text-xs font-mono text-gray-400">Synchronizing agent memories...</div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, idx) => {
                const Icon = msg.avatar;
                const alignment = msg.type === "risk" ? "border-red-500/20 bg-red-500/5 text-left" : 
                                  msg.type === "financial" ? "border-emerald-500/20 bg-emerald-500/5 text-left" : 
                                  "border-cyan-500/20 bg-cyan-500/5 text-left";
                const badgeColor = msg.type === "risk" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                                   msg.type === "financial" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                                   "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className={`flex gap-4 items-start border p-5 rounded-2xl relative glass-panel ${alignment}`}
                  >
                    <div className={`p-2.5 rounded-xl border ${badgeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-white">{msg.agent}</span>
                        <span className={`text-[8px] font-black uppercase tracking-widest border px-2 py-0.5 rounded ${badgeColor}`}>
                          {msg.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed font-semibold">
                        {msg.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </div>
      </section>
    </main>
  );
}
