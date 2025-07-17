
"use client";

import type { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ProductDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailDialog({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: ProductDetailDialogProps) {
  if (!product) return null;

  const handleAddToCartClick = () => {
    onAddToCart(product);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md no-print">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description || 'Sin descripción.'}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-3xl font-bold text-primary">${product.salePrice.toFixed(2)}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleAddToCartClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir al Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
