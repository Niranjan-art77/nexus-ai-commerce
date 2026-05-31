"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { mockDb } from "@/utils/mockDb";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Heart, Target, Clock, Star,
  ChevronRight, Zap, RefreshCw, Send, Gift, Copy,
  Check, Volume2, Mic, Eye, Plus, Scale, X, MessageSquare,
  User, MapPin, CreditCard, HelpCircle, AlertCircle, Sparkles, Trash, PlusCircle, Cpu,
  Download, FileText, Bell, Lock, ShieldCheck, Share2, Search, Sliders, Trash2
} from "lucide-react";

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  
  // 8 Organized Super-Tabs for 40+ Features
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "wishlist" | "wallet" | "history" | "social" | "support" | "profile"
  >("overview");

  // State Variables
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Address & Payment
  const [addresses, setAddresses] = useState<any[]>([
    { id: 1, name: "Home", street: "123 Main St", city: "New York", zip: "10001", default: true },
    { id: 2, name: "Office", street: "456 Corporate Ave", city: "San Francisco", zip: "94016", default: false }
  ]);
  const [newAddress, setNewAddress] = useState({ name: "", street: "", city: "", zip: "" });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  const [cards, setCards] = useState<any[]>([
    { id: 1, type: "Visa", number: "•••• •••• •••• 4321", exp: "12/28", default: true },
    { id: 2, type: "Mastercard", number: "•••• •••• •••• 8765", exp: "05/27", default: false }
  ]);
  const [newCard, setNewCard] = useState({ type: "Visa", number: "", exp: "" });
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardError, setCardError] = useState("");
  const [pointsToConvert, setPointsToConvert] = useState(0);

  // Wallet, Loyalty & Gift Cards
  const [walletBalance, setWalletBalance] = useState(250.00);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardMessage, setGiftCardMessage] = useState("");

  // Returns, Refunds, tracking
  const [returnOrder, setReturnOrder] = useState<any>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnStatusMsg, setReturnStatusMsg] = useState("");
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<any>(null);
  const [invoicePreviewOrder, setInvoicePreviewOrder] = useState<any>(null);

  // Support Tickets
  const [tickets, setTickets] = useState<any[]>([
    { id: "TCK-1234", subject: "Nexus Workstation Pro setup query", status: "Open", date: "2026-05-29" },
    { id: "TCK-8765", subject: "Precision Trackpad gesture configuration", status: "Resolved", date: "2026-05-25" }
  ]);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  // Social/Messages
  const [messages, setMessages] = useState<any[]>([
    { sender: "Apple Official", content: "Your inquiry regarding iPhone 16 restocking details has been processed.", date: "2026-05-30" },
    { sender: "System Fulfillment", content: "Address verification complete. Your workspace rig is scheduled for shipment.", date: "2026-05-28" }
  ]);
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: "Price Alert Triggered", text: "Dell XPS 15 dropped by 12% in today's deals!", time: "2 hours ago", unread: true },
    { id: 2, title: "Order Shipped", text: "Order #ORDER-Q8W9J has left fulfillment center.", time: "1 day ago", unread: false }
  ]);

  // Social/Written Reviews Log
  const [userReviews, setUserReviews] = useState<any[]>([
    { id: "rev-1", productName: "iPhone 15 Pro", rating: 5, text: "Excellent titanium design and blazing fast processor speeds.", date: "2026-05-20" }
  ]);

  // History & Browsing History
  const [browsingHistory, setBrowsingHistory] = useState<any[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>(["iphone 16", "dell laptop", "gaming mouse"]);
  const [priceAlerts, setPriceAlerts] = useState<any[]>([]);
  const [favoriteBrands, setFavoriteBrands] = useState<string[]>(["Apple", "Dell", "Razer"]);

  // Referrals
  const [referralsCount, setReferralsCount] = useState(3);
  const [referralEarnings, setReferralEarnings] = useState(75.00);

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState<any[]>([
    { id: "sub-1", name: "Nexus Prime Membership", price: 14.99, cycle: "Monthly", nextBilling: "2026-06-15", status: "Active" },
    { id: "sub-2", name: "AI Copilot Pro Cloud Seat", price: 29.99, cycle: "Monthly", nextBilling: "2026-06-22", status: "Active" }
  ]);

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<string[]>([
    "Logged in from secure IP 192.168.1.45 at 22:23",
    "Verified 2FA Auth Profile Parameters",
    "Updated billing address parameters for 'Home'"
  ]);

  // AI Copilot Chat
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([
    { role: 'ai', content: "Hello! I'm your Nexus AI Shopping Assistant. How can I help you customize your high-performance hardware build today?" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Voice Command States
  const [voiceMicActive, setVoiceMicActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const fetchDashboardData = React.useCallback(async () => {
    setLoading(true);
    try {
      const ordersData = mockDb.getOrders();
      setOrders(ordersData);

      const productsData = mockDb.getProducts({});
      setProducts(productsData);

      const wishData = JSON.parse(localStorage.getItem("nexus_fallback_wishlist") || "[]");
      setWishlist(wishData);

      // Browsing History from recently viewed
      const historyIds = JSON.parse(localStorage.getItem("nexus_recently_viewed") || "[]");
      const historyItems = historyIds.map((id: string) => mockDb.getProductById(id)).filter(Boolean);
      setBrowsingHistory(historyItems);

      // Price alerts seed from history
      setPriceAlerts(historyItems.slice(0, 2).map((item: any) => ({
        _id: item._id,
        name: item.name,
        currentPrice: item.price,
        alertPrice: Math.round(item.price * 0.9),
        active: true
      })));
    } catch (err) {
      console.error("Error fetching customer dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [token, fetchDashboardData]);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || product.image || ""
    }));
  };

  const handleRemoveWishlist = (id: string) => {
    const updated = wishlist.filter(item => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("nexus_fallback_wishlist", JSON.stringify(updated));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");
    if (!newAddress.name || !newAddress.street) return;
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (!zipPattern.test(newAddress.zip)) {
      setAddressError("Fulfillment Zip Code must match 5-digit format.");
      return;
    }
    const added = {
      id: Date.now(),
      ...newAddress,
      default: addresses.length === 0
    };
    setAddresses([...addresses, added]);
    setNewAddress({ name: "", street: "", city: "", zip: "" });
    setShowAddAddress(false);
    logActivity("Added new address: " + added.name);
  };

  const validateLuhn = (num: string) => {
    let clean = num.replace(/\D/g, "");
    if (clean.length < 13 || clean.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError("");
    const cleanNum = newCard.number.replace(/\s+/g, "");
    if (!validateLuhn(cleanNum)) {
      setCardError("Card number fails secure Luhn validation check.");
      return;
    }
    const detectedType = cleanNum.startsWith("4") ? "Visa" : cleanNum.startsWith("5") ? "Mastercard" : cleanNum.startsWith("3") ? "Amex" : newCard.type;
    const added = {
      id: Date.now(),
      type: detectedType,
      number: "•••• •••• •••• " + cleanNum.slice(-4),
      exp: newCard.exp,
      default: cards.length === 0
    };
    setCards([...cards, added]);
    setNewCard({ type: "Visa", number: "", exp: "" });
    setShowAddCard(false);
    logActivity(`Saved credit card: ${added.type} ${added.number}`);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "NEXUS50") {
      setWalletBalance(prev => prev + 50.00);
      setCouponMessage("Success! $50.00 added to your wallet.");
      setCouponCode("");
      logActivity("Redeemed wallet coupon NEXUS50");
    } else {
      setCouponMessage("Invalid or expired coupon code.");
    }
    setTimeout(() => setCouponMessage(""), 4000);
  };

  const handleRedeemGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (giftCardCode.trim().length > 5) {
      const addedValue = 100.00;
      setWalletBalance(prev => prev + addedValue);
      setGiftCardMessage(`Success! Gift card redeemed. Added $${addedValue}.00 to balance.`);
      setGiftCardCode("");
      logActivity(`Redeemed Gift Card code: ${giftCardCode.substring(0, 4)}...`);
    } else {
      setGiftCardMessage("Invalid gift card code.");
    }
    setTimeout(() => setGiftCardMessage(""), 4000);
  };

  const handleInitiateReturn = (order: any) => {
    setReturnOrder(order);
    setReturnReason("");
    setReturnStatusMsg("");
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason) return;
    
    const updatedOrders = orders.map(o => {
      if (o._id === returnOrder._id) {
        return { 
          ...o, 
          status: "Return Processing",
          returnReason: returnReason,
          refundStatus: "Refund Initiated"
        };
      }
      return o;
    });
    setOrders(updatedOrders);
    mockDb.saveOrders(updatedOrders);

    setReturnStatusMsg("Success! Your return request has been submitted.");
    logActivity(`Submitted return request for Order ${returnOrder._id}`);
    setTimeout(() => {
      setReturnOrder(null);
    }, 2000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !ticketMessage) return;

    const added = {
      id: "TCK-" + Math.floor(1000 + Math.random() * 9000),
      subject: newTicketSubject,
      status: "Open",
      date: new Date().toISOString().split("T")[0]
    };
    setTickets([added, ...tickets]);
    setNewTicketSubject("");
    setTicketMessage("");
    logActivity(`Opened support ticket: ${added.id}`);
  };

  const handleConvertPoints = () => {
    if (pointsToConvert > 0 && loyaltyPoints >= pointsToConvert) {
      const cashVal = pointsToConvert / 100;
      setLoyaltyPoints(prev => prev - pointsToConvert);
      setWalletBalance(prev => prev + cashVal);
      logActivity(`Converted ${pointsToConvert} points to $${cashVal.toFixed(2)} wallet balance`);
      setPointsToConvert(0);
    }
  };

  const toggleSubscriptionStatus = (subId: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        const nextStatus = s.status === "Active" ? "Cancelled" : "Active";
        logActivity(`Updated ${s.name} subscription status to: ${nextStatus}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const changeSubscriptionCycle = (subId: string, cycle: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        logActivity(`Updated ${s.name} cycle frequency to: ${cycle}`);
        return { ...s, cycle: cycle };
      }
      return s;
    }));
  };

  const handleClearHistory = () => {
    localStorage.removeItem("nexus_recently_viewed");
    setBrowsingHistory([]);
    logActivity("Cleared search and browsing history logs");
  };

  const handleRemoveSearch = (term: string) => {
    const updated = savedSearches.filter(s => s !== term);
    setSavedSearches(updated);
  };

  const logActivity = (text: string) => {
    const time = new Date().toLocaleTimeString().substring(0, 5);
    setActivityLogs(prev => [`[${time}] ${text}`, ...prev.slice(0, 8)]);
  };

  // AI Assistant Chat Messages
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const aiResponse = mockDb.getAiResponse(userMsg);
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Channel error. Please re-try request." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Voice Command Web Speech Recognition
  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice navigation not supported in this browser. Please use Chrome.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.lang = "en-US";
    rec.interimResults = false;

    rec.onstart = () => {
      setVoiceMicActive(true);
      setVoiceTranscript("Listening for commands...");
    };
    rec.onerror = () => {
      setVoiceMicActive(false);
      setVoiceTranscript("Error capturing command.");
    };
    rec.onend = () => {
      setVoiceMicActive(false);
    };
    rec.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setVoiceTranscript(`Command: "${command}"`);
      
      // Parse commands to switch tabs or trigger actions
      if (command.includes("overview") || command.includes("main") || command.includes("home")) {
        setActiveTab("overview");
      } else if (command.includes("order") || command.includes("track") || command.includes("purchase")) {
        setActiveTab("orders");
      } else if (command.includes("wishlist") || command.includes("saved")) {
        setActiveTab("wishlist");
      } else if (command.includes("wallet") || command.includes("card") || command.includes("coupon")) {
        setActiveTab("wallet");
      } else if (command.includes("history") || command.includes("brows") || command.includes("alert")) {
        setActiveTab("history");
      } else if (command.includes("social") || command.includes("message") || command.includes("notification")) {
        setActiveTab("social");
      } else if (command.includes("support") || command.includes("assistant") || command.includes("ticket")) {
        setActiveTab("support");
      } else if (command.includes("profile") || command.includes("setting") || command.includes("security")) {
        setActiveTab("profile");
      } else if (command.includes("add points") || command.includes("points")) {
        setLoyaltyPoints(prev => prev + 500);
        logActivity("Voice Command: Added 500 Loyalty Points");
      } else if (command.includes("clear history")) {
        handleClearHistory();
      }
    };

    rec.start();
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-3 py-20 text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#ff9900] border-t-transparent animate-spin" />
        <span className="text-xs text-gray-400 font-mono">Synchronizing workspace profiles...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 pb-10 text-gray-200">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-56 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4 flex-shrink-0 overflow-x-auto md:overflow-x-visible">
        {[
          { id: "overview", label: "Overview Hub", icon: Cpu },
          { id: "orders", label: "Orders & Returns", icon: ShoppingBag },
          { id: "wishlist", label: "Wishlist & Favorites", icon: Heart },
          { id: "wallet", label: "Wallet & Referrals", icon: CreditCard },
          { id: "history", label: "Alerts & History", icon: Clock },
          { id: "social", label: "Social & Activity", icon: MessageSquare },
          { id: "support", label: "Support Copilot", icon: HelpCircle },
          { id: "profile", label: "Settings & Profile", icon: User }
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-left whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#ff9900]/15 text-[#ff9900] border border-[#ff9900]/30 shadow-md shadow-[#ff9900]/5"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Voice Navigation Button */}
        <div className="hidden md:block pt-6 mt-6 border-t border-white/10 text-xs">
          <button 
            onClick={handleVoiceCommand}
            className={`w-full py-2 px-3 rounded-lg border flex items-center gap-2 font-bold cursor-pointer transition-all ${
              voiceMicActive 
                ? "bg-red-500/10 border-red-500/40 text-red-500 animate-pulse" 
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice Navigation</span>
          </button>
          {voiceTranscript && (
            <div className="mt-2 text-[9px] font-mono text-gray-500 italic text-left">{voiceTranscript}</div>
          )}
        </div>
      </div>

      {/* Main Tab Panel Area */}
      <div className="flex-grow min-w-0">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              {/* Profile Card Banner */}
              <div className="glass-effect border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 shadow-xl relative overflow-hidden bg-gradient-to-r from-gray-900 to-black">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(255,153,0,0.15),transparent_70%)]" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff9900] to-[#ffb700] flex items-center justify-center text-2xl font-black text-black shadow-lg">
                  {user?.name ? user.name[0] : "O"}
                </div>
                <div className="text-center sm:text-left flex-1 space-y-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-base font-black text-white capitalize">Welcome back, {user?.name || "Client"}</h3>
                    <span className="text-[8px] bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black px-2 py-0.5 rounded font-mono">GOLD MEMBERSHIP</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{user?.email}</p>
                  <p className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded inline-block font-mono">
                    Alignment: {user?.jobTitle || "Software Engineer"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-black/50 border border-white/5 p-4 rounded-xl text-center w-28">
                    <span className="text-[9px] text-gray-500 block uppercase font-bold">Wallet Cash</span>
                    <span className="text-lg font-mono font-black text-[#ff9900]">${walletBalance.toFixed(2)}</span>
                  </div>
                  <div className="bg-black/50 border border-white/5 p-4 rounded-xl text-center w-28">
                    <span className="text-[9px] text-gray-500 block uppercase font-bold">Loyalty Points</span>
                    <span className="text-lg font-mono font-black text-purple-400">{loyaltyPoints}</span>
                  </div>
                </div>
              </div>

              {/* Main summary grids */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* SVG spending chart */}
                <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Account Analytics - Category Spending</h4>
                  <div className="h-56 w-full flex items-center justify-center relative">
                    {/* SVG Chart */}
                    <svg className="w-full h-full" viewBox="0 0 500 200">
                      <defs>
                        <linearGradient id="gradient-spending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ff9900" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ff9900" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M50 150 Q120 40 200 120 T350 50 T450 110" fill="none" stroke="#ff9900" strokeWidth="3" />
                      <path d="M50 150 Q120 40 200 120 T350 50 T450 110 L450 180 L50 180 Z" fill="url(#gradient-spending)" />
                      {/* Grid lines */}
                      <line x1="50" y1="20" x2="450" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                      <line x1="50" y1="80" x2="450" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                      <line x1="50" y1="140" x2="450" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                      {/* Axis Label */}
                      <text x="45" y="20" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">$2000</text>
                      <text x="45" y="80" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">$1000</text>
                      <text x="45" y="140" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end">$200</text>
                      <text x="50" y="195" fill="rgba(255,255,255,0.4)" fontSize="8">Jan</text>
                      <text x="150" y="195" fill="rgba(255,255,255,0.4)" fontSize="8">Feb</text>
                      <text x="250" y="195" fill="rgba(255,255,255,0.4)" fontSize="8">Mar</text>
                      <text x="350" y="195" fill="rgba(255,255,255,0.4)" fontSize="8">Apr</text>
                      <text x="450" y="195" fill="rgba(255,255,255,0.4)" fontSize="8">May</text>
                    </svg>
                  </div>
                </div>

                {/* Loyalty Convert Card */}
                <div className="lg:col-span-4 bg-black/40 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5"><Gift className="w-4 h-4 text-purple-400"/> Loyalty Rewards</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-light">Convert accumulated points into cash directly. Conversion Rate: **100 PTS = $1.00** Wallet Cash.</p>
                    
                    <div className="space-y-2 mt-2 text-left">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">Convert amount:</span>
                        <strong className="text-purple-400 font-mono">{pointsToConvert} PTS</strong>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max={Math.floor(loyaltyPoints / 100) * 100}
                        step="100"
                        value={pointsToConvert}
                        onChange={(e) => setPointsToConvert(Number(e.target.value))}
                        className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1 cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                        <span>0 PTS</span>
                        <span>Value: ${(pointsToConvert / 100).toFixed(2)} USD</span>
                        <span>{Math.floor(loyaltyPoints / 100) * 100} PTS</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleConvertPoints}
                    disabled={pointsToConvert === 0}
                    className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold uppercase rounded-lg text-[10px] tracking-wider transition-colors cursor-pointer"
                  >
                    Convert points to cash
                  </button>
                </div>
              </div>

              {/* Customer Insights & Activity logs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Insights */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 shadow-xl text-xs space-y-3">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Customer Profile Insights</h4>
                  <div className="space-y-2 font-mono text-gray-400">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>Favorite brand:</span>
                      <strong className="text-white">Apple</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>Preferred Department:</span>
                      <strong className="text-white">Smartphones</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>Saved searches:</span>
                      <strong className="text-white">{savedSearches.length} queries</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Price drop alerts watch list:</span>
                      <strong className="text-white">{priceAlerts.length} items</strong>
                    </div>
                  </div>
                </div>

                {/* Activity Logs */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 shadow-xl text-xs space-y-3">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Secure Activity Trails</h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[10px] text-gray-500 custom-scrollbar text-left">
                    {activityLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2 items-start py-0.5 border-b border-white/5 last:border-b-0">
                        <span className="text-emerald-500 font-bold">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: ORDERS & RETURNS */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bold text-sm text-white">Your Orders & Return Logs</h3>
                {activeTrackingOrder && (
                  <button 
                    onClick={() => setActiveTrackingOrder(null)}
                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    Close Tracker
                  </button>
                )}
              </div>

              {/* Invoices Preview modal block */}
              {invoicePreviewOrder && (
                <div className="bg-white text-black border border-gray-300 rounded-2xl p-6 shadow-2xl space-y-6 text-xs max-w-2xl mx-auto">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-gray-900">Nexus Commerce X</h4>
                      <p className="text-[10px] text-gray-500">Receipt / Invoice Document</p>
                    </div>
                    <button onClick={() => setInvoicePreviewOrder(null)} className="text-gray-400 hover:text-black"><X className="w-5 h-5"/></button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-gray-600">
                    <div>
                      <span className="font-bold block">Bill To:</span>
                      <span>{user?.name || "Customer Representative"}</span><br />
                      <span>{user?.email}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold block">Invoice details:</span>
                      <span>Invoice ID: INV-{invoicePreviewOrder._id.toUpperCase()}</span><br />
                      <span>Date: {new Date(invoicePreviewOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <table className="w-full text-left border-collapse border-y border-gray-200">
                    <thead>
                      <tr className="bg-gray-50 font-bold">
                        <th className="py-2 px-1">Description</th>
                        <th className="py-2 px-1 text-center">Qty</th>
                        <th className="py-2 px-1 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicePreviewOrder.items?.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-100 font-light">
                          <td className="py-2 px-1 capitalize">{item.name}</td>
                          <td className="py-2 px-1 text-center">{item.quantity}</td>
                          <td className="py-2 px-1 text-right font-mono">${item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-baseline font-bold font-mono text-sm pt-2">
                    <span>Total Paid Amount:</span>
                    <span className="text-[#b12704]">${invoicePreviewOrder.totalPrice}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-100 pt-4 mt-4">
                    <span className="text-[9px] text-gray-400 font-mono">Invoice printed from secure client session cache.</span>
                    <button 
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-gray-900 text-white hover:bg-black font-bold uppercase rounded cursor-pointer flex items-center gap-1 text-[9px]"
                    >
                      <Download className="w-3.5 h-3.5"/> Print Receipt
                    </button>
                  </div>
                </div>
              )}

              {/* Order return stepper block */}
              {returnOrder && (
                <div className="bg-amber-50 border border-amber-200 text-black rounded-2xl p-5 mb-4 text-xs">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2 mb-3">
                    <span className="font-bold text-amber-900">Initiate Returns for Order #{returnOrder._id.slice(-8).toUpperCase()}</span>
                    <button onClick={() => setReturnOrder(null)} className="text-gray-400 hover:text-black"><X className="w-4 h-4"/></button>
                  </div>
                  {returnStatusMsg ? (
                    <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded font-bold">{returnStatusMsg}</div>
                  ) : (
                    <form onSubmit={handleSubmitReturn} className="space-y-3">
                      <div>
                        <label className="block font-bold mb-1">Reason for Return</label>
                        <select 
                          value={returnReason} 
                          onChange={(e) => setReturnReason(e.target.value)}
                          className="w-full p-2 bg-white border border-gray-300 rounded text-xs focus:outline-none"
                          required
                        >
                          <option value="">Select Reason...</option>
                          <option value="Damaged Item">Damaged on arrival</option>
                          <option value="Incorrect Specification">Specs do not match</option>
                          <option value="Performance Issue">Underperforming benchmarks</option>
                          <option value="No Longer Needed">No longer needed</option>
                        </select>
                      </div>
                      <button type="submit" className="px-4 py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded font-bold uppercase cursor-pointer text-black">
                        Confirm Return Request
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Order Tracking stepper component */}
              {activeTrackingOrder && (
                <div className="bg-black/50 border border-white/10 p-5 rounded-2xl space-y-4">
                  <h4 className="font-bold text-xs text-white">Live Tracking stepper - Order #{activeTrackingOrder._id.toUpperCase()}</h4>
                  <div className="flex items-center justify-between text-center relative max-w-lg mx-auto py-6">
                    {/* Background line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2 z-0" />
                    
                    {[
                      { label: "Processing", active: true },
                      { label: "Shipped", active: activeTrackingOrder.status === "shipped" || activeTrackingOrder.status === "Delivered" },
                      { label: "Out for Delivery", active: activeTrackingOrder.status === "Delivered" },
                      { label: "Delivered", active: activeTrackingOrder.status === "Delivered" }
                    ].map((step, idx) => (
                      <div key={idx} className="z-10 flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                          step.active ? "bg-[#ff9900] text-black shadow-[0_0_10px_#ff9900]" : "bg-gray-800 text-gray-400 border border-gray-700"
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[9px] mt-2 block font-bold font-mono ${step.active ? "text-white" : "text-gray-500"}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {orders.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center glass-effect border border-white/10 rounded-lg">No orders logged.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="glass-effect border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                      {/* Order Header banner */}
                      <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center text-xs text-gray-400">
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider">Order Placed</span>
                          <span className="font-bold text-gray-200">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider">Total Amount</span>
                          <span className="font-bold text-gray-200 font-mono">${order.totalPrice}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider">Order ID</span>
                          <span className="font-bold text-gray-200 font-mono">#{order._id.toUpperCase()}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setActiveTrackingOrder(order)}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[9px] font-bold text-gray-200 cursor-pointer"
                          >
                            Track Route
                          </button>
                          <button 
                            onClick={() => setInvoicePreviewOrder(order)}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[9px] font-bold text-gray-200 cursor-pointer flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3"/> Invoice
                          </button>
                          {order.status !== "Return Processing" && order.status !== "Returned" && (
                            <button 
                              onClick={() => handleInitiateReturn(order)}
                              className="px-2.5 py-1 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded text-[9px] font-bold text-red-500 cursor-pointer"
                            >
                              Return
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-4 space-y-3 text-xs text-left">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-center justify-between border-b border-white/5 pb-2 last:border-b-0">
                            <div className="flex gap-3 items-center min-w-0">
                              <div className="w-10 h-10 rounded border border-white/10 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center p-0.5">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-white block truncate capitalize">{item.name}</span>
                                <span className="text-[10px] text-gray-400 block">Quantity: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-[#ff9900] block">${item.price}</span>
                              <button 
                                onClick={() => handleAddToCart(item)}
                                className="text-[9px] text-[#00f0ff] hover:underline flex items-center gap-0.5 mt-0.5"
                              >
                                Re-order <ChevronRight className="w-3 h-3"/>
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-gray-500 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full inline-block ${order.status === "Delivered" ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
                            <span>Status: <strong className="text-white uppercase">{order.status}</strong></span>
                          </div>
                          {order.refundStatus && (
                            <span className="text-amber-500 uppercase">Refund status: {order.refundStatus}</span>
                          )}
                          <span>Delivery Speed: Premium Ground Carrier</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: WISHLIST & FAVORITES */}
          {activeTab === "wishlist" && (
            <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Saved list */}
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Your Saved Wishlist</h3>
                  {wishlist.length === 0 ? (
                    <p className="text-xs text-gray-400 py-8 text-center glass-effect border border-white/10 rounded-lg">Wishlist is currently empty.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map((prod) => (
                        <div key={prod._id} className="glass-effect border border-white/10 rounded-xl p-4 flex gap-4 items-center shadow-sm relative">
                          <div className="w-12 h-12 rounded border border-gray-100 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                            <img src={prod.images?.[0] || prod.image} alt={prod.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs text-left">
                            <span className="font-bold text-white block truncate capitalize">{prod.name}</span>
                            <span className="text-[9px] text-gray-400 block truncate uppercase">{prod.category}</span>
                            <span className="font-mono font-bold text-[#ff9900] mt-0.5 block">${prod.price}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleAddToCart(prod)}
                              className="px-2.5 py-1 bg-[#ff9900] hover:bg-[#f3a847] text-black font-bold text-[9px] rounded uppercase cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => handleRemoveWishlist(prod._id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors flex justify-center cursor-pointer"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Following Sellers & Favorites */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Followed Sellers */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1"><User className="w-4 h-4 text-purple-400"/> Followed Stores</h4>
                    <div className="space-y-2.5 text-xs text-left">
                      {["Apple Official Store", "Dell Retail Outlet", "Razer Flagship Store"].map((shop, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-b-0">
                          <span className="font-bold text-gray-200">{shop}</span>
                          <button className="text-[9px] border border-white/10 px-2 py-0.5 rounded text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer">Unfollow</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Favorite Categories */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1"><Heart className="w-4 h-4 text-[#ff007f]"/> Preferred Brands</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {favoriteBrands.map((brand, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-300 flex items-center gap-1 font-mono uppercase">
                          {brand}
                          <button onClick={() => setFavoriteBrands(favoriteBrands.filter(b => b !== brand))} className="hover:text-red-500 text-gray-500 font-black cursor-pointer">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: WALLET & REFERRALS */}
          {activeTab === "wallet" && (
            <motion.div key="wallet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Wallet Balance, coupons, gift cards */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Digital Wallet Card */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-gradient-to-r from-gray-900 to-[#111827] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-[#ff9900]/5 rounded-full blur-2xl" />
                    <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold font-mono">Secure Wallet Asset</span>
                        <h4 className="text-xs font-bold text-white mt-1">Available Purchasing Balance</h4>
                      </div>
                      <CreditCard className="w-6 h-6 text-[#ff9900] opacity-50" />
                    </div>
                    
                    <div className="flex justify-between items-baseline py-2 font-mono">
                      <span className="text-3xl font-black text-[#ff9900]">${walletBalance.toFixed(2)}</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-bold font-mono">AUTHORIZED GATEWAY</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-gray-500">
                      <span>Secure validation key active</span>
                      <span className="text-right">Biometric Auth: Verified</span>
                    </div>
                  </div>

                  {/* Redemptions Forms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Coupons */}
                    <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-3">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">Apply Coupon Code</h4>
                      <form onSubmit={handleApplyCoupon} className="space-y-2 text-xs">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon code (e.g. nexus50)"
                          className="w-full p-2 bg-black/50 border border-white/10 rounded-lg focus:border-[#ff9900] focus:outline-none"
                        />
                        <button type="submit" className="w-full py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-black font-bold uppercase rounded-lg cursor-pointer">Apply Coupon</button>
                      </form>
                      {couponMessage && <p className="text-[10px] text-amber-500">{couponMessage}</p>}
                    </div>

                    {/* Gift Cards */}
                    <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-3">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">Redeem Gift Card</h4>
                      <form onSubmit={handleRedeemGiftCard} className="space-y-2 text-xs">
                        <input
                          type="text"
                          value={giftCardCode}
                          onChange={(e) => setGiftCardCode(e.target.value)}
                          placeholder="Gift card PIN code"
                          className="w-full p-2 bg-black/50 border border-white/10 rounded-lg focus:border-[#ff9900] focus:outline-none"
                        />
                        <button type="submit" className="w-full py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-black font-bold uppercase rounded-lg cursor-pointer">Redeem Card</button>
                      </form>
                      {giftCardMessage && <p className="text-[10px] text-amber-500">{giftCardMessage}</p>}
                    </div>
                  </div>

                  {/* Referral system simulator */}
                  <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-4 text-xs">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5"><Share2 className="w-4 h-4 text-purple-400"/> Referral Ambassador System</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-light">Earn **$25.00** Wallet cash for every client referred to the Nexus marketplace. Share your unique developer key.</p>
                    
                    <div className="flex gap-2 items-center bg-black/35 p-3 rounded-lg border border-white/5">
                      <code className="text-white flex-1 font-mono text-[10px]">{`NEXUS-REF-U8F${user?._id?.slice(-4).toUpperCase() || "7F"}`}</code>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(`NEXUS-REF-U8F${user?._id?.slice(-4).toUpperCase() || "7F"}`); alert("Referral code copied to clipboard!"); }}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-300 hover:text-white cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5"/>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center font-mono">
                      <div className="bg-black/40 p-2 border border-white/5 rounded">
                        <span className="text-[8px] text-gray-500 block">REFERRED SIGNUPS</span>
                        <strong className="text-sm text-white">{referralsCount} users</strong>
                      </div>
                      <div className="bg-black/40 p-2 border border-white/5 rounded">
                        <span className="text-[8px] text-gray-500 block">TOTAL COMMISSIONS</span>
                        <strong className="text-sm text-emerald-500">${referralEarnings.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cards Wallet */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center justify-between">
                      <span>Saved Cards</span>
                      <button onClick={() => setShowAddCard(!showAddCard)} className="text-[9px] text-[#ff9900] hover:underline flex items-center gap-0.5"><PlusCircle className="w-3 h-3"/> Add</button>
                    </h4>

                    {showAddCard && (
                      <form onSubmit={handleAddCard} className="bg-black/50 p-4 border border-white/10 rounded-lg text-xs space-y-3">
                        {cardError && <p className="text-[9px] text-red-500 font-mono text-left">{cardError}</p>}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block mb-1 font-bold">Type</label>
                            <select 
                              value={newCard.type}
                              onChange={(e) => setNewCard({...newCard, type: e.target.value})}
                              className="w-full p-2 bg-black border border-white/10 rounded text-xs focus:outline-none"
                            >
                              <option value="Visa">Visa</option>
                              <option value="Mastercard">Mastercard</option>
                              <option value="Amex">Amex</option>
                            </select>
                          </div>
                          <div>
                            <label className="block mb-1 font-bold">Exp</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={newCard.exp}
                              onChange={(e) => setNewCard({...newCard, exp: e.target.value})}
                              className="w-full p-2 bg-black border border-white/10 rounded text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 font-bold">Card Number</label>
                          <input
                            type="text"
                            required
                            placeholder="16 Digits"
                            value={newCard.number}
                            onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                            className="w-full p-2 bg-black border border-white/10 rounded text-xs focus:outline-none"
                          />
                        </div>
                        <button type="submit" className="w-full py-2 bg-[#ff9900] hover:bg-[#f3a847] text-black font-bold uppercase rounded cursor-pointer">Save Card</button>
                      </form>
                    )}

                    <div className="space-y-2">
                      {cards.map((card) => (
                        <div key={card.id} className="p-3 border border-white/5 rounded-lg text-xs text-left relative flex items-center justify-between hover:border-white/10">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="font-bold text-white block">{card.type}</span>
                              <span className="text-[9px] text-gray-400 block font-mono">{card.number}</span>
                            </div>
                          </div>
                          {card.default && <span className="text-[8px] bg-amber-100 text-[#ff9900] px-1 rounded font-bold font-mono">DEF</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: ALERTS & HISTORY */}
          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Browsing history lists */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">Browsing Logs</h3>
                    <button 
                      onClick={handleClearHistory}
                      className="text-[9px] text-red-500 hover:underline flex items-center gap-1 cursor-pointer font-mono uppercase"
                    >
                      <Trash2 className="w-3.5 h-3.5"/> Clear History
                    </button>
                  </div>
                  {browsingHistory.length === 0 ? (
                    <p className="text-xs text-gray-400 py-8 text-center glass-effect border border-white/10 rounded-lg">No browsing history records logged.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {browsingHistory.map((prod) => (
                        <div key={prod._id} className="glass-effect border border-white/10 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                          <div className="w-12 h-12 rounded border border-gray-100 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                            <img src={prod.images?.[0]} alt={prod.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <span className="font-bold text-white block truncate capitalize">{prod.name}</span>
                            <span className="text-[10px] text-[#ff9900] font-bold font-mono mt-0.5 block">${prod.price}</span>
                          </div>
                          <button 
                            onClick={() => router.push(`/product/${prod._id}`)}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded text-[9px] uppercase cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Alerts & Saved Searches */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Price Alerts */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1"><Bell className="w-4 h-4 text-[#ff9900]"/> Price Alerts</h4>
                    {priceAlerts.length === 0 ? (
                      <p className="text-[10px] text-gray-500">Add items to watchlist to track price drops.</p>
                    ) : (
                      <div className="space-y-3 text-xs text-left">
                        {priceAlerts.map((alert) => (
                          <div key={alert._id} className="p-2 border border-white/5 rounded-lg text-left">
                            <span className="font-bold text-white block truncate">{alert.name}</span>
                            <div className="flex justify-between items-baseline mt-1 font-mono text-[10px]">
                              <span>List: <strong className="text-gray-300">${alert.currentPrice}</strong></span>
                              <span>Target: <strong className="text-emerald-500">${alert.alertPrice}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Saved Searches */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5"><Search className="w-4 h-4 text-purple-400"/> Saved Queries</h4>
                    <div className="flex flex-col gap-1.5 text-xs text-left">
                      {savedSearches.map((term, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 bg-black/20 px-2 rounded border border-white/5">
                          <span className="font-mono text-gray-300 text-[10px] cursor-pointer hover:underline" onClick={() => { router.push(`/shop?search=${encodeURIComponent(term)}`); }}>{term}</span>
                          <button onClick={() => handleRemoveSearch(term)} className="hover:text-red-500 text-gray-500 cursor-pointer">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 6: SOCIAL & ACTIVITY */}
          {activeTab === "social" && (
            <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Messages Panel */}
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Seller Conversations</h3>
                  <div className="space-y-3">
                    {messages.map((msg, idx) => (
                      <div key={idx} className="glass-effect border border-white/10 rounded-xl p-4 text-xs text-left space-y-2">
                        <div className="flex justify-between font-bold text-white">
                          <span className="capitalize">{msg.sender}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{msg.date}</span>
                        </div>
                        <p className="text-gray-400 font-light leading-relaxed">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications feed */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Notifications */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center justify-between">
                      <span>Alert Center</span>
                      <button onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))} className="text-[9px] text-[#ff9900] hover:underline cursor-pointer">Read All</button>
                    </h4>
                    <div className="space-y-3 text-xs text-left">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-2.5 rounded-lg border border-white/5 transition-all ${n.unread ? "bg-white/5 border-l-2 border-l-[#ff9900]" : "opacity-60"}`}>
                          <span className="font-bold text-white block">{n.title}</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.text}</p>
                          <span className="text-[8px] text-gray-500 font-mono block mt-1">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Reviews logs */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Your Written Reviews</h4>
                    <div className="space-y-3 text-xs text-left">
                      {userReviews.map((rev) => (
                        <div key={rev.id} className="p-3 border border-white/5 rounded-lg space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-white block truncate w-32">{rev.productName}</span>
                            <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Star key={si} className={`w-2.5 h-2.5 ${si < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">{rev.text}</p>
                          <span className="text-[8px] text-gray-500 font-mono block pt-1">{rev.date} | Verified Client Review</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 7: SUPPORT COPILOT */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Tickets registry */}
                <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Fulfillment Tickets</h4>
                  
                  {/* Create */}
                  <form onSubmit={handleCreateTicket} className="bg-black/50 p-4 border border-white/10 rounded-xl text-xs space-y-3">
                    <span className="font-bold block text-gray-200">Submit Fulfillment Support Case</span>
                    <div>
                      <label className="block mb-1 font-semibold">Subject / Heading</label>
                      <input
                        type="text"
                        required
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                        placeholder="Setup diagnostics query, payment delay"
                        className="w-full p-2 bg-black border border-white/10 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Message Body</label>
                      <textarea
                        required
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="Detail the case specifications here..."
                        className="w-full p-2 bg-black border border-white/10 rounded focus:outline-none h-20 resize-none"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-black font-bold uppercase rounded cursor-pointer">Open Ticket</button>
                  </form>

                  <div className="space-y-2">
                    {tickets.map((t) => (
                      <div key={t.id} className="flex justify-between items-center p-3 border border-white/5 rounded-lg text-xs">
                        <div>
                          <span className="font-bold text-gray-200 block">{t.subject}</span>
                          <span className="text-[10px] text-gray-400 block">{t.id} | Opened {t.date}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          t.status === "Open" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copilot Chat */}
                <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col h-[480px]">
                  <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#ff9900]"/> Assistant Copilot</span>
                    <button onClick={() => setChatHistory([{role: 'ai', content: "Copilot session reset. Let me know what products you want to examine."}])} className="text-[9px] text-[#ff9900] hover:underline cursor-pointer">Reset Session</button>
                  </h4>
                  
                  {/* Chats */}
                  <div className="flex-grow bg-black/40 border border-white/10 rounded-xl p-3 overflow-y-auto custom-scrollbar space-y-3 text-xs">
                    {chatHistory.map((chat, idx) => (
                      <div key={idx} className={`p-2.5 rounded-lg border max-w-[85%] text-left ${
                        chat.role === 'user'
                          ? "bg-amber-50 border-amber-200 text-black ml-auto"
                          : "glass-effect border-white/10 text-white mr-auto"
                      }`}>
                        <span className="text-[8px] text-gray-400 font-bold block mb-0.5">{chat.role === 'user' ? "Client Operator" : "AI Copilot Core"}</span>
                        <p className="whitespace-pre-line leading-relaxed font-light">{chat.content}</p>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex items-center gap-2 text-[#ff9900] animate-pulse text-[10px] font-mono">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Querying Neural Matrices...</span>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask AI Copilot for recommendations..."
                      className="flex-1 p-2 bg-black border border-white/10 rounded focus:outline-none text-xs text-white"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-black font-bold uppercase rounded cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 8: SETTINGS & PROFILE */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Details edit */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-5 shadow-xl text-xs space-y-4">
                    <h3 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider">Account Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 block mb-1">Display Client Name</span>
                        <input type="text" defaultValue={user?.name || "Nihar"} className="w-full p-2 bg-black border border-white/10 rounded focus:outline-none text-white font-bold" />
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Registered Contact Email</span>
                        <input type="email" defaultValue={user?.email || "niharjan8@gmail.com"} className="w-full p-2 bg-black border border-white/10 rounded focus:outline-none text-white font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 block mb-1">Development Job Title</span>
                        <input type="text" defaultValue={user?.jobTitle || "Software Engineer"} className="w-full p-2 bg-black border border-white/10 rounded focus:outline-none text-white font-bold" />
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Fulfillment Location Address</span>
                        <input type="text" defaultValue="New York, USA" className="w-full p-2 bg-black border border-white/10 rounded focus:outline-none text-white font-bold" />
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#ff9900] text-black font-bold uppercase rounded cursor-pointer" onClick={() => logActivity("Updated profile parameters")}>Update Settings</button>
                  </div>

                  {/* Address Book Card */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-5 shadow-xl text-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h3 className="font-bold text-xs text-white uppercase tracking-wider">Address Book Defaults</h3>
                      <button 
                        onClick={() => setShowAddAddress(!showAddAddress)} 
                        className="text-[9px] text-[#ff9900] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <PlusCircle className="w-3 h-3"/> Add Address
                      </button>
                    </div>

                    {addressError && <p className="text-[9px] text-red-500 font-mono text-left">{addressError}</p>}

                    {showAddAddress && (
                      <form onSubmit={handleAddAddress} className="bg-black/50 p-4 border border-white/10 rounded-lg text-xs space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block mb-1 font-bold text-left">Address Name</label>
                            <input
                              type="text"
                              required
                              placeholder="Home, Office"
                              value={newAddress.name}
                              onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                              className="w-full p-2 bg-black border border-white/10 rounded text-xs focus:outline-none text-white"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 font-bold text-left">Zip Code</label>
                            <input
                              type="text"
                              required
                              placeholder="5 Digits"
                              value={newAddress.zip}
                              onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                              className="w-full p-2 bg-black border border-white/10 rounded text-xs focus:outline-none text-white"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block mb-1 font-bold text-left">Street</label>
                            <input
                              type="text"
                              required
                              placeholder="123 Main St"
                              value={newAddress.street}
                              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                              className="w-full p-2 bg-black border border-white/10 rounded text-xs focus:outline-none text-white"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 font-bold text-left">City</label>
                            <input
                              type="text"
                              required
                              placeholder="New York"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                              className="w-full p-2 bg-black border border-white/10 rounded text-xs focus:outline-none text-white"
                            />
                          </div>
                        </div>
                        <button type="submit" className="w-full py-2 bg-[#ff9900] hover:bg-[#f3a847] text-black font-bold uppercase rounded cursor-pointer">Save Address</button>
                      </form>
                    )}

                    <div className="space-y-2">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="p-3 border border-white/5 rounded-lg text-xs text-left relative flex items-center justify-between hover:border-white/10">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="font-bold text-white block">{addr.name}</span>
                              <span className="text-[9px] text-gray-400 block font-mono">{addr.street}, {addr.city}, {addr.zip}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {addr.default ? (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded font-bold font-mono">DEFAULT</span>
                            ) : (
                              <button 
                                onClick={() => {
                                  setAddresses(addresses.map(a => ({ ...a, default: a.id === addr.id })));
                                  logActivity(`Set default address to: ${addr.name}`);
                                }}
                                className="text-[8px] text-gray-400 hover:text-white uppercase font-mono cursor-pointer"
                              >
                                Set Default
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setAddresses(addresses.filter(a => a.id !== addr.id));
                                logActivity(`Deleted address: ${addr.name}`);
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-black cursor-pointer ml-1"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subscriptions, Security & Privacy */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Security (2FA) */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-400"/> Security Controls</h4>
                    <div className="flex items-center justify-between py-1">
                      <span>Two-Factor Auth (2FA)</span>
                      <input type="checkbox" defaultChecked className="accent-emerald-500 cursor-pointer" onChange={(e) => logActivity(`Toggled 2FA: ${e.target.checked ? "ON" : "OFF"}`)} />
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-white/5 pt-2">
                      <span>Biometric Wallet Validation</span>
                      <input type="checkbox" defaultChecked className="accent-emerald-500 cursor-pointer" />
                    </div>
                  </div>

                  {/* Subscriptions */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-purple-400"/> Subscriptions</h4>
                    <div className="space-y-3">
                      {subscriptions.map((sub) => (
                        <div key={sub.id} className="p-2 border border-white/5 rounded-lg flex justify-between items-center text-left">
                          <div>
                            <span className="font-bold text-white block">{sub.name}</span>
                            <span className="text-[9px] text-gray-500 block font-mono">${sub.price}/{sub.cycle} | Next: {sub.nextBilling}</span>
                            <div className="flex gap-1.5 mt-1">
                              <button 
                                onClick={() => toggleSubscriptionStatus(sub.id)} 
                                className={`text-[8px] uppercase px-1.5 py-0.5 rounded cursor-pointer ${
                                  sub.status === "Active" ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                }`}
                              >
                                {sub.status === "Active" ? "Pause" : "Resume"}
                              </button>
                              <select 
                                value={sub.cycle} 
                                onChange={(e) => changeSubscriptionCycle(sub.id, e.target.value)} 
                                className="text-[8px] bg-black border border-white/10 rounded px-1 py-0.5 text-gray-300 focus:outline-none"
                              >
                                <option value="Monthly">Monthly</option>
                                <option value="Bi-weekly">Bi-weekly</option>
                                <option value="Quarterly">Quarterly</option>
                              </select>
                            </div>
                          </div>
                          <span className={`text-[8px] px-1 rounded font-bold uppercase ${sub.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{sub.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Privacy settings */}
                  <div className="glass-effect border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
                    <h4 className="font-bold text-xs text-white border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5"><Sliders className="w-4 h-4 text-gray-400"/> Privacy Settings</h4>
                    <div className="flex items-center justify-between py-1">
                      <span>Data Sharing Consent</span>
                      <input type="checkbox" defaultChecked className="accent-[#ff9900] cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-white/5 pt-2">
                      <span>Store Browser Cookies</span>
                      <input type="checkbox" defaultChecked className="accent-[#ff9900] cursor-pointer" />
                    </div>
                    <button 
                      onClick={() => { if (confirm("Delete account records? This action is irreversible.")) { alert("Wiping workspace cache..."); localStorage.clear(); window.location.href = "/"; } }}
                      className="w-full mt-2 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-500 rounded font-bold uppercase text-[9px] tracking-wider cursor-pointer"
                    >
                      Delete Account Cache
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
