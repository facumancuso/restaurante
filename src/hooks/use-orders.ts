'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order, KitchenStatus, OrderItem, PaymentStatus, Discount, Product } from '@/lib/types';
import { useTicketConfig } from './use-ticket-config';

const ORDERS_STORAGE_KEY = 'restaurantOrders_v2';

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [ticketConfig] = useTicketConfig(); // Si usas ticketConfig, asegúrate de que useTicketConfig devuelva un array [config, setConfig] o solo el config

    useEffect(() => {
        try {
            const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
            if (savedOrders) {
                // Asegúrate de parsear correctamente y establecer los estados predeterminados
                const parsedOrders: Order[] = JSON.parse(savedOrders);
                setOrders(parsedOrders.map(order => ({
                    ...order,
                    kitchenStatus: order.kitchenStatus || 'pending', // Asegura un valor por defecto
                    paymentStatus: order.paymentStatus || 'open', // Asegura un valor por defecto
                    // Si createdAt está como number, asegúrate de que sea un Date si lo usas como tal en algún lado, pero en tu interfaz Order está como number
                })));
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
            paymentStatus: 'open' as PaymentStatus, // Casting explícito si es necesario
            kitchenStatus: 'pending' as KitchenStatus, // Casting explícito si es necesario
            createdAt: now,
            updatedAt: now, // Asegurar que updatedAt esté inicializado
            isArchived: false, // Valor por defecto
        };
        
        saveOrders([...orders, newOrder]);
        return newOrder;
    }, [orders]);
    
    const updateOrderItems = useCallback((orderId: string, items: OrderItem[]): Order | undefined => {
       const orderToUpdate = orders.find(o => o.id === orderId);
       if (!orderToUpdate) return undefined;

       // Si se actualizan ítems, el estado de cocina puede volver a 'pending'
       const updatedOrder = { 
           ...orderToUpdate, 
           items, 
           kitchenStatus: 'pending' as KitchenStatus, 
           updatedAt: Date.now() 
       };
       
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
           paymentStatus: 'paid' as PaymentStatus, // Asegura el tipo correcto
           kitchenStatus: 'completed' as KitchenStatus, // Asegura el tipo correcto
           paidAt: now,
           invoiceNumber: `INV-${now}`,
           discountAmount,
           subtotal,
           total,
           updatedAt: now,
       };

       const updatedOrders = orders.map(o => o.id === orderId ? paidOrder : o);
       saveOrders(updatedOrders);
       return paidOrder;

    }, [orders]);


    const updateKitchenStatus = useCallback((orderId: string, status: KitchenStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, kitchenStatus: status, updatedAt: Date.now() } : order
        );
        saveOrders(updatedOrders);
    }, [orders]);

    const getOrder = useCallback((orderId: string): Order | undefined => {
        return orders.find(order => order.id === orderId);
    }, [orders]);
    
    // Función para "archivar" órdenes completadas (en lugar de eliminarlas)
    const clearCompletedOrders = useCallback(() => {
        const updatedOrders = orders.map(o =>
            o.kitchenStatus === 'completed' && !o.isArchived ? { ...o, isArchived: true, updatedAt: Date.now() } : o
        );
        saveOrders(updatedOrders);
    }, [orders]);

    // Función para restaurar una orden archivada
    const restoreOrder = useCallback((orderId: string) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, isArchived: false, kitchenStatus: 'completed' as KitchenStatus, updatedAt: Date.now() } : order
        );
        saveOrders(updatedOrders);
    }, [orders]);

    // Puedes agregar más funciones aquí, como cancelarOrder o filtrar órdenes
    const cancelOrder = useCallback((orderId: string): boolean => {
        const orderToCancel = orders.find(o => o.id === orderId);
        if (!orderToCancel) return false;

        const updatedOrder = {
            ...orderToCancel,
            paymentStatus: 'cancelled' as PaymentStatus,
            kitchenStatus: 'completed' as KitchenStatus, // O 'cancelled' si hay un estado específico
            updatedAt: Date.now(),
        };
        const updatedOrders = orders.map(o => o.id === orderId ? updatedOrder : o);
        saveOrders(updatedOrders);
        return true;
    }, [orders]);

    // Funciones para obtener tipos específicos de órdenes (útil para UI)
    const getOpenOrders = useCallback((): Order[] => {
        return orders.filter(order => order.paymentStatus === 'open' && !order.isArchived);
    }, [orders]);

    const getPaidOrders = useCallback((): Order[] => {
        return orders.filter(order => order.paymentStatus === 'paid' && !order.isArchived);
    }, [orders]);

    return { 
        orders, 
        createOrder, 
        updateOrderItems, 
        payOrder, 
        updateKitchenStatus, 
        getOrder, 
        clearCompletedOrders, 
        restoreOrder, 
        isLoaded,
        cancelOrder, // Exportar la nueva función
        getOpenOrders, // Exportar la nueva función
        getPaidOrders, // Exportar la nueva función
    };
}
