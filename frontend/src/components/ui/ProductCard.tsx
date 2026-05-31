"use client";
import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Star, Heart, AlertCircle, Truck, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { RootState } from "@/store/store";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
  delay?: number;
  rating?: number;
  numReviews?: number;
  originalPrice?: number;
  stock?: number;
  deliveryDays?: number;
  onView?: () => void;
  onQuickView?: () => void;
  onAddToCart?: () => void;
}

export const ProductCard = React.memo(function ProductCard({ 
  id, 
  title, 
  category, 
  price, 
  image = "", 
  delay = 0, 
  rating = 4.5, 
  numReviews = 24, 
  originalPrice, 
  stock = 5, 
  deliveryDays = 1,
  onView, 
  onQuickView,
  onAddToCart 
}: ProductCardProps) {
  const dispatch = useDispatch();
  const [addedAnim, setAddedAnim] = useState(false);

  const wishlistItems = useSelector((state: RootState) => state.wishlist?.items || []);
  const isWishlisted = useMemo(() => wishlistItems.some((item: any) => item.id === id), [wishlistItems, id]);

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist({ id, name: title, price, image, category }));
    }
  }, [isWishlisted, id, title, price, image, category, dispatch]);

  const handleAddToCartClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart();
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  }, [onAddToCart]);

  const marketPrice = useMemo(() => originalPrice || Math.round(price * 1.18), [originalPrice, price]);
  const discountPercent = useMemo(() => Math.round(((marketPrice - price) / marketPrice) * 100), [marketPrice, price]);

  const viewHandler = useCallback(() => {
    if (onView) onView();
  }, [onView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay }}
      onClick={viewHandler}
      className="relative w-full rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden text-left select-none cursor-pointer group transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top action overlays */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <motion.button 
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </motion.button>
        <motion.button 
          onClick={(e) => { e.stopPropagation(); if (onQuickView) onQuickView(); }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 text-gray-400 hover:text-[#ff9900] hover:border-[#ff9900]/30 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
      </div>

      {stock <= 3 && stock > 0 && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold uppercase tracking-wide shadow-sm">
          <AlertCircle className="w-2.5 h-2.5" /> Only {stock} left
        </span>
      )}

      {stock === 0 && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[9px] font-bold uppercase tracking-wide">
          Out of Stock
        </span>
      )}

      {/* Product Image Area — Amazon Style: White bg, centered, object-contain */}
      <div className="relative bg-white h-52 flex items-center justify-center overflow-hidden border-b border-gray-50">
        {image && image.includes("https://") ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-400 drop-shadow-sm" 
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
        )}

        {discountPercent > 0 && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-[#b12704] text-white text-[9px] font-black tracking-wider">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Info Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-[#ff9900] font-black uppercase tracking-widest">{category}</span>
            <span className="text-[9px] text-gray-400 flex items-center gap-1">
              <Truck className="w-2.5 h-2.5" /> {deliveryDays === 1 ? "1-Day" : `${deliveryDays}-Day`}
            </span>
          </div>

          <h3 className="text-gray-900 font-bold text-sm line-clamp-2 group-hover:text-[#ff9900] transition-colors leading-snug">{title}</h3>
          
          {/* Star ratings */}
          <div className="flex items-center gap-1.5">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="text-[10px] text-gray-500">({numReviews.toLocaleString()})</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-50 mt-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#ff9900] font-black text-base font-mono">${price.toLocaleString()}</span>
              {discountPercent > 0 && (
                <span className="text-gray-400 line-through text-xs font-mono">${marketPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
          
          <motion.button 
            onClick={handleAddToCartClick}
            title="Add to Cart"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              addedAnim 
                ? "bg-green-500 text-white border border-green-500" 
                : "bg-[#febd69] hover:bg-[#f3a847] border border-[#a88734] text-black"
            }`}
          >
            {addedAnim ? (
              <><Check className="w-3.5 h-3.5" /> Added</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
