"use client";

import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  isRecommended: boolean;
}

export default function ProductCard({ product, onAddToCart, onProductClick, isRecommended }: ProductCardProps) {
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Card
      onClick={() => onProductClick(product)}
      className={cn(
        "relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer min-h-[100px]",
        isRecommended && "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {isRecommended && (
        <Badge variant="default" className="absolute top-2 right-2 z-10 bg-primary/90 backdrop-blur-sm">
          <Wand2 className="mr-2 h-4 w-4" /> Recomendado
        </Badge>
      )}
      <CardContent className="flex-1 p-3">
        <CardTitle className="font-headline text-base mb-1 line-clamp-1">{product.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-2">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-3 pt-0 gap-x-2">
        <span className="text-base font-bold text-primary">${product.salePrice.toFixed(2)}</span>
        <Button onClick={handleAddToCartClick} variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Añadir al pedido</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
