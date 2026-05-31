"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { 
  Settings, Lock, Database, Activity, ShieldAlert, 
  ToggleLeft, ToggleRight, Save, ShieldCheck, RefreshCw, 
  Trash, Users, Key, AlertCircle, FileText, Download, UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SuperAdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Tabs: settings, flags, health, backups, audits
  const [activeTab, setActiveTab] = useState<"settings" | "flags" | "health" | "backups" | "audits">("settings");
  
  // Platform configs
  const [platformName, setPlatformName] = useState("Nexus Commerce X");
  const [platformCurrency, setPlatformCurrency] = useState("USD");
  const [commissionRate, setCommissionRate] = useState(8.5);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(15);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Feature Flags
  const [flags, setFlags] = useState({
    aiAssistant: true,
    flashSales: true,
    socialLogin: true,
    voiceSearch: true,
    fraudShield: true,
    loyaltySystem: true
  });

  // Admin users lists
  const [adminsList, setAdminsList] = useState<any[]>([
    { id: "adm-1", name: "Super User", email: "superadmin@nexus.com", level: "Root" },
    { id: "adm-2", name: "Secondary Admin", email: "admin@nexus.com", level: "Standard" }
  ]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");

  // Health Stats
  const [healthMetrics, setHealthMetrics] = useState({
    cpu: 24,
    ram: 58,
    disk: 42,
    uptime: "14 Days, 6 Hours",
    dbConnection: "Healthy",
    apiLatency: 45
  });

  // Audits
  const [auditLogs, setAuditLogs] = useState<any[]>(() => [
    { id: 1, action: "ROOT_LOGIN", user: "superadmin@nexus.com", details: "Handshake verified for session key", date: "2026-05-30T10:00:00Z" },
    { id: 2, action: "FEATURE_FLAG_MODIFIED", user: "superadmin@nexus.com", details: "Enabled fraudShield", date: "2026-05-30T09:00:00Z" },
    { id: 3, action: "DB_BACKUP_INITIATED", user: "System Scheduler", details: "Committed automatic compression to bucket", date: "2026-05-30T08:00:00Z" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate live platform health metrics jitter
      setHealthMetrics(prev => ({
        ...prev,
        cpu: Math.min(100, Math.max(10, prev.cpu + Math.floor(Math.random() * 9 - 4))),
        ram: Math.min(100, Math.max(20, prev.ram + Math.floor(Math.random() * 5 - 2))),
        apiLatency: Math.min(200, Math.max(20, prev.apiLatency + Math.floor(Math.random() * 11 - 5)))
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFlag = useCallback((key: keyof typeof flags) => {
    const nextFlags = { ...flags, [key]: !flags[key] };
    setFlags(nextFlags);
    setAuditLogs(prev => [
      { id: Date.now(), action: "FEATURE_FLAG_MODIFIED", user: user?.email || "Super Admin", details: `Toggled ${key} status to ${nextFlags[key]}`, date: new Date().toISOString() },
      ...prev
    ]);
  }, [flags, user]);

  const handleSaveSettings = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg("Settings saved successfully.");
    setAuditLogs(prev => [
      { id: Date.now(), action: "SETTINGS_UPDATED", user: user?.email || "Super Admin", details: "Modified base commission and delivery variables", date: new Date().toISOString() },
      ...prev
    ]);
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  }, [user]);

  const handleAddAdmin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName) return;
    const added = {
      id: "adm-" + Math.floor(Math.random() * 10000),
      name: newAdminName,
      email: newAdminEmail,
      level: "Standard"
    };
    setAdminsList(prev => [...prev, added]);
    setNewAdminEmail("");
    setNewAdminName("");
    setAuditLogs(prev => [
      { id: Date.now(), action: "ADMIN_ADDED", user: user?.email || "Super Admin", details: `Granted admin privilege to ${added.email}`, date: new Date().toISOString() },
      ...prev
    ]);
  }, [newAdminEmail, newAdminName, user]);

  const handleRemoveAdmin = useCallback((id: string) => {
    setAdminsList(prev => prev.filter(a => a.id !== id));
    setAuditLogs(prev => [
      { id: Date.now(), action: "ADMIN_REMOVED", user: user?.email || "Super Admin", details: `Revoked admin privileges for ${id}`, date: new Date().toISOString() },
      ...prev
    ]);
  }, [user]);

  const triggerBackup = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([localStorage.getItem("nexus_fallback_products") || "[]"], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "nexus_db_backup.json";
    document.body.appendChild(element);
    element.click();
    
    setAuditLogs(prev => [
      { id: Date.now(), action: "DATABASE_EXPORT", user: user?.email || "Super Admin", details: "Downloaded client local fallback DB JSON backup", date: new Date().toISOString() },
      ...prev
    ]);
  }, [user]);

  const triggerRestore = useCallback(() => {
    // Purges custom records and seeds default values
    localStorage.removeItem("nexus_fallback_products");
    localStorage.removeItem("nexus_fallback_orders");
    window.location.reload();
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-y-auto custom-scrollbar pb-10 text-gray-200">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-56 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4 flex-shrink-0">
        {[
          { id: "settings", label: "System Config", icon: Settings },
          { id: "flags", label: "Feature Flags", icon: Key },
          { id: "health", label: "Health Monitors", icon: Activity },
          { id: "backups", label: "DB & Backups", icon: Database },
          { id: "audits", label: "Audit Ledger", icon: ShieldAlert }
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer text-left ${
                activeTab === tab.id
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "text-gray-400 hover:bg-white/10 hover:text-black"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: SYSTEM CONFIGS */}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* General Settings */}
                <form onSubmit={handleSaveSettings} className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm space-y-4 text-xs">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Global Configuration</h4>
                  
                  <div>
                    <label className="block mb-1 font-bold">Platform App Name</label>
                    <input
                      type="text"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                      className="w-full p-2 bg-black/40 border border-gray-300 rounded focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1 font-bold">Default Currency</label>
                      <input
                        type="text"
                        value={platformCurrency}
                        onChange={(e) => setPlatformCurrency(e.target.value)}
                        className="w-full p-2 bg-black/40 border border-gray-300 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-bold">Market Commission Fee (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(Number(e.target.value))}
                        className="w-full p-2 bg-black/40 border border-gray-300 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-bold">Base Logistics Shipping Fee ($)</label>
                    <input
                      type="number"
                      value={baseDeliveryFee}
                      onChange={(e) => setBaseDeliveryFee(Number(e.target.value))}
                      className="w-full p-2 bg-black/40 border border-gray-300 rounded focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer transition-colors">
                    <Save className="w-4 h-4" /> Save Configuration
                  </button>
                  {saveSuccessMsg && (
                    <p className="text-xs font-bold text-emerald-600 mt-2">{saveSuccessMsg}</p>
                  )}
                </form>

                {/* Admin Management */}
                <div className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm space-y-4 text-xs">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Admin Users Register</h4>
                  
                  {/* Create admin */}
                  <form onSubmit={handleAddAdmin} className="bg-black/40 p-4 border border-white/10 rounded-lg space-y-3">
                    <span className="font-bold block">Delegate Administrator Privilege</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Admin name"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="p-2 glass-effect border border-gray-300 rounded focus:outline-none"
                      />
                      <input
                        type="email"
                        required
                        placeholder="admin@nexus.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="p-2 glass-effect border border-gray-300 rounded focus:outline-none"
                      />
                    </div>
                    <button type="submit" className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-black font-bold uppercase rounded cursor-pointer">Grant Admin Access</button>
                  </form>

                  <div className="space-y-2">
                    {adminsList.map((adm) => (
                      <div key={adm.id} className="flex justify-between items-center p-3 border border-white/5 rounded-lg text-xs">
                        <div>
                          <span className="font-bold text-gray-200 block capitalize">{adm.name}</span>
                          <span className="text-[10px] text-gray-400 block">{adm.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] bg-amber-100 text-[#ff9900] px-1.5 py-0.5 rounded font-bold">{adm.level}</span>
                          {adm.level !== "Root" && (
                            <button 
                              onClick={() => handleRemoveAdmin(adm.id)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: FEATURE FLAGS */}
          {activeTab === "flags" && (
            <motion.div key="flags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-left">
              <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">Toggle App Modules</h3>
              
              <div className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {[
                  { key: "aiAssistant", label: "AI Shopping Assistant", desc: "Allows clients to consult custom AI specifications advisors in their panels." },
                  { key: "flashSales", label: "Flash Sales Countdown Timer", desc: "Activates countdown tickers and flash price models on catalog items." },
                  { key: "socialLogin", label: "SSO Social Logins", desc: "Simulates Google and GitHub SSO login channels." },
                  { key: "voiceSearch", label: "Voice Capture Search", desc: "Toggles micro-haptic speech scanning capabilities in the Navbar." },
                  { key: "fraudShield", label: "Threat Prevention Shield", desc: "Analyzes anomalous log activities and locks suspicious accounts." },
                  { key: "loyaltySystem", label: "Loyalty Points Ledger", desc: "Allocates rewards credits on client actions." }
                ].map((item) => {
                  const isActive = flags[item.key as keyof typeof flags];
                  return (
                    <div key={item.key} className="flex justify-between items-center p-4 bg-black/40 border border-white/10 rounded-xl hover:border-gray-300 transition-colors">
                      <div className="pr-4">
                        <span className="font-bold text-white block">{item.label}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 leading-normal">{item.desc}</span>
                      </div>
                      <button
                        onClick={() => handleToggleFlag(item.key as any)}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {isActive ? (
                          <ToggleRight className="w-10 h-10 text-[#ff9900]" />
                        ) : (
                          <ToggleLeft className="w-10 h-10 text-gray-300" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: HEALTH MONITORS */}
          {activeTab === "health" && (
            <motion.div key="health" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">System Diagnostics</h3>

              {/* Gauges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-center font-mono">
                <div className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm space-y-2">
                  <span className="text-gray-400 font-bold block">CPU Load</span>
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                      <circle cx="48" cy="48" r="40" stroke="#ff9900" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * healthMetrics.cpu) / 100} />
                    </svg>
                    <span className="absolute text-base font-black text-gray-200">{healthMetrics.cpu}%</span>
                  </div>
                </div>

                <div className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm space-y-2">
                  <span className="text-gray-400 font-bold block">Memory Usage</span>
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                      <circle cx="48" cy="48" r="40" stroke="#8a2be2" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * healthMetrics.ram) / 100} />
                    </svg>
                    <span className="absolute text-base font-black text-gray-200">{healthMetrics.ram}%</span>
                  </div>
                </div>

                <div className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm space-y-2">
                  <span className="text-gray-400 font-bold block">Uptime Status</span>
                  <div className="h-24 flex flex-col justify-center">
                    <span className="text-sm font-bold text-emerald-600 block flex items-center justify-center gap-1"><ShieldCheck className="w-5 h-5"/> Healthy</span>
                    <span className="text-xs font-black text-gray-200 mt-1">{healthMetrics.uptime}</span>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm text-xs space-y-2.5">
                <span className="font-bold text-white block border-b border-white/5 pb-1.5">Platform Performance Details</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Database Connection:</span>
                    <span className="font-bold text-emerald-600">CONNECTED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">API Gateway Latency:</span>
                    <span className="font-bold text-gray-200">{healthMetrics.apiLatency} ms</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: DATABASE & BACKUPS */}
          {activeTab === "backups" && (
            <motion.div key="backups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-left text-xs">
              <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">Database Backup & Purge</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Backups trigger */}
                <div className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm space-y-4">
                  <span className="font-bold text-white block border-b border-white/5 pb-1.5">Backup Controls</span>
                  <p className="text-gray-400 leading-relaxed">Save a complete copy of the client local fallback JSON database or restore defaults.</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={triggerBackup}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download Backup
                    </button>
                    <button
                      onClick={triggerRestore}
                      className="px-4 py-2 border border-gray-300 rounded uppercase hover:bg-black/40 cursor-pointer flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" /> Restore Defaults
                    </button>
                  </div>
                </div>

                {/* Purge controls */}
                <div className="glass-effect border border-white/10 rounded-lg p-5 shadow-sm space-y-4">
                  <span className="font-bold text-white block border-b border-white/5 pb-1.5">Data Purge Control</span>
                  <p className="text-gray-400 leading-relaxed">Instantly erase simulated transactions history, registered users list, or clear active browser tokens.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem("nexus_fallback_orders");
                        window.location.reload();
                      }}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold uppercase rounded cursor-pointer"
                    >
                      Purge Orders
                    </button>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded cursor-pointer"
                    >
                      Purge System
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: AUDIT LOGS */}
          {activeTab === "audits" && (
            <motion.div key="audits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-left text-xs">
              <h3 className="font-bold text-sm text-white border-b border-white/5 pb-2">Root Audit logs</h3>
              
              <div className="glass-effect border border-white/10 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black/40 border-b border-white/5 text-gray-400 font-bold">
                      <th className="p-3">Action Event</th>
                      <th className="p-3">Trigger User</th>
                      <th className="p-3">Audit Details</th>
                      <th className="p-3">Date Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-black/40/50">
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-amber-100 text-[#ff9900]">{log.action}</span>
                        </td>
                        <td className="p-3 text-white">{log.user}</td>
                        <td className="p-3 text-gray-400 font-sans text-xs">{log.details}</td>
                        <td className="p-3 text-gray-400">{new Date(log.date).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
