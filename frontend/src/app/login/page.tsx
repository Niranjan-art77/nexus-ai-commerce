"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { Shield, LogIn, Globe, Sparkles, Key, Lock, Mail, CheckCircle, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { mockDb } from "@/utils/mockDb";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "seller" | "admin" | "superadmin">("customer");
  const [rememberMe, setRememberMe] = useState(false);
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // Forgot password states
  const [forgotPasswordActive, setForgotPasswordActive] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Load remembered email on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const remembered = localStorage.getItem("rememberedEmail");
      if (remembered) {
        setEmail(remembered);
        setRememberMe(true);
      }
    }
  }, []);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter email address and password.");
      return;
    }
    setErrorMsg("");
    
    // Simulate sending OTP verification code
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP code.");
      return;
    }
    setOtpError("");
    dispatch(loginStart());

    try {
      // Mock OTP validation - accepts 123456 or any code for simplicity
      if (otpCode !== "123456" && otpCode !== "000000" && otpCode.length === 6) {
        // If they enter any code, we verify it for convenience, but check length
      }
      
      let data;
      try {
        // Try authenticating with backend
        const response = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Invalid credentials.");
        }

        data = await response.json();
      } catch (fetchErr: any) {
        console.warn("API offline. Falling back to local simulated database...", fetchErr);
        try {
          data = mockDb.login(email, password);
        } catch (dbErr: any) {
          throw new Error(dbErr.message || "Authentication failed.");
        }
      }

      // Override role based on selection
      const userWithSelectedRole = { 
        ...data.user, 
        role: selectedRole === "superadmin" ? "admin" : selectedRole 
      };
      if (selectedRole === "superadmin") {
        userWithSelectedRole.isSuperAdmin = true;
      }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Store in session storage / local storage
      localStorage.setItem("currentUser", JSON.stringify(userWithSelectedRole));
      dispatch(loginSuccess({ user: userWithSelectedRole, token: data.token }));
      router.push("/dashboard");
    } catch (err: any) {
      dispatch(loginFailure(err.message || "OTP verification failed."));
      setOtpError(err.message || "Failed to verify session.");
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setForgotSubmitted(true);
    }, 1200);
  };

  const handleSocialLogin = (platform: string) => {
    dispatch(loginStart());
    setTimeout(() => {
      const roleMapped = selectedRole === "superadmin" ? "admin" : selectedRole;
      const mockUser = {
        _id: "social_" + Math.random().toString(36).substring(2, 9),
        name: platform === "Google" ? "Google User" : "GitHub Developer",
        email: `${platform.toLowerCase()}@nexusmarket.net`,
        role: roleMapped,
        isSuperAdmin: selectedRole === "superadmin" ? true : undefined,
        createdAt: new Date(),
      };
      localStorage.setItem("currentUser", JSON.stringify(mockUser));
      dispatch(loginSuccess({ user: mockUser, token: "mock_jwt_token_sso" }));
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <main className="relative w-screen h-screen bg-[#0b0f19] flex items-center justify-center font-sans overflow-hidden px-4 text-white">
      {/* Immersive Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.05)_0%,transparent_60%)] pointer-events-none" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff9900]/10 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md glass-effect p-8 rounded-2xl relative z-10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 mb-2 group">
            <div className="w-9 h-9 rounded box-glow-primary bg-gradient-to-tr from-[#ff9900] to-[#ffb700] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="font-black text-2xl tracking-widest text-glow-primary text-white">NEXUS<span className="text-[#ff9900]">.X</span></span>
          </Link>
          <span className="text-[10px] text-[#ff9900] uppercase tracking-widest font-mono flex items-center gap-1.5 opacity-80">
            <Sparkles className="w-3.5 h-3.5" /> Gateway Authorization
          </span>
        </div>

        {/* FORGOT PASSWORD PANEL */}
        {forgotPasswordActive ? (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Password Recovery Module</h3>
            {forgotSubmitted ? (
              <div className="bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs space-y-2 backdrop-blur-sm">
                <div className="flex items-center gap-2 font-bold"><CheckCircle className="w-4 h-4 text-emerald-400" /> Recovery Key Sent</div>
                <p>An access recovery token has been sent to <strong className="text-white">{forgotEmail}</strong>. Check your inbox and follow instruction links.</p>
                <button 
                  onClick={() => { setForgotPasswordActive(false); setForgotSubmitted(false); }} 
                  className="mt-2 text-xs font-bold text-[#ff9900] hover:text-[#ffb700] transition-colors"
                >
                  Back to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">Enter your registered email address to receive a secure recovery code.</p>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@nexus.com"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] focus:outline-none text-xs text-white placeholder:text-gray-600 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="flex-1 py-2 amazon-button flex items-center justify-center gap-2"
                  >
                    {otpLoading ? "Transmitting..." : "Recover Password"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setForgotPasswordActive(false)}
                    className="px-4 py-2 border border-white/20 rounded-lg text-xs hover:bg-white/5 cursor-pointer text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        ) : otpSent ? (
          /* OTP SCREEN CHALLENGE */
          <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="bg-[#ff9900]/10 border border-[#ff9900]/30 text-[#ff9900] p-4 rounded-xl text-xs space-y-1.5 backdrop-blur-sm shadow-inner">
              <div className="flex items-center gap-1.5 font-bold text-white"><Lock className="w-4 h-4 text-[#ff9900]" /> 2FA Verification Required</div>
              <p className="text-gray-300">We've transmitted a secure 6-digit code to <strong className="text-white">{email}</strong>.</p>
              <p className="font-mono text-[9px] text-[#ff9900] bg-black/40 p-1.5 rounded text-center border border-[#ff9900]/20">TIP: Enter <strong>123456</strong> to verify mock session.</p>
            </div>

            {otpError && (
              <div className="p-3 bg-red-900/40 border border-red-500/30 text-red-300 rounded-xl text-[11px] font-medium leading-tight">
                {otpError}
              </div>
            )}

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold font-mono">
                Verification Code (6 Digits)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full text-center px-4 py-3 bg-black/50 border border-white/20 rounded-xl focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] focus:outline-none text-xl font-bold font-mono tracking-widest text-white placeholder:text-gray-600 transition-all shadow-inner"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 amazon-button text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify & Authorize"}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="px-4 py-3 border border-white/20 rounded-xl text-xs hover:bg-white/5 cursor-pointer text-gray-300 transition-colors"
              >
                Back
              </button>
            </div>
          </motion.form>
        ) : (
          /* STANDARD LOGIN FORM */
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handlePreSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-900/40 border border-red-500/30 text-red-300 rounded-xl text-xs leading-tight">
                {errorMsg}
              </div>
            )}

            {/* ROLE SELECTOR GRID */}
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">
                Select Portal Access Level
              </label>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                {[
                  { role: "customer", label: "Customer" },
                  { role: "seller", label: "Seller" },
                  { role: "admin", label: "Admin" },
                  { role: "superadmin", label: "Super Admin" }
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role as any)}
                    className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      selectedRole === item.role
                        ? "bg-[#ff9900]/20 border-[#ff9900] text-[#ff9900] box-glow-primary shadow-[0_0_10px_rgba(255,153,0,0.2)]"
                        : "bg-black/30 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Identity Hash (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@nexus.com"
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] focus:outline-none text-xs text-white placeholder:text-gray-600 transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Security Passkey
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] focus:outline-none text-xs text-white placeholder:text-gray-600 transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium pt-1">
              <label className="flex items-center gap-1.5 text-gray-400 cursor-pointer select-none hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-[#ff9900] focus:ring-[#ff9900] focus:ring-offset-black cursor-pointer"
                />
                <span>Preserve Session</span>
              </label>
              <button 
                type="button" 
                onClick={() => setForgotPasswordActive(true)} 
                className="text-[#ff9900] hover:text-[#ffb700] hover:underline transition-colors"
              >
                Reset Access?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 amazon-button rounded-xl flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span className="tracking-widest">INITIALIZE LOGIN</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.form>
        )}

        {/* SOCIAL SSO BUTTONS */}
        {!forgotPasswordActive && !otpSent && (
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="relative flex items-center justify-center mb-4">
              <span className="relative px-3 bg-transparent text-[9px] text-gray-500 uppercase tracking-widest font-mono z-10 backdrop-blur-md">External Authorization</span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/10"></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center justify-center gap-2 py-2 border border-white/10 bg-black/30 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("GitHub")}
                className="flex items-center justify-center gap-2 py-2 border border-white/10 bg-black/30 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24" stroke="none"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                GitHub
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-400 font-medium">
          <span>New to Nexus Gateway? </span>
          <Link href="/register" className="text-[#ff9900] hover:text-[#ffb700] hover:underline font-bold transition-colors">
            Initialize Account
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
