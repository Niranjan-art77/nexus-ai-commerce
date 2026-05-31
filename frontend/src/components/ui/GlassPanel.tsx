import { HTMLAttributes, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "secondary" | "accent" | "none";
}

export function GlassPanel({ children, className = "", glowColor = "none", ...props }: GlassPanelProps) {
  const glowClass = glowColor === "none" ? "" : `glow-${glowColor}`;
  
  return (
    <motion.div
      className={`glass-panel border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
