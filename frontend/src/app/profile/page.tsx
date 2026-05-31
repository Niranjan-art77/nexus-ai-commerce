"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { loginSuccess } from "@/store/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Check, ShieldAlert, Fingerprint, 
  Globe, Database, Key, Save, Server, Activity, 
  Sliders, AlertTriangle, Eye, EyeOff, RefreshCw
} from "lucide-react";
import { mockDb } from "@/utils/mockDb";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  
  // Status states
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [biometricScanned, setBiometricScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Simulated Sync telemetry state
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [dbSize, setDbSize] = useState("0 KB");
  const [latency, setLatency] = useState("0.1ms");

  // Route Guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setJobTitle(user.jobTitle || "Software Engineer");
    }
  }, [isAuthenticated, router, user]);

  // Load sync telemetry details
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Calculate simulated size based on localStorage
    const calculateStorageSize = () => {
      let totalBytes = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalBytes += (localStorage[key] || "").length * 2; // UTF-16 characters are 2 bytes
        }
      }
      setDbSize((totalBytes / 1024).toFixed(2) + " KB");
    };

    calculateStorageSize();
    setLatency((Math.random() * 0.15 + 0.05).toFixed(2) + "ms");

    setSyncLogs([
      "SECURE: Handshake verified.",
      "SYNC: Checking local cached datasets...",
      `STORAGE: Local DB nodes loaded (${(totalBytes => (totalBytes / 1024).toFixed(2) + " KB")(0)}).`,
      "SECURITY: Session validation active."
    ]);

    const timer = setInterval(() => {
      const logs = [
        "SYNC: Periodic database checksum committed.",
        "MONITOR: System latency nominal.",
        "DB: Synced wishlist and cart items locally.",
        "SECURE: Rotating session signature token.",
        "FALLBACK: Listening on fallback API port."
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setSyncLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Biometric scanner loop
  const startBiometricScan = useCallback(() => {
    if (scanning) return;
    setScanning(true);
    setScanProgress(0);
    setBiometricScanned(false);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setBiometricScanned(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  }, [scanning]);

  // Save profile changes
  const handleSaveChanges = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg("User name and email credentials cannot be empty.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Simulate system update delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      // Attempt API update (in case server is online)
      const res = await fetch("http://localhost:4000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, jobTitle })
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(loginSuccess({ user: data.user, token: token || "mock_token" }));
        setSuccessMsg("Profile metrics synchronized with central database server.");
      } else {
        throw new Error("Server core unreachable");
      }
    } catch (err) {
      console.warn("Backend profile sync unreachable. Persisting update locally.", err);
      
      // Update local storage user profile fallback
      if (typeof window !== "undefined") {
        const currentUserStr = localStorage.getItem("currentUser");
        if (currentUserStr) {
          const uObj = JSON.parse(currentUserStr);
          uObj.name = name;
          uObj.email = email;
          uObj.jobTitle = jobTitle;
          uObj.avatar = name[0]?.toUpperCase() || "N";
          
          localStorage.setItem("currentUser", JSON.stringify(uObj));

          // Also update in users list database
          const usersList = JSON.parse(localStorage.getItem("nexus_fallback_users") || "[]");
          const idx = usersList.findIndex((u: any) => u.email === user?.email || u._id === user?._id);
          if (idx !== -1) {
            usersList[idx] = { ...usersList[idx], name, email, jobTitle, avatar: uObj.avatar };
            localStorage.setItem("nexus_fallback_users", JSON.stringify(usersList));
          }

          dispatch(loginSuccess({ user: uObj, token: token || "mock_token" }));
          setSuccessMsg("Success! Profile details updated successfully in secure browser storage.");
        } else {
          setErrorMsg("Failed to resolve current active local profile credentials.");
        }
      }
    } finally {
      setSaving(false);
    }
  }, [name, email, jobTitle, token, user, dispatch]);

  const syncLogsList = useMemo(() => {
    return syncLogs.map((log, index) => (
      <p key={index} className="truncate select-none">
        <span className="text-[#d97706]">&gt;</span> {log}
      </p>
    ));
  }, [syncLogs]);

  const calibratedDateStr = useMemo(() => {
    return new Date(user?.createdAt || "2026-05-30").toLocaleDateString();
  }, [user?.createdAt]);

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="text-center font-mono">
          <p className="text-gray-500 animate-pulse uppercase tracking-widest text-xs">Synchronizing active profile session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-20 max-w-7xl mx-auto font-sans text-gray-900 dark:text-white relative">
      {/* Page Header */}
      <div className="mb-8 pb-4 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div>
          <span className="text-[10px] text-[#d97706] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 mb-1.5">
            <Sliders className="w-3.5 h-3.5" /> Workspace Profile Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Account Settings
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg font-mono text-[10px] text-gray-500 dark:text-gray-400">
          <Server className="w-3.5 h-3.5 text-emerald-500" />
          <span>Local Storage Nodes Online</span>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono rounded-xl flex items-center gap-2.5 shadow-sm"
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono rounded-xl flex items-center gap-2.5 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: Identity Badge & Diagnostics */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Minimalist Profile Badge */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 p-6 rounded-xl shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[9px] font-mono text-[#d97706] bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded font-bold">
                Profile Identity
              </span>
              <span className="text-[9px] font-mono text-gray-500 uppercase">
                Role: {user.isSuperAdmin ? "Super Admin" : user.role}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#febd69] to-[#f3a847] rounded-xl p-0.5 shadow-sm">
                  <div className="w-full h-full bg-white dark:bg-[#182235] rounded-xl flex items-center justify-center overflow-hidden relative">
                    <span className="text-2xl font-black text-gray-800 dark:text-white font-mono">{user.avatar || user.name?.[0]?.toUpperCase() || "O"}</span>
                  </div>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-white dark:bg-[#0b0f19] border border-gray-200 dark:border-white/10 rounded-full p-1 shadow-md">
                  <Shield className="w-3.5 h-3.5 text-[#d97706]" />
                </div>
              </div>

              <div className="flex-1 w-full text-center sm:text-left">
                <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-0.5">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3 truncate">{user.email}</p>

                <div className="flex flex-col gap-1.5 text-[9px] font-mono text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-1">
                    <span>JOB TITLE:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">{jobTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-1">
                    <span>USER ID:</span>
                    <span className="text-gray-800 dark:text-gray-200 uppercase">{user._id?.substring(0, 10) || "UNKNOWN"}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>SECURITY SCOPE:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <Check className="w-2.5 h-2.5" /> SECURE SESSION
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[8px] font-mono text-gray-500">
              <span>PLATFORM DESIGNATION: V3.0</span>
              <span>CALIBRATED: {calibratedDateStr}</span>
            </div>
          </div>

          {/* Connection Diagnostics Panel */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 p-6 rounded-xl shadow-sm text-xs">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-500" /> Diagnostics & Logs
            </h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-200/50 dark:border-white/5">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Globe className="w-4 h-4 text-[#d97706]" />
                  <span>Network Sync Status</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-[#00ff87]/10 border border-emerald-200 dark:border-[#00ff87]/30 text-emerald-800 dark:text-[#00ff87] rounded text-[9px] font-bold uppercase tracking-wider">
                  Operational
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-200/50 dark:border-white/5">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Database className="w-4 h-4 text-indigo-500" />
                  <span>Local Storage Cache</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-[10px]">{dbSize} active</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-200/50 dark:border-white/5">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Key className="w-4 h-4 text-amber-500" />
                  <span>Client latency</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-[10px]">{latency}</span>
              </div>
            </div>

            {/* Sync Live Terminal logs */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-white/5 rounded-lg">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest border-b border-gray-200 dark:border-white/5 pb-1 mb-2">Sync Log Stream</p>
              <div className="flex flex-col gap-1 text-[8.5px] text-gray-500 dark:text-gray-400 font-mono">
                {syncLogsList}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Settings Form & Security Scans */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Identity Parameters Editor */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 p-6 rounded-xl shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-6">
              <Sliders className="w-4 h-4 text-[#d97706]" /> Personal Information
            </h3>

            <form onSubmit={handleSaveChanges} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#d97706]"
                    placeholder="Enter name..."
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#d97706]"
                    placeholder="Enter email..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Job Title</label>
                  <select 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#d97706] cursor-pointer"
                  >
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Cloud Architect">Cloud Architect</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#d97706]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning Banner */}
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 text-[#b45309] dark:text-amber-500/90 rounded-lg text-[10px] flex items-start gap-2.5 leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#d97706]" />
                <p>Profile changes persist locally in your browser workspace storage cache. Unauthorized changes to system credentials will trigger session re-verification checks.</p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#febd69] hover:bg-[#f3a847] text-black font-bold uppercase rounded-lg tracking-wider text-[10px] shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{saving ? "Saving Details..." : "Save Configuration"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Biometric Registry */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/5 p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-1">
                <Fingerprint className="w-4 h-4 text-[#d97706]" /> Biometric Registry Lock
              </h3>
              <p className="text-xs text-gray-500">Scan and lock your profile session for password-less authentication.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              {/* Scan box Visualizer */}
              <div className="w-full sm:w-1/3 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={startBiometricScan}
                  disabled={scanning}
                  className={`w-28 h-28 border border-dashed rounded-full flex flex-col items-center justify-center relative cursor-pointer group active:scale-98 transition-all ${
                    scanning 
                      ? "border-[#d97706] bg-[#d97706]/5 shadow-sm"
                      : biometricScanned
                        ? "border-emerald-500 bg-emerald-500/5 shadow-sm"
                        : "border-gray-300 dark:border-white/20 hover:border-[#d97706] hover:bg-gray-50 dark:hover:bg-white/5 shadow-none"
                  }`}
                >
                  <Fingerprint className={`w-10 h-10 transition-all ${
                    scanning 
                      ? "text-[#d97706] animate-pulse"
                      : biometricScanned
                        ? "text-emerald-500"
                        : "text-gray-400 group-hover:text-[#d97706]"
                  }`} />
                  
                  {scanning && (
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#d97706] animate-[scan_2s_ease-in-out_infinite]" />
                  )}

                  <span className="text-[8px] font-mono uppercase tracking-widest text-gray-400 mt-2">
                    {scanning 
                      ? "SCANNING..." 
                      : biometricScanned 
                        ? "BIOMETRIC SYNCED" 
                        : "TOUCH SENSOR"}
                  </span>
                </button>
              </div>

              {/* Scan readings telemetry */}
              <div className="w-full sm:w-2/3 flex flex-col gap-4 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                    <span>Biometric Calibration</span>
                    <span>{scanning ? `${scanProgress}%` : biometricScanned ? "100%" : "0%"}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/10">
                    <div 
                      className={`h-full transition-all duration-200 ${
                        biometricScanned ? "bg-emerald-500" : "bg-[#d97706]"
                      }`} 
                      style={{ width: `${scanning ? scanProgress : biometricScanned ? 100 : 0}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-[9px] text-gray-500">
                  <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-1">
                    <span>BIOMETRIC MATCH RATE:</span>
                    <span className={biometricScanned ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-500"}>
                      {biometricScanned ? "99.98% VERIFIED" : "STANDBY"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-1">
                    <span>ENCRYPTION MODULE:</span>
                    <span className={biometricScanned ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-500"}>
                      {biometricScanned ? "ACTIVE KEY DESCRIPTOR" : "INACTIVE"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>PROFILE BINDING:</span>
                    <span className={biometricScanned ? "text-gray-800 dark:text-gray-200 font-bold" : "text-gray-500"}>
                      {biometricScanned ? jobTitle.toUpperCase() : "AWAITING LOCK"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
