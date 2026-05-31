"use client";
import { motion } from "framer-motion";
import { Cpu, Sparkles } from "lucide-react";

export function AICopilotWidget() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8a2be2] to-[#00f0ff] p-[1px] glow-secondary">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
            NEXUS COPILOT <Sparkles className="w-3 h-3 text-[#ff007f]" />
          </h3>
          <p className="text-[10px] text-[#00f0ff] uppercase tracking-widest animate-pulse">Neural Link Active</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#8a2be2]/10 border border-[#8a2be2]/30 p-3 rounded-r-xl rounded-bl-xl max-w-[85%]"
        >
          <p className="text-xs text-gray-300 leading-relaxed">Analyzing your digital DNA... I recommend upgrading your workstation display based on your recent 3D rendering activity.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-[#00f0ff]/10 border border-[#00f0ff]/30 p-3 rounded-l-xl rounded-br-xl max-w-[85%] self-end"
        >
          <p className="text-xs text-white leading-relaxed">Show me the top ultra-wide monitors under $1000.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
          className="bg-[#8a2be2]/10 border border-[#8a2be2]/30 p-3 rounded-r-xl rounded-bl-xl max-w-[85%]"
        >
          <p className="text-xs text-gray-300 leading-relaxed">I found 3 matches with 99% compatibility to your setup. Rendering holographic previews now.</p>
        </motion.div>
      </div>

      <div className="mt-4 relative">
        <input 
          type="text" 
          disabled
          placeholder="Awaiting input..." 
          className="w-full bg-black/50 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none placeholder:text-gray-600"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#ff007f]/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#ff007f] animate-ping" />
        </div>
      </div>
    </div>
  );
}
