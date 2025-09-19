
'use client';

import { useOrders } from '@/hooks/use-orders';
import OrderCard from '@/components/order-card';
import type { KitchenStatus, Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trash2, Package, ArchiveRestore } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const statusColumns: { status: KitchenStatus; title: string }[] = [
    { status: 'pending', title: 'Pendientes' },
    { status: 'in-progress', title: 'En Preparación' },
    { status: 'ready', title: 'Listos para Servir' },
    { status: 'completed', title: 'Entregados' },
];

export default function OrdersPage() {
    const { orders, updateKitchenStatus, clearCompletedOrders, restoreOrder, isLoaded } = useOrders();
    const { toast } = useToast();

    const handleClearCompleted = () => {
        clearCompletedOrders();
        toast({ title: 'Pedidos archivados', description: 'Los pedidos completados han sido movidos al archivo.' });
    };

    const handleRestoreOrder = (orderId: string) => {
        restoreOrder(orderId);
        toast({ title: 'Pedido Restaurado', description: 'El pedido ha vuelto a la lista de "Entregados".' });
    }

    const activeOrders = orders.filter(o => !o.isArchived);
    const archivedOrders = orders.filter(o => o.isArchived);

    const renderSkeleton = () => (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-4">
            {statusColumns.map(({ status }) => (
                 <div key={status} className="flex flex-col rounded-lg bg-card shadow-sm">
                     <div className="p-4 border-b">
                        <Skeleton className="h-7 w-3/5" />
                    </div>
                     <div className="flex-1 space-y-4 p-4">
                        <div className="space-y-4">
                            <Skeleton className="h-28 w-full" />
                            <Skeleton className="h-28 w-full" />
                        </div>
                    </div>
                 </div>
            ))}
        </div>
    );

    const renderActiveOrders = () => (
         <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statusColumns.map(({ status, title }) => (
                <div key={status} className="flex flex-col rounded-lg bg-card shadow-sm h-full">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold">{title}</h2>
                    </div>
                    <div className="flex-1 space-y-4 p-4 overflow-y-auto bg-muted/20">
                        {activeOrders
                            .filter(order => order.kitchenStatus === status)
                            .sort((a, b) => a.createdAt - b.createdAt)
                            .map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onUpdateStatus={updateKitchenStatus}
                                />
                            ))
                        }
                        {activeOrders.filter(order => order.kitchenStatus === status).length === 0 && (
                            <p className="text-sm text-center text-muted-foreground pt-4">No hay pedidos en este estado.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderArchivedOrders = () => (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mesa/ID</TableHead>
                        <TableHead>Fecha de Pago</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[150px] text-right">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {archivedOrders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">No hay pedidos archivados.</TableCell>
                        </TableRow>
                    )}
                    {archivedOrders.sort((a, b) => (b.paidAt ?? 0) - (a.paidAt ?? 0)).map((order: Order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.tableNumber}</TableCell>
                            <TableCell>{order.paidAt ? format(new Date(order.paidAt), 'Pp', { locale: es }) : 'N/A'}</TableCell>
                            <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                            <TableCell className="text-right font-semibold">${order.total?.toFixed(2) ?? '0.00'}</TableCell>
                             <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleRestoreOrder(order.id)}>
                                    <ArchiveRestore className="mr-2 h-4 w-4" />
                                    Restaurar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="flex h-screen flex-col bg-muted/40">
            <header className="flex h-20 shrink-0 items-center justify-between border-b bg-background px-4 md:px-8">
                <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Cocina</h1>
                </div>
                <div className="flex items-center gap-4">
                     <Button variant="outline" onClick={handleClearCompleted} disabled={!activeOrders.some(o => o.kitchenStatus === 'completed')}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Archivar Entregados
                    </Button>
                    <Link href="/" passHref>
                        <Button>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al TPV
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-x-auto p-4">
                <Tabs defaultValue="active">
                    <TabsList className="mb-6">
                        <TabsTrigger value="active">Pedidos Activos</TabsTrigger>
                        <TabsTrigger value="archived">Pedidos Archivados</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                        {!isLoaded ? renderSkeleton() : renderActiveOrders()}
                    </TabsContent>
                    <TabsContent value="archived">
                        {!isLoaded ? <div className="text-center p-8">Cargando pedidos archivados...</div> : renderArchivedOrders()}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
