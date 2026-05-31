"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, ShieldAlert, CheckCircle2, User, Clock, 
  AlertTriangle, Sparkles, Send, RefreshCw, BarChart3, Star, 
  Zap, HelpCircle, Search, Filter, Plus, Trash2 
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";

interface Ticket {
  id: string;
  customerName: string;
  customerTier: "Pioneer" | "Pro" | "Standard";
  issue: string;
  severity: "critical" | "medium" | "low";
  status: "open" | "in-progress" | "resolved";
  timestamp: string;
  messages: Array<{ sender: "user" | "operator"; text: string; time: string }>;
  aiSuggestions: string[];
}

const initialTickets: Ticket[] = [
  {
    id: "TCK-8291",
    customerName: "Nihar",
    customerTier: "Pioneer",
    issue: "DNA calibration sync failed on Gemini Core 2.5 node.",
    severity: "critical",
    status: "open",
    timestamp: "10 mins ago",
    messages: [
      { sender: "user", text: "I attempted to sync my diagnostic DNA profile, but the response timed out at 1.2ms.", time: "10m ago" }
    ],
    aiSuggestions: [
      "We detected a high queue latency on the neural pipeline. Force re-elevate roles to flush session cache.",
      "Ensure port 4000 is open in your local network firewall and restart the Node compiler.",
      "A developer override role bypass has been enabled. Re-authenticating should solve the sync mismatch."
    ]
  },
  {
    id: "TCK-8292",
    customerName: "Devin",
    customerTier: "Pro",
    issue: "Quantum screen flickering under high GPU compute.",
    severity: "medium",
    status: "in-progress",
    timestamp: "45 mins ago",
    messages: [
      { sender: "user", text: "My screen flickers whenever I run deep neural network compilation training.", time: "45m ago" },
      { sender: "operator", text: "Hi Devin, let's verify if your liquid cooling loop pressure is nominal.", time: "30m ago" },
      { sender: "user", text: "Temp is at 78°C, but there's a weird artifact line on the left side.", time: "28m ago" }
    ],
    aiSuggestions: [
      "Please adjust the chassis shell material density and verify cooling parameters in your seller inventory edit.",
      "Check if your graphics bus latency matches the recommended 1.2ms in your telemetry HUD.",
      "We will issue an RMA return label. You can print the custom invoice from your Seller Terminal."
    ]
  },
  {
    id: "TCK-8293",
    customerName: "Erlich",
    customerTier: "Standard",
    issue: "Where is my ordered liquid cooling loop?",
    severity: "low",
    status: "open",
    timestamp: "2 hours ago",
    messages: [
      { sender: "user", text: "Order status shows pending. Can I get a priority delivery route?", time: "2h ago" }
    ],
    aiSuggestions: [
      "Your order has been assigned to a Logistics dispatcher. Check the Delivery HUD for live coordinates.",
      "We have expedited this order. Delivery updates will display inside the Customer pipeline waves section.",
      "Standard orders have a default processing threshold of 24h. You can view the live grid zone map to track status."
    ]
  },
  {
    id: "TCK-8294",
    customerName: "Monica",
    customerTier: "Pro",
    issue: "Fraud alert triggered during bulk purchase.",
    severity: "critical",
    status: "resolved",
    timestamp: "4 hours ago",
    messages: [
      { sender: "user", text: "I tried to order 5 workstations and got locked out by security shields.", time: "4h ago" },
      { sender: "operator", text: "We have updated the Admin security panel settings to pass through.", time: "3h ago" }
    ],
    aiSuggestions: []
  }
];

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexus_support_tickets");
      return stored ? JSON.parse(stored) : initialTickets;
    }
    return initialTickets;
  });

  const [activeTicketId, setActiveTicketId] = useState<string>(tickets[0]?.id || "");
  const [chatInput, setChatInput] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "medium" | "low">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "in-progress" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  // New Ticket Form State
  const [newCustomer, setNewCustomer] = useState("");
  const [newTier, setNewTier] = useState<"Pioneer" | "Pro" | "Standard">("Standard");
  const [newIssue, setNewIssue] = useState("");
  const [newSeverity, setNewSeverity] = useState<"critical" | "medium" | "low">("low");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_support_tickets", JSON.stringify(tickets));
    }
  }, [tickets]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicketId, tickets]);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  // Filter Tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSeverity = filterSeverity === "all" || t.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesSearch = t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  // Send Message
  const handleSendMessage = (textToSend?: string) => {
    const msgText = textToSend || chatInput;
    if (!msgText.trim() || !activeTicketId) return;

    setTickets(prev => prev.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          status: t.status === "open" ? "in-progress" : t.status,
          messages: [...t.messages, { sender: "operator", text: msgText, time: "Just now" }]
        };
      }
      return t;
    }));

    if (!textToSend) setChatInput("");

    // Simulate short delay, then user replies or closes
    if (msgText.toLowerCase().includes("rmar") || msgText.toLowerCase().includes("refund")) {
      setIsAiAnswering(true);
      setTimeout(() => {
        setTickets(prev => prev.map(t => {
          if (t.id === activeTicketId) {
            return {
              ...t,
              messages: [...t.messages, { sender: "user", text: "Excellent operator. Initiating returns now.", time: "1 min ago" }]
            };
          }
          return t;
        }));
        setIsAiAnswering(false);
      }, 2000);
    }
  };

  // Inject AI suggestion
  const handleInjectAiSuggestion = (suggestion: string) => {
    setChatInput(suggestion);
  };

  // Toggle Ticket Status
  const handleToggleStatus = (ticketId: string, status: "open" | "in-progress" | "resolved") => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status };
      }
      return t;
    }));
  };

  // Delete Ticket
  const handleDeleteTicket = (ticketId: string) => {
    if (confirm(`De-register ticket ${ticketId}?`)) {
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      if (activeTicketId === ticketId) {
        setActiveTicketId(tickets.find(t => t.id !== ticketId)?.id || "");
      }
    }
  };

  // Create Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim() || !newIssue.trim()) return;

    const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const fresh: Ticket = {
      id: newId,
      customerName: newCustomer,
      customerTier: newTier,
      issue: newIssue,
      severity: newSeverity,
      status: "open",
      timestamp: "Just now",
      messages: [
        { sender: "user", text: newIssue, time: "Just now" }
      ],
      aiSuggestions: [
        `Processing initial telemetry request for ${newCustomer}.`,
        "Sync custom workspace configuration values to flush state.",
        "We are accelerating delivery dispatcher tasks now."
      ]
    };

    setTickets(prev => [fresh, ...prev]);
    setActiveTicketId(newId);
    setShowNewTicketModal(false);

    // Reset Form
    setNewCustomer("");
    setNewTier("Standard");
    setNewIssue("");
    setNewSeverity("low");
  };

  // Analytics Metrics
  const resolvedCount = tickets.filter(t => t.status === "resolved").length;
  const inProgressCount = tickets.filter(t => t.status === "in-progress").length;
  const openCount = tickets.filter(t => t.status === "open").length;

  const severityPieData = [
    { name: "Critical", value: tickets.filter(t => t.severity === "critical").length, color: "#ef4444" },
    { name: "Medium", value: tickets.filter(t => t.severity === "medium").length, color: "#f59e0b" },
    { name: "Low", value: tickets.filter(t => t.severity === "low").length, color: "#10b981" }
  ].filter(d => d.value > 0);

  const csatTrend = [
    { day: "Mon", score: 92 },
    { day: "Tue", score: 94 },
    { day: "Wed", score: 91 },
    { day: "Thu", score: 95 },
    { day: "Fri", score: 96 },
    { day: "Sat", score: 98 },
    { day: "Sun", score: 97 }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden font-sans gap-6">
      
      {/* GRID OVERVIEW DASH STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-white/5 bg-white/2">
          <div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest block uppercase">Open Tickets</span>
            <span className="text-xl font-black text-white mt-1 block">{openCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-white/5 bg-white/2">
          <div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest block uppercase">In Progress</span>
            <span className="text-xl font-black text-amber-500 mt-1 block">{inProgressCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-white/5 bg-white/2">
          <div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest block uppercase">Resolved</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">{resolvedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-white/5 bg-white/2">
          <div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest block uppercase">CSAT Performance</span>
            <span className="text-xl font-black text-[#00f0ff] mt-1 block">97.4%</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center border border-[#00f0ff]/20 text-[#00f0ff]">
            <Star className="w-5 h-5 fill-[#00f0ff]" />
          </div>
        </div>
      </div>

      {/* CORE SPLIT WORKSPACE INTERFACE */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* LEFT COLUMN: TICKET QUEUE CONTROLLER */}
        <div className="w-full lg:w-80 flex flex-col border border-white/5 bg-[#060b13]/60 rounded-2xl p-4 min-h-0 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-500" /> TICKET BUFFER
            </h3>
            <button 
              onClick={() => setShowNewTicketModal(true)}
              className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-1 text-[9px] font-mono font-bold uppercase"
            >
              <Plus className="w-3.5 h-3.5" /> File Ticket
            </button>
          </div>

          {/* Filters and search */}
          <div className="space-y-2 mb-4 font-mono text-[9px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
              <input 
                type="text"
                placeholder="Search ticket, customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-black/45 border border-white/5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-[7.5px] text-gray-500 uppercase font-black mb-1">Severity</span>
                <select 
                  value={filterSeverity}
                  onChange={e => setFilterSeverity(e.target.value as any)}
                  className="bg-black/60 border border-white/5 rounded-lg py-1.5 px-2 text-gray-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">ALL SEVERITY</option>
                  <option value="critical">CRITICAL</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                </select>
              </div>

              <div className="flex flex-col">
                <span className="text-[7.5px] text-gray-500 uppercase font-black mb-1">Status</span>
                <select 
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                  className="bg-black/60 border border-white/5 rounded-lg py-1.5 px-2 text-gray-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="open">OPEN</option>
                  <option value="in-progress">IN PROGRESS</option>
                  <option value="resolved">RESOLVED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ticket queue feed */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/5 rounded-xl text-xs text-gray-500 font-mono">
                No tickets matching variables.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isActive = t.id === activeTicketId;
                const severityColors = {
                  critical: "border-l-red-500 text-red-500 bg-red-500/5",
                  medium: "border-l-amber-500 text-amber-500 bg-amber-500/5",
                  low: "border-l-emerald-500 text-emerald-500 bg-emerald-500/5"
                };

                const tierColors = {
                  Pioneer: "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/20",
                  Pro: "bg-[#8a2be2]/10 text-[#8a2be2] border-[#8a2be2]/20",
                  Standard: "bg-white/5 text-gray-400 border-white/10"
                };

                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
                    className={`p-3 rounded-xl border border-white/5 border-l-4 cursor-pointer transition-all ${
                      isActive ? "bg-white/5 border-white/20" : "hover:bg-white/2"
                    } ${severityColors[t.severity]}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono font-bold text-white">{t.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-mono font-bold border ${tierColors[t.customerTier]}`}>
                        {t.customerTier}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-300 font-medium truncate mb-2">{t.issue}</p>

                    <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-500">
                      <span>{t.customerName}</span>
                      <span className="capitalize">{t.status}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: OPERATOR CHAT DESK */}
        <div className="flex-1 flex flex-col border border-white/5 bg-[#060b13]/60 rounded-2xl p-5 min-h-0">
          {activeTicket ? (
            <>
              {/* Active Ticket Header details */}
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-white/5 pb-4 mb-4 gap-3 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">{activeTicket.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase ${
                      activeTicket.severity === "critical" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                      activeTicket.severity === "medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {activeTicket.severity} severity
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{activeTicket.customerName} &bull; <span className="font-mono text-gray-500 text-[10.5px]">Loyalty: {activeTicket.customerTier}</span></h3>
                </div>

                {/* Status operations override */}
                <div className="flex items-center gap-1.5 font-mono text-[9px]">
                  <button 
                    onClick={() => handleToggleStatus(activeTicket.id, "open")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
                      activeTicket.status === "open" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-black/40 border-white/5 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Open
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(activeTicket.id, "in-progress")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
                      activeTicket.status === "in-progress" ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-black/40 border-white/5 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(activeTicket.id, "resolved")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
                      activeTicket.status === "resolved" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-black/40 border-white/5 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Resolved
                  </button>
                  <button 
                    onClick={() => handleDeleteTicket(activeTicket.id)}
                    className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Ticket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat Stream Logs */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 mb-4">
                {activeTicket.messages.map((m, idx) => {
                  const isOperator = m.sender === "operator";
                  return (
                    <div 
                      key={idx}
                      className={`flex ${isOperator ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isOperator 
                          ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-tr-none shadow-md shadow-emerald-950/20" 
                          : "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none"
                      }`}>
                        <div className="flex justify-between items-center gap-6 text-[8px] font-mono text-white/50 mb-1">
                          <span>{isOperator ? "SUPPORT AGENT" : "CUSTOMER"}</span>
                          <span>{m.time}</span>
                        </div>
                        <p className="leading-relaxed font-sans">{m.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isAiAnswering && (
                  <div className="flex justify-start">
                    <div className="bg-white/2 border border-white/5 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-gray-400 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span className="font-mono text-[9px]">CUSTOMER IS TRANSCRIBING...</span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Message Composer */}
              <div className="border-t border-white/5 pt-4 flex-shrink-0">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2"
                >
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type dispatch instructions or select AI prompt below..."
                    className="flex-1 bg-black/45 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button 
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs">
              <MessageSquare className="w-10 h-10 text-gray-600 mb-3" />
              <span>No tickets currently active. Select or add a ticket node.</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI AUTOCOMPLETE HELPER & ANALYTICS BAR */}
        <div className="w-full lg:w-72 flex flex-col gap-6 flex-shrink-0">
          
          {/* AI Helper Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#060b13]/60 flex flex-col min-h-0">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white flex items-center gap-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" /> AI AUTOCOMPLETE
            </h3>

            {activeTicket && activeTicket.aiSuggestions && activeTicket.aiSuggestions.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                <span className="text-[8px] text-gray-500 uppercase font-black font-mono block mb-1">Generated Draft Options</span>
                {activeTicket.aiSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInjectAiSuggestion(s)}
                    className="w-full text-left p-3 rounded-xl bg-black/45 hover:bg-[#00f0ff]/5 border border-white/5 hover:border-[#00f0ff]/30 text-[10px] text-gray-300 hover:text-white transition-all leading-normal relative group"
                  >
                    <span className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 text-[7px] text-[#00f0ff] font-mono font-bold">INJECT</span>
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-500 font-mono text-[10px] py-8">
                No active suggestions for selected ticket node.
              </div>
            )}
          </div>

          {/* Quick CSAT Recharts Area */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#060b13]/60">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white flex items-center gap-1.5 mb-4">
              <BarChart3 className="w-4 h-4 text-purple-500" /> RESOLUTION RATE
            </h3>
            
            <div className="w-full h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={csatTrend}>
                  <defs>
                    <linearGradient id="supportGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#060b13", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 9, fontFamily: "monospace" }} 
                    labelStyle={{ color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8a2be2" strokeWidth={2} fillOpacity={1} fill="url(#supportGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-500 mt-2">
              <span>Avg CSAT score</span>
              <span className="text-[#8a2be2] font-bold">95.1 / 100</span>
            </div>
          </div>
        </div>

      </div>

      {/* NEW TICKET FORM MODAL */}
      <AnimatePresence>
        {showNewTicketModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#060b13] border border-white/10 rounded-2xl p-6 shadow-2xl font-mono text-xs"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-400" /> REGISTER TICKET
                </h3>
                <button 
                  onClick={() => setShowNewTicketModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4 text-left">
                <div>
                  <label className="block text-[8.5px] text-gray-500 uppercase font-black mb-1.5">Customer Name</label>
                  <input 
                    type="text"
                    required
                    value={newCustomer}
                    onChange={e => setNewCustomer(e.target.value)}
                    placeholder="e.g. Nihar"
                    className="w-full bg-black/45 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] text-gray-500 uppercase font-black mb-1.5">Loyalty Tier</label>
                    <select 
                      value={newTier}
                      onChange={e => setNewTier(e.target.value as any)}
                      className="w-full bg-black/45 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Standard">Standard Tier</option>
                      <option value="Pro">Pro Tier</option>
                      <option value="Pioneer">Pioneer Tier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8.5px] text-gray-500 uppercase font-black mb-1.5">Severity</label>
                    <select 
                      value={newSeverity}
                      onChange={e => setNewSeverity(e.target.value as any)}
                      className="w-full bg-black/45 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] text-gray-500 uppercase font-black mb-1.5">Describe Issue Node</label>
                  <textarea 
                    required
                    rows={3}
                    value={newIssue}
                    onChange={e => setNewIssue(e.target.value)}
                    placeholder="Describe network/node failure parameters..."
                    className="w-full bg-black/45 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  COMMIT TO TICKETS BUFFER
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
