
'use client';

import type { Order, KitchenStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (orderId: string, status: KitchenStatus) => void;
}

const getNextStatus = (currentStatus: KitchenStatus): { status: KitchenStatus; text: string } | null => {
    switch (currentStatus) {
        case 'pending': return { status: 'in-progress', text: "Mover a Preparación" };
        case 'in-progress': return { status: 'ready', text: "Marcar como Listo" };
        case 'ready': return { status: 'completed', text: "Marcar como Entregado" };
        default: return null;
    }
}

const getPreviousStatus = (currentStatus: KitchenStatus): { status: KitchenStatus; text: string } | null => {
    switch (currentStatus) {
        case 'in-progress': return { status: 'pending', text: "Atrás a Pendiente" };
        case 'ready': return { status: 'in-progress', text: "Atrás a Preparación" };
        case 'completed': return { status: 'ready', text: "Atrás a Listo" };
        default: return null;
    }
}


export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
    const next = getNextStatus(order.kitchenStatus);
    const prev = getPreviousStatus(order.kitchenStatus);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Pedido para {order.tableNumber}</CardTitle>
                <CardDescription>
                    Recibido hace {formatDistanceToNow(new Date(order.createdAt), { locale: es })}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="text-sm space-y-2 max-h-40 overflow-y-auto pr-2">
                    {order.items.map(item => (
                        <li key={item.id}>
                            <div className="flex justify-between">
                                <span className="truncate pr-2">{item.quantity}x {item.name}</span>
                            </div>
                            {item.notes && (
                                <p className="text-xs text-muted-foreground italic pl-3">- {item.notes}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                {prev && (
                    <Button variant="outline" onClick={() => onUpdateStatus(order.id, prev.status)} className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {prev.text}
                    </Button>
                )}
                {next && (
                    <Button onClick={() => onUpdateStatus(order.id, next.status)} className="w-full">
                        {next.text}
                        <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
