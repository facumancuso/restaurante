
'use client';

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductTable from "@/components/product-table";
import { useProducts } from "@/hooks/use-products";
import { PlusCircle, ArrowUp, DollarSign } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import ProductForm from "@/components/product-form";
import type { z } from "zod";
import type { productSchema } from "@/components/product-form";
import DeleteProductDialog from "@/components/delete-product-dialog";
import BulkPriceUpdateDialog from "@/components/bulk-price-update-dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketConfigForm from "@/components/ticket-config-form";
import { getCategories } from "./actions";

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, bulkUpdatePrices } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function loadCategories() {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    }
    loadCategories();
  }, []);

  const suppliers = useMemo(() => [...new Set(products.map(p => p.supplier).filter(Boolean) as string[])], [products]);

  const handleOpenForm = (product: Product | null) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setProductToEdit(null);
    setIsFormOpen(false);
  };

  const handleSaveProduct = async (values: ProductFormData) => {
    if (productToEdit) {
      await updateProduct({ ...productToEdit, ...values });
    } else {
      await addProduct(values);
    }
    handleCloseForm();
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setProductToDelete(product);
  };

  const handleCloseDeleteDialog = () => {
    setProductToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      handleCloseDeleteDialog();
    }
  };
  
  const handleBulkUpdate = (type: 'percentage' | 'fixed', value: number, supplier: string) => {
    if (isNaN(value) || value <= 0) {
      toast({ title: "Error", description: "Por favor, introduce un valor positivo válido.", variant: "destructive" });
      return;
    }
    bulkUpdatePrices(type, value, supplier);
    setIsBulkUpdateOpen(false);
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
              <h1 className="text-3xl font-bold">Administración</h1>
              <p className="text-muted-foreground">
                  Gestiona los productos y la configuración de la aplicación.
              </p>
          </div>
          <div className="flex gap-4">
               <Link href="/sales" passHref>
                  <Button variant="outline">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Ver Ventas
                  </Button>
              </Link>
              <Link href="/" passHref>
                  <Button variant="outline">Volver al TPV</Button>
              </Link>
          </div>
        </div>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Gestión de Productos</TabsTrigger>
            <TabsTrigger value="settings">Configuración de Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <div className="flex gap-2 mb-6">
              <Button onClick={() => handleOpenForm(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Producto
              </Button>
               <Button variant="secondary" onClick={() => setIsBulkUpdateOpen(true)}>
                 <ArrowUp className="mr-2 h-4 w-4" />
                 Aumento de Precios
               </Button>
            </div>
            <ProductTable products={products} onEdit={handleOpenForm} onDelete={handleOpenDeleteDialog} />
          </TabsContent>
          <TabsContent value="settings">
            <TicketConfigForm />
          </TabsContent>
        </Tabs>
      </div>

      <ProductForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
      />
      
      <DeleteProductDialog
        isOpen={!!productToDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name || ''}
      />

      <BulkPriceUpdateDialog
        isOpen={isBulkUpdateOpen}
        onClose={() => setIsBulkUpdateOpen(false)}
        onConfirm={handleBulkUpdate}
        suppliers={suppliers}
      />
    </>
  );
}
