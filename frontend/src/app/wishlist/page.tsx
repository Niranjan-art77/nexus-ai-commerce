"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingCart, ArrowRight, Heart, Cpu } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const handleAddToCart = (item: any) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      })
    );
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
          <Heart className="w-8 h-8 text-[#ff007f] drop-shadow-[0_0_8px_rgba(255,0,127,0.4)] fill-[#ff007f]" />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">Saved Target Signatures</h1>
            <p className="text-xs text-gray-500 mt-1 font-mono">Telemetry database containing {wishlistItems.length} bookmark nodes.</p>
          </div>
        </div>

        {/* Wishlist Grid */}
        <AnimatePresence mode="popLayout">
          {wishlistItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-black/10 flex flex-col items-center justify-center p-6"
            >
              <Cpu className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
              <p className="text-sm text-gray-400 font-mono uppercase tracking-widest mb-6">NO SIGNATURES CACHED IN LOCAL TERMINAL</p>
              <button 
                onClick={() => router.push("/shop")}
                className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#00f0ff] hover:text-black transition-all rounded-xl shadow-md"
              >
                <span>Browse Multiverse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ duration: 0.25 }}
                >
                  <GlassPanel className="h-full flex flex-col justify-between p-5 relative group border-white/15 overflow-hidden">
                    {/* Background Neon Halo */}
                    <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-[40px] opacity-15 bg-gradient-to-br ${item.image}`} />

                    <div>
                      {/* Category */}
                      <span className="text-[9px] text-[#00f0ff] font-mono font-bold uppercase tracking-widest mb-1.5 block">
                        {item.category}
                      </span>
                      
                      {/* Name */}
                      <h3 
                        onClick={() => router.push(`/product/${item.id}`)}
                        className="text-sm font-bold text-white uppercase tracking-wide mb-3 group-hover:text-[#00f0ff] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      
                      {/* Price */}
                      <p className="text-[#00f0ff] font-mono font-black text-lg mb-4">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-white/5">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-2.5 bg-white hover:bg-[#00f0ff] text-black hover:text-black font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all rounded-lg"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add Wave</span>
                      </button>
                      
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="w-10 h-10 border border-white/10 hover:border-red-500/50 flex items-center justify-center rounded-lg transition-colors text-gray-400 hover:text-red-400"
                        title="De-register Target"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
