import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price: number | null;
  discount_percent: number | null;
  poster_url: string;
  banner_url: string;
  release_date: string;
  is_multiplayer: boolean;
  is_offline: boolean;
  is_featured: boolean;
  is_upcoming: boolean;
  is_new: boolean;
  rating: number | null;
}

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const hasDiscount = game.discount_price !== null && game.discount_price < game.price;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative"
    >
      <Card className="overflow-hidden border-none bg-zinc-900 shadow-xl transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        <CardContent className="p-0">
          {/* Poster Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={game.poster_url}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {hasDiscount && (
                <Badge variant="destructive" className="font-bold">
                  -{game.discount_percent}%
                </Badge>
              )}
              {game.is_new && (
                <Badge className="bg-blue-600 hover:bg-blue-700">NEW</Badge>
              )}
              {game.is_upcoming && (
                <Badge className="bg-amber-600 hover:bg-amber-700 font-bold uppercase">Coming Soon</Badge>
              )}
              {game.is_multiplayer && (
                <Badge variant="secondary" className="bg-zinc-800/80 backdrop-blur-md">Multiplayer</Badge>
              )}
              {game.is_offline && !game.is_multiplayer && (
                <Badge variant="secondary" className="bg-zinc-800/80 backdrop-blur-md">Offline</Badge>
              )}
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button size="icon" variant="secondary" className="rounded-full">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Link href={`/games/${game.id}`}>
                <Button size="icon" variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/20">
                  <Eye className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {game.title}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-col">
                {game.is_upcoming ? (
                  <span className="text-sm font-medium text-zinc-400">
                    {game.release_date ? new Date(game.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-sm text-zinc-500 line-through">${Number(game.price).toFixed(2)}</span>
                        <span className="text-lg font-bold text-green-500">${Number(game.discount_price).toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-white">${Number(game.price).toFixed(2)}</span>
                    )}
                  </div>
                )}
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-zinc-800" />
  );
}
