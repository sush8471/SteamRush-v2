import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { GameCard, Game } from '@/components/website/game-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  ExternalLink, 
  Calendar, 
  Users, 
  Monitor, 
  Gamepad2, 
  ChevronRight,
  Star
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getGameDetail(id: string) {
  const { data, error } = await supabase
    .from('games')
    .select('*, game_categories(categories(name, slug))')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

async function getRelatedGames(gameId: string, categoryIds: string[]) {
  if (categoryIds.length === 0) return [];
  
  const { data } = await supabase
    .from('games')
    .select('*, game_categories!inner(category_id)')
    .in('game_categories.category_id', categoryIds)
    .neq('id', gameId)
    .limit(4);
    
  return data || [];
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = await params;
  const game = await getGameDetail(id);

  if (!game) {
    notFound();
  }

  const categoryIds = game.game_categories?.map((gc: any) => gc.category_id) || [];
  const relatedGames = await getRelatedGames(id, categoryIds);
  const hasDiscount = game.discount_price !== null && game.discount_price < game.price;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Banner Section */}
      <div className="relative h-[50vh] w-full overflow-hidden sm:h-[60vh] lg:h-[70vh]">
        <Image
          src={game.banner_url || game.poster_url}
          alt={game.title}
          fill
          className="object-cover opacity-40 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-end">
              {/* Poster on top of banner */}
              <div className="relative hidden aspect-[3/4] w-64 overflow-hidden rounded-xl shadow-2xl md:block">
                <Image
                  src={game.poster_url}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Title and Info */}
              <div className="flex-1 space-y-4">
                <nav className="flex items-center space-x-2 text-sm text-zinc-400">
                  <Link href="/store" className="hover:text-blue-400">Store</Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-zinc-200">{game.title}</span>
                </nav>
                
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  {game.title}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {game.game_categories?.map((gc: any) => (
                    <Badge key={gc.categories.slug} variant="secondary" className="bg-white/10 backdrop-blur-md">
                      {gc.categories.name}
                    </Badge>
                  ))}
                  {game.rating && (
                    <Badge className="bg-amber-500 text-black font-bold">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      {Number(game.rating).toFixed(1)}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>{new Date(game.release_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-blue-400" />
                    <span>{game.developer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-blue-400" />
                    <span>{game.platforms?.join(', ') || 'PC'}</span>
                  </div>
                </div>
              </div>

              {/* Action Sidebar on Mobile, integrated on Desktop */}
              <Card className="w-full border-zinc-800 bg-zinc-900/80 backdrop-blur-md md:w-80">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      {hasDiscount ? (
                        <>
                          <span className="text-sm text-zinc-400 line-through">${Number(game.price).toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-white">${Number(game.discount_price).toFixed(2)}</span>
                            <Badge variant="destructive">-{game.discount_percent}%</Badge>
                          </div>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-white">${Number(game.price).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button className="w-full bg-blue-600 font-bold hover:bg-blue-700">
                      Buy Now
                    </Button>
                    <Button variant="outline" className="w-full border-zinc-700 bg-transparent hover:bg-white/5">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>

                  <Separator className="my-6 bg-zinc-800" />

                  <div className="space-y-4 text-sm text-zinc-400">
                    <div className="flex justify-between">
                      <span>Publisher</span>
                      <span className="text-zinc-200">{game.publisher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Developer</span>
                      <span className="text-zinc-200">{game.developer}</span>
                    </div>
                    {game.steam_url && (
                      <Link 
                        href={game.steam_url} 
                        target="_blank"
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-800 py-2 text-white hover:bg-zinc-700 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Steam Page
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-12">
            {/* Screenshots Gallery */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-zinc-500">Screenshots</h2>
              <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <div className="flex w-max space-x-4">
                  {game.screenshots?.map((url: string, index: number) => (
                    <div key={index} className="relative aspect-video w-[300px] overflow-hidden rounded-lg sm:w-[500px]">
                      <Image
                        src={url}
                        alt={`${game.title} Screenshot ${index + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                  {!game.screenshots?.length && (
                    <div className="relative aspect-video w-[500px] overflow-hidden rounded-lg bg-zinc-800 flex items-center justify-center">
                       <Monitor className="h-12 w-12 text-zinc-700" />
                    </div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </section>

            {/* Description and Requirements */}
            <section className="space-y-8">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 border-zinc-800 bg-zinc-900">
                  <TabsTrigger value="description" className="data-[state=active]:bg-zinc-800">Description</TabsTrigger>
                  <TabsTrigger value="requirements" className="data-[state=active]:bg-zinc-800">System Requirements</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <div className="prose prose-invert max-w-none text-zinc-300">
                    <p className="text-lg leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="requirements" className="mt-6">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-blue-400">Minimum</h3>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        {game.system_requirements_min && Object.entries(game.system_requirements_min).map(([key, value]) => (
                          <li key={key} className="flex flex-col">
                            <span className="font-semibold uppercase text-zinc-500 text-xs">{key}</span>
                            <span className="text-zinc-200">{String(value)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-green-400">Recommended</h3>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        {game.system_requirements_rec && Object.entries(game.system_requirements_rec).map(([key, value]) => (
                          <li key={key} className="flex flex-col">
                            <span className="font-semibold uppercase text-zinc-500 text-xs">{key}</span>
                            <span className="text-zinc-200">{String(value)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            {/* Game Details Grid */}
            <section className="grid grid-cols-2 gap-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 sm:grid-cols-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-zinc-500">Genre</span>
                <p className="font-medium">{game.game_categories?.map((gc: any) => gc.categories.name).join(', ') || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-zinc-500">Modes</span>
                <p className="font-medium">{game.is_multiplayer ? 'Multi-player' : ''}{game.is_multiplayer && game.is_offline ? ', ' : ''}{game.is_offline ? 'Single-player' : ''}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-zinc-500">Platforms</span>
                <p className="font-medium">{game.platforms?.join(', ') || 'PC'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-zinc-500">Release Date</span>
                <p className="font-medium">{new Date(game.release_date).toLocaleDateString()}</p>
              </div>
            </section>
          </div>

          {/* Related Games Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-500">Related Games</h2>
            <div className="flex flex-col gap-6">
              {relatedGames.map((relatedGame) => (
                <Link key={relatedGame.id} href={`/store/${relatedGame.id}`} className="group flex gap-4 overflow-hidden rounded-lg bg-zinc-900/50 transition-colors hover:bg-zinc-900">
                  <div className="relative aspect-[3/4] w-20 flex-shrink-0">
                    <Image
                      src={relatedGame.poster_url}
                      alt={relatedGame.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-2 pr-4">
                    <h3 className="font-bold text-zinc-200 group-hover:text-blue-400 line-clamp-1">{relatedGame.title}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-green-500">
                        ${Number(relatedGame.discount_price || relatedGame.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {relatedGames.length === 0 && (
                <p className="text-sm text-zinc-500 italic">No related games found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
