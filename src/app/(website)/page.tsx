'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HeroSection, HeroSkeleton } from '@/components/website/hero-section';
import { GameRow } from '@/components/website/game-row';
import { CategoriesSection, Category } from '@/components/website/categories-section';
import { DealsSection } from '@/components/website/deals-section';
import { Game } from '@/components/website/game-card';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch all games
        const { data: gamesData, error: gamesError } = await supabase
          .from('games')
          .select('*')
          .order('created_at', { ascending: false });

        if (gamesError) throw gamesError;

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) throw categoriesError;

        setGames(gamesData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const featuredGames = games.filter(g => g.is_featured);
  const recentlyAdded = games.filter(g => g.is_new).slice(0, 8);
  const upcomingGames = games.filter(g => g.is_upcoming).slice(0, 8);
  const multiplayerGames = games.filter(g => g.is_multiplayer).slice(0, 8);
  const offlineGames = games.filter(g => g.is_offline && !g.is_multiplayer).slice(0, 8);
  const dealGames = games.filter(g => g.discount_percent && g.discount_percent >= 40).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <HeroSkeleton />
        <div className="container space-y-12 py-12 px-4 md:px-6">
          <div className="h-64 w-full animate-pulse rounded-3xl bg-zinc-900" />
          <div className="h-64 w-full animate-pulse rounded-3xl bg-zinc-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION */}
      <HeroSection games={featuredGames.length > 0 ? featuredGames : games.slice(0, 3)} />

        <main className="space-y-8 pb-20">
          {/* 2. RECENTLY ADDED GAMES */}
          <GameRow title="Recently Added" games={recentlyAdded} href="/store?sort=newest" />

          {/* 6. DEALS & DISCOUNTS SECTION */}
          <DealsSection games={dealGames} />

          {/* 3. UPCOMING GAMES */}
          <GameRow title="Upcoming Games" games={upcomingGames} href="/store?type=upcoming" />

          {/* 7. CATEGORIES SECTION */}
          <CategoriesSection categories={categories} />

          {/* 4. ONLINE MULTIPLAYER GAMES */}
          <GameRow title="Online Multiplayer" games={multiplayerGames} href="/store?type=online" />

          {/* 5. OFFLINE GAMES */}
          <GameRow title="Offline Games" games={offlineGames} href="/store?type=offline" />
        </main>


      {/* Footer-like Branding */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="container px-4 text-center md:px-6">
          <h2 className="text-2xl font-black tracking-tighter text-white italic">
            STEAM<span className="text-blue-600">RUSH</span>
          </h2>
          <p className="mt-4 text-sm text-zinc-500">
            © 2026 Steam Rush. All rights reserved. Built for gamers, by gamers.
          </p>
        </div>
      </footer>
    </div>
  );
}
