import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { GameCard, Game } from '@/components/website/game-card';
import { StoreFilters } from '@/components/website/store-filters';
import { StoreSearch } from '@/components/website/store-search';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

interface StorePageProps {
  searchParams: Promise<{
    search?: string;
    categories?: string;
    maxPrice?: string;
    type?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*').order('name');
  return data || [];
}

async function getGames(params: Awaited<StorePageProps['searchParams']>) {
  const pageSize = 12;
  const currentPage = Number(params.page) || 1;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('games').select('*, game_categories!inner(categories!inner(slug))', { count: 'exact' });

  // Filtering
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`);
  }

  if (params.categories) {
    const categorySlugs = params.categories.split(',');
    query = query.in('game_categories.categories.slug', categorySlugs);
  }

  if (params.maxPrice) {
    const maxPrice = Number(params.maxPrice);
    if (maxPrice < 100) {
      query = query.lte('price', maxPrice);
    }
  }

  if (params.type === 'online') {
    query = query.eq('is_multiplayer', true);
  } else if (params.type === 'offline') {
    query = query.eq('is_offline', true);
  }

  if (params.rating) {
    query = query.gte('rating', Number(params.rating));
  }

  // Sorting
  switch (params.sort) {
    case 'popular':
      query = query.order('rating', { ascending: false });
      break;
    case 'price-low':
      query = query.order('price', { ascending: true });
      break;
    case 'price-high':
      query = query.order('price', { ascending: false });
      break;
    case 'discount':
      query = query.order('discount_percent', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('release_date', { ascending: false });
      break;
  }

  const { data, count, error } = await query.range(from, to);
  
  if (error) {
    console.error('Error fetching games:', error);
    return { data: [], count: 0 };
  }

  return { data: data as Game[], count: count || 0 };
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams;
  const categories = await getCategories();
  const { data: games, count } = await getGames(params);

  const totalPages = Math.ceil(count / 12);
  const currentPage = Number(params.page) || 1;

  const createPageUrl = (pageNumber: number) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    searchParams.set('page', pageNumber.toString());
    return `/store?${searchParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 lg:w-72">
            <Suspense fallback={<Skeleton className="h-[600px] w-full bg-zinc-900" />}>
              <StoreFilters categories={categories} />
            </Suspense>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md flex-1">
                <StoreSearch />
              </div>
              <p className="text-sm text-zinc-400">
                Showing <span className="font-bold text-white">{games.length}</span> of <span className="font-bold text-white">{count}</span> games
              </p>
            </div>

            {games.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                <p className="text-xl font-bold text-white">No games found</p>
                <p className="mt-2 text-zinc-400">Try adjusting your filters or search terms</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'} 
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href={createPageUrl(page)} 
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'} 
                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
