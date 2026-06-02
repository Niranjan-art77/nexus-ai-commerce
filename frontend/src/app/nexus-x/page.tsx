"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cpu } from "lucide-react";

export default function NexusXRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Perform redirect to the redesigned experimental AI lab page
    router.push("/nexus-ai-lab");
  }, [router]);

  return (
    <main className="w-full min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center font-sans p-6 text-center select-none">
      <div className="space-y-4 max-w-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse text-cyan-400">
          <Cpu className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black uppercase tracking-widest text-glow-cyan text-cyan-400 font-mono">
            Redirecting Session
          </h2>
          <p className="text-xs text-gray-500 font-mono">
            Transitioning old telemetry protocols into the redesigned Nexus AI Lab interface...
          </p>
        </div>
        <Link 
          href="/nexus-ai-lab" 
          className="text-xs text-[#ff9900] hover:underline font-mono uppercase tracking-widest font-bold block pt-2 cursor-pointer"
        >
          Click here if redirect fails
        </Link>
      </div>
    </main>
  );
}
