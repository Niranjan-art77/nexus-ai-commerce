"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Send, Cpu, Disc, Shield, Settings, Zap, 
  Terminal, Sparkles, RefreshCw, Layers, CheckCircle2, 
  AlertCircle, Copy, Check, ChevronRight, BarChart2 
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { mockDb } from "@/utils/mockDb";
import { NavBar } from "@/components/ui/NavBar";

interface MessageItem {
  id: number;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}

const SUGGESTIONS = [
  "Optimize my workstation core cooling loops",
  "Recommend workstations compatible with AI Architect profile",
  "Review developer specifications of Quantum Rig V9",
  "Compare the performance metrics of Core Station"
];

export default function AICopilotPage() {
  const { token } = useSelector((state: RootState) => state.auth);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([
    { 
      id: 1,
      role: 'ai', 
      content: "Hello. I'm your Nexus productivity assistant. I can help you search, compare, or configure your high-performance computing setups. What kind of project workload are you targeting today?",
      timestamp: new Date().toLocaleTimeString()
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<"developer" | "analyst" | "creative">("developer");
  const [memoryBuffer, setMemoryBuffer] = useState<number>(32); // GB
  const [copilotPerformance, setCopilotPerformance] = useState<boolean>(true);
  const [calibrating, setCalibrating] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status Checklist states
  const [checklist, setChecklist] = useState({
    engineActive: true,
    latencyStable: true,
    credentialsVerified: true,
    offloadingEnabled: true
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Audio simulation timer
  useEffect(() => {
    if (micActive) {
      const timer = setTimeout(() => {
        setMicActive(false);
        handleSendMessage(null as any, "Select a high-speed development machine with liquid cooling");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [micActive]);

  // Typewriter streaming simulator
  const streamMessage = (fullText: string) => {
    setLoading(false);
    const words = fullText.split(" ");
    let currentText = "";
    let wordIndex = 0;
    
    const newMessageId = Date.now();
    setMessages(prev => [
      ...prev,
      {
        id: newMessageId,
        role: 'ai',
        content: "",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    
    const timer = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
        setMessages(prev => prev.map(m => m.id === newMessageId ? { ...m, content: currentText } : m));
        wordIndex++;
      } else {
        clearInterval(timer);
      }
    }, 25);
  };

  async function handleSendMessage(e: React.FormEvent, customText?: string) {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMessage = textToSend.trim();
    if (!customText) setInputText("");
    
    setMessages((prev) => [
      ...prev, 
      { 
        id: Date.now() - 1,
        role: "user", 
        content: userMessage,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setLoading(true);

    try {
      let aiResponse = "";
      try {
        const response = await fetch("http://localhost:4000/api/ai/copilot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) throw new Error("API offline");
        const data = await response.json();
        aiResponse = data.response;
      } catch (err) {
        console.warn("AI copilot API down. Falling back to local offline model...", err);
        await new Promise((resolve) => setTimeout(resolve, 600));
        aiResponse = mockDb.getAiResponse(userMessage);
      }
      
      streamMessage(aiResponse);
    } catch (err) {
      console.error("AI copilot request failed:", err);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now(),
          role: "ai", 
          content: "A temporary offline mode is active. Please check your connectivity parameters. Ready to queue locally.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  const handleRecalibrate = () => {
    setCalibrating(true);
    setChecklist({
      engineActive: false,
      latencyStable: false,
      credentialsVerified: false,
      offloadingEnabled: false
    });

    setTimeout(() => {
      setChecklist(prev => ({ ...prev, engineActive: true }));
    }, 600);
    setTimeout(() => {
      setChecklist(prev => ({ ...prev, latencyStable: true }));
    }, 1200);
    setTimeout(() => {
      setChecklist(prev => ({ ...prev, credentialsVerified: true }));
    }, 1700);
    setTimeout(() => {
      setChecklist(prev => ({ ...prev, offloadingEnabled: true }));
      setCalibrating(false);
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'ai',
          content: `Calibration finished. Active workspace mode reset to **${workspaceMode.toUpperCase()}**. Memory buffers compiled at **${memoryBuffer} GB**. Latency metrics stabilized at **0.65ms**.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 2200);
  };

  const copyCodeToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple markdown parsing function
  const renderMarkdown = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const codeLines = part.slice(3, -3).trim().split("\n");
        const language = codeLines[0] && !codeLines[0].startsWith(" ") ? codeLines[0] : "typescript";
        const code = language === codeLines[0] ? codeLines.slice(1).join("\n") : codeLines.join("\n");
        const codeId = `code-block-${index}`;
        
        return (
          <div key={index} className="my-3 border border-white/10 rounded-xl overflow-hidden font-mono text-xs bg-black/80 shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-gray-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">{language}</span>
              <button
                type="button"
                onClick={() => copyCodeToClipboard(code, codeId)}
                className="text-[9px] hover:text-white uppercase tracking-widest font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedId === codeId ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-gray-200">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      const lines = part.split("\n");
      return (
        <div key={index} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            if (line.trim().startsWith("- ")) {
              return (
                <ul key={lIdx} className="list-disc pl-5 my-1 text-gray-300 font-light">
                  <li>{parseInlineMarkdown(line.trim().substring(2))}</li>
                </ul>
              );
            }
            if (line.trim() === "") return <div key={lIdx} className="h-2" />;
            return (
              <p key={lIdx} className="text-sm font-light text-gray-300 leading-relaxed">
                {parseInlineMarkdown(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const parseInlineMarkdown = (text: string) => {
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((bPart, idx) => {
      if (bPart.startsWith("**") && bPart.endsWith("**")) {
        return (
          <strong key={idx} className="font-bold text-white text-glow-xs">
            {bPart.slice(2, -2)}
          </strong>
        );
      }
      const codeParts = bPart.split(/(`.*?`)/g);
      return codeParts.map((cPart, cIdx) => {
        if (cPart.startsWith("`") && cPart.endsWith("`")) {
          return (
            <code key={cIdx} className="px-1.5 py-0.5 bg-white/10 border border-white/5 rounded text-xs font-mono text-[#00f0ff]">
              {cPart.slice(1, -1)}
            </code>
          );
        }
        return cPart;
      });
    });
  };

  return (
    <main className="relative w-screen h-screen bg-[#030712] overflow-hidden flex flex-col pt-16 font-sans">
      
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#8a2be2]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00f0ff]/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030712_95%)]" />
      </div>

      <NavBar />

      {/* CORE WORKSPACE GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 z-10 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* LEFT COLUMN: PARAMETER PANEL (COL-SPAN-3) */}
        <aside className="col-span-1 lg:col-span-3 flex flex-col gap-4 overflow-hidden h-full">
          
          {/* CORE HUB PANEL */}
          <GlassPanel className="p-5 flex flex-col justify-between flex-1 relative overflow-hidden bg-black/40 border border-white/10 rounded-2xl">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <Cpu className="w-5 h-5 text-[#8a2be2]" />
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Nexus Core Hub</h2>
                  <span className="text-[9px] text-[#00f0ff] uppercase tracking-widest font-mono">Workspace Controller</span>
                </div>
              </div>

              {/* Workspace Mode */}
              <div className="mb-6">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-3 font-mono">Workspace Mode</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["developer", "analyst", "creative"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setWorkspaceMode(mode)}
                      className={`py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider border transition-all ${
                        workspaceMode === mode 
                          ? "bg-[#8a2be2]/25 border-[#8a2be2] text-white font-bold" 
                          : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memory Buffer limits */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">Memory Allocation</span>
                  <span className="text-xs font-mono font-bold text-[#00f0ff]">{memoryBuffer} GB</span>
                </div>
                <input 
                  type="range"
                  min="8"
                  max="128"
                  step="8"
                  value={memoryBuffer}
                  onChange={(e) => setMemoryBuffer(Number(e.target.value))}
                  className="w-full accent-[#8a2be2] bg-white/5 rounded-lg appearance-none h-1 cursor-pointer mb-2"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                  <span>8 GB</span>
                  <span>128 GB</span>
                </div>
              </div>

              {/* System checklist */}
              <div className="mb-6">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-3.5 font-mono">Active Parameters</span>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400">Inference Latency</span>
                    <span className="text-[#00f0ff]">{calibrating ? "..." : `${(0.8 - (memoryBuffer / 256) * 0.4).toFixed(2)}ms`}</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400">Context Window</span>
                    <span className="text-white">{(memoryBuffer * 2000).toLocaleString()} tokens</span>
                  </div>
                </div>
              </div>

              {/* Dynamic activity checklist */}
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-3 font-mono">Status Checklist</span>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${checklist.engineActive ? "border-green-500/50 text-green-400 bg-green-500/10" : "border-white/10 text-gray-500"}`}>
                      {checklist.engineActive ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1 h-1 bg-gray-500 rounded-full" />}
                    </div>
                    <span className={checklist.engineActive ? "text-gray-200" : "text-gray-500"}>Model Engine Cached</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${checklist.latencyStable ? "border-green-500/50 text-green-400 bg-green-500/10" : "border-white/10 text-gray-500"}`}>
                      {checklist.latencyStable ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1 h-1 bg-gray-500 rounded-full" />}
                    </div>
                    <span className={checklist.latencyStable ? "text-gray-200" : "text-gray-500"}>Workload Thread Optimizations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${checklist.credentialsVerified ? "border-green-500/50 text-green-400 bg-green-500/10" : "border-white/10 text-gray-500"}`}>
                      {checklist.credentialsVerified ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1 h-1 bg-gray-500 rounded-full" />}
                    </div>
                    <span className={checklist.credentialsVerified ? "text-gray-200" : "text-gray-500"}>Authentication Credentials</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${checklist.offloadingEnabled ? "border-green-500/50 text-green-400 bg-green-500/10" : "border-white/10 text-gray-500"}`}>
                      {checklist.offloadingEnabled ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1 h-1 bg-gray-500 rounded-full" />}
                    </div>
                    <span className={checklist.offloadingEnabled ? "text-gray-200" : "text-gray-500"}>Memory Swaps Verified</span>
                  </div>
                </div>
              </div>

            </div>

            <button 
              onClick={handleRecalibrate}
              disabled={calibrating}
              className="w-full py-3 bg-[#8a2be2]/15 border border-[#8a2be2]/30 hover:bg-[#8a2be2]/30 text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-6"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${calibrating ? "animate-spin" : ""}`} />
              {calibrating ? "Re-Compiling Pipelines..." : "Recalibrate Core"}
            </button>
          </GlassPanel>

        </aside>

        {/* RIGHT COLUMN: COMMAND CHAT WORKSPACE (COL-SPAN-9) */}
        <section className="col-span-1 lg:col-span-9 flex flex-col overflow-hidden h-full">
          
          <GlassPanel className="flex-1 flex flex-col overflow-hidden bg-black/40 border border-white/10 rounded-2xl h-full">
            
            {/* Header */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-20 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Nexus Assistant Command Feed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Processor Node:</span>
                <span className="text-[10px] text-[#8a2be2] border border-[#8a2be2]/30 bg-[#8a2be2]/10 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">
                  Local Cache Link
                </span>
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative z-10 custom-scrollbar">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,43,226,0.01)_0%,transparent_70%)] pointer-events-none" />
              
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-[#8a2be2] to-[#00f0ff] p-[1px] shadow-[0_0_15px_rgba(138,43,226,0.15)] mt-1">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                          <Cpu className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-1">
                      <div className={`p-4 rounded-2xl text-xs md:text-sm border transition-all ${
                        msg.role === 'user' 
                          ? 'bg-[#00f0ff]/10 border-[#00f0ff]/20 text-white rounded-tr-none shadow-[0_0_15px_rgba(0,240,255,0.02)]' 
                          : 'bg-black/50 border-white/5 text-gray-300 rounded-tl-none shadow-[0_0_15px_rgba(138,43,226,0.02)]'
                      }`}>
                        {msg.role === 'ai' ? renderMarkdown(msg.content) : <p className="font-light leading-relaxed">{msg.content}</p>}
                      </div>
                      <span className={`text-[8px] font-mono text-gray-600 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 max-w-[85%] self-start"
                >
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-[#8a2be2] to-[#00f0ff] p-[1px] mt-1">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-white animate-spin" />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl text-xs font-mono text-gray-500 bg-black/50 border border-white/5 rounded-tl-none flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#8a2be2] animate-pulse" />
                    Processing query coordinates...
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Simulated Microphone Waveform Overlay */}
            <AnimatePresence>
              {micActive && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-x-0 bottom-[88px] mx-6 p-4 bg-black/85 backdrop-blur-md border border-[#ff007f]/30 rounded-2xl z-30 flex flex-col items-center justify-center gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#ff007f] font-bold uppercase tracking-widest">
                    <Mic className="w-4 h-4 animate-pulse" />
                    Voice Capture Session Active
                  </div>
                  {/* Waveform SVG */}
                  <svg className="w-64 h-12 text-[#ff007f]" viewBox="0 0 256 48" fill="none">
                    <motion.path 
                      d="M 10,24 Q 25,2 40,24 T 70,24 T 100,24 T 130,24 T 160,24 T 190,24 T 220,24 T 246,24" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      animate={{
                        d: [
                          "M 10,24 Q 25,2 40,24 T 70,24 T 100,2 T 130,46 T 160,2 T 190,24 T 220,24 T 246,24",
                          "M 10,24 Q 25,24 40,2 Q 70,46 100,24 T 130,2 T 160,46 T 190,2 T 220,24 T 246,24",
                          "M 10,24 Q 25,2 40,24 T 70,24 T 100,24 T 130,24 T 160,24 T 190,24 T 220,24 T 246,24"
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    />
                  </svg>
                  <span className="text-[10px] font-mono text-gray-500">Listening to voice inputs...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestion Chips */}
            <div className="px-6 pb-2 pt-3 bg-black/10 flex flex-wrap gap-2.5 z-20 border-t border-white/5 flex-shrink-0">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(null as any, sug)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 hover:border-[#8a2be2]/40 text-[10px] text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all text-left font-mono max-w-sm truncate cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-black/60 border-t border-white/5 relative z-20 flex-shrink-0">
              <div className="relative flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setMicActive(!micActive)}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all relative group cursor-pointer ${
                    micActive 
                      ? "bg-[#ff007f]/10 border-[#ff007f] text-[#ff007f]" 
                      : "bg-white/5 border-white/5 hover:border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {micActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter query commands or ask questions here..." 
                    className="w-full bg-black border border-white/5 rounded-xl px-5 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-[#8a2be2] focus:ring-1 focus:ring-[#8a2be2] transition-all placeholder:text-gray-600 font-light tracking-wider font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Zap className="w-4 h-4 text-[#8a2be2] animate-pulse opacity-40" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center hover:bg-[#00f0ff] hover:text-black transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </form>

          </GlassPanel>

        </section>

      </div>

    </main>
  );
}


