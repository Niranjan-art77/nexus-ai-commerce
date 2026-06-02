"use client";

import { useState, useMemo } from "react";
import { NavBar } from "@/components/ui/NavBar";
import { mockDb } from "@/utils/mockDb";
import { useRouter } from "next/navigation";
import { Briefcase, Cpu, ShieldCheck, Sparkles, BookOpen, Layers } from "lucide-react";

export default function CareerHubPage() {
  const router = useRouter();
  const [selectedCareer, setSelectedCareer] = useState("Software Engineer");

  const careerData = useMemo(() => {
    const mappings: Record<string, { desc: string; devices: string[]; courses: string[]; tools: string[] }> = {
      "Software Engineer": {
        desc: "Optimize compilation pipelines, buffer massive source projects, and manage local Docker containers. Priority specs: multi-core compile frequencies and RAM capacity.",
        devices: ["Dell XPS 15 Creator Edition", "MacBook Pro 16-inch M3 Max"],
        courses: ["Advanced System Architect Certification", "React Design & Microservices Architectures"],
        tools: ["Docker Desktop Enterprise License", "VS Code Pro Cloud Compiler"]
      },
      "ML Engineer": {
        desc: "Train transformers, build neural sandboxes, and run on-device token queries. Priority specs: high GPU VRAM pools and high-bandwidth caching slots.",
        devices: ["Intel Xeon Multi-GPU Server Build", "NVIDIA RTX 6000 Ada Workstation"],
        courses: ["Deep Learning & LLM Fine-Tuning Labs", "PyTorch GPU Sharding Architectures"],
        tools: ["JupyterLab Pro Sandbox Kit", "Hugging Face Enterprise Client Key"]
      },
      "Video Editor": {
        desc: "Compile multi-layer raw logs, color-grade details, and output 4K workflows. Priority specs: high screen resolutions and specialized hardware encoder arrays.",
        devices: ["Mac Studio M2 Ultra Studio Set", "LG OLED Curved Spatial Display"],
        courses: ["DaVinci Resolve Color Grading Masterclass", "Premiere Pro Rendering Optimization"],
        tools: ["Adobe Creative Suite Pro License Key", "100TB High-Speed NAS Cache Node"]
      },
      "Cybersecurity Analyst": {
        desc: "Build sandboxes, audit network stacks, trace protocols, and intercept system logs. Priority specs: hyper-threaded core structures and virtualization chips.",
        devices: ["Lenovo ThinkPad P1 Custom Rig", "Anker Multi-port Hub Shield"],
        courses: ["CompTIA Security+ Lab Exercises", "Ethical Hacking & Sandbox Construction"],
        tools: ["Kali Linux Enterprise Sandbox Key", "Hardware USB Rubber Ducky Node"]
      },
      "Data Scientist": {
        desc: "Formulate Bayesian inference calculations, shard databases, and deploy visualization nodes. Priority specs: high-capacity RAM arrays and storage speed.",
        devices: ["Dell XPS 15 Creator Edition", "Mac Studio M2 Ultra Studio Set"],
        courses: ["Apache Spark Clusters Masterclass", "Applied Bayesian Inference & Stan Models"],
        tools: ["Tableau Developer License Key", "PostgreSQL Cloud Sharded Index"]
      },
      "Student": {
        desc: "Access digital modules, write structural code, and secure foundational certifications. Priority specs: durable battery runtimes and affordable price ratios.",
        devices: ["iPhone 15 Pro", "Dell XPS 15 Creator Edition"],
        courses: ["Computer Science Foundations Certification", "Modern App Development Basics"],
        tools: ["Notion Pro Academic Key", "GitHub Student Developer Pack Access"]
      }
    };
    return mappings[selectedCareer] || mappings["Software Engineer"]!;
  }, [selectedCareer]);

  return (
    <main className="relative min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#ff9900]/30 overflow-x-hidden">
      <NavBar />
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 space-y-8 z-10 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#ff9900]/10 border border-[#ff9900]/20 px-3 py-1 rounded-full font-mono text-[9px] font-bold text-[#ff9900] uppercase tracking-widest mb-3">
            Ecosystem Goal Boards
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-[#ff9900]" />
            Career Goals Hub
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Map hardware configurations, software packages, and educational tracks to match target workspace milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu selectors */}
          <div className="space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none shrink-0 font-mono text-[10px] uppercase">
            {[
              "Software Engineer", "ML Engineer", "Video Editor", 
              "Cybersecurity Analyst", "Data Scientist", "Student"
            ].map((role) => {
              const active = selectedCareer === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedCareer(role)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all border text-left shrink-0 cursor-pointer ${
                    active
                      ? "bg-[#ff9900]/10 border-[#ff9900]/40 text-[#ff9900] shadow-[0_0_10px_rgba(255,153,0,0.05)]"
                      : "bg-transparent border-transparent text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>{role}</span>
                </button>
              );
            })}
          </div>

          {/* Details output board */}
          <div className="lg:col-span-3 glass-panel border border-white/5 rounded-3xl p-6 text-left space-y-6">
            <div className="space-y-1 border-b border-white/5 pb-4">
              <span className="text-[9px] uppercase tracking-widest text-[#ff9900] font-mono font-bold block">Career Node Path</span>
              <h3 className="text-lg font-black text-white uppercase">{selectedCareer}</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed font-mono">{careerData.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px]">
              {/* Devices */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Recommended Hardware</span>
                <div className="space-y-2">
                  {careerData.devices.map(dev => (
                    <div 
                      key={dev} 
                      onClick={() => {
                        const results = mockDb.getProducts({ search: dev });
                        if (results.length > 0) {
                          router.push(`/product/${results[0]?._id}`);
                        } else {
                          router.push("/shop");
                        }
                      }}
                      className="p-3 rounded-xl border border-white/5 bg-black/40 hover:border-[#ff9900]/30 transition-all cursor-pointer text-white font-bold"
                    >
                      {dev}
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Training Modules</span>
                <div className="space-y-2">
                  {careerData.courses.map(course => (
                    <div 
                      key={course}
                      onClick={() => alert(`Launching mock sandbox course: "${course}"`)}
                      className="p-3 rounded-xl border border-white/5 bg-black/40 hover:border-cyan-500/30 transition-all text-gray-300 cursor-pointer"
                    >
                      {course}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase text-gray-500 font-bold block border-b border-white/5 pb-1">Software Stacks</span>
                <div className="space-y-2">
                  {careerData.tools.map(tool => (
                    <div 
                      key={tool}
                      onClick={() => alert(`Adding software token to cart: "${tool}"`)}
                      className="p-3 rounded-xl border border-white/5 bg-black/40 hover:border-[#ff9900]/30 transition-all text-gray-300 cursor-pointer"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
