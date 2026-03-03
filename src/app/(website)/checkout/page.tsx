"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CreditCard,
  Building2,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{ id: string } | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Checkout not available</h1>
        <p className="text-slate-400 mb-8 text-center max-w-sm">
          You don't have any items in your cart to checkout.
        </p>
        <Button asChild className="bg-cyan-500 hover:bg-cyan-400 text-black">
          <Link href="/store">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const total_amount = totalPrice();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            total_amount,
            payment_method: paymentMethod,
            user_email: email || "anonymous@steamrush.com",
            status: "completed",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        game_id: item.id,
        price: item.discount_price ?? item.price,
        quantity: 1,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderConfirmed({ id: order.id });
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 italic tracking-tighter">SUCCESS!</h1>
          <p className="text-xl text-cyan-400 font-semibold mb-4">ORDER CONFIRMED</p>
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-6 mb-8">
            <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest">Order ID</p>
            <p className="text-white font-mono text-lg">{orderConfirmed.id}</p>
          </div>
          <p className="text-slate-400 mb-8">
            Thank you for your purchase! Your digital keys have been sent to your registered email.
          </p>
          <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-12 rounded-xl">
            <Link href="/">Back to Home</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Contact Info */}
            <section className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-7 h-7 bg-cyan-500/10 text-cyan-400 text-sm rounded-full flex items-center justify-center border border-cyan-500/20">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="bg-slate-900 border-slate-800 focus:border-cyan-500 h-12"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">Your digital game key will be sent to this email.</p>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-7 h-7 bg-cyan-500/10 text-cyan-400 text-sm rounded-full flex items-center justify-center border border-cyan-500/20">2</span>
                Payment Method
              </h2>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="card" id="card" className="sr-only" />
                  <Label
                    htmlFor="card"
                    className={`flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 ${paymentMethod === "card" ? "text-cyan-400" : "text-slate-500"}`} />
                    <span className={`text-sm font-medium ${paymentMethod === "card" ? "text-white" : "text-slate-400"}`}>Card</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="upi" id="upi" className="sr-only" />
                  <Label
                    htmlFor="upi"
                    className={`flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "upi"
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
                    }`}
                  >
                    <Smartphone className={`w-6 h-6 ${paymentMethod === "upi" ? "text-cyan-400" : "text-slate-500"}`} />
                    <span className={`text-sm font-medium ${paymentMethod === "upi" ? "text-white" : "text-slate-400"}`}>UPI</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="netbanking" id="netbanking" className="sr-only" />
                  <Label
                    htmlFor="netbanking"
                    className={`flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
                    }`}
                  >
                    <Building2 className={`w-6 h-6 ${paymentMethod === "netbanking" ? "text-cyan-400" : "text-slate-500"}`} />
                    <span className={`text-sm font-medium ${paymentMethod === "netbanking" ? "text-white" : "text-slate-400"}`}>Net Banking</span>
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-8 p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <AnimatePresence mode="wait">
                  {paymentMethod === "card" && (
                    <motion.div
                      key="card-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">Card Number</Label>
                        <Input placeholder="0000 0000 0000 0000" className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-xs uppercase tracking-wider">Expiry</Label>
                          <Input placeholder="MM/YY" className="bg-slate-800 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-400 text-xs uppercase tracking-wider">CVV</Label>
                          <Input placeholder="123" className="bg-slate-800 border-slate-700" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "upi" && (
                    <motion.div
                      key="upi-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">UPI ID</Label>
                        <Input placeholder="username@upi" className="bg-slate-800 border-slate-700 h-12" />
                      </div>
                      <p className="text-xs text-slate-500">A payment request will be sent to your UPI app.</p>
                    </motion.div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <motion.div
                      key="net-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-slate-300">Choose your bank from the list on the next page.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <div className="flex items-center gap-3 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <p className="text-xs text-slate-400">
                Your transaction is secured with 256-bit SSL encryption. No card details are stored on our servers.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-14 text-lg rounded-2xl shadow-xl shadow-cyan-500/20 group"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                  />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Place Order & Pay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Sidebar Order Summary */}
        <div className="lg:w-96">
          <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Details</h2>

            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    <p className="text-xs text-cyan-400 font-bold">
                      ${(item.discount_price ?? item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-800 my-6" />

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Items Total</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-2">
                <span>Grand Total</span>
                <span className="text-cyan-400">${totalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center uppercase tracking-widest">
              Digital Download • Lifetime Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
