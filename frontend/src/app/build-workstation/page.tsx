"use client";

import { useState, useMemo, useCallback } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "@/store/slices/cartSlice";
import { Sliders, Cpu, Sparkles, Check } from "lucide-react";

const BUILDER_PARTS = {
  cpu: [
    { id: "cpu-1", name: "Intel Core i9-14900K", price: 589, specs: "24 Cores / 32 Threads / 6.0 GHz" },
    { id: "cpu-2", name: "AMD Ryzen 9 7950X", price: 649, specs: "16 Cores / 32 Threads / 5.7 GHz" },
    { id: "cpu-3", name: "Intel Xeon W9-3495X", price: 999, specs: "56 Cores / 112 Threads / Workstation" }
  ],
  gpu: [
    { id: "gpu-1", name: "NVIDIA GeForce RTX 5090", price: 1999, specs: "32GB GDDR7 VRAM / Next-Gen" },
    { id: "gpu-2", name: "NVIDIA GeForce RTX 4090", price: 1599, specs: "24GB GDDR6X VRAM / Ray Tracing" },
    { id: "gpu-3", name: "NVIDIA RTX 6000 Ada", price: 2899, specs: "48GB GDDR6 VRAM / Professional" }
  ],
  ram: [
    { id: "ram-1", name: "64GB DDR5 Dual-Channel", price: 249, specs: "6400 MT/s CL32 Corsair" },
    { id: "ram-2", name: "128GB DDR5 Quad-Channel", price: 549, specs: "6000 MT/s ECC G.Skill" },
    { id: "ram-3", name: "256GB DDR5 High-Capacity Array", price: 1199, specs: "5600 MT/s Crucial System" }
  ],
  cooling: [
    { id: "cool-1", name: "Liquid AIO Cooler 360mm", price: 159, specs: "Triple Silent PWM Fans" },
    { id: "cool-2", name: "Custom Hard-Tubing Loop", price: 299, specs: "Dual Radiator / D5 Pump Reservoir" },
    { id: "cool-3", name: "Phase Change Sub-Zero Cooling", price: 699, specs: "Automated Condensation Control" }
  ],
  storage: [
    { id: "ssd-1", name: "2TB PCIe Gen5 NVMe M.2 SSD", price: 189, specs: "Crucial T700 / 12,400 MB/s" },
    { id: "ssd-2", name: "4TB PCIe Gen5 NVMe M.2 SSD", price: 349, specs: "Sabrent Rocket / 12,400 MB/s" },
    { id: "ssd-3", name: "8TB NVMe Enterprise RAID Array", price: 899, specs: "ASUS Hyper M.2 / PCIe Gen5" }
  ]
};

