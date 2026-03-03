import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameCard, Game } from './game-card';

interface DealsSectionProps {
  games: Game[];
}

export function DealsSection({ games }: DealsSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container py-20 px-4 md:px-6">
      <div className="relative rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-1.5 text-sm font-bold uppercase tracking-wider">
                <Timer className="h-4 w-4" />
                Limited Time Deals
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                Massive Discounts, <span className="text-blue-500">Rush Now!</span>
              </h2>
              <p className="text-xl text-zinc-400">
                The biggest titles at the lowest prices. Don't miss out on these incredible offers before they're gone.
              </p>
            </div>

            <div className="flex gap-6">
              {[
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-2xl font-bold text-white border border-zinc-800">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <span className="mt-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-blue-600 px-10 py-7 text-lg hover:bg-blue-700">
              View All Deals
            </Button>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
            {games.slice(0, 2).map((game) => (
              <div key={game.id} className="relative transition-transform duration-500 hover:-translate-y-4">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
