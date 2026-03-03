"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Gamepad2,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Revenue",
    value: "$124,680",
    change: "+12.5%",
    positive: true,
    icon: DollarSign,
    desc: "vs last month",
  },
  {
    title: "Total Orders",
    value: "3,842",
    change: "+8.2%",
    positive: true,
    icon: ShoppingBag,
    desc: "vs last month",
  },
  {
    title: "Active Users",
    value: "28,540",
    change: "+18.7%",
    positive: true,
    icon: Users,
    desc: "vs last month",
  },
  {
    title: "Avg. Order Value",
    value: "$32.45",
    change: "-2.1%",
    positive: false,
    icon: TrendingUp,
    desc: "vs last month",
  },
];

const recentOrders = [
  { id: "#ORD-5892", customer: "Alex M.", game: "Cyberpunk 2077", amount: "$29.99", status: "Delivered" },
  { id: "#ORD-5891", customer: "Sarah K.", game: "Elden Ring", amount: "$49.99", status: "Processing" },
  { id: "#ORD-5890", customer: "James W.", game: "Hollow Knight", amount: "$7.49", status: "Delivered" },
  { id: "#ORD-5889", customer: "Emma R.", game: "Baldur's Gate 3", amount: "$59.99", status: "Delivered" },
  { id: "#ORD-5888", customer: "Liam T.", game: "Stardew Valley", amount: "$13.99", status: "Failed" },
];

const topGames = [
  { title: "Cyberpunk 2077", sold: 1240, revenue: "$37,176", rating: 4.7 },
  { title: "Elden Ring", sold: 980, revenue: "$48,990", rating: 4.9 },
  { title: "Hollow Knight", sold: 870, revenue: "$6,520", rating: 4.8 },
  { title: "Baldur's Gate 3", sold: 750, revenue: "$44,993", rating: 4.9 },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {stats.map(({ title, value, change, positive, icon: Icon, desc }) => (
          <motion.div key={title} variants={itemVariants}>
            <Card className="bg-[#0d1117] border-slate-800 hover:border-cyan-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-2">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {positive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {change}
                      </span>
                      <span className="text-xs text-slate-500">{desc}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="xl:col-span-3"
        >
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Order</th>
                      <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Customer</th>
                      <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium hidden sm:table-cell">Game</th>
                      <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Amount</th>
                      <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-3.5 text-cyan-400 font-mono text-xs">{order.id}</td>
                        <td className="px-6 py-3.5 text-slate-300">{order.customer}</td>
                        <td className="px-6 py-3.5 text-slate-400 hidden sm:table-cell">{order.game}</td>
                        <td className="px-6 py-3.5 text-white font-medium">{order.amount}</td>
                        <td className="px-6 py-3.5">
                          <Badge className={`text-xs border ${statusColors[order.status]}`}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="xl:col-span-2"
        >
          <Card className="bg-[#0d1117] border-slate-800 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                Top Selling Games
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topGames.map((game, i) => (
                <div
                  key={game.title}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-500 w-4">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{game.title}</p>
                    <p className="text-xs text-slate-500">{game.sold} sold</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-cyan-400">{game.revenue}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-slate-400">{game.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
