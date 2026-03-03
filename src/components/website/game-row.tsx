import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameCard, GameCardSkeleton, Game } from './game-card';

interface GameRowProps {
  title: string;
  games: Game[];
  isLoading?: boolean;
  href?: string;
}

export function GameRow({ title, games, isLoading, href = '/store' }: GameRowProps) {
  return (
    <section className="container space-y-6 py-12 px-4 md:px-6 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
          {title}
        </h2>
        <Link href={href}>
          <Button variant="ghost" className="group text-zinc-400 hover:text-white">
            View All
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide md:gap-8 lg:gap-10">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[240px] flex-shrink-0 md:min-w-[280px]">
                  <GameCardSkeleton />
                </div>
              ))
            : games.map((game) => (
                <div key={game.id} className="min-w-[240px] flex-shrink-0 md:min-w-[280px]">
                  <GameCard game={game} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
