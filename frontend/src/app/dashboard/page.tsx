"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { loginSuccess } from "@/store/slices/authSlice";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";

import dynamic from "next/dynamic";

// Professional Dashboard Skeleton Loader
const DashboardSkeleton = () => (
  <div className="flex-1 p-6 space-y-6 animate-pulse bg-gray-50 dark:bg-[#0a0e17] min-h-screen">
    <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-800">
      <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-1/6"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="h-24 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-24 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-24 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-24 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="h-80 bg-gray-200 dark:bg-slate-800 rounded-lg lg:col-span-2"></div>
      <div className="h-80 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
    </div>
  </div>
);

// Lazy-loaded Dashboards
const CustomerDashboard = dynamic(() => import("@/dashboards/customer/CustomerDashboard"), {
  loading: () => <DashboardSkeleton />,
  ssr: false,
});
const AdminDashboard = dynamic(() => import("@/dashboards/admin/AdminDashboard"), {
  loading: () => <DashboardSkeleton />,
  ssr: false,
});
const SellerDashboard = dynamic(() => import("@/dashboards/seller/SellerDashboard"), {
  loading: () => <DashboardSkeleton />,
  ssr: false,
});
const SuperAdminDashboard = dynamic(() => import("@/dashboards/superadmin/SuperAdminDashboard"), {
  loading: () => <DashboardSkeleton />,
  ssr: false,
});

type DashboardRole = 'customer' | 'admin' | 'seller' | 'superadmin';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
  
  const [activeRole, setActiveRole] = useState<DashboardRole>("customer");
  const [mounted, setMounted] = useState(false);

  // Sync activeRole with Redux user role when loaded
  useEffect(() => {
    if (user?.role) {
      if (user.isSuperAdmin) {
        setActiveRole("superadmin");
      } else {
        setActiveRole(user.role as DashboardRole);
      }
    }
    setMounted(true);
  }, [user]);

  // Route Guard
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, mounted]);

  const handleRoleChange = (newRole: DashboardRole) => {
    setActiveRole(newRole);
    if (user) {
      const updatedUser = { 
        ...user, 
        role: newRole === "superadmin" ? "admin" : newRole,
        isSuperAdmin: newRole === "superadmin" ? true : undefined
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      dispatch(loginSuccess({ user: updatedUser, token: token || "mock_token" }));
    }
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="w-screen h-screen bg-[#131921] flex items-center justify-center font-mono text-xs text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#ff9900] border-t-transparent animate-spin" />
          <span>Securing Gateway session...</span>
        </div>
      </div>
    );
  }

  // Route protection checker: returns true if user is authorized for the active dashboard selection
  const isAuthorized = () => {
    // Super admins can access everything
    if (user.isSuperAdmin) return true;
    
    // Admins can access admin, seller, and customer dashboards
    if (user.role === "admin") {
      return activeRole !== "superadmin";
    }
    
    // Sellers can access seller and customer dashboards
    if (user.role === "seller") {
      return activeRole === "seller" || activeRole === "customer";
    }
    
    // Customers can ONLY access customer dashboard
    return activeRole === "customer";
  };

  // Render the appropriate dashboard inside the shared layout
  const renderActiveDashboard = () => {
    if (!isAuthorized()) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-black">
          <div className="max-w-md bg-white border border-red-200 rounded-lg p-8 shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-red-600 animate-bounce" />
            </div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">Access Denied</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your profile authority (<strong>{user.isSuperAdmin ? "Super Admin" : user.role}</strong>) is insufficient to access the selected dashboard tab (<strong>{activeRole}</strong>).
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleRoleChange(user.isSuperAdmin ? "superadmin" : user.role)}
                className="px-4 py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded text-xs font-bold uppercase tracking-wider shadow hover:from-[#f5d78e] hover:to-[#eeb933] cursor-pointer"
              >
                Return to Safe Zone
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeRole) {
      case "superadmin":
        return <SuperAdminDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "seller":
        return <SellerDashboard />;
      case "customer":
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <DashboardLayout activeRole={activeRole as any} onRoleChange={handleRoleChange as any}>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {renderActiveDashboard()}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
