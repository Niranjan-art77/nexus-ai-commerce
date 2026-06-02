"use client";

import { NavBar } from "@/components/ui/NavBar";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Smartphone, Cpu, Zap, Monitor, 
  ShieldCheck, Eye, Layers, Package, HelpCircle 
} from "lucide-react";

export default function CategoriesPage() {
  const router = useRouter();

  const categories = [
    { name: "Smartphones", count: "115 items", desc: "Mobile terminals, neural processors, and accessories.", icon: Smartphone, color: "text-blue-400" },
    { name: "Laptops", count: "115 items", desc: "High compile-speed laptops and creative notebooks.", icon: Cpu, color: "text-[#ff9900]" },
    { name: "Gaming", count: "115 items", desc: "Esports grade peripherals and high bandwidth adapters.", icon: Zap, color: "text-red-500" },
    { name: "Monitors", count: "115 items", desc: "Spatial OLED displays and high dynamic rate panels.", icon: Monitor, color: "text-purple-400" },
    { name: "AI Devices", count: "115 items", desc: "Autonomous AI companions and computational cores.", icon: Sparkles, color: "text-pink-400" },
    { name: "Smart Home", count: "115 items", desc: "Automated grid regulators, doorbells, and locks.", icon: ShieldCheck, color: "text-emerald-400" },
    { name: "VR Tech", count: "115 items", desc: "Immersion shields, haptic gloves, and tracking nodes.", icon: Eye, color: "text-cyan-400" },
    { name: "Workstations", count: "115 items", desc: "64-Core compilations nodes and rendering setups.", icon: Layers, color: "text-amber-500" },
    { name: "Accessories", count: "115 items", desc: "Compact GaN chargers, stand links, and cables.", icon: Package, color: "text-gray-400" }
  ];

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
            Ecosystem Directories
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            Ecosystem Departments
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Browse through custom partitioned hardware categories compiled for immediate workspace alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.name)}`)}
                className="p-6 border border-white/5 bg-[#0f172a]/30 backdrop-blur-md rounded-3xl text-left cursor-pointer transition-all hover:border-[#ff9900]/30 hover:shadow-[0_0_20px_rgba(255,153,0,0.04)] select-none flex flex-col justify-between h-48 group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${cat.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{cat.count}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-[#ff9900] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal font-light line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="text-[9px] uppercase tracking-widest text-[#ff9900] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity mt-4 flex items-center gap-1">
                  Explore Department &gt;
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
