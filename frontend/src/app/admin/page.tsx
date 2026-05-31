"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { Activity, Users, DollarSign, Package, AlertTriangle, ShieldAlert, Edit, Trash2, Plus, X } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // CRUD Form State
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    description: "",
    features: ""
  });

  const isAdmin = user?.role === "admin";

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 199,
      category: "Workstation",
      stock: 50,
      description: "Next-gen experimental cybernetic utility module.",
      features: "Bandwidth: 10Gbps, Latency: <1ms"
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || "",
      features: (product.features || []).join(", ")
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0 || formData.stock < 0) {
      setErrorMsg("Please populate all coordinates properly.");
      return;
    }

    if (!isAdmin) {
      setErrorMsg("ADMINISTRATIVE ACCESS DENIED: guest link detected.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    const featuresArray = formData.features.split(",").map(f => f.trim()).filter(Boolean);

    try {
      const url = editingProduct 
        ? `http://localhost:4000/api/products/${editingProduct._id}`
        : "http://localhost:4000/api/products";
      
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          features: featuresArray,
          images: ["from-[#00f0ff] to-[#8a2be2]"]
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save coordinates.");
      }

      setSuccessMsg(editingProduct ? "Telemetry updated successfully." : "New product grid registered.");
      setShowFormModal(false);
      fetchProducts();
    } catch (err: any) {
      setErrorMsg(err.message || "Request transmission failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      setErrorMsg("ADMINISTRATIVE ACCESS DENIED: delete operation blocked.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Unable to wipe coordinates.");
      }

      setSuccessMsg("Product registration wiped clean.");
      fetchProducts();
    } catch (err: any) {
      setErrorMsg(err.message || "Delete request failed.");
    }
  };

  return (
    <main className="min-h-screen pt-32 px-6 pb-20 max-w-[100rem] mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-4xl font-black text-[#ff007f] text-glow-accent uppercase tracking-tighter flex items-center gap-4">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
            Command Center
         </h1>
         <div className="flex items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
              Sys_Status: {isAdmin ? "Root Admin" : "Guest Operator"}
            </span>
         </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          {successMsg}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <GlassPanel className="p-6 border-[#00f0ff]/20">
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest">Global Revenue</h3>
               <DollarSign className="w-5 h-5 text-[#00f0ff]" />
            </div>
            <p className="text-3xl font-black text-white text-glow mb-2">$8.4M</p>
            <p className="text-xs text-green-400 flex items-center gap-1">+14.2% <span className="text-gray-600">vs last cycle</span></p>
         </GlassPanel>

         <GlassPanel className="p-6 border-[#8a2be2]/20">
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active Nodes</h3>
               <Users className="w-5 h-5 text-[#8a2be2]" />
            </div>
            <p className="text-3xl font-black text-white text-glow mb-2">124,592</p>
            <p className="text-xs text-green-400 flex items-center gap-1">+5.8% <span className="text-gray-600">vs last cycle</span></p>
         </GlassPanel>

         <GlassPanel className="p-6 border-[#ff007f]/20">
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Tech Logs</h3>
               <Package className="w-5 h-5 text-[#ff007f]" />
            </div>
            <p className="text-3xl font-black text-white text-glow mb-2">{products.length}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">Fully dynamic</p>
         </GlassPanel>

         <GlassPanel className="p-6 border-yellow-500/20">
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest">Operator Role</h3>
               <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-black text-white text-glow mb-2">{isAdmin ? "ROOT" : "GUEST"}</p>
            <p className="text-xs text-yellow-500 font-mono">{!isAdmin && "Login with admin credentials for CRUD rights"}</p>
         </GlassPanel>
      </div>

      {/* Inventory Management Panel */}
      <GlassPanel className="p-6">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#00f0ff]" />
              Multiverse Grid Inventory
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">OPERATES OVER REST DATASOURCE</p>
          </div>
          
          <button 
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#00f0ff] hover:bg-[#00d0ff] text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2 rounded transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Item Coordinates
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-gray-500">RETRIEVING INVENTORY SYSTEMS...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 uppercase tracking-widest">
                  <th className="pb-3 font-normal">Grid Item</th>
                  <th className="pb-3 font-normal">Category</th>
                  <th className="pb-3 font-normal">Price</th>
                  <th className="pb-3 font-normal">Stock Level</th>
                  <th className="pb-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <span className="text-white font-bold block">{p.name}</span>
                      <span className="text-gray-500 text-[10px] block truncate max-w-xs">{p.description}</span>
                    </td>
                    <td className="py-4 text-gray-400">{p.category}</td>
                    <td className="py-4 text-[#00f0ff] font-bold">${p.price.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        p.stock > 10 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id)}
                          className="p-2 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-colors text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg glass-panel p-6 border border-white/15 rounded-2xl relative shadow-2xl">
            <button 
              onClick={() => setShowFormModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">
              {editingProduct ? "Edit Product Coordinates" : "Register New Product"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Quantum Processor V2"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded focus:border-[#00f0ff] focus:outline-none text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded focus:border-[#00f0ff] focus:outline-none text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">Stock Level</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded focus:border-[#00f0ff] focus:outline-none text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Workstation"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded focus:border-[#00f0ff] focus:outline-none text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Telemetry details..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded focus:border-[#00f0ff] focus:outline-none text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">Features (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Bandwidth: 10Gbps, Latency: <1ms"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded focus:border-[#00f0ff] focus:outline-none text-xs text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-black hover:bg-[#ff007f] hover:text-white font-bold uppercase tracking-widest text-[10px] rounded transition-all flex items-center justify-center gap-2"
              >
                Save Registration Coordinates
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
