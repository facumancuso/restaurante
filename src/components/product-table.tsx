
"use client";

import type { Product } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const getProfitMargin = (salePrice: number, costPrice: number) => {
  if (salePrice <= 0) return 0;
  const margin = ((salePrice - costPrice) / salePrice) * 100;
  return margin.toFixed(1);
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">P. Costo</TableHead>
            <TableHead className="text-right">P. Venta</TableHead>
            <TableHead className="text-right">Margen</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.category?.name ?? 'Sin categoría'}</Badge>
              </TableCell>
              <TableCell>{product.stock} {product.unitOfMeasure}</TableCell>
              <TableCell className="text-right">${product.costPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">${product.salePrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">{getProfitMargin(product.salePrice, product.costPrice)}%</TableCell>
              <TableCell>{product.supplier}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(product)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={() => onDelete(product)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
