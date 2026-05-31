"use client";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Users } from "lucide-react";

export function LiveAnalyticsWidget() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00f0ff]" />
          Ecosystem Live Telemetry
        </h3>
        <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-pulse shadow-[0_0_10px_#ff007f]"></span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-black/40 border border-white/5 rounded-xl p-4 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Active Users</p>
          <p className="text-2xl font-bold text-white text-glow">24,592</p>
          <TrendingUp className="w-4 h-4 text-[#00f0ff] absolute top-4 right-4 opacity-50" />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-black/40 border border-white/5 rounded-xl p-4 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#8a2be2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Network Vol</p>
          <p className="text-2xl font-bold text-white text-glow">$1.2M</p>
          <Activity className="w-4 h-4 text-[#8a2be2] absolute top-4 right-4 opacity-50" />
        </motion.div>
      </div>

      <div className="mt-2 bg-black/40 border border-white/5 rounded-xl p-4">
         <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">AI Node Activity</p>
         <div className="flex items-end gap-1 h-12">
            {[40, 70, 45, 90, 65, 85, 30, 50, 70, 100, 60, 80].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                className="flex-1 bg-gradient-to-t from-[#8a2be2]/50 to-[#00f0ff] rounded-t-sm"
              />
            ))}
         </div>
      </div>
    </div>
  );
}
