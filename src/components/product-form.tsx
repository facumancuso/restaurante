
"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Product, Category } from "@/lib/types";
import { UnitOfMeasure, PrintingStation } from "@prisma/client";

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Debes seleccionar una categoría."),
  costPrice: z.coerce.number().min(0, "El precio de costo no puede ser negativo."),
  salePrice: z.coerce.number().min(0, "El precio de venta no puede ser negativo."),
  stock: z.coerce.number().int("El stock debe ser un número entero.").min(0, "El stock no puede ser negativo."),
  supplier: z.string().optional(),
  unitOfMeasure: z.nativeEnum(UnitOfMeasure),
  printingStation: z.nativeEnum(PrintingStation),
  allowPriceChange: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  productToEdit: Product | null;
  categories: Category[];
}


export default function ProductForm({ isOpen, onClose, onSave, productToEdit, categories }: ProductFormProps) {
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      costPrice: 0,
      salePrice: 0,
      stock: 0,
      supplier: "",
      unitOfMeasure: "unidad",
      printingStation: "cocina",
      allowPriceChange: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        form.reset({
          ...productToEdit,
          costPrice: Number(productToEdit.costPrice),
          salePrice: Number(productToEdit.salePrice),
          description: productToEdit.description ?? "",
          supplier: productToEdit.supplier ?? "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
          categoryId: "",
          costPrice: 0,
          salePrice: 0,
          stock: 0,
          supplier: "",
          unitOfMeasure: "unidad",
          printingStation: "cocina",
          allowPriceChange: false,
        });
      }
    }
  }, [productToEdit, form, isOpen]);

  const onSubmit = (values: ProductFormData) => {
    onSave(values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] no-print">
        <DialogHeader>
          <DialogTitle>{productToEdit ? "Editar Producto" : "Añadir Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {productToEdit ? "Modifica los detalles del producto." : "Completa el formulario para añadir un nuevo producto."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl><Input placeholder="Ej: Pizza Margherita" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl><Textarea placeholder="Describe el producto..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Costo</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Venta</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="unitOfMeasure"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unidad de Medida</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="unidad">Unidad</SelectItem>
                                    <SelectItem value="kg">Kilogramo (kg)</SelectItem>
                                    <SelectItem value="litro">Litro (l)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl><Input placeholder="Ej: Proveedor Local" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="printingStation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estación de Impresión</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="cocina">Cocina</SelectItem>
                                    <SelectItem value="barra">Barra</SelectItem>
                                    <SelectItem value="ninguna">Ninguna</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="allowPriceChange"
                    render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                            <FormLabel className="mb-2">Permitir Cambio de Precio</FormLabel>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar Producto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
