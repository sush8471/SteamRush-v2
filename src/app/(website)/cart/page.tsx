"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, totalPrice, totalItems, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = totalPrice();
  const discount = items.reduce((acc, item) => {
    if (item.discount_price) {
      return acc + (item.price - item.discount_price);
    }
    return acc;
  }, 0);
  const total = subtotal;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <ShoppingBag className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Your cart is empty</h1>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto">
            Looks like you haven't added any games to your cart yet.
          </p>
          <Button asChild className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-full px-8 h-12">
            <Link href="/store">Browse Store</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Your Cart <span className="text-sm font-normal text-slate-400">({totalItems()} items)</span>
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 flex gap-4 items-center group relative overflow-hidden"
                >
                  {/* Glowing background on hover */}
                  <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <Link href={`/store/${item.id}`} className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/store/${item.id}`}>
                      <h3 className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors truncate">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
                        Steam Digital
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="flex flex-col items-end">
                      {item.discount_price ? (
                        <>
                          <span className="text-lg font-bold text-cyan-400">
                            ${item.discount_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-slate-500 line-through">
                            ${item.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-white">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${(subtotal + discount).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount Applied</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax</span>
                <span>$0.00</span>
              </div>
              <div className="h-px bg-slate-800 my-4" />
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span className="text-cyan-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-12 rounded-xl group">
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="w-8 h-8 rounded bg-slate-800/50 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <p>Digital delivery via Steam after successful payment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
