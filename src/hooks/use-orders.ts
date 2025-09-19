
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order, KitchenStatus, OrderItem, PaymentStatus, Discount, Product } from '@/lib/types';
import { useTicketConfig } from './use-ticket-config';

const ORDERS_STORAGE_KEY = 'restaurantOrders_v2';

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [ticketConfig] = useTicketConfig();

    useEffect(() => {
        try {
            const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders));
            }
        } catch (error) {
            console.error("Failed to load orders from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const saveOrders = (updatedOrders: Order[]) => {
        try {
            setOrders(updatedOrders);
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
        } catch (error) {
            console.error("Failed to save orders to localStorage", error);
        }
    };

    const createOrder = useCallback((items: OrderItem[], tableNumber: string, employeeName: string): Order => {
        const now = Date.now();
        const newOrder: Order = {
            id: `order_${now}`,
            tableNumber,
            items,
            employeeName,
            paymentStatus: 'open',
            kitchenStatus: 'pending',
            createdAt: now,
        };
        
        saveOrders([...orders, newOrder]);
        return newOrder;
    }, [orders]);
    
    const updateOrderItems = useCallback((orderId: string, items: OrderItem[]): Order | undefined => {
       const orderToUpdate = orders.find(o => o.id === orderId);
       if (!orderToUpdate) return undefined;

       const updatedOrder = { ...orderToUpdate, items, kitchenStatus: 'pending' as KitchenStatus };
       
       const updatedOrders = orders.map(o => o.id === orderId ? updatedOrder : o);
       saveOrders(updatedOrders);
       return updatedOrder;
    }, [orders]);


    const payOrder = useCallback((orderId: string, discount: Discount): Order | undefined => {
       const orderToPay = orders.find(o => o.id === orderId);
       if (!orderToPay) return undefined;
       
       const subtotal = orderToPay.items.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
       const discountAmount = discount.type === 'fixed'
           ? discount.value
           : subtotal * (discount.value / 100);

       const totalAfterDiscount = subtotal - discountAmount;
       const total = totalAfterDiscount > 0 ? totalAfterDiscount : 0;
       
       const now = Date.now();

       const paidOrder: Order = {
           ...orderToPay,
           paymentStatus: 'paid',
           kitchenStatus: 'pending',
           paidAt: now,
           invoiceNumber: `INV-${now}`,
           discountAmount,
           subtotal,
           total
       };

       const updatedOrders = orders.map(o => o.id === orderId ? paidOrder : o);
       saveOrders(updatedOrders);
       return paidOrder;

    }, [orders]);


    const updateKitchenStatus = useCallback((orderId: string, status: KitchenStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, kitchenStatus: status } : order
        );
        saveOrders(updatedOrders);
    }, [orders]);

    const getOrder = useCallback((orderId: string): Order | undefined => {
        return orders.find(order => order.id === orderId);
    }, [orders]);
    
    const clearCompletedOrders = useCallback(() => {
        const updatedOrders = orders.map(o => 
            o.kitchenStatus === 'completed' && !o.isArchived ? { ...o, isArchived: true } : o
        );
        saveOrders(updatedOrders);
    }, [orders]);

    const restoreOrder = useCallback((orderId: string) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, isArchived: false, kitchenStatus: 'completed' as KitchenStatus } : order
        );
        saveOrders(updatedOrders);
    }, [orders]);

    return { orders, createOrder, updateOrderItems, payOrder, updateKitchenStatus, getOrder, clearCompletedOrders, restoreOrder, isLoaded };
}
