
'use server'

import prisma from '@/lib/db'
import type { Product, Category } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

type ActionResponse = {
  success: boolean;
  error?: string;
}

// Helper to convert Decimal to number for client-side usage
function mapProduct(product: any): Product {
  return {
    ...product,
    costPrice: product.costPrice ? product.costPrice.toNumber() : 0,
    salePrice: product.salePrice ? product.salePrice.toNumber() : 0,
  };
}

export async function getProducts(): Promise<Product[]> {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' },
            include: { category: true }
        });
        return products.map(mapProduct);
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getCategories(): Promise<Category[]> {
    try {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>): Promise<ActionResponse> {
    try {
        await prisma.product.create({
            data: {
              name: productData.name,
              description: productData.description,
              categoryId: productData.categoryId,
              costPrice: new Prisma.Decimal(productData.costPrice.toFixed(2)),
              salePrice: new Prisma.Decimal(productData.salePrice.toFixed(2)),
              stock: productData.stock,
              supplier: productData.supplier,
              unitOfMeasure: productData.unitOfMeasure,
              printingStation: productData.printingStation,
              allowPriceChange: productData.allowPriceChange,
            }
        });
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error in addProduct action:", error);
        const errorMessage = (error instanceof Error) ? error.message : "No se pudo crear el producto en la base de datos.";
        return { success: false, error: errorMessage };
    }
}

export async function updateProduct(productData: Product): Promise<ActionResponse> {
    try {
        await prisma.product.update({
            where: { id: productData.id },
            data: {
              name: productData.name,
              description: productData.description,
              categoryId: productData.categoryId,
              costPrice: new Prisma.Decimal(productData.costPrice.toFixed(2)),
              salePrice: new Prisma.Decimal(productData.salePrice.toFixed(2)),
              stock: productData.stock,
              supplier: productData.supplier,
              unitOfMeasure: productData.unitOfMeasure,
              printingStation: productData.printingStation,
              allowPriceChange: productData.allowPriceChange,
            }
        });
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error in updateProduct action:", error);
        const errorMessage = (error instanceof Error) ? error.message : "No se pudo actualizar el producto en la base de datos.";
        return { success: false, error: errorMessage };
    }
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
    try {
        await prisma.product.delete({
            where: { id: productId }
        });
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error in deleteProduct action:", error);
        const errorMessage = (error instanceof Error) ? error.message : "No se pudo eliminar el producto de la base de datos.";
        return { success: false, error: errorMessage };
    }
}

export async function bulkUpdatePrices(type: 'percentage' | 'fixed', value: number, supplier: string): Promise<ActionResponse> {
    try {
        const productsToUpdate = await prisma.product.findMany({
            where: supplier === 'all' ? {} : { supplier: supplier }
        });

        for (const product of productsToUpdate) {
            const currentSalePrice = product.salePrice.toNumber();
            const newSalePrice = type === 'percentage'
                ? currentSalePrice * (1 + value / 100)
                : currentSalePrice + value;

            await prisma.product.update({
                where: { id: product.id },
                data: { salePrice: new Prisma.Decimal(newSalePrice.toFixed(2)) }
            });
        }
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error in bulkUpdatePrices action:", error);
        const errorMessage = (error instanceof Error) ? error.message : "No se pudieron actualizar los precios en masa.";
        return { success: false, error: errorMessage };
    }
}
