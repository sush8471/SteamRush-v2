import { Sword, BookOpen, Map, Trophy, Target, Cpu, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const icons: Record<string, any> = {
  Sword: Sword,
  BookOpen: BookOpen,
  Map: Map,
  Trophy: Trophy,
  Target: Target,
  Cpu: Cpu,
};

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  game_count?: number;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="container space-y-10 py-16 px-4 md:px-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
          Browse by <span className="text-blue-600">Categories</span>
        </h2>
        <p className="text-lg text-zinc-400">Discover games from every genre and style.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
        {categories.map((category) => {
          const Icon = icons[category.icon] || Sword;
          return (
            <button
              key={category.id}
              className="group relative flex flex-col items-center gap-4 rounded-2xl bg-zinc-900/50 p-8 transition-all duration-300 hover:bg-zinc-800/80 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-zinc-800 hover:border-blue-600/50"
            >
              <div className="rounded-2xl bg-zinc-950 p-4 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                <Icon className="h-8 w-8 text-blue-500 transition-colors duration-500 group-hover:text-white" />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                  {category.name}
                </h3>
                <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-400">
                  {category.game_count || '200+'} Games
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
