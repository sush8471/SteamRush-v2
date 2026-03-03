'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface StoreFiltersProps {
  categories: Category[];
}

export function StoreFilters({ categories }: StoreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categories')?.split(',').filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<number[]>([
    0, 
    Number(searchParams.get('maxPrice')) || 100
  ]);
  const [gameType, setGameType] = useState<string>(
    searchParams.get('type') || 'both'
  );
  const [minRating, setMinRating] = useState<string>(
    searchParams.get('rating') || '0'
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sort') || 'newest'
  );

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const updateFilters = () => {
    const query = createQueryString({
      categories: selectedCategories.length > 0 ? selectedCategories.join(',') : null,
      maxPrice: priceRange[1] < 100 ? priceRange[1].toString() : null,
      type: gameType !== 'both' ? gameType : null,
      rating: minRating !== '0' ? minRating : null,
      sort: sortBy !== 'newest' ? sortBy : null,
      page: '1', // Reset to page 1 on filter change
    });
    router.push(`/store?${query}`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setGameType('both');
    setMinRating('0');
    setSortBy('newest');
    router.push('/store');
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug) 
        : [...prev, slug]
    );
  };

  // Sync state with URL params when they change (e.g. back button)
  useEffect(() => {
    setSelectedCategories(searchParams.get('categories')?.split(',').filter(Boolean) || []);
    setPriceRange([0, Number(searchParams.get('maxPrice')) || 100]);
    setGameType(searchParams.get('type') || 'both');
    setMinRating(searchParams.get('rating') || '0');
    setSortBy(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 text-white sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Filters</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="h-8 px-2 text-zinc-400 hover:text-white"
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort By */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Sort By</Label>
          <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setTimeout(updateFilters, 0); }}>
            <SelectTrigger className="border-zinc-800 bg-zinc-950 text-white">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-950 text-white">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="discount">Highest Discount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Categories</Label>
          <div className="grid gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={category.slug} 
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => { toggleCategory(category.slug); setTimeout(updateFilters, 0); }}
                  className="border-zinc-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor={category.slug}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Max Price</Label>
            <span className="text-sm font-bold text-blue-400">${priceRange[1] === 100 ? 'Any' : priceRange[1]}</span>
          </div>
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={5}
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={updateFilters}
            className="[&_[role=slider]]:bg-blue-600"
          />
        </div>

        <Separator className="bg-zinc-800" />

        {/* Game Type */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Game Type</Label>
          <RadioGroup value={gameType} onValueChange={(val) => { setGameType(val); setTimeout(updateFilters, 0); }}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="type-both" className="border-zinc-700 text-blue-600" />
              <Label htmlFor="type-both" className="cursor-pointer">Both</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="type-online" className="border-zinc-700 text-blue-600" />
              <Label htmlFor="type-online" className="cursor-pointer">Online Multiplayer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="type-offline" className="border-zinc-700 text-blue-600" />
              <Label htmlFor="type-offline" className="cursor-pointer">Offline</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Min Rating</Label>
          <Select value={minRating} onValueChange={(val) => { setMinRating(val); setTimeout(updateFilters, 0); }}>
            <SelectTrigger className="border-zinc-800 bg-zinc-950 text-white">
              <SelectValue placeholder="Select rating..." />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-950 text-white">
              <SelectItem value="0">Any Rating</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
