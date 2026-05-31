"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { apiService } from "@/services/apiService";
import { mockDb } from "@/utils/mockDb";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  Truck, MapPin, DollarSign, Star, CheckCircle, Navigation,
  RefreshCw, Map, AlertTriangle, Eye, ShieldAlert, Award
} from "lucide-react";

export default function DeliveryDashboard() {
  const { token } = useSelector((state: RootState) => state.auth);

  // States
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [syncLoading, setSyncLoading] = useState<string | null>(null);

  // Map coordinates simulation
  const [driverPos, setDriverPos] = useState({ x: 80, y: 120 });
  const [simulationActive, setSimulationActive] = useState(false);
  const [simSteps, setSimSteps] = useState<Array<{x: number, y: number}>>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Earning logs
  const earningsData = [
    { name: "Cycle 1", earnings: 140 },
    { name: "Cycle 2", earnings: 280 },
    { name: "Cycle 3", earnings: 210 },
    { name: "Cycle 4", earnings: 390 },
    { name: "Cycle 5", earnings: 350 },
    { name: "Cycle 6", earnings: 420 }
  ];

  // Coordinates mapping for SVGs based on order IDs
  const getOrderCoordinates = (orderId: string) => {
    // Generate deterministic coordinates based on hash
    let hash = 0;
    for (let i = 0; i < orderId.length; i++) {
      hash = orderId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.abs((hash % 250) + 70);
    const y = Math.abs(((hash >> 8) % 150) + 60);
    return { x, y };
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let ordersData = [];
      try {
        ordersData = await apiService.getOrders();
      } catch {
        ordersData = mockDb.getOrders();
      }
      // Filter orders to show pending/processing/shipped (active logistics)
      setOrders(ordersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [token, fetchOrders]);

  // Handle route simulation
  useEffect(() => {
    if (!simulationActive || simSteps.length === 0) return;
    
    const interval = setInterval(() => {
      if (currentStepIdx < simSteps.length) {
        setDriverPos(simSteps[currentStepIdx]!);
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setSimulationActive(false);
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [simulationActive, simSteps, currentStepIdx]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setSyncLoading(orderId);
    try {
      try {
        await apiService.updateOrderStatus(orderId, newStatus);
      } catch {
        // Fallback local updates
        const localOrders = JSON.parse(localStorage.getItem("nexus_fallback_orders") || "[]");
        const idx = localOrders.findIndex((o: any) => o._id === orderId);
        if (idx !== -1) {
          localOrders[idx].status = newStatus;
          // Sync stages as well
          localOrders[idx].deliveryStages = (localOrders[idx].deliveryStages || []).map((stage: any) => {
            const matchStatus = stage.stage.toLowerCase() === newStatus.toLowerCase() || 
                                (newStatus === 'processing' && stage.stage === 'Processing') ||
                                (newStatus === 'shipped' && ['processing', 'shipped'].includes(stage.stage.toLowerCase())) ||
                                (newStatus === 'delivered' && ['processing', 'shipped', 'delivered'].includes(stage.stage.toLowerCase()));
            return {
              ...stage,
              completed: stage.completed || matchStatus,
              timestamp: matchStatus ? new Date().toISOString() : stage.timestamp
            };
          });
          localStorage.setItem("nexus_fallback_orders", JSON.stringify(localOrders));
        }
      }
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncLoading(null);
    }
  };

  const startRouteOptimization = (order: any) => {
    setSelectedOrder(order);
    const target = getOrderCoordinates(order._id);
    
    // Create direct path stepping points
    const steps = [];
    const stepsCount = 15;
    const startX = driverPos.x;
    const startY = driverPos.y;

    for (let i = 1; i <= stepsCount; i++) {
      steps.push({
        x: Math.round(startX + (target.x - startX) * (i / stepsCount)),
        y: Math.round(startY + (target.y - startY) * (i / stepsCount))
      });
    }

    setSimSteps(steps);
    setCurrentStepIdx(0);
    setSimulationActive(true);
  };

  // Aggregated stats
  const activeDeliveries = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled");
  const completedDeliveries = orders.filter(o => o.status === "delivered");
  const totalEarnings = completedDeliveries.length * 45; // $45 per delivery

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-amber-500/10 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-amber-500 rounded-full animate-spin" />
        </div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase animate-pulse">Syncing logistics route grid...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto custom-scrollbar pb-10">
      
      {/* SECTION 1: METRICS & STATUS CARDS (COL-SPAN-12) */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#060b13]/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase">DRIVER REVENUES</span>
            <span className="text-lg font-black text-white font-mono block mt-1">${totalEarnings}.00</span>
          </div>
          <DollarSign className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="bg-[#060b13]/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase">ACTIVE SHIPMENTS</span>
            <span className="text-lg font-black text-white font-mono block mt-1">{activeDeliveries.length} Rigs</span>
          </div>
          <Truck className="w-8 h-8 text-blue-400 opacity-80" />
        </div>

        <div className="bg-[#060b13]/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase">TRANSIT SUCCESS</span>
            <span className="text-lg font-black text-white font-mono block mt-1">{completedDeliveries.length} Nodes</span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#060b13]/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase">PARTNER STATS</span>
            <span className="text-lg font-black text-white font-mono block mt-1">4.9 Star Rating</span>
          </div>
          <Star className="w-8 h-8 text-amber-400 fill-amber-400 opacity-80" />
        </div>

      </div>

      {/* SECTION 2: MAP HUDS & ROUTING PLOTTER (COL-SPAN-8) */}
      <div className="lg:col-span-8 bg-[#060b13]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex flex-col justify-between overflow-hidden">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-1.5">
              <Map className="w-4 h-4 text-amber-500" /> Logistics Navigation HUD
            </h3>
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Optimized route vectors</span>
          </div>
          <span className="text-[9px] font-mono text-gray-400 border border-white/10 px-2 py-0.5 rounded uppercase">Scale: 1:5000</span>
        </div>

        {/* Custom Interactive SVG grid map */}
        <div className="flex-1 min-h-[300px] border border-white/5 rounded-xl relative overflow-hidden bg-black/45 flex items-center justify-center">
          
          {/* Map Grid Background lines */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          {/* SVG Map HUD */}
          <svg viewBox="0 0 400 250" className="w-[95%] h-[95%] text-gray-700 font-mono relative z-10 select-none">
            
            {/* Roads & Pathways layout */}
            <path d="M40 40h320M40 120h320M40 200h320M80 20v210M200 20v210M320 20v210" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <path d="M40 40h320M40 120h320M40 200h320M80 20v210M200 20v210M320 20v210" fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Active destination routing vectors */}
            {selectedOrder && (
              (() => {
                const target = getOrderCoordinates(selectedOrder._id);
                return (
                  <>
                    <line x1={driverPos.x} y1={driverPos.y} x2={target.x} y2={target.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" className="animate-[pulse_1s_infinite]" />
                    <line x1={80} y1={120} x2={target.x} y2={target.y} stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                  </>
                );
              })()
            )}

            {/* Render active deliveries as glowing coordinate targets */}
            {activeDeliveries.map((ord) => {
              const coords = getOrderCoordinates(ord._id);
              const isSelected = selectedOrder?._id === ord._id;
              
              return (
                <g key={ord._id} className="cursor-pointer" onClick={() => setSelectedOrder(ord)}>
                  <circle cx={coords.x} cy={coords.y} r={isSelected ? 6 : 4} fill={isSelected ? "#f59e0b" : "#3b82f6"} className="animate-pulse" />
                  <circle cx={coords.x} cy={coords.y} r={isSelected ? 12 : 8} fill="none" stroke={isSelected ? "#f59e0b" : "#3b82f6"} strokeWidth="1" opacity={0.4} />
                  <text x={coords.x + 8} y={coords.y + 3} fill="rgba(255,255,255,0.5)" fontSize="6" fontWeight="bold">#{ord._id.slice(-6).toUpperCase()}</text>
                </g>
              );
            })}

            {/* Render vehicle driver position locator */}
            <g transform={`translate(${driverPos.x}, ${driverPos.y})`}>
              <circle cx="0" cy="0" r="5" fill="#10b981" />
              <circle cx="0" cy="0" r="10" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" style={{ animationDuration: "2s" }} />
              <polygon points="0,-4 3,4 -3,4" fill="white" transform="rotate(45)" />
            </g>
            
          </svg>

          {/* Controls Overlay */}
          <div className="absolute bottom-3 left-3 bg-[#080d1a]/90 border border-white/5 p-3 rounded-xl max-w-xs font-mono text-[9px] text-gray-400">
            <span className="text-[#f59e0b] font-bold uppercase tracking-wider block">Live Locator Feed</span>
            <div className="flex gap-2.5 mt-1.5">
              <span>DRIVER: <strong className="text-white">X:{driverPos.x} Y:{driverPos.y}</strong></span>
              <span>MARKERS: <strong className="text-white">{activeDeliveries.length} Active</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: EARNINGS ANALYTICS & GRID HEATMAPS (COL-SPAN-4) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Earnings chart */}
        <div className="bg-[#060b13]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[190px]">
          <div className="border-b border-white/5 pb-2 mb-2 flex justify-between items-center flex-shrink-0">
            <h3 className="text-xs font-black uppercase text-white tracking-wider">Accrued Cycle Earnings</h3>
            <span className="text-[8px] font-mono text-gray-500">PAYROLL</span>
          </div>

          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={7} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={7} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#060b13", borderColor: "rgba(255,255,255,0.1)", fontSize: "9px" }} />
                <Area type="monotone" dataKey="earnings" stroke="#f59e0b" fill="rgba(245,158,11,0.15)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap Grid Cells */}
        <div className="bg-[#060b13]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-[178px] overflow-hidden">
          <div className="border-b border-white/5 pb-2 mb-2">
            <h3 className="text-xs font-black uppercase text-white tracking-wider">Demand Density Matrix</h3>
            <span className="text-[8px] font-mono text-gray-500 block mt-0.5">Delivery heat frequency</span>
          </div>

          <div className="grid grid-cols-6 gap-1 flex-1 py-1">
            {[90, 20, 50, 80, 10, 60, 40, 75, 15, 85, 30, 95, 20, 45, 60, 35, 70, 90].map((val, idx) => {
              const bg = val > 80 ? "bg-amber-500/80" : 
                         val > 50 ? "bg-amber-500/40" : 
                         val > 20 ? "bg-amber-500/15" : "bg-white/2";
              return (
                <div 
                  key={idx} 
                  className={`w-full h-full rounded border border-white/5 transition-all duration-500 ${bg}`}
                  title={`Zone ${idx + 1} activity: ${val}%`}
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* SECTION 4: DELIVERY JOBS LIST & INSTANT DATABASE SYNC (COL-SPAN-12) */}
      <div className="lg:col-span-12 bg-[#060b13]/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-500" /> Transit Queue Operations
            </h3>
            <span className="text-[9px] text-gray-500 font-mono uppercase">Select orders to deploy route optimizations</span>
          </div>
          <button 
            onClick={fetchOrders}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/10"
            title="Reload telemetry queue"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                <th className="py-2.5">Order Telemetry ID</th>
                <th className="py-2.5">Client Identity</th>
                <th className="py-2.5">Shipping link Address</th>
                <th className="py-2.5">Bus Value</th>
                <th className="py-2.5">Logistics Status</th>
                <th className="py-2.5 text-right">Job actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[10px]">
              {orders.map((ord) => {
                const isSelected = selectedOrder?._id === ord._id;
                const isDelivered = ord.status === "delivered";
                
                return (
                  <tr key={ord._id} className={`transition-colors ${isSelected ? "bg-amber-500/5 hover:bg-amber-500/10" : "hover:bg-white/2"}`}>
                    <td className="py-3">
                      <span className="font-bold text-white uppercase font-mono block">#{ord._id.slice(-10).toUpperCase()}</span>
                      <span className="text-[8px] text-gray-500 mt-0.5">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3 text-gray-300 truncate max-w-[120px]">{ord.user}</td>
                    <td className="py-3 text-gray-400 truncate max-w-[150px]">{ord.shippingAddress || "Geo point linked"}</td>
                    <td className="py-3 text-amber-500 font-bold">${ord.totalAmount || ord.totalPrice}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        ord.status === "delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        ord.status === "shipped" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-[#8a2be2]/10 text-[#8a2be2] border border-[#8a2be2]/20"
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end items-center gap-2">
                        
                        {/* Map trigger */}
                        <button
                          onClick={() => startRouteOptimization(ord)}
                          className="px-2 py-1 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-gray-300 hover:text-amber-500 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Optimize Route
                        </button>

                        {/* Toggle Status action button */}
                        {!isDelivered && (
                          <button
                            onClick={() => {
                              const nextStatus = ord.status === "pending" ? "processing" : 
                                                 ord.status === "processing" ? "shipped" : "delivered";
                              handleUpdateStatus(ord._id, nextStatus);
                            }}
                            disabled={syncLoading === ord._id}
                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black rounded-lg text-[9px] font-bold uppercase transition-all border border-amber-500/20 hover:border-amber-500 font-mono active:scale-95 flex items-center gap-1 cursor-pointer"
                          >
                            {syncLoading === ord._id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <span>Mark {
                                ord.status === "pending" ? "Processing" : 
                                ord.status === "processing" ? "Shipped" : "Delivered"
                              }</span>
                            )}
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-5 text-center text-gray-600 font-mono">No active transportation schedules in database queue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
