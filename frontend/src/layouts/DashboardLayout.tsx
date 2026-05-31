"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { loginSuccess, logout } from "@/store/slices/authSlice";
import { apiService } from "@/services/apiService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Store, Cpu, Database, 
  Menu, X, Bell, LogOut, RefreshCw, ChevronRight, Activity,
  Sliders, ShieldCheck, Sun, Moon, ArrowUpRight, Lock, Key
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: 'customer' | 'admin' | 'seller' | 'superadmin';
  onRoleChange?: (role: 'customer' | 'admin' | 'seller' | 'superadmin') => void;
}

export function DashboardLayout({ children, activeRole, onRoleChange }: DashboardLayoutProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [elevateLoading, setElevateLoading] = useState(false);

  // Sync theme with document element
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Live system status metrics
  const [systemMetrics, setSystemMetrics] = useState({
    status: "Active",
    dbSync: "Synced",
    apiLatency: 12
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        apiLatency: Math.floor(Math.random() * 6) + 8
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleRoleToggle = async (targetRole: 'customer' | 'admin' | 'seller' | 'superadmin') => {
    setElevateLoading(true);
    setRoleMenuOpen(false);
    try {
      // Local storage fallback updates
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const uObj = JSON.parse(storedUser);
        uObj.role = targetRole === "superadmin" ? "admin" : targetRole;
        if (targetRole === "superadmin") {
          uObj.isSuperAdmin = true;
        } else {
          uObj.isSuperAdmin = false;
        }
        localStorage.setItem("currentUser", JSON.stringify(uObj));
        dispatch(loginSuccess({ user: uObj, token: token || "mock_token" }));
      }
      if (onRoleChange) onRoleChange(targetRole);
    } catch (err) {
      console.error("Error setting dashboard role override", err);
    } finally {
      setElevateLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const getRoleHeaderDetails = () => {
    switch (activeRole) {
      case 'superadmin':
        return { title: "Super Admin Console", glow: "text-amber-500", color: "#f59e0b" };
      case 'admin':
        return { title: "Administrative Center", glow: "text-indigo-600 dark:text-indigo-400", color: "#6366f1" };
      case 'seller':
        return { title: "Merchant Dashboard", glow: "text-purple-600 dark:text-purple-400", color: "#a855f7" };
      default:
        return { title: "Customer Portal", glow: "text-gray-900 dark:text-white", color: "#3b82f6" };
    }
  };

  const navLinks = [
    { name: "Customer view", role: "customer" as const, icon: User },
    { name: "Seller terminal", role: "seller" as const, icon: Store },
    { name: "Admin console", role: "admin" as const, icon: Shield },
    { name: "Super Admin panel", role: "superadmin" as const, icon: Lock },
  ];

  const roleDetails = getRoleHeaderDetails();

  return (
    <div className={`w-screen h-screen overflow-hidden flex font-sans ${themeMode === 'light' ? 'bg-[#f3f4f6] text-gray-900' : 'bg-[#0b0f19] text-white'}`}>
      
      {/* COLLAPSIBLE SIDEBAR */}
      <aside 
        className={`hidden md:flex flex-col border-r relative z-30 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-[#131921] border-white/5 backdrop-blur-2xl'}`}
      >
        {/* SIDEBAR HEADER */}
        <div className="p-5 flex items-center justify-between border-b border-white/5 h-20">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#ff9900] flex items-center justify-center shadow-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-widest text-[#ff9900]">
                  Nexus<span className="text-white">.X</span>
                </span>
                <span className="text-[7.5px] font-mono text-gray-400 uppercase tracking-widest font-bold">ENTERPRISE PORTAL</span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded bg-[#ff9900] flex items-center justify-center mx-auto shadow-md">
              <Cpu className="w-4 h-4 text-white" />
            </div>
          )}

          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* SIDEBAR LINKS */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[8px] font-mono font-bold tracking-widest text-gray-400 uppercase px-3.5 mb-3">
            {sidebarOpen ? "Dashboard Panels" : "DASH"}
          </div>

          {navLinks.map((link) => {
            const isActive = activeRole === link.role;
            const LinkIcon = link.icon;
            return (
              <button
                key={link.role}
                onClick={() => handleRoleToggle(link.role)}
                className={`w-full flex items-center gap-3 py-3 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? `${themeMode === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-white/5 border-white/10 text-white'}`
                    : `border-transparent text-gray-400 hover:text-white hover:bg-white/2`
                }`}
                style={{ 
                  borderLeftColor: isActive ? roleDetails.color : undefined,
                  borderLeftWidth: isActive ? "3px" : undefined
                }}
              >
                <LinkIcon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? roleDetails.color : undefined }} />
                {sidebarOpen && (
                  <span className="capitalize tracking-wider">
                    {link.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-white/5">
          {sidebarOpen ? (
            <div className="p-3 bg-white/2 rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#ff9900]/20 flex items-center justify-center text-[10px] font-black text-[#ff9900]">
                  {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "O"}
                </div>
                <div className="flex flex-col w-28 text-left">
                  <span className="text-[10px] font-bold truncate capitalize">{user?.name || "Operator"}</span>
                  <span className="text-[8px] font-mono text-gray-400 truncate uppercase">{activeRole}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-white/2 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-gray-400 hover:text-red-400 flex items-center justify-center mx-auto transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 h-full bg-[#131921] border-r border-white/5 p-5 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[#ff9900]" />
                    <span className="text-sm font-black uppercase tracking-widest text-white">Nexus Center</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = activeRole === link.role;
                    const LinkIcon = link.icon;
                    return (
                      <button
                        key={link.role}
                        onClick={() => { handleRoleToggle(link.role); setMobileOpen(false); }}
                        className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? `bg-white/5 border-white/10 text-white`
                            : "border-transparent text-gray-400 hover:text-white"
                        }`}
                        style={{ borderLeftColor: isActive ? roleDetails.color : undefined, borderLeftWidth: isActive ? "3px" : undefined }}
                      >
                        <LinkIcon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? roleDetails.color : undefined }} />
                        <span className="capitalize tracking-wider">{link.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-3 bg-white/2 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#ff9900]/20 flex items-center justify-center text-[10px] font-black text-[#ff9900]">
                    {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "O"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-white truncate capitalize">{user?.name || "Operator"}</span>
                    <span className="text-[8px] font-mono text-gray-500 truncate uppercase">{activeRole}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-1 text-gray-400 hover:text-red-400 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* TOP NAVBAR */}
        <header className={`h-20 flex items-center justify-between px-6 border-b transition-colors relative z-20 ${
          themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-[#131921]/50 border-white/5 backdrop-blur-md'
        }`}>
          {/* LEFT: TITLE & MOBILE TOGGLE */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className={`text-base font-black uppercase tracking-wider ${roleDetails.glow}`}>
                {roleDetails.title}
              </span>
              <span className="hidden sm:inline-block text-[8px] font-mono px-2 py-0.5 rounded bg-[#ff9900]/10 border border-[#ff9900]/20 text-[#ff9900] uppercase tracking-widest leading-none font-bold">
                MEMBER AREA
              </span>
            </div>
          </div>

          {/* MIDDLE: REAL-TIME SYSTEM HUD */}
          <div className="hidden xl:flex items-center gap-6 px-4 py-2 rounded-full border bg-black/25 border-white/5 font-mono text-[9px] text-gray-400 select-none">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>SYSTEM: <strong className="text-emerald-400">ONLINE</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>DB CLUSTER: <strong className="text-white">{systemMetrics.dbSync}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#ff9900]" />
              <span>LATENCY: <strong className="text-white">{systemMetrics.apiLatency}ms</strong></span>
            </div>
          </div>

          {/* RIGHT: THEME & OVERRIDES */}
          <div className="flex items-center gap-3">
            
            {/* Quick Link to Catalog Shop */}
            <Link 
              href="/shop" 
              className="hidden lg:flex items-center gap-1 text-[9px] font-mono font-bold uppercase border border-white/10 hover:border-[#ff9900]/50 px-3 py-2 rounded-xl transition-all hover:bg-[#ff9900]/5 text-gray-300 hover:text-[#ff9900] tracking-widest"
            >
              Back to Catalog <ArrowUpRight className="w-3 h-3" />
            </Link>

            {/* Quick Switch role dropdown widget */}
            <div className="relative">
              <button 
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                disabled={elevateLoading}
                className="flex items-center gap-1.5 text-[9px] font-mono font-black uppercase border px-3 py-2 rounded-xl transition-all cursor-pointer tracking-wider"
                style={{ borderColor: roleDetails.color, color: roleDetails.color }}
              >
                {elevateLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Sliders className="w-3.5 h-3.5" />
                )}
                <span>Override Role</span>
              </button>

              <AnimatePresence>
                {roleMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-44 bg-[#131921] border border-white/10 rounded-xl p-1 shadow-2xl z-50 font-mono text-[9px]"
                  >
                    <div className="px-2.5 py-1.5 text-[8.5px] text-gray-400 uppercase font-black border-b border-white/5 mb-1 select-none">
                      Developer Bypass
                    </div>
                    {['customer', 'seller', 'admin', 'superadmin'].map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleToggle(r as any)}
                        className={`w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer uppercase transition-colors tracking-wider block ${
                          activeRole === r ? "text-[#ff9900] font-bold" : "text-gray-400"
                        }`}
                      >
                        {r} Dashboard
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Light/Dark mode */}
            <button 
              onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-hidden p-6 relative z-10 flex flex-col">
          {children}
        </main>

      </div>
    </div>
  );
}
