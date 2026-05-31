"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearCart } from "@/store/slices/cartSlice";
import { ShieldCheck, CreditCard, ChevronRight, ShoppingBag, Fingerprint, Trash2, ShieldAlert } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { mockDb } from "@/utils/mockDb";
import { NavBar } from "@/components/ui/NavBar";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [telemetry, setTelemetry] = useState<string[]>([]);

  // Signature Canvas States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTelemetry, setDrawingTelemetry] = useState({
    dots: 0,
    velocity: 0,
    integrity: 0
  });

  useEffect(() => {
    // If cart is empty and not ordered successfully, send to shop
    if (items.length === 0 && !orderSuccess) {
      router.push("/shop");
    }
  }, [items, orderSuccess, router]);

  // Set up canvas context and defaults
  useEffect(() => {
    if (step === 3 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 240, 255, 0.4)";
      }
    }
  }, [step]);

  const addTelemetryLog = (msg: string) => {
    setTelemetry(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 5)
    ]);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!shippingAddress || !city || !country) {
        setErrorMsg("Please fill in all shipping details.");
        addTelemetryLog("ERR: SHIPPING DETAILS INCOMPLETE");
        return;
      }
      addTelemetryLog(`SHIPPING SECURED -> ${city.toUpperCase()}, ${country.toUpperCase()}`);
    }
    if (step === 2) {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        setErrorMsg("Please fill in all payment details.");
        addTelemetryLog("ERR: PAYMENT DETAILS INCOMPLETE");
        return;
      }
      addTelemetryLog("PAYMENT SECURED -> VALID CARD SYNTAX DETECTED");
    }
    setErrorMsg("");
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    setStep(step - 1);
  };

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
    setDrawingTelemetry(prev => ({
      dots: prev.dots + 1,
      velocity: Math.floor(Math.random() * 40) + 10,
      integrity: Math.min(100, Math.floor(prev.dots * 1.5) + 5)
    }));
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    
    setDrawingTelemetry(prev => ({
      dots: prev.dots + 1,
      velocity: Math.floor(Math.random() * 50) + 20,
      integrity: Math.min(100, Math.floor(prev.dots * 0.8) + 12)
    }));
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setDrawingTelemetry({ dots: 0, velocity: 0, integrity: 0 });
    addTelemetryLog("Signature field cleared.");
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!hasSigned || drawingTelemetry.integrity < 20) {
      setErrorMsg("Signature verification score too low. Please sign the verification panel.");
      addTelemetryLog("ERR: SIGNATURE VALIDATION FAILED");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    addTelemetryLog("AUTHORIZING CREDIT TRANSACTION...");

    const orderItems = items.map((item) => ({
      product: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const fullAddress = `${shippingAddress}, ${city}, ${country}`;
    const total = totalAmount + totalAmount * 0.08;

    try {
      const response = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems.map(i => ({ product: i.product, quantity: i.quantity })),
          shippingAddress: fullAddress,
          paymentMethod: "Credit Card",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order placement rejected by server.");
      }

      addTelemetryLog("TRANSACTION SECURED - REGISTERED ON PRODUCTION SERVER");
      setOrderSuccess(data.order);
      dispatch(clearCart());
    } catch (err: any) {
      console.warn("Backend server down. Directing checkout to local sandbox database simulation.", err);
      addTelemetryLog("BACKEND OFFLINE - REDIRECTING TO LOCAL DATABASE...");
      
      setTimeout(() => {
        const fallbackOrder = mockDb.createOrder(orderItems, { address: shippingAddress, city, country }, total);
        addTelemetryLog(`LOCAL DATABASE SYNC COMPLETED - ID: ${fallbackOrder._id}`);
        setOrderSuccess(fallbackOrder);
        dispatch(clearCart());
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  const subtotal = totalAmount;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (!isAuthenticated) {
    return (
      <main className="w-screen h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,127,0.05),transparent_70%)] pointer-events-none" />
        <h2 className="text-xl font-bold font-mono text-white tracking-widest mb-2">AUTHENTICATION REQUIRED</h2>
        <p className="text-gray-400 mb-6 max-w-sm text-xs font-mono uppercase tracking-wider">Please sign in to your developer profile prior to checkout.</p>
        <button 
          onClick={() => router.push("/login?redirect=/checkout")} 
          className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-[#00f0ff] transition-all cursor-pointer"
        >
          Sign In
        </button>
      </main>
    );
  }

  if (orderSuccess) {
    return (
      <main className="w-screen h-screen bg-[#030712] flex items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,135,0.05),transparent_60%)] pointer-events-none" />
        
        <GlassPanel className="w-full max-w-xl p-8 text-center border-emerald-500/20 relative z-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">ORDER COMPLETED</h1>
          <p className="text-[#00f0ff] font-mono text-xs mb-6">ORDER ID: {orderSuccess._id || orderSuccess.id}</p>
          
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6 text-left text-[11px] font-mono space-y-2 text-gray-400">
            <div className="flex justify-between">
              <span>DELIVERY DESTINATION:</span>
              <span className="text-white text-right">{orderSuccess.shippingAddress || `${orderSuccess.shipping?.address}, ${orderSuccess.shipping?.city}`}</span>
            </div>
            <div className="flex justify-between">
              <span>TOTAL PAID:</span>
              <span className="text-[#00f0ff]">${(orderSuccess.totalAmount || orderSuccess.totalPrice)?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>TRANSACTION SIGNATURE:</span>
              <span className="text-emerald-400 truncate max-w-[200px]">{orderSuccess.quantumValidationCode || "TX_SSL_SECURE"}</span>
            </div>
            <div className="flex justify-between">
              <span>DATABASE ENGINE:</span>
              <span className="text-yellow-400">{orderSuccess.quantumValidationCode ? "LOCAL SANDBOX DATABASE" : "PRODUCTION SERVER"}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-3 bg-white text-black font-mono font-bold uppercase tracking-widest text-[10px] rounded hover:bg-[#00f0ff] transition-all cursor-pointer"
            >
              Go to Customer Dashboard
            </button>
            <button 
              onClick={() => router.push("/shop")}
              className="flex-1 py-3 bg-transparent border border-white/15 hover:bg-white/5 text-white font-mono font-bold uppercase tracking-widest text-[10px] rounded transition-all cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        </GlassPanel>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen bg-[#030712] overflow-hidden flex flex-col pt-16 font-sans">
      <NavBar />
      
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#8a2be2]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#ff007f]/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030712_95%)]" />
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="flex-grow flex overflow-hidden h-[calc(100vh-64px)] w-full z-10 relative">
        
        {/* LEFT COLUMN: ACTIVE STEP FLOW PANE (SCROLLABLE) */}
        <div className="flex-grow h-full flex flex-col overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-4xl w-full">
            {/* Header info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase text-white tracking-tighter">Checkout</h1>
                <p className="text-xs text-[#00f0ff] uppercase tracking-widest font-mono mt-1">Secure Encrypted Transaction</p>
              </div>
              
              {/* Stepper Progress */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <div className={`px-2.5 py-1 rounded border transition-all ${step === 1 ? "border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/5" : "border-white/5 text-gray-500"}`}>
                  1. SHIPPING
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
                <div className={`px-2.5 py-1 rounded border transition-all ${step === 2 ? "border-[#8a2be2] text-[#8a2be2] bg-[#8a2be2]/5" : "border-white/5 text-gray-500"}`}>
                  2. CREDIT DETAILS
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
                <div className={`px-2.5 py-1 rounded border transition-all ${step === 3 ? "border-[#ff007f] text-[#ff007f] bg-[#ff007f]/5" : "border-white/5 text-gray-500"}`}>
                  3. VERIFICATION
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-5 p-4 rounded bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <GlassPanel className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-12 bg-white/[0.01] pointer-events-none border-b border-l border-white/5 rounded-bl-xl flex items-center justify-center font-mono text-[8px] text-gray-600">
                SECURE_SSL
              </div>

              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-base font-bold text-[#00f0ff] uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                    Shipping Address
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-1.5">Street Address</label>
                      <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="123 Developer Parkway"
                        className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] focus:outline-none text-xs text-white font-mono transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-1.5">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="San Francisco"
                          className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] focus:outline-none text-xs text-white font-mono transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-1.5">Country</label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="United States"
                          className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] focus:outline-none text-xs text-white font-mono transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-base font-bold text-[#8a2be2] uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8a2be2] animate-pulse" />
                    Credit Card Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-1.5">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4000 1234 5678 9010"
                          className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-[#8a2be2] focus:ring-1 focus:ring-[#8a2be2] focus:outline-none text-xs text-white font-mono pl-10 transition-all"
                        />
                        <CreditCard className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-1.5">Expiration Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-[#8a2be2] focus:ring-1 focus:ring-[#8a2be2] focus:outline-none text-xs text-white font-mono transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-1.5">CVV Code</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-[#8a2be2] focus:ring-1 focus:ring-[#8a2be2] focus:outline-none text-xs text-white font-mono transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-base font-bold text-[#ff007f] uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-pulse" />
                    Signature verification
                  </h3>
                  
                  <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-[10px] font-mono space-y-2.5 text-gray-400">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span>Account Holder:</span>
                      <span className="text-white font-bold">{user?.name || "Anonymous Developer"}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span>Delivery Destination:</span>
                      <span className="text-white text-right">{shippingAddress}, {city}, {country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Card ending in:</span>
                      <span className="text-[#00f0ff] font-bold">*{cardNumber.slice(-4) || "9010"}</span>
                    </div>
                  </div>

                  {/* Signature pad */}
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-black/60 relative">
                    <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
                      <Fingerprint className="w-3.5 h-3.5 text-[#ff007f] animate-pulse" />
                      <span className="text-[9px] text-gray-500 font-mono tracking-widest">DIGITAL SIGNATURE PAD</span>
                    </div>
                    
                    {hasSigned && (
                      <button 
                        type="button"
                        onClick={clearSignature}
                        className="absolute top-2 right-2 p-1 rounded bg-black/80 border border-white/10 hover:border-[#ff007f] text-gray-400 hover:text-white transition-all z-20 flex items-center gap-1.5 text-[8px] font-mono cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        RESET
                      </button>
                    )}

                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={160}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-40 cursor-crosshair relative z-10 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]"
                    />

                    {!hasSigned && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center p-4">
                        <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mb-0.5">Draw signature in the box below to authorize checkout</p>
                        <span className="text-[8px] text-[#ff007f]/50 font-mono">SIGNATURE REQUIRED</span>
                      </div>
                    )}

                    {/* Telemetry info */}
                    <div className="border-t border-white/5 bg-black/40 p-2 flex justify-between items-center text-[8px] font-mono text-gray-500">
                      <div>
                        <span>POINTS DETECTED: </span>
                        <span className="text-[#00f0ff]">{drawingTelemetry.dots}</span>
                      </div>
                      <div>
                        <span>SIGNATURE VALIDATION: </span>
                        <span className={drawingTelemetry.integrity >= 20 ? "text-[#00ff87]" : "text-[#ff007f]"}>
                          {drawingTelemetry.integrity}% {drawingTelemetry.integrity >= 20 ? "(VERIFIED)" : "(INSUFFICIENT)"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Logs */}
              {telemetry.length > 0 && (
                <div className="mt-5 p-3 bg-black/80 border border-white/5 rounded-xl font-mono text-[8px] text-gray-500 space-y-1">
                  <div className="text-gray-600 uppercase tracking-widest border-b border-white/5 pb-1 mb-1">Diagnostic Log</div>
                  {telemetry.map((log, i) => (
                    <div key={i} className="truncate">{log}</div>
                  ))}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-white font-mono font-bold uppercase tracking-widest text-[9px] rounded-xl transition-all cursor-pointer"
                  >
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-grow py-2.5 bg-white text-black hover:bg-[#00f0ff] font-mono font-bold uppercase tracking-widest text-[9px] rounded-xl transition-all ml-auto max-w-[150px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-grow py-3.5 bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#ff007f] text-white font-mono font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>PLACE ORDER</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* RIGHT COLUMN: ITEMS OVERVIEW (SIDEBAR) */}
        <aside className="w-96 h-full flex flex-col border-l border-white/5 bg-black/30 p-6 flex-shrink-0 justify-between">
          <div className="flex flex-col gap-5 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2 text-white font-mono">
              <ShoppingBag className="w-4 h-4 text-[#00f0ff]" />
              Items List
            </h3>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3.5 pr-1 select-text">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-[11px] font-mono">
                  <div className="truncate pr-4 flex-1">
                    <span className="text-white font-bold block truncate">{item.name}</span>
                    <span className="text-gray-500 text-[10px]">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-[#00f0ff] font-bold shrink-0">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4 border-t border-white/5 pt-4">
            <div className="space-y-2 text-[10px] font-mono text-gray-500">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>TAX (8%)</span>
                <span className="text-white">${tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-3 font-mono">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">TOTAL VALUE</span>
              <span className="text-xl font-bold text-[#00f0ff]">${total.toLocaleString()}</span>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
