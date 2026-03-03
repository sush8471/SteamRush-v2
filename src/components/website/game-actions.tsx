"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface GameActionsProps {
  game: {
    id: string;
    title: string;
    price: number;
    discount_price: number | null;
    poster_url: string;
  };
}

export function GameActions({ game }: GameActionsProps) {
  const { addToCart, items } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-3">
        <Button className="w-full bg-cyan-600 font-bold hover:bg-cyan-700">
          Buy Now
        </Button>
        <Button variant="outline" className="w-full border-zinc-700 bg-transparent hover:bg-white/5">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    );
  }

  const isInCart = items.some((item) => item.id === game.id);

  const handleAddToCart = () => {
    if (isInCart) {
      toast.info("Already in cart", {
        description: `${game.title} is already in your shopping cart.`,
      });
      return;
    }

    addToCart({
      id: game.id,
      name: game.title,
      price: game.price,
      discount_price: game.discount_price,
      image_url: game.poster_url,
    });

    toast.success("Added to cart", {
      description: `${game.title} has been added to your shopping cart.`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  const handleBuyNow = () => {
    if (!isInCart) {
      addToCart({
        id: game.id,
        name: game.title,
        price: game.price,
        discount_price: game.discount_price,
        image_url: game.poster_url,
      });
    }
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        className="w-full bg-cyan-600 font-bold hover:bg-cyan-700 text-white"
        onClick={handleBuyNow}
      >
        Buy Now
      </Button>
      <Button
        variant={isInCart ? "default" : "outline"}
        className={`w-full ${
          isInCart
            ? "bg-green-600 hover:bg-green-700 text-white border-none"
            : "border-zinc-700 bg-transparent hover:bg-white/5 text-white"
        }`}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isInCart ? "In Cart" : "Add to Cart"}
      </Button>
    </div>
  );
}
