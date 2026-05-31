"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { mockDb } from "@/utils/mockDb";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, AreaChart, Area,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  TrendingUp, Users, ShieldAlert, FileText, Check, X,
  Trash2, ShieldCheck, AlertCircle, RefreshCw, Search,
  HardDrive, Cpu, Terminal, Plus, Tag, HelpCircle, Package, AlertTriangle,
  Settings, Database, Bell, Activity, Lock, Percent, Eye, EyeOff,
  Download, Server, Shield, Radio, FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Tabs: analytics, accounts, products, orders, categories, coupons, tickets, fraud, system
  const [activeTab, setActiveTab] = useState<
    "analytics" | "accounts" | "products" | "orders" | "categories" | "coupons" | "tickets" | "fraud" | "system"
  >("analytics");
  const [loading, setLoading] = useState(true);

  // Data Lists
  const [usersList, setUsersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "AI Devices", "Gaming", "Laptops", "Monitors", "Smartphones", "Smart Home", "Accessories", "Workstations", "VR Tech"
  ]);
  const [newCategory, setNewCategory] = useState("");

  // Interactions
  const [searchQuery, setSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [selectedUserLogs, setSelectedUserLogs] = useState<any>(null);
  
  // Coupons list
  const [coupons, setCoupons] = useState<any[]>([
    { code: "NEXUS50", type: "fixed", amount: 50, active: true },
    { code: "AMAZON10", type: "percentage", amount: 10, active: true },
    { code: "FUTURE2050", type: "percentage", amount: 25, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponAmount, setNewCouponAmount] = useState(10);
  const [newCouponType, setNewCouponType] = useState("percentage");

  // Advertising / Promoted Campaigns
  const [promotedAds, setPromotedAds] = useState<any[]>([
    { id: "ad-1", name: "iPhone 16 Pro Max Banner Campaign", budget: 500, spent: 142, cpc: 0.85, status: "Active" },
    { id: "ad-2", name: "Dell XPS Creator Edition High Bids", budget: 1000, spent: 785, cpc: 1.20, status: "Active" },
    { id: "ad-3", name: "Razer DeathAdder V3 Sidebar Ads", budget: 300, spent: 300, cpc: 0.45, status: "Completed" }
  ]);
  const [newAdName, setNewAdName] = useState("");
  const [newAdBudget, setNewAdBudget] = useState(500);
  const [newAdCpc, setNewAdCpc] = useState(0.50);

  // Content Management
  const [homeTagline, setHomeTagline] = useState("Next-Gen 2050 Quantum Marketplace");
  const [promoBannerAlert, setPromoBannerAlert] = useState("🔥 NEXUS SPECIAL: Redeem FUTURE2050 at checkout for 25% off high-spec rigs!");

  // Support Tickets
  const [tickets, setTickets] = useState<any[]>([
    { id: "TCK-1234", email: "client@workstation.net", subject: "Nexus Workstation Pro setup query", status: "Open", message: "Need liquid cooling loop manual.", category: "Tech Support", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: "TCK-4421", email: "seller@nexus.com", subject: "Listing approval processing time", status: "Open", message: "Why is my mechanical keyboard listing still pending approval?", category: "Sellers Support", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: "TCK-9081", email: "user@galaxy.com", subject: "Failed double charge during checkout", status: "Resolved", message: "Payment succeeded but browser crashed. Got double email confirmation.", category: "Billing Support", createdAt: new Date(Date.now() - 3600000 * 24).toISOString() }
  ]);
  const [replyMessage, setReplyMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState<any>(null);

  // Disputes Resolution Center
  const [disputes, setDisputes] = useState<any[]>([
    { id: "DISP-089", orderId: "ORDER-A834B", buyer: "Niranjan", seller: "Sony Entertainment", reason: "Item damaged in transit - cracked frame.", status: "Pending", claimAmount: 499 },
    { id: "DISP-112", orderId: "ORDER-C122X", buyer: "Guest User", seller: "Dell Retail Services", reason: "Item not received after 5 business days.", status: "Pending", claimAmount: 2299 }
  ]);
  const [disputeResponseText, setDisputeResponseText] = useState("");
  const [activeDispute, setActiveDispute] = useState<any>(null);

  // System Settings & Feature Flags (loaded from localStorage or defaults)
  const [featureFlags, setFeatureFlags] = useState({
    enableAiRecommendations: true,
    enableVoiceSearch: true,
    enableStripeCheckout: true,
    enableMultiVendorShipping: false,
    enableBetaGoldTheme: true
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemCurrency, setSystemCurrency] = useState("USD");
  const [defaultTaxRate, setDefaultTaxRate] = useState(8.25);

  // Simulated live CPU & RAM metrics
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 28,
    memory: 42,
    latency: 14,
    disk: 56
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.min(100, Math.max(10, prev.cpu + Math.floor(Math.random() * 9 - 4))),
        memory: Math.min(100, Math.max(20, prev.memory + Math.floor(Math.random() * 5 - 2))),
        latency: Math.min(100, Math.max(5, prev.latency + Math.floor(Math.random() * 7 - 3))),
        disk: prev.disk
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Analytics mock datasets
  const globalRevenueData = [
    { name: "Mon", revenue: 14200, orders: 22, signup: 5 },
    { name: "Tue", revenue: 15800, orders: 28, signup: 8 },
    { name: "Wed", revenue: 28400, orders: 45, signup: 12 },
    { name: "Thu", revenue: 21900, orders: 36, signup: 9 },
    { name: "Fri", revenue: 32500, orders: 52, signup: 15 },
    { name: "Sat", revenue: 42000, orders: 74, signup: 22 },
    { name: "Sun", revenue: 38000, orders: 61, signup: 18 }
  ];

  const trafficData = [
    { source: "Direct Traffic", visits: 18500, bounce: "22%" },
    { source: "Organic Search", visits: 24200, bounce: "31%" },
    { source: "Referral Nodes", visits: 9800, bounce: "15%" },
    { source: "Social Feeds", visits: 14600, bounce: "48%" },
    { source: "Promotional Ads", visits: 12100, bounce: "35%" }
  ];

  const fetchAdminData = useCallback(() => {
    setLoading(true);
    try {
      const uList = JSON.parse(localStorage.getItem("nexus_fallback_users_v3") || "[]");
      setUsersList(uList.length ? uList : JSON.parse(localStorage.getItem("nexus_fallback_users") || "[]"));

      const pList = mockDb.getProducts({});
      setProductsList(pList);

      const oList = mockDb.getOrders();
      setOrdersList(oList);

      // Load feature flags / settings if set
      const savedFlags = localStorage.getItem("nexus_admin_feature_flags");
      if (savedFlags) setFeatureFlags(JSON.parse(savedFlags));

      const savedMMode = localStorage.getItem("nexus_admin_maintenance_mode");
      if (savedMMode) setMaintenanceMode(JSON.parse(savedMMode));

      const savedTagline = localStorage.getItem("nexus_home_tagline");
      if (savedTagline) setHomeTagline(savedTagline);

      const savedBanner = localStorage.getItem("nexus_promo_banner");
      if (savedBanner) setPromoBannerAlert(savedBanner);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
    setAuditLogs([
      `[${new Date().toLocaleTimeString()}] SECURE: Admin control panel synchronized with backend JSON models.`,
      `[${new Date().toLocaleTimeString()}] MONITOR: Database integrity checked (100% records intact).`,
      `[${new Date().toLocaleTimeString()}] FRAUD: Threat telemetry scanner module verified active.`,
      `[${new Date().toLocaleTimeString()}] AUDIT: Admin dashboard session established for ${user?.email || "Superuser"}.`
    ]);

    // Micro system telemetry ticker simulator
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: Math.floor(18 + Math.random() * 25),
        memory: Math.floor(35 + Math.random() * 12),
        latency: Math.floor(8 + Math.random() * 12),
        disk: 56
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchAdminData, user]);

  const handleToggleUserBan = (id: string) => {
    const updated = usersList.map(u => {
      if (u._id === id) {
        const nextState = !u.isBanned;
        logAuditEvent(`USER_MODERATION: Account ${u.email} ban status toggled to ${nextState}`);
        return { ...u, isBanned: nextState };
      }
      return u;
    });
    setUsersList(updated);
    localStorage.setItem("nexus_fallback_users_v3", JSON.stringify(updated));
    localStorage.setItem("nexus_fallback_users", JSON.stringify(updated));
  };

  const handleVerifySeller = (id: string, state: boolean) => {
    const updated = usersList.map(u => {
      if (u._id === id) {
        logAuditEvent(`SELLER_MODERATION: Seller ${u.email} verified status set to ${state}`);
        return { ...u, role: state ? "seller" : "customer", sellerVerified: state };
      }
      return u;
    });
    setUsersList(updated);
    localStorage.setItem("nexus_fallback_users_v3", JSON.stringify(updated));
    localStorage.setItem("nexus_fallback_users", JSON.stringify(updated));
  };

  const handleModifyUserRole = (id: string, role: string) => {
    const updated = usersList.map(u => {
      if (u._id === id) {
        logAuditEvent(`USER_PERMISSIONS: User ${u.email} role updated from ${u.role} -> ${role}`);
        return { ...u, role };
      }
      return u;
    });
    setUsersList(updated);
    localStorage.setItem("nexus_fallback_users_v3", JSON.stringify(updated));
    localStorage.setItem("nexus_fallback_users", JSON.stringify(updated));
  };

  const handleApproveProduct = (id: string, status: "Approved" | "Rejected") => {
    const updated = productsList.map(p => {
      if (p._id === id || p.id === id) {
        logAuditEvent(`CATALOG_APPROVAL: Product ${p.name} listing set to ${status}`);
        // Synchronize in the actual list
        mockDb.saveProduct({ ...p, approvalStatus: status });
        return { ...p, approvalStatus: status };
      }
      return p;
    });
    setProductsList(updated);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || categories.includes(newCategory)) return;
    const nextCategories = [...categories, newCategory];
    setCategories(nextCategories);
    logAuditEvent(`CATALOG_STRUCTURE: Added department category: ${newCategory}`);
    setNewCategory("");
  };

  const handleRemoveCategory = (name: string) => {
    const nextCategories = categories.filter(c => c !== name);
    setCategories(nextCategories);
    logAuditEvent(`CATALOG_STRUCTURE: Deleted department category: ${name}`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const added = {
      code: newCouponCode.toUpperCase().trim(),
      type: newCouponType,
      amount: newCouponAmount,
      active: true
    };
    setCoupons([added, ...coupons]);
    logAuditEvent(`COUPON_CREATION: Generated global platform discount coupon ${added.code}`);
    setNewCouponCode("");
  };

  const handleToggleCoupon = (code: string) => {
    const updated = coupons.map(c => {
      if (c.code === code) {
        const nextState = !c.active;
        logAuditEvent(`COUPON_MODERATION: Coupon ${code} active state toggled to ${nextState}`);
        return { ...c, active: nextState };
      }
      return c;
    });
    setCoupons(updated);
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdName) return;
    const newAd = {
      id: "ad-" + Math.random().toString(36).substring(2, 7),
      name: newAdName,
      budget: newAdBudget,
      spent: 0,
      cpc: newAdCpc,
      status: "Active"
    };
    setPromotedAds([newAd, ...promotedAds]);
    logAuditEvent(`CAMPAIGN_CREATION: Started CPC promo listing for ${newAdName}`);
    setNewAdName("");
  };

  const handleSaveHomepageConfig = () => {
    localStorage.setItem("nexus_home_tagline", homeTagline);
    localStorage.setItem("nexus_promo_banner", promoBannerAlert);
    logAuditEvent(`CONTENT_MANAGEMENT: Saved global store landing config adjustments.`);
    alert("Landing page settings applied successfully!");
  };

  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage || !activeTicket) return;
    
    const updated = tickets.map(t => {
      if (t.id === activeTicket.id) {
        logAuditEvent(`SUPPORT_TICKET: Resolved ticket ${t.id} -> Reply: "${replyMessage.substring(0, 30)}..."`);
        return { ...t, status: "Resolved" };
      }
      return t;
    });
    setTickets(updated);
    setActiveTicket(null);
    setReplyMessage("");
  };

  const handleResolveDispute = (disputeId: string, action: "Refund Buyer" | "Reject Claim") => {
    const updated = disputes.map(d => {
      if (d.id === disputeId) {
        logAuditEvent(`DISPUTE_MEDIATOR: Resolved dispute ${d.id} for Order ${d.orderId} via: ${action}`);
        
        // If refunding, simulate processing the order return status in the database
        if (action === "Refund Buyer") {
          const ords = mockDb.getOrders();
          const targetOrd = ords.map((o: any) => {
            if (o._id.toUpperCase() === d.orderId.replace("ORDER-", "").toUpperCase()) {
              return { ...o, status: "Returned", refundStatus: "Refund Processed" };
            }
            return o;
          });
          mockDb.saveOrders(targetOrd);
          setOrdersList(targetOrd);
        }
        
        return { ...d, status: action === "Refund Buyer" ? "Resolved (Refunded)" : "Resolved (Claim Rejected)" };
      }
      return d;
    });
    setDisputes(updated);
    setActiveDispute(null);
    setDisputeResponseText("");
  };

  const handleToggleFeatureFlag = (key: keyof typeof featureFlags) => {
    const updated = {
      ...featureFlags,
      [key]: !featureFlags[key]
    };
    setFeatureFlags(updated);
    localStorage.setItem("nexus_admin_feature_flags", JSON.stringify(updated));
    logAuditEvent(`SYSTEM_FLAGS: Feature toggle "${key}" shifted to ${updated[key]}`);
  };

  const handleToggleMaintenanceMode = () => {
    const nextState = !maintenanceMode;
    setMaintenanceMode(nextState);
    localStorage.setItem("nexus_admin_maintenance_mode", JSON.stringify(nextState));
    logAuditEvent(`SYSTEM_SECURITY: Marketplace core shifted to ${nextState ? "MAINTENANCE MODE (OFFLINE)" : "ONLINE"}`);
  };

  const handleTriggerBackup = () => {
    try {
      const dbBackup = {
        products: JSON.parse(localStorage.getItem("nexus_fallback_products_v3") || "[]"),
        users: JSON.parse(localStorage.getItem("nexus_fallback_users_v3") || "[]"),
        orders: JSON.parse(localStorage.getItem("nexus_fallback_orders_v3") || "[]"),
        timestamp: new Date().toISOString(),
        version: "Nexus-M1-2050"
      };

      const jsonStr = JSON.stringify(dbBackup, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nexus_backup_${new Date().toISOString().substring(0, 10)}.json`;
      link.click();
      
      logAuditEvent(`BACKUP_CONTROL: Compiled and downloaded secure system JSON database dump.`);
    } catch (err) {
      console.error(err);
      alert("Error generating backup file.");
    }
  };

  const handleFactoryReset = () => {
    if (confirm("Are you sure you want to perform a factory restore? This will wipe the database and re-seed 1000+ premium products, clearing all customized transactions, custom user accounts, and tickets!")) {
      localStorage.removeItem("nexus_fallback_products_v3");
      localStorage.removeItem("nexus_fallback_products");
      localStorage.removeItem("nexus_fallback_users_v3");
      localStorage.removeItem("nexus_fallback_users");
      localStorage.removeItem("nexus_fallback_orders_v3");
      localStorage.removeItem("nexus_fallback_orders");
      localStorage.removeItem("nexus_database_seeded_v4");
      
      logAuditEvent(`BACKUP_CONTROL: Executed factory override sequence. Re-initializing database.`);
      alert("Database wiped. Reloading dashboard context...");
      window.location.reload();
    }
  };

  const logAuditEvent = (text: string) => {
    setAuditLogs(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev]);
  };

  // Compile Reports Preview modal
  const [showReportModal, setShowReportModal] = useState(false);
  const triggerGenerateReport = () => {
    setShowReportModal(true);
    logAuditEvent(`REPORTS_GENERATOR: Compiled system performance report.`);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#ff9900] border-t-transparent animate-spin" />
        <span className="text-xs text-gray-400 font-mono">Synchronizing administrative database logs...</span>
      </div>
    );
  }

  // Statistics Calculations
  const totalRevenue = ordersList.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const activeOrdersCount = ordersList.filter(o => o.status === "Processing" || o.status === "shipped").length;
  const pendingApprovalsCount = productsList.filter(p => p.approvalStatus === "Pending" || !p.approvalStatus).length;
  const returnRequestsCount = ordersList.filter(o => o.status === "Return Processing").length;
  const lowStockProducts = productsList.filter(p => p.stock <= 5);

  // Filter accounts
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (userRoleFilter === "all") return matchesSearch;
    if (userRoleFilter === "banned") return matchesSearch && u.isBanned;
    return matchesSearch && u.role === userRoleFilter;
  });

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 overflow-y-auto custom-scrollbar pb-10 text-gray-200">
      
      {/* Sidebar Navigation */}
      <div className="w-full xl:w-64 flex flex-row xl:flex-col gap-1 border-b xl:border-b-0 xl:border-r border-white/10 pb-4 xl:pb-0 xl:pr-4 flex-shrink-0 overflow-x-auto xl:overflow-x-visible custom-scrollbar">
        {[
          { id: "analytics", label: "Global Analytics", icon: TrendingUp },
          { id: "accounts", label: "Users & Sellers", icon: Users },
          { id: "products", label: "Catalog Approvals", icon: HardDrive },
          { id: "orders", label: "Orders & Disputes", icon: Package },
          { id: "categories", label: "Categories & Page", icon: Cpu },
          { id: "coupons", label: "Coupons & Ads", icon: Tag },
          { id: "tickets", label: "Support Desk", icon: HelpCircle },
          { id: "fraud", label: "Telemetry & Health", icon: ShieldAlert },
          { id: "system", label: "System & Backup", icon: Settings }
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
            <span>CORE NODE: ONLINE</span>
          </div>
          <div>DATABASE VER: v4_1000plus</div>
          <div>PLATFORM ORDS: {ordersList.length} total</div>
          <div>CATALOG COUNT: {productsList.length} items</div>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: GLOBAL ANALYTICS */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              {/* Highlight KPI row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Accrued Volume</span>
                    <span className="text-xl font-black text-[#ff9900] font-mono">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="p-2 bg-[#ff9900]/10 rounded-lg"><TrendingUp className="w-5 h-5 text-[#ff9900]" /></div>
                </div>
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Active Shipments</span>
                    <span className="text-xl font-black text-white font-mono">{activeOrdersCount} processing</span>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Package className="w-5 h-5 text-blue-400" /></div>
                </div>
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Moderations Pending</span>
                    <span className={`text-xl font-black font-mono ${pendingApprovalsCount > 0 ? "text-amber-500 animate-pulse" : "text-white"}`}>
                      {pendingApprovalsCount} units
                    </span>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-400" /></div>
                </div>
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Dispute Claims</span>
                    <span className={`text-xl font-black font-mono ${disputes.filter(d => d.status === "Pending").length > 0 ? "text-red-500" : "text-white"}`}>
                      {disputes.filter(d => d.status === "Pending").length} issues
                    </span>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-lg"><ShieldAlert className="w-5 h-5 text-red-400" /></div>
                </div>
              </div>

              {/* Graphic charts: Revenue Analysis & Customer growth */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">Financial Streams and Signups</h4>
                    <button 
                      onClick={triggerGenerateReport}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[9px] uppercase rounded flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> Compile Report
                    </button>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={globalRevenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff9900" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#ff9900" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
                        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 9 }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" name="Revenue ($)" dataKey="revenue" stroke="#ff9900" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                        <Line type="monotone" name="Orders Filled" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider mb-4">Traffic Channel Sources</h4>
                    <div className="space-y-4">
                      {trafficData.map((channel, index) => (
                        <div key={index} className="text-xs space-y-1">
                          <div className="flex justify-between text-gray-300">
                            <span className="font-semibold">{channel.source}</span>
                            <span className="font-mono text-[10px] text-[#ff9900]">{channel.visits.toLocaleString()} visits</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-[#ff9900] h-full" 
                              style={{ width: `${(channel.visits / 24200) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                            <span>Relative Weight</span>
                            <span>Bounce: {channel.bounce}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: ACCOUNTS */}
          {activeTab === "accounts" && (
            <motion.div key="accounts" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Account Directory & Permissions</h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2.5" />
                    <input 
                      type="text"
                      placeholder="Search accounts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-48 pl-7 pr-3 py-1 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="p-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 focus:outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="customer">Customers Only</option>
                    <option value="seller">Sellers Only</option>
                    <option value="admin">Administrators</option>
                    <option value="banned">Banned Directory</option>
                  </select>
                </div>
              </div>

              {selectedUserLogs && (
                <div className="bg-[#ff9900]/10 border border-[#ff9900]/20 p-4 rounded-xl space-y-2.5 text-xs">
                  <div className="flex justify-between items-center border-b border-[#ff9900]/20 pb-1.5">
                    <span className="font-bold text-[#ff9900]">Profile Info & Logs: {selectedUserLogs.name} ({selectedUserLogs.email})</span>
                    <button onClick={() => setSelectedUserLogs(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-gray-300">
                    <div><span className="text-[10px] text-gray-500 block">UID</span><span className="font-mono">{selectedUserLogs._id}</span></div>
                    <div><span className="text-[10px] text-gray-500 block">Designation</span><span>{selectedUserLogs.jobTitle || "N/A"}</span></div>
                    <div><span className="text-[10px] text-gray-500 block">Joined</span><span className="font-mono">{new Date(selectedUserLogs.createdAt || Date.now()).toLocaleDateString()}</span></div>
                  </div>
                </div>
              )}

              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">User Node</th>
                      <th className="p-3">Display Label</th>
                      <th className="p-3">Role Designation</th>
                      <th className="p-3">Seller Clearance</th>
                      <th className="p-3 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center font-sans font-bold border border-white/10">
                              {u.avatar || u.name[0]?.toUpperCase() || "U"}
                            </span>
                            <div>
                              <span className="block font-sans text-xs">{u.name}</span>
                              <span className="block text-[10px] text-gray-500">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-400 font-mono text-[10px]">{u.jobTitle || "Consumer Node"}</td>
                        <td className="p-3">
                          <select
                            value={u.role}
                            onChange={(e) => handleModifyUserRole(u._id, e.target.value)}
                            className="p-1 bg-[#131b2e] border border-white/10 rounded text-[10px] text-gray-300 font-bold focus:outline-none"
                          >
                            <option value="customer">CUSTOMER</option>
                            <option value="seller">SELLER</option>
                            <option value="admin">ADMIN</option>
                          </select>
                        </td>
                        <td className="p-3 font-bold">
                          {u.sellerVerified ? (
                            <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> VERIFIED</span>
                          ) : u.role === "seller" ? (
                            <button 
                              onClick={() => handleVerifySeller(u._id, true)}
                              className="px-2 py-0.5 bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/40 text-[9px] rounded font-bold transition-all cursor-pointer"
                            >
                              VERIFY NOW
                            </button>
                          ) : (
                            <span className="text-gray-500 font-mono text-[10px]">UNCERTIFIED</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2.5">
                          <button
                            onClick={() => setSelectedUserLogs(u)}
                            className="text-gray-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <Eye className="w-3.5 h-3.5"/> Logs
                          </button>
                          {u.role === "seller" && u.sellerVerified && (
                            <button
                              onClick={() => handleVerifySeller(u._id, false)}
                              className="text-amber-500 hover:text-amber-400 text-[10px] transition-colors cursor-pointer"
                            >
                              Revoke Seller
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleUserBan(u._id)}
                            className={`px-2 py-0.5 font-mono text-[9px] uppercase rounded border transition-all cursor-pointer ${
                              u.isBanned 
                                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30" 
                                : "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                            }`}
                          >
                            {u.isBanned ? "UNBAN NODE" : "BAN ACCOUNT"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">No matching account nodes identified.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: PRODUCT APPROVALS */}
          {activeTab === "products" && (
            <motion.div key="products" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Pending Catalog Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3">Hardware Listing</th>
                        <th className="p-3">Seller Registry</th>
                        <th className="p-3">Price Parameters</th>
                        <th className="p-3">Current Status</th>
                        <th className="p-3 text-right">Approve / Reject Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {productsList.filter(p => !p.approvalStatus || p.approvalStatus === "Pending").map((prod) => (
                        <tr key={prod._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 capitalize font-bold text-white">{prod.name}</td>
                          <td className="p-3 text-gray-400 font-mono text-[10px]">{prod.seller || "Merchant Store"}</td>
                          <td className="p-3 font-mono text-gray-300 font-semibold">${prod.price} <span className="text-[10px] text-emerald-500">(-{prod.discount}%)</span></td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse">
                              {prod.approvalStatus || "Pending Approval"}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleApproveProduct(prod._id, "Approved")}
                              className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/40 text-emerald-400 font-bold text-[9px] uppercase rounded transition-colors cursor-pointer"
                            >
                              Approve Listing
                            </button>
                            <button
                              onClick={() => handleApproveProduct(prod._id, "Rejected")}
                              className="px-2.5 py-1 bg-red-500/20 border border-red-500/30 hover:bg-red-500/40 text-red-400 font-bold text-[9px] uppercase rounded transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                      {productsList.filter(p => !p.approvalStatus || p.approvalStatus === "Pending").length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-500 font-mono">No catalog uploads awaiting moderate workflow approval.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inventory monitoring & replenishment forecasting */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Catalog Low Stock Monitor
                  </h4>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2.5">
                    {lowStockProducts.slice(0, 10).map((prod) => (
                      <div key={prod._id} className="flex justify-between items-center bg-black/40 p-2.5 rounded border border-white/5 text-xs">
                        <div>
                          <span className="font-bold text-white block capitalize">{prod.name}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{prod.category} | Seller: {prod.seller}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-red-400 block font-mono">{prod.stock} units left</span>
                          <span className="text-[9px] text-[#ff9900] bg-[#ff9900]/10 border border-[#ff9900]/20 px-1 rounded uppercase font-bold">
                            RESTOCK PRIORITY
                          </span>
                        </div>
                      </div>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <p className="text-xs text-gray-500 font-mono text-center py-6">All products maintain normal stock parameters.</p>
                    )}
                  </div>
                </div>

                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider mb-3">Inventory Replenishment Analytics</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      Using moving average purchases, the system projects estimated catalog stockout risks. In the next 30 days, we recommend alerting key merchants to restock these segments:
                    </p>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2 font-mono">
                        <span className="text-gray-300">Smartphones Catalog Category</span>
                        <span className="text-[#ff9900] font-bold">High Out-of-Stock Risk (7 Days)</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2 font-mono">
                        <span className="text-gray-300">Accessories Segment</span>
                        <span className="text-amber-500 font-bold">Moderate Out-of-Stock Risk (18 Days)</span>
                      </div>
                      <div className="flex justify-between pb-2 font-mono">
                        <span className="text-gray-300">VR Tech Line</span>
                        <span className="text-emerald-500 font-bold">Low Risk (40+ Days)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: ORDERS & DISPUTES */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              {/* Order management */}
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Active Order Ingress</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3">Order Node ID</th>
                        <th className="p-3">Receipt Price</th>
                        <th className="p-3">Customer Node</th>
                        <th className="p-3">Fulfillment Status</th>
                        <th className="p-3">Transit Logs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {ordersList.map((order) => (
                        <tr key={order._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold text-white">#{order._id.toUpperCase()}</td>
                          <td className="p-3 font-bold text-[#ff9900]">${order.totalPrice}</td>
                          <td className="p-3 text-gray-400 font-sans">{order.shipping?.email || "Guest Buyer"}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              order.status === "Returned" ? "bg-red-500/25 text-red-400 border border-red-500/30" :
                              order.status === "Return Processing" ? "bg-amber-500/25 text-amber-400 border border-amber-500/30 animate-pulse" :
                              order.status === "delivered" ? "bg-emerald-500/25 text-emerald-400 border border-emerald-500/30" :
                              "bg-blue-500/25 text-blue-400 border border-blue-500/30"
                            }`}>{order.status}</span>
                          </td>
                          <td className="p-3 text-gray-500 font-sans text-[10px]">{new Date(order.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                      {ordersList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-500 font-mono">No order transaction logs on the platform database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Disputes Mediator Panel */}
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Disputes & Arbitration</h3>
                
                {activeDispute && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center border-b border-red-500/20 pb-2">
                      <span className="font-bold text-red-400">Mediator Arbitration: Resolve Case {activeDispute.id}</span>
                      <button onClick={() => setActiveDispute(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
                    </div>
                    <div className="text-gray-300 space-y-1">
                      <p><strong>Order ID:</strong> #{activeDispute.orderId}</p>
                      <p><strong>Reason Filed:</strong> "{activeDispute.reason}"</p>
                      <p><strong>Claim Total:</strong> ${activeDispute.claimAmount}</p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-3">
                      <div>
                        <label className="block mb-1 font-bold text-gray-400">Resolution Memo</label>
                        <textarea
                          required
                          value={disputeResponseText}
                          onChange={(e) => setDisputeResponseText(e.target.value)}
                          placeholder="Provide details on ruling..."
                          className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-red-500 h-16 resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolveDispute(activeDispute.id, "Refund Buyer")}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase rounded cursor-pointer transition-colors"
                        >
                          Approve Refund to Buyer
                        </button>
                        <button
                          onClick={() => handleResolveDispute(activeDispute.id, "Reject Claim")}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] uppercase rounded cursor-pointer transition-colors"
                        >
                          Reject Buyer Claim
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-3">
                  {disputes.map((disp) => (
                    <div key={disp.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <span className="font-bold text-white block">Arbitration ID: {disp.id} (Order: {disp.orderId})</span>
                        <span className="text-gray-400 block text-[11px]">Buyer: {disp.buyer} | Seller Node: {disp.seller}</span>
                        <p className="text-gray-500 mt-1 italic">Reason: "{disp.reason}"</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          disp.status.includes("Pending") 
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse" 
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        }`}>{disp.status}</span>
                        {disp.status === "Pending" && (
                          <button 
                            onClick={() => { setActiveDispute(disp); setDisputeResponseText(""); }}
                            className="px-2.5 py-1 bg-[#ff9900]/25 hover:bg-[#ff9900]/40 text-[#ff9900] border border-[#ff9900]/30 font-bold text-[9px] uppercase rounded cursor-pointer transition-all"
                          >
                            Arbitrate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: CATEGORIES & CONTENT */}
          {activeTab === "categories" && (
            <motion.div key="categories" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              {/* Category manager */}
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Department Structure (Database Categories)</h3>
                
                <form onSubmit={handleAddCategory} className="bg-black/40 p-4 border border-white/5 rounded-xl space-y-3 flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block mb-1 font-bold text-gray-400">Add New Department Segment</label>
                    <input
                      type="text"
                      required
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="E.g., Neural Enhancers"
                      className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded cursor-pointer transition-colors">Add Segment</button>
                </form>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                  {categories.map((c) => (
                    <div key={c} className="border border-white/5 p-3 rounded-lg bg-black/40 flex justify-between items-center shadow-sm">
                      <span className="font-bold text-gray-200 capitalize">{c}</span>
                      <button 
                        onClick={() => handleRemoveCategory(c)}
                        className="p-1 hover:bg-red-500/15 text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landing Page Content Management */}
              <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Marketplace Content Layout</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-bold text-gray-400">Landing Hero Title Tagline</label>
                    <input 
                      type="text"
                      value={homeTagline}
                      onChange={(e) => setHomeTagline(e.target.value)}
                      className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-bold text-gray-400">Homepage System Broadcast Banner Text</label>
                    <textarea 
                      value={promoBannerAlert}
                      onChange={(e) => setPromoBannerAlert(e.target.value)}
                      className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] h-16 resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleSaveHomepageConfig}
                    className="px-4 py-2 bg-[#ff9900]/20 border border-[#ff9900]/30 hover:bg-[#ff9900]/30 text-[#ff9900] font-bold uppercase rounded cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 6: COUPONS & ADVERTISING */}
          {activeTab === "coupons" && (
            <motion.div key="coupons" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Coupon registry */}
                <div className="lg:col-span-2 bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Active Discount Coupons</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3">Discount Code</th>
                          <th className="p-3">Cut Value</th>
                          <th className="p-3">Coupon Format</th>
                          <th className="p-3">State</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono">
                        {coupons.map((c, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-bold text-white">{c.code}</td>
                            <td className="p-3 font-bold text-[#ff9900]">{c.amount}</td>
                            <td className="p-3 text-gray-400 uppercase font-sans text-[10px]">{c.type === "fixed" ? "Fixed Cash ($)" : "Percentage (%)"}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                c.active ? "bg-emerald-500/25 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-gray-500 border border-white/10"
                              }`}>{c.active ? "Active" : "Disabled"}</span>
                            </td>
                            <td className="p-3 text-right">
                              <button 
                                onClick={() => handleToggleCoupon(c.code)}
                                className={`text-[10px] font-sans font-bold cursor-pointer transition-colors ${c.active ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"}`}
                              >
                                {c.active ? "Disable" : "Enable"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <form onSubmit={handleCreateCoupon} className="bg-black/40 p-4 border border-white/5 rounded-xl space-y-3 text-xs">
                    <span className="font-bold text-gray-200 block border-b border-white/5 pb-1">Create Promo Code Offer</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block mb-1 text-[10px] text-gray-400">Coupon Tag Code</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g., SUMMER50"
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                          className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[10px] text-gray-400">Value Amount</label>
                        <input
                          type="number"
                          required
                          value={newCouponAmount}
                          onChange={(e) => setNewCouponAmount(Number(e.target.value))}
                          className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[10px] text-gray-400">Coupon Math Mode</label>
                        <select
                          value={newCouponType}
                          onChange={(e) => setNewCouponType(e.target.value)}
                          className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Cash ($)</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded cursor-pointer transition-colors">Add Coupon</button>
                  </form>
                </div>

                {/* Advertising setup */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1"><Radio className="w-4 h-4 text-[#ff9900]" /> Promoted Ads</h3>
                  <div className="space-y-3">
                    {promotedAds.map((ad) => (
                      <div key={ad.id} className="bg-black/40 border border-white/5 p-3 rounded-lg space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white block">{ad.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                            ad.status === "Active" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-white/5 text-gray-500 border border-white/10"
                          }`}>{ad.status}</span>
                        </div>
                        <div className="grid grid-cols-2 text-[10px] text-gray-500 font-mono">
                          <span>Budget: ${ad.budget}</span>
                          <span className="text-right">Spent: ${ad.spent}</span>
                          <span>CPC: ${ad.cpc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleCreateAd} className="bg-black/40 p-3.5 border border-white/5 rounded-xl space-y-2.5 text-xs">
                    <span className="font-bold text-gray-200 block border-b border-white/5 pb-1">Start Promoted Ad Campaign</span>
                    <div>
                      <label className="block text-[10px] text-gray-500">Campaign / Product Title</label>
                      <input 
                        type="text"
                        required
                        value={newAdName}
                        onChange={(e) => setNewAdName(e.target.value)}
                        placeholder="Razer Pro Click Ad Spot"
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-500">Budget ($)</label>
                        <input 
                          type="number"
                          required
                          value={newAdBudget}
                          onChange={(e) => setNewAdBudget(Number(e.target.value))}
                          className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500">CPC Bid ($)</label>
                        <input 
                          type="number"
                          step="0.05"
                          required
                          value={newAdCpc}
                          onChange={(e) => setNewAdCpc(Number(e.target.value))}
                          className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none text-xs"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2 bg-[#ff9900]/20 border border-[#ff9900]/30 hover:bg-[#ff9900]/30 text-[#ff9900] font-bold uppercase rounded cursor-pointer transition-colors">Start Ad</button>
                  </form>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 7: SUPPORT TICKETS */}
          {activeTab === "tickets" && (
            <motion.div key="tickets" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 text-left text-xs">
              <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2 uppercase tracking-wider">Client Support Desk</h3>
              
              {activeTicket && (
                <div className="bg-[#ff9900]/10 border border-[#ff9900]/20 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-[#ff9900]/20 pb-2">
                    <span className="font-bold text-[#ff9900]">Reply Support Request: Ticket {activeTicket.id}</span>
                    <button onClick={() => setActiveTicket(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
                  </div>
                  <p className="italic text-gray-300">Client: "{activeTicket.message}"</p>
                  <form onSubmit={handleReplyTicket} className="space-y-3">
                    <div>
                      <label className="block mb-1 font-bold text-gray-400">Response Message Body</label>
                      <textarea
                        required
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type troubleshooting instructions or claim ruling..."
                        className="w-full p-2 bg-[#131b2e] border border-white/10 rounded focus:outline-none focus:border-[#ff9900] h-16 resize-none"
                      />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-black font-bold uppercase rounded cursor-pointer transition-colors">Send & Close Ticket</button>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="border border-white/5 p-4 bg-[#0f172a]/60 backdrop-blur rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{t.subject}</span>
                        <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-gray-400 uppercase font-mono">{t.category}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono block">{t.id} | Email Node: {t.email}</span>
                      <p className="text-gray-400 mt-1">{t.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                        t.status === "Open" ? "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      }`}>{t.status}</span>
                      {t.status === "Open" && (
                        <button 
                          onClick={() => setActiveTicket(t)}
                          className="px-2.5 py-1 bg-[#ff9900]/25 hover:bg-[#ff9900]/40 text-[#ff9900] border border-[#ff9900]/30 font-bold text-[9px] uppercase rounded transition-all cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 8: TELEMETRY & HEALTH */}
          {activeTab === "fraud" && (
            <motion.div key="fraud" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              {/* Health stats widgets */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">CPU Core Load</span>
                    <span className="text-lg font-black text-white font-mono">{systemMetrics.cpu}%</span>
                  </div>
                  <Cpu className="w-5 h-5 text-[#ff9900]" />
                </div>
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Buffer Cache Memory</span>
                    <span className="text-lg font-black text-white font-mono">{systemMetrics.memory}%</span>
                  </div>
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Network Ping Latency</span>
                    <span className="text-lg font-black text-white font-mono">{systemMetrics.latency} ms</span>
                  </div>
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Storage Alloc</span>
                    <span className="text-lg font-black text-white font-mono">{systemMetrics.disk}%</span>
                  </div>
                  <Database className="w-5 h-5 text-[#ff9900]" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Live System Logs Terminal */}
                <div className="lg:col-span-2 bg-[#0b0f19] p-4 rounded-xl border border-white/5 font-mono text-[10px] text-emerald-400 flex flex-col h-72 shadow-inner">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5">
                    <span className="text-white font-bold uppercase tracking-wider flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-[#ff9900]" /> Telemetry Live Audit Logs</span>
                    <button 
                      onClick={() => setAuditLogs([])}
                      className="text-gray-500 hover:text-white text-[9px] uppercase transition-colors"
                    >
                      Clear Log
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="opacity-85 leading-relaxed">{log}</div>
                    ))}
                  </div>
                </div>

                {/* Threat control */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" /> Threat Interceptor Status
                    </h4>
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold block text-gray-300">Biometric OTP Lock</span>
                          <span className="text-[10px] text-gray-500 block">Require OTP code for transactions &gt; $1000</span>
                        </div>
                        <span className="text-emerald-400 text-[10px] font-bold">ONLINE</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-3">
                        <div>
                          <span className="font-bold block text-gray-300">Suspicious IP Blocker</span>
                          <span className="text-[10px] text-gray-500 block">Autoban matching brute login indicators</span>
                        </div>
                        <span className="text-emerald-400 text-[10px] font-bold">ACTIVE</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-3">
                        <div>
                          <span className="font-bold block text-gray-300">Integrity Scanning</span>
                          <span className="text-[10px] text-gray-500 block">Scan items and collections for illegal fields</span>
                        </div>
                        <span className="text-[#ff9900] text-[10px] font-bold">MONITORING</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 9: SYSTEM & BACKUP */}
          {activeTab === "system" && (
            <motion.div key="system" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left text-xs">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Feature flags and toggles */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Active Sandbox Feature Flags</h3>
                  <div className="space-y-4">
                    
                    {[
                      { key: "enableAiRecommendations", label: "Semantic AI Recommendations", description: "Inject matching tags/category matches on landing carousels" },
                      { key: "enableVoiceSearch", label: "Speech Recognition Search Voice Mode", description: "Access device microphone to dictating global search parameters" },
                      { key: "enableStripeCheckout", label: "Stripe Simulator Sandbox Mode", description: "Direct credit validation inputs on cart checkout flows" },
                      { key: "enableMultiVendorShipping", label: "Multi-Warehouse Splitting Shipping", description: "Split orders by different seller depots automatically" },
                      { key: "enableBetaGoldTheme", label: "Premium Gold Highlights Styling", description: "Toggle high-fidelity dark-gold styling options" }
                    ].map((flag) => (
                      <div key={flag.key} className="flex justify-between items-center bg-black/30 p-2.5 rounded border border-white/5">
                        <div className="pr-4">
                          <span className="font-bold block text-gray-200">{flag.label}</span>
                          <span className="text-[10px] text-gray-500 block">{flag.description}</span>
                        </div>
                        <button
                          onClick={() => handleToggleFeatureFlag(flag.key as any)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex-shrink-0 ${
                            featureFlags[flag.key as keyof typeof featureFlags] ? "bg-[#ff9900]" : "bg-white/10"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-[#0b0f19] shadow transition-transform duration-200 ${
                            featureFlags[flag.key as keyof typeof featureFlags] ? "translate-x-4" : "translate-x-0"
                          }`} />
                        </button>
                      </div>
                    ))}

                  </div>
                </div>

                {/* Database actions & Backup recovery */}
                <div className="bg-[#0f172a]/60 backdrop-blur border border-white/5 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">Platform Backup & Restores</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Download complete system transaction parameters and seeded user/product states. You can also deploy a factory override sequence to clear customization artifacts and reinitialize a clean seeded DB environment.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-[10px] text-gray-500 uppercase font-mono">Store Status</label>
                        <button
                          onClick={handleToggleMaintenanceMode}
                          className={`w-full py-2.5 font-bold uppercase rounded border transition-colors cursor-pointer text-xs ${
                            maintenanceMode 
                              ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30" 
                              : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                          }`}
                        >
                          {maintenanceMode ? "MAINTENANCE MODE" : "SYSTEM ONLINE"}
                        </button>
                      </div>

                      <div>
                        <label className="block mb-1 text-[10px] text-gray-500 uppercase font-mono">Platform Currency</label>
                        <select
                          value={systemCurrency}
                          onChange={(e) => setSystemCurrency(e.target.value)}
                          className="w-full p-2.5 bg-[#131b2e] border border-white/10 rounded focus:outline-none text-xs font-bold"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/5">
                    <button
                      onClick={handleTriggerBackup}
                      className="w-full py-2 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 font-bold uppercase rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download Database JSON Backup
                    </button>
                    <button
                      onClick={handleFactoryReset}
                      className="w-full py-2 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-bold uppercase rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Database className="w-4 h-4" /> Factory Reset Database (1000+ Seeds)
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Printable Report Modal Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40">
              <span className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#ff9900]" /> Platform Financial Audit Report
              </span>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-left text-xs print:text-black print:bg-white text-gray-300">
              {/* Invoice details header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">NEXUS MARKETPLACE</h2>
                  <span className="text-[10px] text-gray-500">Autonomous Ecommerce Core 2050</span>
                </div>
                <div className="text-right font-mono text-[10px]">
                  <div>REPORT ID: RPT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
                  <div>TIMESTAMP: {new Date().toLocaleString()}</div>
                  <div>AUDITOR: Platform System Controller</div>
                </div>
              </div>

              {/* Financial snapshot */}
              <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-black/30 border border-white/5 p-3 rounded">
                  <span className="text-[10px] text-gray-500 block">TOTAL VOLUME ACCRUED</span>
                  <span className="text-sm font-bold text-[#ff9900]">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded">
                  <span className="text-[10px] text-gray-500 block">TRANSACTIONS PROCESSED</span>
                  <span className="text-sm font-bold text-white">{ordersList.length} Ingress Orders</span>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded">
                  <span className="text-[10px] text-gray-500 block">SEEDED DATABASE SCHEMA</span>
                  <span className="text-sm font-bold text-emerald-400">1,020 Total Products</span>
                </div>
              </div>

              {/* Inventory categorization distribution */}
              <div className="space-y-2">
                <h3 className="font-bold text-white uppercase tracking-wider text-[10px] border-b border-white/5 pb-1">Segmented Distribution Matrix</h3>
                <div className="space-y-2.5 font-mono text-[10px]">
                  <div className="flex justify-between"><span>Smartphones Catalog Line:</span><span>117 Seeded entries</span></div>
                  <div className="flex justify-between"><span>Gaming Gear & Tech Line:</span><span>117 Seeded entries</span></div>
                  <div className="flex justify-between"><span>Workstations Rendering Line:</span><span>117 Seeded entries</span></div>
                  <div className="flex justify-between"><span>Laptops & Notebooks Line:</span><span>117 Seeded entries</span></div>
                  <div className="flex justify-between"><span>Monitors Spatial Display Line:</span><span>117 Seeded entries</span></div>
                  <div className="flex justify-between border-t border-white/5 pt-2 text-white"><span>TOTAL CATALOG INVENTORY:</span><span>1,020 active models</span></div>
                </div>
              </div>

              {/* System Audit details */}
              <div className="space-y-2 font-mono text-[9px] text-gray-500">
                <h3 className="font-bold text-white uppercase tracking-wider text-[10px] border-b border-white/5 pb-1">System Health Telemetry</h3>
                <p>Host CPU Architecture: Client Browser Runtime Simulator</p>
                <p>Persistence Engine: Browser Local Storage key mappings</p>
                <p>Security Handshakes: JWT Mock Token authentication validation</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-2">
              <button 
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-[#ff9900] text-black font-bold uppercase rounded text-xs cursor-pointer hover:bg-[#e08700] transition-colors"
              >
                Print Report
              </button>
              <button 
                onClick={() => setShowReportModal(false)}
                className="px-4 py-1.5 border border-white/10 text-white font-bold uppercase rounded text-xs cursor-pointer hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
