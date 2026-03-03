import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Package,
  Tag,
  LogOut,
  Gamepad2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Dashboard - Steam Rush Admin",
  description: "Steam Rush admin dashboard",
};

const sidebarLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Promotions", href: "/dashboard/promotions", icon: Tag },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#080c14]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0a0e18] border-r border-slate-800 fixed top-0 left-0 h-full z-40">
        {/* Sidebar Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
          <div className="relative">
            <Gamepad2 className="w-6 h-6 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          </div>
          <span className="text-lg font-bold">
            <span className="text-white">Steam</span>
            <span className="text-cyan-400"> Rush</span>
          </span>
          <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded px-1.5 py-0.5 font-medium">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors group"
            >
              <Icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        <Separator className="bg-slate-800" />

        {/* Bottom */}
        <div className="px-3 py-4 space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors group"
          >
            <Settings className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
            Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

          {/* User avatar */}
          <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@steamrush.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-[#0a0e18] border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-sm font-medium text-slate-300">Steam Rush Admin</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              ← Back to Store
            </Link>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
