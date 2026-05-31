"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { Shield, Eye, EyeOff, Sparkles, ChevronRight, Fingerprint, Lock } from "lucide-react";
import Link from "next/link";
import { mockDb } from "@/utils/mockDb";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Verification Step Simulation
  const [showVerification, setShowVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: "Enter password", color: "bg-gray-200 dark:bg-gray-800" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
        return { score, text: "Weak", color: "bg-red-500 shadow-sm" };
      case 2:
        return { score, text: "Medium", color: "bg-amber-500 shadow-sm" };
      case 3:
        return { score, text: "Strong", color: "bg-yellow-500 shadow-sm" };
      case 4:
        return { score, text: "Very Strong", color: "bg-emerald-500 shadow-sm" };
      default:
        return { score: 0, text: "Weak", color: "bg-red-500" };
    }
  };

  const strength = getPasswordStrength();

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all registration fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setErrorMsg("");
    setShowVerification(true);
  };

  const handleVerifyAndRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "123456" && otpCode.length !== 6) {
      setErrorMsg("Please enter the correct 6-digit verification code.");
      return;
    }

    dispatch(loginStart());
    try {
      let data;
      try {
        const response = await fetch("http://localhost:4000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Registration rejected by database.");
        }

        data = await response.json();
      } catch (fetchErr: any) {
        console.warn("Registration API offline. Attempting offline registration...", fetchErr);
        try {
          data = mockDb.register(name, email, password);
        } catch (dbErr: any) {
          throw new Error(dbErr.message || "Registration rejected by local cache.");
        }
      }

      dispatch(loginSuccess({ user: data.user, token: data.token }));
      router.push("/dashboard");
    } catch (err: any) {
      dispatch(loginFailure(err.message || "Connection failure."));
      setErrorMsg(err.message || "Failed to register account.");
      setShowVerification(false);
    }
  }, [name, email, password, otpCode, dispatch, router]);

  return (
    <main className="relative w-screen h-screen bg-[#131921] flex items-center justify-center font-sans overflow-hidden px-4 text-black">
      {/* Background visual overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl border border-gray-200 relative z-10 overflow-hidden">
        {/* Return to Shop link */}
        <button 
          onClick={() => router.push("/shop")}
          className="absolute top-4 left-4 text-[9px] font-bold text-[#e47911] hover:underline uppercase tracking-widest transition-colors cursor-pointer"
        >
          ← Return to Shop
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded bg-[#ff9900] flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-widest text-[#131921]">NEXUS<span className="text-[#ff9900]">.X</span></span>
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ff9900]" /> Create Account Portal
          </span>
        </div>

        {/* Error Feedback */}
        {(errorMsg || error) && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider text-[10px]">Registration Error</p>
              <p className="text-[10px] text-red-600 mt-0.5">{errorMsg || error}</p>
            </div>
          </div>
        )}

        {!showVerification ? (
          <form onSubmit={handlePreSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Niranjan Spencer"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="niharjan8@gmail.com"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] focus:outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                    <span>Password Strength:</span>
                    <span className="font-bold text-gray-600 uppercase tracking-wider">{strength.text}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${(strength.score / 4) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-black font-bold uppercase tracking-wider text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#a88734]"
            >
              <span>CONTINUE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* OTP SCREEN CHALLENGE */
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-800"><Lock className="w-4 h-4" /> OTP Verification Required</div>
              <p>We've simulated sending a 6-digit verification code to <strong>{email}</strong>.</p>
              <p className="font-mono text-[9px] text-amber-700 bg-amber-100/50 p-1.5 rounded text-center">TIP: Enter <strong>123456</strong> to complete registration.</p>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-bold font-mono">
                Verification Code (6 Digits)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full text-center px-4 py-3 bg-gray-50 border border-gray-300 rounded focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] focus:outline-none text-lg font-bold font-mono tracking-widest placeholder:text-gray-300"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] hover:from-[#f5d78e] hover:to-[#eeb933] text-black font-bold uppercase tracking-wider text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                Verify & Register
              </button>
              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="px-4 py-3 border border-gray-300 rounded text-xs hover:bg-gray-50 cursor-pointer"
              >
                Back
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <span>Already have an account? </span>
          <Link href="/login" className="text-[#e47911] hover:underline font-bold uppercase tracking-widest ml-1 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
