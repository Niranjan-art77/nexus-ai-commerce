"use client";

import { useState } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { HelpCircle, MessageSquare, ChevronDown, Check, Send } from "lucide-react";

export default function SupportPage() {
  // Ticket Creator State
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [ticketCategory, setTicketCategory] = useState("shipping");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Chat Support States
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<any[]>([
    { sender: "support", text: "Hello! Thank you for contacting Nexus Client Support. How can we assist your workspace configuration today?" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const faqs = [
    { q: "How fast is Nexus Store priority shipping?", a: "Certified orders are processed immediately. Laptops and workstations typically deliver within 1-2 business days with priority channels." },
    { q: "Can I customize a compiled workstation bundle?", a: "Yes. Use our Workstation Builder tool to swap components (GPU, CPU, RAM) and confirm specification compatibility live." },
    { q: "What is your hardware return policy?", a: "We offer a flat 30-day trial refund guarantee. Return shipping is fully carbon-offset and prepaid by Nexus." },
    { q: "Do you offer student discounts?", a: "Yes. Academic verification unlocks flat 10% rebates, extended warranties, and developer package keys." }
  ];

  const handleChatSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatLog(prev => [...prev, { sender: "user", text: chatMessage }]);
    setChatMessage("");
    setChatLoading(true);

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        { sender: "support", text: "I have registered your inquiry in our queue. A client representative is review your workspace configuration metrics." }
      ]);
      setChatLoading(false);
    }, 1000);
  };

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
            Client Services Gateway
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <HelpCircle className="w-8 h-8 text-[#ff9900]" />
            Ecosystem Support
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Submit service tickets, browse verified FAQs, and talk directly to client support proxies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Columns: Ticket Creator & FAQ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Creator */}
            <div className="glass-panel border border-white/10 rounded-3xl p-6 text-left space-y-4">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold block border-b border-white/5 pb-2">
                Submit Support Ticket
              </span>

              {ticketSubmitted ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 text-emerald-400 font-mono text-xs">
                  <Check className="w-8 h-8" />
                  <span className="font-bold uppercase tracking-wider">Ticket Submitted Successfully</span>
                  <p className="text-gray-400 font-light max-w-sm">
                    Your issue was logged in the secure network. A support representative will message your workspace shortly.
                  </p>
                  <button
                    onClick={() => {
                      setTicketSubject("");
                      setTicketBody("");
                      setTicketSubmitted(false);
                    }}
                    className="mt-2 text-[#ff9900] hover:underline uppercase font-bold tracking-widest text-[10px] cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <div className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-500 uppercase tracking-wider block">Ticket Category</label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                      >
                        <option value="shipping">Logistics & Shipping</option>
                        <option value="hardware">Hardware Compatibility</option>
                        <option value="billing">Refunds & Billing</option>
                        <option value="other">General Inquiry</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-500 uppercase tracking-wider block">Subject</label>
                      <input
                        type="text"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="e.g. AeroBook compatibility issue"
                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-500 uppercase tracking-wider block">Inquiry details</label>
                    <textarea
                      rows={4}
                      value={ticketBody}
                      onChange={(e) => setTicketBody(e.target.value)}
                      placeholder="Specify your technical environment and issue..."
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!ticketSubject.trim() || !ticketBody.trim()) {
                        alert("Please specify both subject and description parameters.");
                        return;
                      }
                      setTicketSubmitted(true);
                    }}
                    className="w-full py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-mono"
                  >
                    Submit Ticket File
                  </button>
                </div>
              )}
            </div>

            {/* FAQs */}
            <div className="space-y-3 text-left">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold block border-b border-white/5 pb-2">
                Frequently Answered Inquiries
              </span>

              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const open = openFaqIdx === idx;
                  return (
                    <div 
                      key={idx}
                      className="border border-white/5 bg-[#0f172a]/20 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIdx(open ? null : idx)}
                        className="w-full p-4 flex justify-between items-center text-left hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-bold uppercase tracking-tight text-white">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-[#ff9900] transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <p className="px-4 pb-4 text-xs font-light text-gray-400 leading-relaxed font-mono">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Support Chatbot */}
          <div className="p-5 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md flex flex-col justify-between text-left font-mono h-[450px]">
            <div className="space-y-4 flex flex-col flex-1 min-h-0">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 shrink-0">
                <MessageSquare className="w-5 h-5 text-[#ff9900]" />
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-300">Live Client Chat</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar text-xs min-h-0">
                {chatLog.map((chat, idx) => (
                  <div key={idx} className={`flex flex-col ${chat.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-left ${
                      chat.sender === "user" 
                        ? "bg-[#ff9900]/10 border border-[#ff9900]/20 text-white" 
                        : "bg-white/5 border border-white/5 text-gray-300"
                    }`}>
                      <p className="leading-relaxed font-mono text-[10px]">{chat.text}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-[9px] shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
                    <span>Client representative typing...</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleChatSubmit} className="flex items-center gap-2 mt-4 border-t border-white/5 pt-4 shrink-0">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask support details..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff9900]"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
