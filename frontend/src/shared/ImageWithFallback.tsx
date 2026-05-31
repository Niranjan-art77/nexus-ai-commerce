"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackCategory?: string;
}

export function ImageWithFallback({ src, alt, className = "", fallbackCategory = "" }: ImageWithFallbackProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    setError(false);
    setLoading(true);

    if (!src || src.startsWith("from-") || src.startsWith("to-") || src.includes("gradient")) {
      // It's a CSS gradient string, mark as error so we fallback to custom SVG/gradient render
      setError(true);
      setLoading(false);
    } else {
      setImgSrc(src);
    }
  }, [src]);

  // SVG Illustration Renderer based on Category (matching ProductHoloCard designs)
  const renderCategoryIcon = () => {
    const lowerCat = fallbackCategory.toLowerCase();

    if (lowerCat.includes("workstation")) {
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#00f0ff] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="25" y="15" width="50" height="50" rx="3" />
          <path d="M30 65 L20 85 h60 L70 65" />
          <line x1="50" y1="65" x2="50" y2="85" />
          <circle cx="50" cy="40" r="12" />
          <path d="M40 40h20M50 30v20" />
        </svg>
      );
    }
    if (lowerCat.includes("gaming")) {
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#ff007f] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="15" y="30" width="70" height="40" rx="6" />
          <circle cx="35" cy="50" r="6" fill="currentColor" />
          <path d="M60 45h10M65 40v10M20 50h8" />
        </svg>
      );
    }
    if (lowerCat.includes("monitor")) {
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#00f0ff] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 25 C30 20, 70 20, 90 25 v40 C70 45, 30 45, 10 65 V25 Z" fill="none" />
          <path d="M40 68 L30 85 h40 L60 68" />
          <circle cx="50" cy="40" r="5" fill="currentColor" />
        </svg>
      );
    }
    if (lowerCat.includes("laptop")) {
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#8a2be2] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 20 h60 v40 H20 Z" />
          <path d="M10 60 h80 l-10 20 H20 Z" fill="currentColor" fillOpacity="0.1" />
          <line x1="50" y1="70" x2="50" y2="70.1" strokeWidth="4" />
        </svg>
      );
    }
    if (lowerCat.includes("device") || lowerCat.includes("ai")) {
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#8a2be2] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="20" />
          <circle cx="50" cy="50" r="8" fill="currentColor" />
          <path d="M50 15 v15 M50 70 v15 M15 50 h15 M70 50 h15" />
        </svg>
      );
    }
    // Accessories / Default generic sci-fi hex cube
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#00f0ff] opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" />
        <line x1="50" y1="15" x2="50" y2="95" />
        <line x1="50" y1="55" x2="85" y2="35" />
        <line x1="50" y1="55" x2="15" y2="35" />
      </svg>
    );
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-black/20 ${className}`}>
      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#00f0ff]/20 border-t-[#00f0ff] rounded-full animate-spin" />
        </div>
      )}

      {/* Render Image */}
      {!error && imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />
      )}

      {/* Fallback Graphics */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white/2 to-transparent">
          {renderCategoryIcon()}
          <span className="text-[8px] text-gray-500 font-mono mt-2 text-center uppercase tracking-widest leading-none">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}
