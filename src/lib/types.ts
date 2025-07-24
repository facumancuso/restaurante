// /lib/types.ts - Definiciones de tipos completas y actualizadas para sistema POS térmico

// ===== NUEVO TIPO PARA ESTADO DEL PEDIDO EN COCINA =====
export type KitchenStatus = 'pending' | 'in-progress' | 'ready' | 'completed';

// ===== TIPOS BÁSICOS PARA PRODUCTOS Y CATEGORÍAS =====
export interface Product {
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
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ===== TIPOS PARA PEDIDOS Y ÓRDENES =====
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  salePrice: number;
  price?: number; // Para compatibilidad con versiones anteriores
  notes?: string;
  printingStation?: 'cocina' | 'barra' | 'ambos';
  category?: string;
  ingredients?: string[];
  allergens?: string[];
  // Campos adicionales para compatibilidad con Product
  categoryId?: string;
  costPrice?: number;
  stock?: number;
  supplier?: string;
  unitOfMeasure?: string;
  allowPriceChange?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  id: string;
  items: OrderItem[];
  tableNumber: string;
  employeeName?: string;
  subtotal?: number;
  total?: number;
  discountAmount?: number;
  paymentStatus: 'open' | 'paid' | 'cancelled';
  paidAt?: number;
  invoiceNumber?: string;
  createdAt: number;
  updatedAt: number;
  orderType?: 'mesa' | 'delivery' | 'takeaway';
  deliveryAddress?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  paymentMethod?: 'efectivo' | 'credito' | 'debito' | 'MercadoPago' | 'transferencia';
  paymentDetails?: {
    amountPaid?: number;
    change?: number;
    cardLast4?: string;
    authCode?: string;
  };

  // NUEVO CAMPO: estado del pedido en cocina
  kitchenStatus?: KitchenStatus;
}

// (El resto de tipos omitido por brevedad, pero puedes mantenerlos igual si quieres)

export type {
  Product,
  Category,
  OrderItem,
  Order,
  // otros tipos que exportabas...
};
