"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { 
  Clock, Package, Truck, CheckCircle2, ChevronRight, FileText, 
  Printer, ArrowLeft, Loader2, Sparkles, ShoppingBag 
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Invoice overlay state
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await fetch("http://localhost:4000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          // Sort orders by newest first
          const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(sorted);
          if (sorted.length > 0) {
            setSelectedOrder(sorted[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, isAuthenticated, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#00f0ff] animate-spin" />
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Decrypting order history...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">Order History</h1>
            <p className="text-xs text-gray-500 mt-1 font-mono">Real-time status of your multiverse purchases.</p>
          </div>
          <button 
            onClick={() => router.push("/shop")}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00f0ff] hover:underline font-mono"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-black/10 flex flex-col items-center justify-center p-6">
            <Package className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
            <p className="text-sm text-gray-400 font-mono uppercase tracking-widest mb-6">NO TRANSACTION WAVES SUBMITTED YET</p>
            <button 
              onClick={() => router.push("/shop")}
              className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md"
            >
              Browse Shop Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Orders List */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono mb-2">Committed Waves</h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {orders.map((ord) => {
                  const isSelected = selectedOrder?._id === ord._id;
                  const itemNames = ord.items.map((i: any) => i.name).join(", ");
                  return (
                    <div 
                      key={ord._id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                        isSelected 
                          ? "bg-[#060b13] border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                          : "bg-[#060b13]/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono font-bold text-[#00f0ff]">#{ord._id.slice(-8).toUpperCase()}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <p className="text-xs text-gray-300 font-light truncate max-w-sm">{itemNames}</p>
                      
                      <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-3">
                        <span className="text-xs font-bold text-white font-mono">${ord.totalAmount?.toLocaleString()}</span>
                        
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-mono font-bold ${
                          ord.status === "Delivered" || ord.status === "delivered"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-[#8a2be2]/10 text-[#8a2be2] border border-[#8a2be2]/20"
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Tracking Details */}
            {selectedOrder && (
              <div className="lg:col-span-7 space-y-6">
                <GlassPanel className="p-6">
                  
                  {/* Title Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/5 pb-4">
                    <div>
                      <span className="text-[9px] text-[#00f0ff] font-mono uppercase tracking-widest font-bold">Active Wave telemetry</span>
                      <h2 className="text-lg font-bold uppercase text-white font-sans mt-0.5">Order Tracking</h2>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowInvoice(true)}
                        className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono uppercase tracking-widest rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Invoice
                      </button>
                    </div>
                  </div>

                  {/* Visual Tracker Pipeline */}
                  <div className="mb-8">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-6">Delivery Pipeline Stages</h3>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative px-4">
                      {/* Connection bar (Desktop) */}
                      <div className="hidden sm:block absolute left-8 right-8 top-5 h-0.5 bg-white/5 z-0" />
                      
                      {/* Delivery Stages Mapper */}
                      {(selectedOrder.deliveryStages || [
                        { stage: 'Order Placed', timestamp: selectedOrder.createdAt, completed: true },
                        { stage: 'Processing', timestamp: null, completed: selectedOrder.status !== 'pending' },
                        { stage: 'Shipped', timestamp: null, completed: ['shipped', 'delivered'].includes(selectedOrder.status) },
                        { stage: 'Delivered', timestamp: null, completed: selectedOrder.status === 'delivered' }
                      ]).map((stage: any, index: number) => {
                        const isCompleted = stage.completed;
                        const iconColor = isCompleted ? "text-[#00f0ff] stroke-[#00f0ff]" : "text-gray-600";
                        const bgClass = isCompleted 
                          ? "bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)]" 
                          : "bg-black/40 border-white/10";

                        return (
                          <div key={index} className="flex sm:flex-col items-center gap-4 sm:gap-2.5 z-10 w-full sm:w-1/4 text-left sm:text-center">
                            {/* Neon ring container */}
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${bgClass}`}>
                              {index === 0 && <Clock className={`w-4 h-4 ${iconColor}`} />}
                              {index === 1 && <Package className={`w-4 h-4 ${iconColor}`} />}
                              {index === 2 && <Truck className={`w-4 h-4 ${iconColor}`} />}
                              {index === 3 && <CheckCircle2 className={`w-4 h-4 ${iconColor}`} />}
                            </div>

                            <div>
                              <p className={`text-xs font-bold font-sans uppercase tracking-wide ${isCompleted ? "text-white" : "text-gray-500"}`}>
                                {stage.stage}
                              </p>
                              {stage.timestamp && (
                                <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                                  {new Date(stage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Itemized summary */}
                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Consigned Items</h3>
                    
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5 text-xs font-mono">
                          <div>
                            <span className="text-white font-bold block">{item.name}</span>
                            <span className="text-gray-500 text-[10px]">Qty: {item.quantity} • Unit: ${item.price.toLocaleString()}</span>
                          </div>
                          <span className="text-[#00f0ff] font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-white/10 pt-4 font-mono text-sm font-bold text-white">
                      <span>Total Value:</span>
                      <span className="text-[#00f0ff] text-base">${selectedOrder.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Shipping Coords */}
                  <div className="border-t border-white/5 pt-6 font-mono text-xs text-gray-500">
                    <p className="uppercase text-[9px] tracking-widest font-bold text-white mb-2">Delivery Coordinates</p>
                    <p>{selectedOrder.shippingAddress?.street || "Sector 7, Block B, Neo-Tokyo Grid"}</p>
                    <p>{selectedOrder.shippingAddress?.city || "Kanto District"}, {selectedOrder.shippingAddress?.postalCode || "892-09"}</p>
                  </div>

                </GlassPanel>
              </div>
            )}

          </div>
        )}

      </div>

      {/* INVOICE RECEIPTS OVERLAY MODAL */}
      <AnimatePresence>
        {showInvoice && selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-black border border-white/20 w-full max-w-2xl p-8 rounded-3xl relative font-mono text-xs text-white max-h-[90vh] overflow-y-auto print:border-0 print:p-0"
            >
              
              {/* Retro dot-matrix header */}
              <div className="text-center border-b-2 border-dashed border-white/25 pb-6 mb-6">
                <h1 className="text-2xl font-bold tracking-widest text-[#00f0ff] uppercase flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00f0ff]" /> NEXUS SYSTEM RECEIPT <Sparkles className="w-5 h-5 text-[#00f0ff]" />
                </h1>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">TRANSACTION INDEX: #{selectedOrder._id.toUpperCase()}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">DATE: {new Date(selectedOrder.createdAt).toUTCString()}</p>
              </div>

              {/* Transaction details grid */}
              <div className="grid grid-cols-2 gap-6 mb-8 text-[11px] uppercase tracking-wider">
                <div>
                  <p className="text-gray-500 mb-1">CUSTOMER RECORDS</p>
                  <p className="text-white font-bold">USER ID: USER_{selectedOrder.user?.slice(-8).toUpperCase()}</p>
                  <p className="text-gray-400">ROLE: CUSTOMER</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">DISTRIBUTION COORDS</p>
                  <p className="text-white font-bold">{selectedOrder.shippingAddress?.street || "Sector 7, Block B"}</p>
                  <p className="text-gray-400">{selectedOrder.shippingAddress?.city || "Neo-Tokyo Grid"}, {selectedOrder.shippingAddress?.postalCode || "892-09"}</p>
                </div>
              </div>

              {/* Itemized columns table */}
              <table className="w-full text-left border-b-2 border-dashed border-white/25 pb-6 mb-6">
                <thead>
                  <tr className="text-gray-500 border-b border-white/10 uppercase text-[10px] tracking-widest">
                    <th className="pb-2 font-normal">Component Identifier</th>
                    <th className="pb-2 font-normal text-center">Qty</th>
                    <th className="pb-2 font-normal text-right">Unit Price</th>
                    <th className="pb-2 font-normal text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <tr key={idx} className="text-[11px] border-b border-white/5 last:border-b-0">
                      <td className="py-3 text-white uppercase font-bold">{item.name}</td>
                      <td className="py-3 text-center text-gray-400">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-400">${item.price.toLocaleString()}</td>
                      <td className="py-3 text-right text-[#00f0ff] font-bold">${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Subtotals & Taxes breakdown */}
              <div className="flex flex-col items-end gap-2 text-[11px] uppercase tracking-wider mb-8">
                <div className="flex justify-between w-64 text-gray-400">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-64 text-gray-400">
                  <span>Network Sync Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between w-64 text-white font-bold border-t border-white/20 pt-2 text-xs">
                  <span>Total Investment:</span>
                  <span className="text-[#00f0ff]">${selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Fake Retro Barcode representation */}
              <div className="flex flex-col items-center justify-center mb-8 gap-2 border-t border-white/10 pt-8">
                <svg className="w-64 h-10 overflow-visible text-white fill-current opacity-70">
                  {/* Render thin/thick lines to look like barcode */}
                  <rect x="0" y="0" width="4" height="40" />
                  <rect x="8" y="0" width="2" height="40" />
                  <rect x="14" y="0" width="8" height="40" />
                  <rect x="26" y="0" width="4" height="40" />
                  <rect x="34" y="0" width="2" height="40" />
                  <rect x="40" y="0" width="6" height="40" />
                  <rect x="50" y="0" width="2" height="40" />
                  <rect x="56" y="0" width="10" height="40" />
                  <rect x="70" y="0" width="4" height="40" />
                  <rect x="78" y="0" width="2" height="40" />
                  <rect x="84" y="0" width="6" height="40" />
                  <rect x="94" y="0" width="4" height="40" />
                  <rect x="102" y="0" width="8" height="40" />
                  <rect x="114" y="0" width="2" height="40" />
                  <rect x="120" y="0" width="12" height="40" />
                  <rect x="136" y="0" width="4" height="40" />
                  <rect x="144" y="0" width="2" height="40" />
                  <rect x="150" y="0" width="6" height="40" />
                  <rect x="160" y="0" width="4" height="40" />
                  <rect x="168" y="0" width="2" height="40" />
                  <rect x="174" y="0" width="8" height="40" />
                  <rect x="186" y="0" width="4" height="40" />
                  <rect x="194" y="0" width="6" height="40" />
                  <rect x="204" y="0" width="2" height="40" />
                  <rect x="210" y="0" width="10" height="40" />
                  <rect x="224" y="0" width="4" height="40" />
                  <rect x="232" y="0" width="2" height="40" />
                  <rect x="238" y="0" width="6" height="40" />
                  <rect x="248" y="0" width="4" height="40" />
                </svg>
                <span className="text-[8px] text-gray-500 tracking-widest font-mono font-bold uppercase">NEXUS-NODE-AUTHENTICITY-SIG-V1.0</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 border-t border-white/10 pt-6 print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-1.5 hover:bg-[#00f0ff] hover:text-black transition-colors rounded-xl font-mono active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
                <button
                  onClick={() => setShowInvoice(false)}
                  className="px-6 py-3 border border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors font-mono active:scale-95"
                >
                  Close Receipt
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
