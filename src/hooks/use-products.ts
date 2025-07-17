
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { getProducts, addProduct as addProductAction, updateProduct as updateProductAction, deleteProduct as deleteProductAction, bulkUpdatePrices as bulkUpdatePricesAction } from '@/app/admin/actions';
import { useToast } from './use-toast';

type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>;

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { toast } = useToast();

    const fetchProducts = useCallback(async () => {
        try {
            const dbProducts = await getProducts();
            setProducts(dbProducts);
        } catch (error) {
            console.error("Failed to fetch products from database", error);
            toast({ title: "Error de Carga", description: "No se pudieron cargar los productos.", variant: "destructive" });
        } finally {
            setIsLoaded(true);
        }
    }, [toast]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const addProduct = useCallback(async (productData: ProductFormData) => {
        try {
            const result = await addProductAction(productData);
            if (result.success) {
                toast({ title: "Éxito", description: "Producto creado correctamente." });
                await fetchProducts();
            } else {
                toast({ title: "Error al Crear", description: result.error || "La operación falló.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Error calling addProductAction:", error);
            const errorMessage = (error instanceof Error) ? error.message : "Ocurrió un error inesperado.";
            toast({ title: "Error de Comunicación", description: errorMessage, variant: "destructive" });
        }
    }, [fetchProducts, toast]);
    
    const updateProduct = useCallback(async (productData: Product) => {
       try {
           const result = await updateProductAction(productData);
           if (result.success) {
                toast({ title: "Éxito", description: "Producto actualizado correctamente." });
                await fetchProducts();
           } else {
                toast({ title: "Error al Actualizar", description: result.error || "La operación falló.", variant: "destructive" });
           }
       } catch (error) {
            console.error("Error calling updateProductAction:", error);
            const errorMessage = (error instanceof Error) ? error.message : "Ocurrió un error inesperado.";
            toast({ title: "Error de Comunicación", description: errorMessage, variant: "destructive" });
       }
    }, [fetchProducts, toast]);

    const deleteProduct = useCallback(async (productId: string) => {
        try {
            const result = await deleteProductAction(productId);
            if (result.success) {
                toast({ title: "Éxito", description: "Producto eliminado correctamente." });
                await fetchProducts();
            } else {
                toast({ title: "Error al Eliminar", description: result.error || "La operación falló.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Error calling deleteProductAction:", error);
            const errorMessage = (error instanceof Error) ? error.message : "Ocurrió un error inesperado.";
            toast({ title: "Error de Comunicación", description: errorMessage, variant: "destructive" });
        }
    }, [fetchProducts, toast]);

    const bulkUpdatePrices = useCallback(async (type: 'percentage' | 'fixed', value: number, supplier: string) => {
        try {
            const result = await bulkUpdatePricesAction(type, value, supplier);
            if (result.success) {
                toast({ title: "Éxito", description: "Precios actualizados en masa." });
                await fetchProducts();
            } else {
                toast({ title: "Error al Actualizar Precios", description: result.error || "La operación falló.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Error calling bulkUpdatePricesAction:", error);
            const errorMessage = (error instanceof Error) ? error.message : "Ocurrió un error inesperado.";
            toast({ title: "Error de Comunicación", description: errorMessage, variant: "destructive" });
        }
    }, [fetchProducts, toast]);

    return { products, addProduct, updateProduct, deleteProduct, bulkUpdatePrices, isLoaded };
}
