"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  Package, 
  Star,
  Info,
  Sparkles
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  supplier?: string;
  unitOfMeasure?: string;
  printingStation?: 'cocina' | 'barra' | 'ambas';
  allowPriceChange?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  recommendations?: string[];
}

export default function ProductList({ 
  products, 
  onAddToCart, 
  onProductClick,
  recommendations = []
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isRecommended = (productName: string) => {
    return recommendations.some(rec => 
      rec.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(rec.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Productos</h2>
          <Badge variant="secondary" className="text-xs">
            {filteredProducts.length}
          </Badge>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-medium text-amber-800">
                Recomendaciones IA
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {recommendations.map((rec, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-amber-100 text-amber-800 h-5">
                  {rec}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products List */}
      <ScrollArea className="flex-1">
        {filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "No se encontraron productos" : "No hay productos"}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredProducts.map((product) => {
              const recommended = isRecommended(product.name);
              const isLowStock = product.stock <= 5;
              const isOutOfStock = product.stock === 0;
              
              return (
                <div
                  key={product.id}
                  className={`group bg-card border rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer ${
                    recommended ? 'ring-1 ring-amber-200 bg-amber-50/50' : 'hover:border-primary/20'
                  } ${isOutOfStock ? 'opacity-60' : ''}`}
                  onClick={() => onProductClick?.(product)}
                >
                  {/* Recommended Badge */}
                  {recommended && (
                    <div className="absolute -top-1 -right-1">
                      <Badge className="bg-amber-500 text-white h-5 text-xs">
                        <Star className="h-2 w-2 mr-1" />
                        IA
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm leading-tight truncate">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {product.description}
                        </p>
                      )}
                      
                      {/* Product Details Row */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-primary">
                          ${product.salePrice.toFixed(2)}
                        </span>
                        
                        {/* Stock Badge */}
                        <Badge 
                          variant="outline" 
                          className={`text-xs h-5 ${
                            isOutOfStock ? 'text-red-600 border-red-200' : 
                            isLowStock ? 'text-amber-600 border-amber-200' : 
                            'text-green-600 border-green-200'
                          }`}
                        >
                          {isOutOfStock ? 'Sin stock' : 
                           isLowStock ? `${product.stock} left` : 
                           `Stock: ${product.stock}`}
                        </Badge>

                        {/* Printing Station */}
                        {product.printingStation && (
                          <Badge variant="secondary" className="text-xs h-5">
                            {product.printingStation === 'cocina' ? '🍳' :
                             product.printingStation === 'barra' ? '🥤' : 
                             '🍳🥤'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        disabled={isOutOfStock}
                        size="sm"
                        className={`h-8 px-3 text-xs ${
                          recommended 
                            ? 'bg-amber-500 hover:bg-amber-600' 
                            : ''
                        }`}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar
                      </Button>
                      
                      {onProductClick && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProductClick(product);
                          }}
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Warning Messages */}
                  {isOutOfStock && (
                    <div className="mt-2 p-1.5 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                      ❌ Producto agotado
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}