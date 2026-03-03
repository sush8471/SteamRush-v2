'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function StoreSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') || '');
  const debouncedValue = useDebounce(value, 500);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set('page', '1'); // Reset to page 1 on search
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    // Only update if the value has changed from the current search param
    if (debouncedValue !== (searchParams.get('search') || '')) {
      router.push(`/store?${createQueryString('search', debouncedValue)}`);
    }
  }, [debouncedValue, router, createQueryString, searchParams]);

  const clearSearch = () => {
    setValue('');
    router.push(`/store?${createQueryString('search', '')}`);
  };

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <Input
        type="text"
        placeholder="Search for games..."
        className="h-11 w-full border-zinc-800 bg-zinc-900/50 pl-10 pr-10 text-white placeholder:text-zinc-500 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
