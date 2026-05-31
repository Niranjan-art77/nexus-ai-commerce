"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { mockDb } from "@/utils/mockDb";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart2, Store, Activity, Plus, Trash2, Edit, 
  AlertTriangle, RefreshCw, CheckCircle, TrendingUp, DollarSign,
  Package, Truck, Tag, HelpCircle, Users, Check, X, ShieldCheck,
  Percent, FileText, Send, Warehouse, ShieldAlert, Award, FileSpreadsheet
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Legend, AreaChart, Area 
} from "recharts";

export default function SellerDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Tabs: analytics, products, inventory, orders, discounts, financial, profile
  const [activeTab, setActiveTab] = useState<
    "analytics" | "products" | "inventory" | "orders" | "discounts" | "financial" | "profile"
  >("analytics");
  const [loading, setLoading] = useState(true);

  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // CRUD Product Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    description: "",
    price: 0,
    discount: 0,
    category: "Laptops",
    stock: 10,
    tags: "",
    specifications: "Warranty: 1-Year Certified, Form Factor: Ultra Laptop"
  });

  // Bulk Upload Simulator
  const [bulkStatus, setBulkStatus] = useState("");

  // Reviews Watch & Moderation Request
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [flaggedReviews, setFlaggedReviews] = useState<string[]>([]);

  // Coupons / Discounts Builder
  const [coupons, setCoupons] = useState<any[]>([
    { code: "DEALS15", amount: 15, type: "percentage", active: true },
    { code: "RIGMONEY", amount: 100, type: "fixed", active: true }
  ]);
  const [newCoupon, setNewCoupon] = useState({ code: "", amount: 10, type: "percentage" });
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Advertising & Bid CPC
  const [advertisingList, setAdvertisingList] = useState<any[]>([
    { prodId: "prod-curated-0", clicks: 124, cost: 48, cpc: 0.40, revenue: 1998 },
    { prodId: "prod-curated-1", clicks: 88, cost: 52, cpc: 0.60, revenue: 1199 }
  ]);
  const [newAdCpcBid, setNewAdCpcBid] = useState({ prodId: "", bid: 0.50 });

  // Shipping & Warehouse Config
  const [activeWarehouses, setActiveWarehouses] = useState<any[]>([
    { id: "WH-EAST", name: "Depot East Core", region: "NY Zone", capacity: 85 },
    { id: "WH-WEST", name: "Depot West Grid", region: "CA Zone", capacity: 42 }
  ]);
  const [shippingCarriers, setShippingCarriers] = useState<any[]>([
    { carrier: "UPS Ground", rate: 12.50, enabled: true },
    { carrier: "DHL Express", rate: 35.00, enabled: true },
    { carrier: "Quantum Fast Logistics", rate: 45.00, enabled: false }
  ]);

  // Financial & Payout tracking
  const [pendingBalance, setPendingBalance] = useState(2450.00);
  const [withdrawnBalance, setWithdrawnBalance] = useState(14800.00);
  const [payoutLogs, setPayoutLogs] = useState<any[]>([
    { date: "2026-05-15", amount: 4800.00, method: "Wire Transfer (Chase)", status: "Delivered" },
    { date: "2026-05-01", amount: 10000.00, method: "Wire Transfer (Chase)", status: "Delivered" }
  ]);

  // AI Seller Assistant Chat Drawer
  const [aiChatMessages, setAiChatMessages] = useState<any[]>([
    { sender: "assistant", text: "Hello! I am your AI Seller Assistant. I can check your inventory health, analyze profit trends, suggest bulk discounts, or check days-to-depletion metrics. What catalog analytics can I run for you?" }
  ]);
  const [aiChatInput, setAiChatInput] = useState("");

  // Analytics datasets
  const revenueData = [
    { name: "Mon", sales: 2400, orders: 4, profit: 480 },
    { name: "Tue", sales: 1398, orders: 3, profit: 279 },
    { name: "Wed", sales: 9800, orders: 12, profit: 1960 },
    { name: "Thu", sales: 3908, orders: 6, profit: 781 },
    { name: "Fri", sales: 4800, orders: 7, profit: 960 },
    { name: "Sat", sales: 3800, orders: 5, profit: 760 },
    { name: "Sun", sales: 4300, orders: 6, profit: 860 }
  ];

  const forecastData = [
    { name: "Week 1", projected: 5400, current: 4800 },
    { name: "Week 2", projected: 6200, current: 0 },
    { name: "Week 3", projected: 7800, current: 0 },
    { name: "Week 4", projected: 9100, current: 0 }
  ];

  const fetchSellerData = useCallback(() => {
    setLoading(true);
    try {
      const prods = mockDb.getProducts({});
      setProducts(prods);

      const ords = mockDb.getOrders();
      setOrders(ords);

      // Extract reviews for this seller's products
      const revs: any[] = [];
      prods.forEach(p => {
        if (p.reviews && p.reviews.length) {
          p.reviews.forEach((r: any) => {
            revs.push({ ...r, productName: p.name, productId: p._id });
          });
        }
      });
      setReviewsList(revs);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellerData();
  }, [fetchSellerData]);

  // CRUD Actions
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || productForm.price <= 0) return;

    const tagList = productForm.tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    const specMap: Record<string, string> = {};
    productForm.specifications.split(",").forEach(spec => {
      const parts = spec.split(":");
      if (parts.length >= 2) {
        specMap[parts[0]!.trim()] = parts[1]!.trim();
      }
    });

    const payload: any = {
      name: productForm.name,
      brand: productForm.brand || "Nexus",
      category: productForm.category,
      price: Number(productForm.price),
      discount: Number(productForm.discount),
      stock: Number(productForm.stock),
      description: productForm.description || "Premium merchant listing product.",
      tags: tagList.length ? tagList : [productForm.category.toLowerCase()],
      specifications: specMap,
      seller: "Nexus Tech Wholesalers Ltd",
      approvalStatus: "Approved"
    };

    if (editProduct) {
      payload._id = editProduct._id;
      payload.id = editProduct.id;
    }

    mockDb.saveProduct(payload);
    fetchSellerData();
    setShowAddForm(false);
    setEditProduct(null);
    setProductForm({ name: "", brand: "", description: "", price: 0, discount: 0, category: "Laptops", stock: 10, tags: "", specifications: "Warranty: 1-Year Certified" });
  };

  const handleEditClick = (product: any) => {
    setEditProduct(product);
    const specsStr = product.specifications 
      ? Object.entries(product.specifications).map(([k, v]) => `${k}:${v}`).join(", ") 
      : "Warranty: 1-Year Certified";
    setProductForm({
      name: product.name,
      brand: product.brand || "Nexus",
      description: product.description || "",
      price: product.price,
      discount: product.discount || 0,
      category: product.category,
      stock: product.stock,
      tags: product.tags?.join(", ") || "",
      specifications: specsStr
    });
    setShowAddForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this listing from the database?")) {
      mockDb.deleteProduct(id);
      fetchSellerData();
    }
  };

  // Bulk Upload Simulator
  const handleTriggerBulkUpload = () => {
    setBulkStatus("Analyzing manifest CSV columns...");
    setTimeout(() => {
      setBulkStatus("Seeding catalog variations...");
      
      const newItems = [
        { name: "Apex Gaming Mouse Gen-7", brand: "Razer", price: 129, stock: 45, category: "Gaming" },
        { name: "Ultradock Thunderbolt Hub 12-Port", brand: "Nexus", price: 189, stock: 20, category: "Accessories" },
        { name: "Creator Studio Sound Card V2", brand: "Sony", price: 299, stock: 15, category: "Accessories" }
      ];

      newItems.forEach(item => {
        mockDb.saveProduct({
          ...item,
          description: "Bulk uploaded hardware component configured for elite workstations.",
          discount: 10,
          specifications: { "Interface": "Thunderbolt 4", "Warranty": "2-Years" },
          seller: "Nexus Tech Wholesalers Ltd",
          approvalStatus: "Approved"
        });
      });

      setBulkStatus("Bulk upload successfully registered! Added 3 products.");
      fetchSellerData();
    }, 2000);
  };

  // Flag inappropriate review
  const handleFlagReview = (id: string) => {
    if (flaggedReviews.includes(id)) return;
    setFlaggedReviews([...flaggedReviews, id]);
    alert("Review flagged for administrator moderation. The system team will review the comments within 24 hours.");
  };

  // Order Fulfillment Dispatch
  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    const ords = mockDb.getOrders();
    const updated = ords.map((o: any) => {
      if (o._id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    mockDb.saveOrders(updated);
    setOrders(updated);
  };

  // Coupon Operations
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    setCoupons([{ ...newCoupon, active: true }, ...coupons]);
    setNewCoupon({ code: "", amount: 10, type: "percentage" });
    setShowCouponForm(false);
  };

  // Set Ad Bidding
  const handleSetAdBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdCpcBid.prodId) return;
    
    const existingIdx = advertisingList.findIndex(a => a.prodId === newAdCpcBid.prodId);
    if (existingIdx !== -1) {
      const updated = [...advertisingList];
      updated[existingIdx]!.cpc = newAdCpcBid.bid;
      setAdvertisingList(updated);
    } else {
      setAdvertisingList([...advertisingList, { prodId: newAdCpcBid.prodId, clicks: 0, cost: 0, cpc: newAdCpcBid.bid, revenue: 0 }]);
    }
    
    alert(`CPC Bid updated successfully to $${newAdCpcBid.bid.toFixed(2)}!`);
    setNewAdCpcBid({ prodId: "", bid: 0.50 });
  };

  // Instant payout processing
  const handleTriggerPayout = () => {
    if (pendingBalance <= 0) {
      alert("No pending balances available for payout clearance.");
      return;
    }
    
    const payoutAmount = pendingBalance;
    setWithdrawnBalance(prev => prev + payoutAmount);
    setPendingBalance(0);
    setPayoutLogs([
      { date: new Date().toISOString().substring(0, 10), amount: payoutAmount, method: "Instant Transfer (Debit Card)", status: "Processing" },
      ...payoutLogs
    ]);
    alert(`Payout of $${payoutAmount.toLocaleString()} successfully dispatched to Chase Bank Account!`);
  };

  // Seller Assistant AI Chat
  const handleAiChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userText = aiChatInput.trim();
    setAiChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setAiChatInput("");

    setTimeout(() => {
      const q = userText.toLowerCase();
      let reply = "";

      if (q.includes("stock") || q.includes("inventory") || q.includes("low")) {
        const lowList = products.filter(p => p.stock <= 5);
        if (lowList.length > 0) {
          reply = `You currently have ${lowList.length} products with critical low stock: ${lowList.map(p => `${p.name} (${p.stock} units)`).join(", ")}. We recommend restock allocations today.`;
        } else {
          reply = "Your catalog items maintain normal inventory parameters. Total products monitored: " + products.length;
        }
      } else if (q.includes("depletion") || q.includes("forecast")) {
        reply = "Average catalog depletion rates project that Laptops and Gaming segments will remain stocked for 22 days, while accessories may deplete within 9 days due to increased checkout volume.";
      } else if (q.includes("profit") || q.includes("margin")) {
        reply = "Your storefront profit margins currently average 20% on Laptops and 35% on Accessories. Total weekly profit logged: $5,290.";
      } else if (q.includes("bulk") || q.includes("discount")) {
        reply = "We suggest running a tag discount on Laptops. Setting a 10% coupon increases checkout click-through rates by up to 25% on our dashboard metrics.";
      } else {
        reply = `Analyzing query: "${userText}". As your store copilot, I suggest checking inventory levels, reviewing payouts, or configuring active campaigns. Let me know if you would like me to compile a forecast.`;
      }

      setAiChatMessages(prev => [...prev, { sender: "assistant", text: reply }]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#ff9900] border-t-transparent animate-spin" />
        <span className="text-xs text-gray-400 font-mono">Synchronizing merchant node logs...</span>
      </div>
    );
  }

  // Statistics
  const weeklyRevenue = revenueData.reduce((acc, d) => acc + d.sales, 0);
  const weeklyProfit = revenueData.reduce((acc, d) => acc + d.profit, 0);
  const weeklySalesCount = revenueData.reduce((acc, d) => acc + d.orders, 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 overflow-y-auto custom-scrollbar pb-10 text-gray-200">
      
      {/* Sidebar navigation */}
      <div className="w-full xl:w-64 flex flex-row xl:flex-col gap-1 border-b xl:border-b-0 xl:border-r border-white/10 pb-4 xl:pb-0 xl:pr-4 flex-shrink-0 overflow-x-auto xl:overflow-x-visible custom-scrollbar">
        {[
          { id: "analytics", label: "Merchant Analytics", icon: BarChart2 },
          { id: "products", label: "Catalog Listings", icon: Store },
          { id: "inventory", label: "Inventory Watch", icon: Activity },
          { id: "orders", label: "Fulfillment & Returns", icon: Package },
          { id: "discounts", label: "Promotions & Ads", icon: Tag },
          { id: "financial", label: "Invoices & Payouts", icon: DollarSign },
          { id: "profile", label: "Merchant Profile", icon: Users }
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer text-left whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <TabIcon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <div className="hidden xl:block mt-6 pt-4 border-t border-white/5 space-y-2.5 text-[10px] text-gray-500 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>MERCHANT VERIFIED</span>
          </div>
          <div>MERCHANT ID: MCH-7881A</div>
          <div>CATALOG ITEMS: {products.length} entries</div>
          <div>PENDING SHIPMENTS: {orders.filter(o => o.status === "Processing").length}</div>
        </div>
      </div>

      {/* Main Panel Content Canvas */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              {/* Highlight Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Weekly Invoiced Sales</span>
                    <span className="text-xl font-black text-[#ff9900] font-mono">${weeklyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-[#ff9900]/10 rounded-lg"><DollarSign className="w-5 h-5 text-[#ff9900]" /></div>
                </div>
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Weekly Clear Profits</span>
                    <span className="text-xl font-black text-white font-mono">${weeklyProfit.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
                </div>
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Fulfillment Alerts</span>
                    <span className={`text-xl font-black font-mono ${lowStockCount > 0 ? "text-red-500" : "text-white"}`}>
                      {lowStockCount} restocks
                    </span>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
                </div>
              </div>

              {/* Graphic Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Weekly Revenue Stream & Profit Margins</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff9900" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ff9900" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
                        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 9 }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" name="Invoiced Sales" dataKey="sales" stroke="#ff9900" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                        <Line type="monotone" name="Net Profit" dataKey="profit" stroke="#10b981" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Monthly Sales Target Forecasting</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
                        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 9 }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar name="Projected Targets" dataKey="projected" fill="#ff9900" radius={[4, 4, 0, 0]} opacity={0.65} />
                        <Bar name="Logged Sales" dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Insights & Metrics Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg text-xs space-y-3">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Product Performance & Trends Insights</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Based on visitor CTR matches, the following products have high user engagement. We suggest adjusting PPC campaign budgets to optimize landing click conversion ratios:
                  </p>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-300">iPhone 16 Pro Max (Desert Titanium)</span>
                      <span className="text-emerald-400 font-bold">+18.5% CTR Conversion (Outstanding)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-300">Dell XPS 15 Creator Edition</span>
                      <span className="text-[#ff9900] font-bold">+9.2% CTR Conversion (Stable)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Razer Fast Optical Switches Mouse</span>
                      <span className="text-gray-500 font-bold">-2.1% CTR (Needs CPC Boost)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg flex flex-col justify-between items-center text-center">
                  <Award className="w-12 h-12 text-[#ff9900]" />
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Seller Rating Level</span>
                    <span className="text-2xl font-black text-white block">4.9 / 5.0</span>
                    <span className="text-[9px] text-[#ff9900] bg-[#ff9900]/10 border border-[#ff9900]/20 px-2 py-0.5 rounded uppercase font-bold">
                      TOP MERCHANT STATUS
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Fulfillment Rate: 100% | Return Rate: &lt;1.8% | Response Score: Elite
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <motion.div key="products" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Catalog Inventory & Listings</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handleTriggerBulkUpload}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[10px] rounded cursor-pointer transition-colors"
                  >
                    CSV/JSON Bulk Upload
                  </button>
                  <button 
                    onClick={() => {
                      setEditProduct(null);
                      setProductForm({ name: "", brand: "", description: "", price: 0, discount: 0, category: "Laptops", stock: 10, tags: "", specifications: "Warranty: 1-Year Certified" });
                      setShowAddForm(!showAddForm);
                    }}
                    className="px-3 py-1.5 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5"/> Add Listing
                  </button>
                </div>
              </div>

              {bulkStatus && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] rounded-lg">
                  {bulkStatus}
                </div>
              )}

              {/* Add / Edit Form */}
              {showAddForm && (
                <form onSubmit={handleProductSubmit} className="bg-black/40 border border-white/5 rounded-xl p-5 space-y-4 shadow-lg text-xs">
                  <span className="font-bold text-white block border-b border-white/10 pb-1.5 uppercase tracking-wider">
                    {editProduct ? `Adjust ${editProduct.name}` : "Publish New Product Listing"}
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Product Title</label>
                      <input 
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="E.g., Quantum Rig Book 15"
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Brand Name</label>
                      <input 
                        type="text"
                        required
                        value={productForm.brand}
                        onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                        placeholder="E.g., Razer, Apple, Dell"
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Department Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      >
                        {["AI Devices", "Gaming", "Laptops", "Monitors", "Smartphones", "Smart Home", "Accessories", "Workstations", "VR Tech"].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Price ($)</label>
                      <input 
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                        placeholder="1299"
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Discount Percentage (%)</label>
                      <input 
                        type="number"
                        value={productForm.discount}
                        onChange={(e) => setProductForm({...productForm, discount: Number(e.target.value)})}
                        placeholder="0"
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Initial Stock Inventory</label>
                      <input 
                        type="number"
                        required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                        placeholder="10"
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-gray-400">Description Summary</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Specifications, features, pros cons parameters..."
                      className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs h-16 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Keywords (Comma separated tags)</label>
                      <input 
                        type="text"
                        value={productForm.tags}
                        onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                        placeholder="laptop, dell, xps, processor"
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Specifications (Key:Value, Key:Value)</label>
                      <input 
                        type="text"
                        value={productForm.specifications}
                        onChange={(e) => setProductForm({...productForm, specifications: e.target.value})}
                        placeholder="Warranty: 2-Years, Processor: Intel Core Ultra"
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded cursor-pointer transition-colors">
                      {editProduct ? "Update Listing" : "Publish Listing"}
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-white/10 rounded uppercase hover:bg-white/5 cursor-pointer text-white">Cancel</button>
                  </div>
                </form>
              )}

              {/* Products Directory Grid */}
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">In-Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.slice(0, 40).map((prod) => (
                      <tr key={prod._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-white capitalize">
                          <div>
                            <span>{prod.name}</span>
                            <span className="block text-[9px] text-gray-500 font-mono font-normal">Brand: {prod.brand} | ID: {prod._id}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-400 font-mono text-[10px]">{prod.category}</td>
                        <td className="p-3 font-mono font-bold text-white">
                          ${prod.price} {prod.discount > 0 && <span className="text-emerald-500 text-[10px]">(-{prod.discount}%)</span>}
                        </td>
                        <td className={`p-3 font-mono font-bold ${prod.stock <= 5 ? "text-red-400" : "text-gray-400"}`}>{prod.stock} units</td>
                        <td className="p-3 text-right space-x-2">
                          <button 
                            onClick={() => handleEditClick(prod)} 
                            className="p-1.5 border border-white/10 hover:border-blue-400 text-blue-400 rounded transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5"/>
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod._id)} 
                            className="p-1.5 border border-white/10 hover:border-red-400 text-red-400 rounded transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Customer feedback reviewer */}
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Store Feedback Reviews Directory</h4>
                <div className="space-y-3.5 max-h-60 overflow-y-auto custom-scrollbar">
                  {reviewsList.map((rev, idx) => (
                    <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-lg flex justify-between items-start text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rev.user}</span>
                          <span className="text-amber-500">★ {rev.rating}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">Product: {rev.productName}</span>
                        <p className="text-gray-400 mt-1">"{rev.text}"</p>
                      </div>
                      <button 
                        onClick={() => handleFlagReview(rev._id)}
                        className={`text-[9px] font-bold uppercase transition-colors px-2 py-0.5 rounded border border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 cursor-pointer`}
                      >
                        Flag Content
                      </button>
                    </div>
                  ))}
                  {reviewsList.length === 0 && (
                    <p className="text-xs text-gray-500 font-mono text-center py-6">No customer reviews left on your products.</p>
                  )}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 3: INVENTORY */}
          {activeTab === "inventory" && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Inventory Stock & Depletion Forecaster</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3">Inventory Listing</th>
                        <th className="p-3">Quantities Stocked</th>
                        <th className="p-3">Warehouse Allocations</th>
                        <th className="p-3">Forecast Out-of-Stock</th>
                        <th className="p-3">Priority Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {products.slice(0, 30).map((prod) => {
                        // depletion formula
                        const hash = (prod._id?.charCodeAt(prod._id.length - 1) || 0) % 10;
                        const days = Math.max(1, Math.floor(prod.stock * (1.1 + (hash / 10))));
                        const isLow = prod.stock <= 5;
                        
                        return (
                          <tr key={prod._id} className="hover:bg-white/5 transition-colors text-[11px]">
                            <td className="p-3 font-sans font-bold text-white capitalize">{prod.name}</td>
                            <td className={`p-3 font-bold ${isLow ? "text-red-400 animate-pulse" : "text-gray-300"}`}>{prod.stock} Units</td>
                            <td className="p-3 font-sans text-gray-500 text-[10px]">
                              {hash % 2 === 0 ? "Depot East Core" : "Depot West Grid"}
                            </td>
                            <td className="p-3 text-gray-400 font-bold">{days} Days left</td>
                            <td className="p-3 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                isLow ? "bg-red-500/25 border border-red-500/30 text-red-400" : "bg-emerald-500/25 border border-emerald-500/30 text-emerald-400"
                              }`}>
                                {isLow ? "CRITICAL ALERT" : "STABLE"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Warehouse Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Warehouse className="w-4 h-4 text-[#ff9900]" /> Fulfilment Warehouse Zone Directory
                  </h4>
                  <div className="space-y-3">
                    {activeWarehouses.map((wh) => (
                      <div key={wh.id} className="bg-black/40 border border-white/5 p-3 rounded-lg flex flex-col gap-2 text-xs">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white block">{wh.name} ({wh.id})</span>
                            <span className="text-[10px] text-gray-500 font-mono">Region: {wh.region}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-gray-300 font-bold block">{wh.capacity}% capacity</span>
                            <span className="text-[9px] text-emerald-400 font-bold uppercase">ACTIVE</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-500">Usage Gauge:</span>
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={wh.capacity}
                            onChange={(e) => {
                              setActiveWarehouses(prev => prev.map(w => w.id === wh.id ? { ...w, capacity: Number(e.target.value) } : w));
                              logAuditEventSeller(`Adjusted ${wh.id} warehouse allocation capacity threshold to ${e.target.value}%`);
                            }}
                            className="flex-1 accent-[#ff9900] bg-white/5 rounded-lg appearance-none h-1 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Stock Restocking Rules</h4>
                    <p className="text-gray-400 leading-relaxed text-xs">
                      When products fall below the critical threshold (5 units), automatic notification handshakes trigger warehouse shipping manifests. Make sure your logistics carriers are enabled on the Orders tab.
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Customer Shipping Manifests</h3>
                
                {orders.length === 0 ? (
                  <p className="text-xs text-gray-500 py-8 text-center">No customer order transactions logged.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3 shadow-md">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2 font-mono">
                          <div>
                            <span className="font-bold text-white block">ORDER ID: #{order._id.toUpperCase()}</span>
                            <span className="text-[9px] text-gray-500 block">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="font-bold text-[#ff9900] text-sm">${order.totalPrice}</span>
                        </div>

                        <div className="space-y-1.5">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-gray-300 capitalize">{item.name} x {item.quantity}</span>
                              <span className="text-gray-500 font-mono">${item.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2.5 flex items-center justify-between border-t border-white/5 text-[11px]">
                          <span className="font-bold text-gray-500">Fulfillment status: <span className="uppercase text-[#ff9900]">{order.status}</span></span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "shipped")}
                              disabled={order.status === "shipped" || order.status === "delivered" || order.status === "Returned"}
                              className="px-2.5 py-1 bg-blue-500/25 border border-blue-500/30 text-blue-400 hover:bg-blue-500/40 text-[9px] uppercase font-bold rounded flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                            >
                              <Truck className="w-3.5 h-3.5" /> Ship Package
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "delivered")}
                              disabled={order.status === "delivered" || order.status === "Returned"}
                              className="px-2.5 py-1 bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/40 text-[9px] uppercase font-bold rounded flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" /> Mark Delivered
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping Provider Configurations & Returns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Shipping logistics setup */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1"><Truck className="w-4 h-4 text-[#ff9900]" /> Carrier Configurations</h4>
                  <div className="space-y-3">
                    {shippingCarriers.map((carrier, idx) => (
                      <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block">{carrier.carrier}</span>
                          <span className="text-[10px] text-gray-500">Base weight fee: ${carrier.rate.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => {
                            const updated = [...shippingCarriers];
                            updated[idx]!.enabled = !carrier.enabled;
                            setShippingCarriers(updated);
                          }}
                          className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                            carrier.enabled 
                              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30" 
                              : "bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10"
                          }`}
                        >
                          {carrier.enabled ? "ENABLED" : "DISABLED"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Returns Management & Disputes */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" /> Store Return Claims Queue
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {orders.filter(o => o.status === "Return Processing").map((o) => (
                      <div key={o._id} className="bg-black/40 border border-white/5 p-3 rounded-lg space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-white block">Order ID: #{o._id.toUpperCase()}</span>
                            <span className="text-[10px] text-gray-500">Reason: <strong>{o.returnReason || "Malfunction"}</strong></span>
                          </div>
                          <span className="font-mono text-[#ff9900] font-bold">${o.totalPrice}</span>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              handleUpdateOrderStatus(o._id, "Returned");
                              alert("Refund approved. Platform bank balances cleared.");
                            }}
                            className="px-2 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] uppercase rounded cursor-pointer"
                          >
                            Approve Refund
                          </button>
                          <button
                            onClick={() => {
                              handleUpdateOrderStatus(o._id, "Processing");
                              alert("Refund claim rejected. Shipping dispute ticket dispatched.");
                            }}
                            className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white font-bold text-[9px] uppercase rounded cursor-pointer"
                          >
                            Reject Claim
                          </button>
                        </div>
                      </div>
                    ))}
                    {orders.filter(o => o.status === "Return Processing").length === 0 && (
                      <p className="text-xs text-gray-500 font-mono text-center py-6">No customer return requests in progress.</p>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 5: MARKETING & ADS */}
          {activeTab === "discounts" && (
            <motion.div key="discounts" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Store Coupon creator */}
                <div className="lg:col-span-2 bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">Merchant Store Coupons</h3>
                    <button 
                      onClick={() => setShowCouponForm(!showCouponForm)}
                      className="px-2.5 py-1 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold text-[10px] rounded uppercase cursor-pointer transition-colors"
                    >
                      Create Store Coupon
                    </button>
                  </div>

                  {showCouponForm && (
                    <form onSubmit={handleCreateCoupon} className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block mb-1 text-[10px] text-gray-500">Coupon Code</label>
                          <input
                            type="text"
                            required
                            placeholder="SAVE20"
                            value={newCoupon.code}
                            onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                            className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-[10px] text-gray-500">Value Amount</label>
                          <input
                            type="number"
                            required
                            value={newCoupon.amount}
                            onChange={(e) => setNewCoupon({...newCoupon, amount: Number(e.target.value)})}
                            className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-[10px] text-gray-500">Type Mode</label>
                          <select
                            value={newCoupon.type}
                            onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                            className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Cash ($)</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded cursor-pointer transition-colors">Activate Coupon</button>
                    </form>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3">Promo Code</th>
                          <th className="p-3">Discount Cut</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {coupons.map((c, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-bold text-white">{c.code}</td>
                            <td className="p-3 font-bold text-[#ff9900]">{c.amount}</td>
                            <td className="p-3 text-gray-400 uppercase font-sans text-[10px]">{c.type}</td>
                            <td className="p-3 text-emerald-400 font-sans font-bold">ACTIVE</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CPC ads campaigns */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">Promotional CPC Ads</h3>
                  
                  <form onSubmit={handleSetAdBid} className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-3">
                    <span className="font-bold text-gray-200 block border-b border-white/5 pb-1">Configure Product CPC Bid</span>
                    <div>
                      <label className="block text-[10px] text-gray-500">Select Catalog Product</label>
                      <select
                        value={newAdCpcBid.prodId}
                        onChange={(e) => setNewAdCpcBid({...newAdCpcBid, prodId: e.target.value})}
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs text-gray-300"
                        required
                      >
                        <option value="">-- Choose Product --</option>
                        {products.slice(0, 10).map(p => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500">CPC Bid Bid-Rate ($)</label>
                      <input 
                        type="number"
                        step="0.05"
                        min="0.10"
                        required
                        value={newAdCpcBid.bid}
                        onChange={(e) => setNewAdCpcBid({...newAdCpcBid, bid: Number(e.target.value)})}
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none text-xs"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-[#ff9900]/25 border border-[#ff9900]/30 hover:bg-[#ff9900]/40 text-[#ff9900] font-bold uppercase rounded cursor-pointer transition-all">Submit CPC Bid</button>
                  </form>

                  <div className="space-y-3 font-mono text-[10px]">
                    {advertisingList.map((ad, idx) => {
                      const matchingProduct = products.find(p => p._id === ad.prodId);
                      return (
                        <div key={idx} className="bg-black/40 p-2.5 border border-white/5 rounded-lg space-y-1">
                          <span className="font-sans font-bold text-white block truncate">{matchingProduct?.name || ad.prodId}</span>
                          <div className="grid grid-cols-2 text-gray-500 text-[9px]">
                            <span>Clicks: {ad.clicks}</span>
                            <span className="text-right">Ad Costs: ${ad.cost}</span>
                            <span>CPC: ${ad.cpc.toFixed(2)}</span>
                            <span className="text-right text-[#ff9900] font-bold">Revenue: ${ad.revenue}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 6: FINANCIAL */}
          {activeTab === "financial" && (
            <motion.div key="financial" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Balance tracker */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">Platform Cash Ledger</h3>
                    <div className="space-y-4 font-mono">
                      <div>
                        <span className="text-gray-500 text-[10px] block">PENDING DISPATCH BALANCE</span>
                        <span className="text-2xl font-black text-[#ff9900]">${pendingBalance.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] block">TOTAL ACCRUED WITHDRAWN</span>
                        <span className="text-lg font-bold text-white">${withdrawnBalance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleTriggerPayout}
                    className="w-full py-3 bg-emerald-500 text-black font-bold uppercase rounded cursor-pointer hover:bg-emerald-600 transition-colors text-center text-xs"
                  >
                    Trigger Bank Transfer payout
                  </button>
                </div>

                {/* Payout History logs */}
                <div className="lg:col-span-2 bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">Payout Transfer Logs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3">Dispatched Date</th>
                          <th className="p-3">Payout Value</th>
                          <th className="p-3">Deposit Account Mode</th>
                          <th className="p-3 text-right">Transfer status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                        {payoutLogs.map((log, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 text-gray-400">{log.date}</td>
                            <td className="p-3 font-bold text-white">${log.amount.toLocaleString()}</td>
                            <td className="p-3 text-gray-500 font-sans text-[10px]">{log.method}</td>
                            <td className="p-3 text-right text-emerald-400 font-bold uppercase">{log.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Tax reports */}
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-blue-400" /> Platform Tax Documents & Invoices
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Platform IRS 1099-K compliance documents for the 2025/2026 fiscal cycle are compiled. Click the compilation generator below to print mock taxation record sheets:
                </p>
                <button
                  onClick={() => {
                    logAuditEventSeller("REPORT_TAX: Tax manifest sheet successfully downloaded.");
                    alert("Compiling 1099-K IRS taxation form layout...\nDownloaded nexus_merchant_tax_1099k_2026.pdf.");
                  }}
                  className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 font-bold uppercase rounded cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Download 1099-K Tax Sheet
                </button>
              </div>

            </motion.div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Profile credentials */}
                <div className="lg:col-span-2 bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-6 shadow-lg space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Merchant Registration Credentials</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 font-bold text-[10px] uppercase block">Merchant Store Tag</span>
                      <span className="font-bold text-white text-xs block mt-0.5">Nexus Tech Wholesalers Ltd</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold text-[10px] uppercase block">Registered Email Node</span>
                      <span className="font-bold text-white text-xs block mt-0.5">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold text-[10px] uppercase block">Clearance Status</span>
                      <span className="font-bold text-emerald-500 text-xs block mt-0.5 uppercase flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Certified Platform Merchant</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold text-[10px] uppercase block">Fulfillment Warehouses</span>
                      <span className="font-bold text-white text-xs block mt-0.5">Depot East Core / Depot West Grid</span>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Chat widget */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 shadow-lg flex flex-col h-80 justify-between">
                  <span className="font-bold text-white block uppercase tracking-wider border-b border-white/5 pb-1 mb-2">AI Merchant Assistant</span>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-2 p-1.5 bg-[#0b0f19] rounded-lg">
                    {aiChatMessages.map((msg, idx) => (
                      <div key={idx} className={`p-2 rounded text-[10px] max-w-[85%] ${
                        msg.sender === "assistant" ? "bg-white/5 text-gray-300 self-start mr-auto" : "bg-[#ff9900]/25 text-[#ff9900] self-end ml-auto text-right"
                      }`}>
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAiChatSubmit} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Ask copilot optimization questions..."
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      className="flex-1 p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none text-[10px]"
                    />
                    <button type="submit" className="p-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded cursor-pointer transition-colors flex-shrink-0">
                      <Send className="w-3.5 h-3.5"/>
                    </button>
                  </form>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );

  function logAuditEventSeller(text: string) {
    console.log(`[Seller Audit] ${text}`);
  }
}
