"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Gamepad2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Store", href: "/store" },
  {
    label: "Categories",
    href: "/categories",
    sub: ["Action", "RPG", "Strategy", "Simulation", "Horror", "Sports"],
  },
  { label: "Deals", href: "/deals" },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = 3;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080c14]/95 backdrop-blur-md border-b border-cyan-500/10 shadow-lg shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="relative">
              <Gamepad2 className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Steam</span>
              <span className="text-cyan-400"> Rush</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.sub ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors rounded-md hover:bg-white/5">
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <AnimatePresence>
                    {categoriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-44 bg-[#0d1117] border border-cyan-500/20 rounded-lg shadow-xl shadow-black/60 overflow-hidden"
                      >
                        {link.sub.map((cat) => (
                          <Link
                            key={cat}
                            href={`/categories/${cat.toLowerCase()}`}
                            className="block px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                          >
                            {cat}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors rounded-md hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search games..."
                className="pl-9 bg-[#0d1117] border-slate-700 text-slate-300 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-full text-sm h-9"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-300 hover:text-cyan-400 hover:bg-white/5"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-cyan-500 text-black border-0 rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-cyan-400 hover:bg-white/5"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-300 hover:text-cyan-400 hover:bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search games..."
              className="pl-9 bg-[#0d1117] border-slate-700 text-slate-300 placeholder:text-slate-500 focus:border-cyan-500 rounded-full text-sm h-9"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#080c14]/98 border-t border-slate-800 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.sub && (
                    <div className="ml-4 mt-1 space-y-1">
                      {link.sub.map((cat) => (
                        <Link
                          key={cat}
                          href={`/categories/${cat.toLowerCase()}`}
                          className="block px-4 py-2 text-xs text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
