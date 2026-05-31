"use client";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromCart, updateQuantity, addToCart } from "@/store/slices/cartSlice";
import { ShoppingCart, Plus, Minus, Trash2, Cpu, ShieldCheck, ArrowRight, Zap, Gauge } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/ui/NavBar";

export default function CartPage() {
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const subtotal = totalAmount;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleUpdateQty = (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <main className="relative w-screen h-screen bg-[#030712] overflow-hidden flex flex-col pt-16 font-sans">
      <NavBar />
      
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00f0ff]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#8a2be2]/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030712_95%)]" />
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="flex-grow flex overflow-hidden h-[calc(100vh-64px)] w-full z-10 relative">
        
        {/* LEFT COLUMN: SHOPPING CART ITEMS & RECOMMENDED CO-PILOT ADDITIONS (SCROLLABLE) */}
        <div className="flex-grow h-full flex flex-col overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
               <ShoppingCart className="w-7 h-7 text-[#00f0ff]" />
               System Cart
            </h1>

            <div className="flex flex-col gap-4">
              {items.length === 0 ? (
                <GlassPanel className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-7 h-7 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Your cart is empty</h3>
                  <p className="text-xs text-gray-400 mb-6 font-mono">Add items to your cart from the workstation shop.</p>
                  <button 
                    onClick={() => router.push("/shop")}
                    className="px-5 py-2.5 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-[#00f0ff] transition-all cursor-pointer"
                  >
                    Browse Shop
                  </button>
                </GlassPanel>
              ) : (
                items.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <GlassPanel className="p-4 flex flex-col sm:flex-row gap-5 items-center group">
                      <div className="w-24 h-24 rounded-xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0 p-2">
                        {item.image && item.image.startsWith("https://") ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      
                      <div className="flex-grow text-center sm:text-left font-mono">
                        <h3 className="text-lg font-bold text-white tracking-wide mb-1">{item.name}</h3>
                        <p className="text-[#00f0ff] text-sm font-bold">${item.price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-full px-3 py-1 font-mono">
                          <button 
                            onClick={() => handleUpdateQty(item.id, item.quantity, -1)} 
                            className="w-5 h-5 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQty(item.id, item.quantity, 1)} 
                            className="w-5 h-5 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemove(item.id)} 
                          className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </GlassPanel>
                  </motion.div>
                ))
              )}

              {/* Recommended Pairings */}
              {items.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 p-[1px] rounded-xl bg-gradient-to-r from-[#8a2be2]/50 to-[#ff007f]/50 relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
                  <div className="relative z-10 bg-black/75 rounded-lg p-5 flex flex-col sm:flex-row items-center gap-5 group-hover:bg-black/60 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8a2be2] to-[#ff007f] flex items-center justify-center p-[1px] shadow-[0_0_15px_rgba(138,43,226,0.2)] flex-shrink-0">
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left font-mono">
                      <h4 className="text-xs font-bold text-[#8a2be2] uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
                        Recommended Hardware Pairing
                      </h4>
                      <p className="text-white text-xs">Add the <span className="font-bold">Holo-Display Pro</span> to maximize workstation display rendering capabilities.</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        dispatch(addToCart({
                          id: "seed_3",
                          name: "Holo-Display Pro",
                          price: 1450,
                          quantity: 1,
                          image: "from-[#ff007f] to-transparent"
                        }));
                      }}
                      className="px-4 py-2 bg-[#8a2be2]/10 border border-[#8a2be2]/30 text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg hover:bg-[#8a2be2]/30 transition-all whitespace-nowrap cursor-pointer"
                    >
                      Add for $1,450
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
        {items.length > 0 && (
          <aside className="w-96 h-full flex flex-col border-l border-white/5 bg-black/30 p-6 flex-shrink-0 justify-between">
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-black uppercase tracking-widest mb-2 border-b border-white/5 pb-3 text-white font-mono">Order Summary</h3>
              
              {/* Telemetry Metrics */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 font-mono text-[10px]">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1.5 uppercase">
                    <Zap className="w-3.5 h-3.5 text-[#00f0ff]" /> Workstation Estimated TDP
                  </span>
                  <span className="text-[#00f0ff] font-bold">{(subtotal * 0.12).toFixed(2)} W</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1.5 uppercase">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Environmental Impact Index
                  </span>
                  <span className="text-emerald-400 font-bold">{(subtotal * 0.08).toFixed(1)} kg CO2</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-[#00f0ff] rounded-full" style={{ width: `${Math.min((subtotal / 100), 100)}%` }} />
                  <div className="absolute top-0 right-0 h-full bg-emerald-400" style={{ width: `${Math.min((subtotal * 0.08 / 10), 100)}%` }} />
                </div>
              </div>

              {/* Price Details */}
              <div className="flex flex-col gap-3 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 uppercase tracking-widest text-[9px] font-bold">Standard Shipping</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <div className="flex justify-between items-end border-t border-white/5 pt-4 font-mono">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Total Value</span>
                <span className="text-2xl font-black text-[#00f0ff]">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <button 
                onClick={() => router.push("/checkout")}
                className="w-full relative px-6 py-3.5 bg-white text-black font-black uppercase tracking-widest text-[10px] overflow-hidden group rounded-xl cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> PROCEED TO CHECKOUT
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
              </button>

              <div className="text-center font-mono text-[9px] text-gray-600">
                Secure SSL Encrypted Checkout
              </div>
            </div>
          </aside>
        )}

      </div>
    </main>
  );
}