export default function BuildWorkstationPage() {
  const dispatch = useDispatch();

  const [profession, setProfession] = useState("Software Engineer");
  const [purpose, setPurpose] = useState("AI Development & Compile Loops");

  const [selections, setSelections] = useState({
    cpu: BUILDER_PARTS.cpu[0]!,
    gpu: BUILDER_PARTS.gpu[0]!,
    ram: BUILDER_PARTS.ram[0]!,
    cooling: BUILDER_PARTS.cooling[0]!,
    storage: BUILDER_PARTS.storage[0]!
  });

  const totalCost = useMemo(() => {
    return (
      selections.cpu.price +
      selections.gpu.price +
      selections.ram.price +
      selections.cooling.price +
      selections.storage.price
    );
  }, [selections]);

  const compatibilityScore = useMemo(() => {
    let score = 100;
    if (selections.cpu.id === "cpu-1" && selections.ram.id === "ram-3") {
      score -= 10; 
    }
    if (selections.gpu.id === "gpu-3" && selections.cooling.id === "cool-1") {
      score -= 15; 
    }
    return score;
  }, [selections]);

  const handleCompileRig = useCallback(() => {
    const customRig = {
      _id: `custom-rig-${Date.now()}`,
      name: `Custom Workstation Setup (${profession})`,
      price: totalCost,
      images: [""],
      category: "Workstations",
      description: `Custom configured workspace node. CPU: ${selections.cpu.name}. GPU: ${selections.gpu.name}. RAM: ${selections.ram.name}. Cooling: ${selections.cooling.name}. Storage: ${selections.storage.name}.`,
    };
    dispatch(
      addToCartAction({
        id: customRig._id,
        name: customRig.name,
        price: customRig.price,
        quantity: 1,
        image: "",
      })
    );
    alert("Your customized workstation configuration was successfully compiled and added to your cart!");
  }, [totalCost, selections, profession, dispatch]);

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
            Hardware Compilations
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-8 h-8 text-[#ff9900]" />
            Workstation Configurator
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Design and compile custom enterprise-aligned desktop nodes. Check specifications compatibility live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selections column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel border border-white/15 rounded-3xl p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block">Target Profession</label>
                  <select 
                    value={profession} 
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                  >
                    {["Software Engineer", "ML Engineer", "Video Editor", "Cybersecurity Analyst", "Data Scientist", "Student"].map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block">Development Purpose</label>
                  <input 
                    type="text" 
                    value={purpose} 
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Individual parts configuration */}
              <div className="space-y-4 font-mono text-xs">
                {/* CPU */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-t border-white/5 pt-4">
                  <div className="text-left">
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Processors (CPU)</span>
                    <span className="text-xs text-gray-400 block mt-0.5">{selections.cpu.specs}</span>
                  </div>
                  <select
                    value={selections.cpu.id}
                    onChange={(e) => setSelections(prev => ({ ...prev, cpu: BUILDER_PARTS.cpu.find(x => x.id === e.target.value)! }))}
                    className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    {BUILDER_PARTS.cpu.map(x => (
                      <option key={x.id} value={x.id}>{x.name} (+${x.price})</option>
                    ))}
                  </select>
                </div>

                {/* GPU */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-t border-white/5 pt-4">
                  <div className="text-left">
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Graphics Card (GPU)</span>
                    <span className="text-xs text-gray-400 block mt-0.5">{selections.gpu.specs}</span>
                  </div>
                  <select
                    value={selections.gpu.id}
                    onChange={(e) => setSelections(prev => ({ ...prev, gpu: BUILDER_PARTS.gpu.find(x => x.id === e.target.value)! }))}
                    className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    {BUILDER_PARTS.gpu.map(x => (
                      <option key={x.id} value={x.id}>{x.name} (+${x.price})</option>
                    ))}
                  </select>
                </div>

                {/* RAM */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-t border-white/5 pt-4">
                  <div className="text-left">
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">System Memory (RAM)</span>
                    <span className="text-xs text-gray-400 block mt-0.5">{selections.ram.specs}</span>
                  </div>
                  <select
                    value={selections.ram.id}
                    onChange={(e) => setSelections(prev => ({ ...prev, ram: BUILDER_PARTS.ram.find(x => x.id === e.target.value)! }))}
                    className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    {BUILDER_PARTS.ram.map(x => (
                      <option key={x.id} value={x.id}>{x.name} (+${x.price})</option>
                    ))}
                  </select>
                </div>

                {/* Cooling */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-t border-white/5 pt-4">
                  <div className="text-left">
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Cooling Solution</span>
                    <span className="text-xs text-gray-400 block mt-0.5">{selections.cooling.specs}</span>
                  </div>
                  <select
                    value={selections.cooling.id}
                    onChange={(e) => setSelections(prev => ({ ...prev, cooling: BUILDER_PARTS.cooling.find(x => x.id === e.target.value)! }))}
                    className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    {BUILDER_PARTS.cooling.map(x => (
                      <option key={x.id} value={x.id}>{x.name} (+${x.price})</option>
                    ))}
                  </select>
                </div>

                {/* Storage */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-t border-white/5 pt-4">
                  <div className="text-left">
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">SSD Storage Node</span>
                    <span className="text-xs text-gray-400 block mt-0.5">{selections.storage.specs}</span>
                  </div>
                  <select
                    value={selections.storage.id}
                    onChange={(e) => setSelections(prev => ({ ...prev, storage: BUILDER_PARTS.storage.find(x => x.id === e.target.value)! }))}
                    className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    {BUILDER_PARTS.storage.map(x => (
                      <option key={x.id} value={x.id}>{x.name} (+${x.price})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout sidebar */}
          <div className="p-6 border border-white/10 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md flex flex-col justify-between text-left font-mono h-full min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="w-5 h-5 text-[#ff9900]" />
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-300">Config Validation</span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">Compatibility Score</span>
                  <span className={`text-xl font-black block ${compatibilityScore >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                    {compatibilityScore}% / 100
                  </span>
                </div>

                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">Virtualization Support</span>
                  <span className="text-xs font-bold text-white block">Verified Hardware</span>
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-gray-400 leading-relaxed font-light">
                  {compatibilityScore === 100 
                    ? "✓ Parameters aligned. Heat dissipation buffers and voltage matrices are calibrated."
                    : "⚠ Selected RAM arrays or GPU loads might require minor compile clock adjustments."
                  }
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5">
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-[9px] uppercase text-gray-500 font-bold">Rig Cost Pool</span>
                <span className="text-xl font-black text-[#ff9900]">${totalCost.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCompileRig}
                className="w-full py-2.5 bg-[#ff9900] hover:bg-[#ffb700] text-black font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer text-center"
              >
                Compile Rig & Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
