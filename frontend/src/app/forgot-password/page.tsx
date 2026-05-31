"use client";

import { useState } from "react";
import { Terminal, Shield, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please populate the identity email coordinate.");
      return;
    }
    setErrorMsg("");
    setMessage("");
    setLoading(true);

    try {
      // Simulate network request delays
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Local coordinate verification check
      const fallbackUsers = JSON.parse(localStorage.getItem("nexus_fallback_users") || "[]");
      const userExists = fallbackUsers.some((u: any) => u.email === email);

      if (!userExists) {
        throw new Error("Identity coordinates not found in local node registry.");
      }

      setMessage("Restoration signals successfully transmitted. Scan your inbox terminal.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to transmit restoration signal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#030712] flex items-center justify-center font-sans overflow-hidden px-4 pt-24 pb-12">
      {/* Background grids and glowing particles */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff007f]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00f0ff]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#060b13]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 relative z-10 shadow-[0_15px_50px_rgba(0,0,0,0.5),0_0_50px_rgba(255,0,127,0.05)] overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr from-[#ff007f] to-[#00f0ff] rounded-full blur-2xl opacity-45 pointer-events-none" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#ff007f] to-[#00f0ff] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.3)]">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-widest text-white text-glow">NEXUS<span className="text-[#ff007f]">.X</span></span>
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#ff007f]" /> Cipher Restoration Gate
          </span>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2.5 animate-pulse">
            <Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">Sync Error</p>
              <p className="text-[11px] text-red-300/80 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">Signal Broadcasted</p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">{message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 font-mono">
              Registered Email Coordinate
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="neo@nexus.net"
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#ff007f] focus:ring-1 focus:ring-[#ff007f] focus:outline-none text-white text-sm transition-all placeholder:text-gray-700 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#ff007f] hover:text-white transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,0,127,0.3)] disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Transmit Restore Wave</span>
                <RefreshCw className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-mono">
          <Link href="/login" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Core gate</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
