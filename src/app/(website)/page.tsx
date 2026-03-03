"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Tag,
  ChevronRight,
  Flame,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featuredGames = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    genre: "RPG",
    price: 29.99,
    originalPrice: 59.99,
    discount: 50,
    rating: 4.7,
    reviews: 124500,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    tag: "Hot Deal",
  },
  {
    id: 2,
    title: "Elden Ring",
    genre: "Action RPG",
    price: 49.99,
    originalPrice: 59.99,
    discount: 17,
    rating: 4.9,
    reviews: 89300,
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=600&q=80",
    tag: "Top Rated",
  },
  {
    id: 3,
    title: "Baldur's Gate 3",
    genre: "RPG",
    price: 59.99,
    originalPrice: 59.99,
    discount: 0,
    rating: 4.9,
    reviews: 201000,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    tag: "New",
  },
  {
    id: 4,
    title: "Hollow Knight",
    genre: "Metroidvania",
    price: 7.49,
    originalPrice: 14.99,
    discount: 50,
    rating: 4.8,
    reviews: 345000,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    tag: "Best Seller",
  },
];

const categories = [
  { name: "Action", icon: "⚔️", count: 1240, color: "from-red-500/20 to-red-900/10" },
  { name: "RPG", icon: "🧙", count: 856, color: "from-purple-500/20 to-purple-900/10" },
  { name: "Strategy", icon: "♟️", count: 673, color: "from-blue-500/20 to-blue-900/10" },
  { name: "Simulation", icon: "🎮", count: 492, color: "from-green-500/20 to-green-900/10" },
  { name: "Horror", icon: "👻", count: 318, color: "from-orange-500/20 to-orange-900/10" },
  { name: "Sports", icon: "⚽", count: 215, color: "from-cyan-500/20 to-cyan-900/10" },
];

const features = [
  { icon: Zap, title: "Instant Delivery", desc: "Get your game key delivered instantly after purchase." },
  { icon: Shield, title: "Secure Payments", desc: "Your transactions are protected with bank-level security." },
  { icon: Clock, title: "24/7 Support", desc: "Our team is always ready to help you around the clock." },
  { icon: Tag, title: "Best Prices", desc: "We guarantee the lowest prices on all game titles." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function GameCard({ game }: { game: (typeof featuredGames)[0] }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="group bg-[#0d1117] border-slate-800 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10">
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {game.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-cyan-500 text-black font-bold border-0">
              -{game.discount}%
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 bg-black/70 text-white border-slate-700 text-xs"
          >
            {game.tag}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="text-xs text-cyan-400 font-medium mb-1">{game.genre}</p>
            <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
              {game.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-medium">{game.rating}</span>
            <span>({(game.reviews / 1000).toFixed(0)}k reviews)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">${game.price}</span>
              {game.discount > 0 && (
                <span className="text-sm text-slate-500 line-through">${game.originalPrice}</span>
              )}
            </div>
            <Button
              size="sm"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold h-8 px-3 text-xs"
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80"
            alt="Hero background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c14] via-[#080c14]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
        </div>

        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl space-y-6"
          >
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Summer Sale — Up to 75% Off
              </Badge>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
              Level Up Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Gaming
              </span>{" "}
              Experience
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              Discover thousands of Steam games at the best prices. Instant
              delivery, secure checkout, and exclusive deals every day.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 transition-all"
                asChild
              >
                <Link href="/store">
                  Browse Store
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 bg-transparent"
                asChild
              >
                <Link href="/deals">
                  <Flame className="w-4 h-4 mr-2" />
                  Today's Deals
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-800">
              {[
                { label: "Games Available", value: "50,000+" },
                { label: "Happy Players", value: "2M+" },
                { label: "Daily Deals", value: "100+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-cyan-400 font-semibold uppercase tracking-widest">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white">Featured Games</h2>
          </div>
          <Link
            href="/store"
            className="hidden sm:flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {featuredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-[#060a10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-xs text-cyan-400 font-semibold uppercase tracking-widest">
              Browse By
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">Categories</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={itemVariants}>
                <Link
                  href={`/categories/${cat.name.toLowerCase()}`}
                  className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-gradient-to-br ${cat.color} border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 text-center`}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors text-sm">
                      {cat.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.count} games</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Deal Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/20 p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-[#080c14]/60" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(6,182,212,0.6) 0%, transparent 60%)",
            }}
          />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                <Flame className="w-3 h-3 mr-1" />
                Limited Time Offer
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold">
                Weekend Flash Sale{" "}
                <span className="text-cyan-400">75% OFF</span>
              </h2>
              <p className="text-slate-400">
                Grab the hottest titles at the lowest prices. Offer ends Sunday midnight.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 shadow-lg shadow-cyan-500/30 flex-shrink-0"
              asChild
            >
              <Link href="/deals">Shop the Sale</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#060a10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="flex gap-4 p-5 rounded-xl bg-[#0d1117] border border-slate-800 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
