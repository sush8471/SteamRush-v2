'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Game } from './game-card';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  games: Game[];
}

export function HeroSection({ games }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart, items } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (!games || games.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [games.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % games.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);

  const currentGame = games[currentIndex];

  if (!currentGame) return null;

  const isInCart = items.some(item => item.id === currentGame.id);

  const handleBuyNow = () => {
    if (!isInCart) {
      addToCart({
        id: currentGame.id,
        name: currentGame.title,
        price: currentGame.price,
        discount_price: currentGame.discount_price,
        image_url: currentGame.poster_url,
      });
      toast.success("Added to cart", {
        description: `${currentGame.title} added to cart.`,
      });
    }
    router.push("/checkout");
  };

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-full w-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={currentGame.banner_url || currentGame.poster_url}
              alt={currentGame.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="container relative flex h-full items-center px-4 md:px-6">
            <div className="max-w-2xl space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex gap-2">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Featured
                  </span>
                  {currentGame.discount_percent && (
                    <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      -{currentGame.discount_percent}% OFF
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
                  {currentGame.title}
                </h1>
                <p className="line-clamp-3 text-lg text-zinc-300 md:text-xl">
                  {currentGame.description}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">
                      ${currentGame.discount_price || currentGame.price}
                    </span>
                    {currentGame.discount_price && (
                      <span className="text-sm text-zinc-500 line-through">
                        ${currentGame.price}
                      </span>
                    )}
                  </div>
                  <Button size="lg" className="bg-blue-600 px-8 hover:bg-blue-700">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                  <Button size="lg" variant="outline" className="border-zinc-700 bg-white/5 backdrop-blur-md">
                    <Heart className="mr-2 h-5 w-5" />
                    Wishlist
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute bottom-10 right-10 flex gap-4">
        <Button
          size="icon"
          variant="outline"
          onClick={handlePrev}
          className="rounded-full bg-white/5 border-zinc-700 hover:bg-white/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleNext}
          className="rounded-full bg-white/5 border-zinc-700 hover:bg-white/10"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-8 bg-blue-600' : 'w-2 bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return <div className="h-[80vh] w-full animate-pulse bg-zinc-900" />;
}
