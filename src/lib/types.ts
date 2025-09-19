// /lib/types.ts - Definiciones de tipos completas y actualizadas para sistema POS térmico

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
}

export interface Discount {
  type: 'percentage' | 'fixed' | 'none';
  value: number;
  reason?: string;
  appliedBy?: string;
  appliedAt?: Date;
}

// ===== TIPOS PARA CONFIGURACIÓN DE TICKETS TÉRMICOS OPTIMIZADOS =====
export interface TicketConfig {
  // ===== INFORMACIÓN BÁSICA DEL NEGOCIO =====
  restaurantName?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // ===== INFORMACIÓN FISCAL ARGENTINA =====
  invoiceType?: 'A' | 'B' | 'C' | string; // Tipos de factura AFIP
  posNumber?: string; // Punto de venta (PDV)
  taxId?: string; // CUIT
  taxCondition?: 'Responsable Inscripto' | 'Monotributo' | 'Exento' | 'Consumidor Final' | string;
  grossIncome?: string; // Ingresos Brutos
  activityStartDate?: string; // Fecha de inicio de actividades DD/MM/AAAA
  
  // ===== MENSAJES PERSONALIZADOS =====
  thankYouMessage?: string;
  legalDisclaimer?: string; // Aviso legal del ticket
  footerMessage?: string; // Para compatibilidad
  
  // ===== CONTROLES DE VISIBILIDAD =====
  showRestaurantName?: boolean;
  showAddress?: boolean;
  showTaxId?: boolean;
  showWebsite?: boolean;
  showThankYouMessage?: boolean;
  showQrCode?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showInvoiceType?: boolean;
  showPosNumber?: boolean;
  showTaxCondition?: boolean;
  showGrossIncome?: boolean;
  showActivityStartDate?: boolean;
  showLegalDisclaimer?: boolean;
  
  // ===== CONFIGURACIÓN TÉRMICA AVANZADA =====
  thermalOptimized?: boolean; // Activar optimizaciones térmicas
  thermalFontSize?: '9px' | '10px' | '11px' | '12px' | '13px' | string;
  thermalFontWeight?: '600' | '700' | '800' | '900' | string;
  thermalLineHeight?: '1.0' | '1.2' | '1.3' | '1.4' | string;
  thermalDensity?: 'low' | 'medium' | 'high'; // Densidad de impresión
  thermalSpeed?: 'slow' | 'normal' | 'fast'; // Velocidad de impresión
  
  // ===== CAMPOS DE COMPATIBILIDAD =====
  businessName?: string; // Para compatibilidad con versiones anteriores
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  
  // ===== CONFIGURACIÓN DE QR Y REDES SOCIALES =====
  qrCodeSize?: '120x120' | '140x140' | '160x160' | string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    twitter?: string;
  };
  
  // ===== CONFIGURACIÓN AVANZADA DE LAYOUT =====
  layoutStyle?: 'compact' | 'normal' | 'spacious';
  separatorStyle?: 'dashed' | 'solid' | 'dotted';
  headerStyle?: 'centered' | 'left' | 'right';
  itemDisplayStyle?: 'detailed' | 'simple' | 'minimal';
  
  // ===== CONFIGURACIÓN DE PAPEL =====
  paperWidth?: '58mm' | '80mm' | 'custom';
  marginSize?: 'none' | 'small' | 'medium';
  cutAfterPrint?: boolean;
  
  // ===== CONFIGURACIÓN DE COLORES PARA DISPLAY =====
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
}

// ===== TIPOS PARA IMPRESIÓN =====
export type PrintFormat = 
  | 'thermal-80mm' 
  | 'thermal-58mm' 
  | 'a4' 
  | 'letter' 
  | 'thermal-custom';

export type PrintType = 
  | 'customer' 
  | 'kitchen' 
  | 'cashier' 
  | 'sales-report' 
  | 'thermal-receipt'
  | 'thermal-kitchen'
  | 'thermal-cashier';

export interface PrintData {
  type: PrintType;
  order: OrderItem[];
  subtotal: number;
  total: number;
  discountAmount: number;
  paidAt: number;
  invoice: string;
  settings: TicketConfig;
  tableNumber?: string;
  employeeName?: string;
  qrCodeUrl?: string;
  format?: PrintFormat;
  
  // Campos adicionales para reportes
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  
  // Información de pago
  paymentMethod?: 'efectivo' | 'credito' | 'debito' | 'MercadoPago' | 'transferencia';
  paymentDetails?: {
    amountPaid?: number;
    change?: number;
    cardLast4?: string;
    authCode?: string;
  };
  
  // Información adicional
  orderType?: 'mesa' | 'delivery' | 'takeaway';
  deliveryAddress?: string;
  orderNotes?: string;
  promotions?: Array<{
    name: string;
    discount: number;
    type: 'percentage' | 'fixed';
  }>;
}

// ===== TIPOS PARA IMPRESIÓN TÉRMICA OPTIMIZADA =====
export interface ThermalPrintData {
  order: OrderItem[];
  subtotal: number;
  total: number;
  discountAmount?: number;
  invoice?: string;
  paidAt?: number;
  tableNumber?: string;
  employeeName?: string;
  qrCodeUrl?: string;
  settings?: TicketConfig;
  type?: 'customer' | 'kitchen' | 'cashier';
}

export interface ThermalPrintOptions {
  width: '58mm' | '80mm' | 'custom';
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  encoding: 'UTF-8' | 'ISO-8859-1' | 'CP437';
  cutType: 'full' | 'partial' | 'none';
  cashdrawer?: boolean;
  buzzer?: boolean;
  
  // Configuraciones específicas para 3nstar RPT008
  thermalLevel?: 'low' | 'medium' | 'high';
  printSpeed?: 'slow' | 'normal' | 'fast';
  characterSet?: 'standard' | 'extended';
  codePageTable?: number;
}

export interface ThermalPrintCommand {
  type: 'text' | 'separator' | 'qr' | 'image' | 'cut' | 'raw';
  content?: string;
  options?: {
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
    underline?: boolean;
    fontSize?: 'small' | 'normal' | 'large';
    width?: number;
    height?: number;
  };
  rawCommand?: Uint8Array;
}

// ===== TIPOS PARA REPORTES DE VENTAS =====
export interface SalesReportData {
  filteredOrders: Array<{
    id?: string;
    invoiceNumber?: string;
    paidAt: number;
    tableNumber: string;
    total?: number;
    subtotal?: number;
    discountAmount?: number;
    employeeName?: string;
    orderType?: string;
    paymentMethod?: string;
    items?: OrderItem[];
  }>;
  salesSummary: {
    totalOrders: number;
    totalRevenue: number;
    totalDiscount: number;
    averageOrderValue?: number;
    topSellingItems?: Array<{
      name: string;
      quantity: number;
      revenue: number;
    }>;
    paymentMethodBreakdown?: Record<string, {
      count: number;
      total: number;
    }>;
    hourlyBreakdown?: Array<{
      hour: number;
      orders: number;
      revenue: number;
    }>;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  filters?: {
    employeeName?: string;
    tableNumber?: string;
    orderType?: string;
    paymentMethod?: string;
    minAmount?: number;
    maxAmount?: number;
  };
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

// ===== TIPOS PARA CONFIGURACIÓN DE IMPRESORAS =====
export interface PrinterConfig {
  name: string;
  type: 'thermal' | 'inkjet' | 'laser';
  model?: string;
  connectionType: 'usb' | 'network' | 'bluetooth' | 'serial';
  
  // Configuraciones térmicas específicas
  thermal?: ThermalPrintOptions;
  
  // Configuraciones de red
  network?: {
    ip: string;
    port: number;
    protocol: 'raw' | 'lpr' | 'ipp';
  };
  
  // Configuraciones de serie/USB
  serial?: {
    port: string;
    baudRate: number;
    dataBits: number;
    stopBits: number;
    parity: 'none' | 'even' | 'odd';
  };
}

// ===== TIPOS PARA TRABAJOS DE IMPRESIÓN =====
export type PrintStatus = 
  | 'idle' 
  | 'printing' 
  | 'completed' 
  | 'error' 
  | 'cancelled'
  | 'paper-empty'
  | 'offline';

export interface PrintJob {
  id: string;
  type: PrintType;
  status: PrintStatus;
  data: PrintData;
  printer?: PrinterConfig;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  retryCount?: number;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

// ===== TIPOS PARA HOOKS =====
export interface UseThermalPrintReturn {
  isPrinting: boolean;
  printCustomerTicket: (data: ThermalPrintData) => Promise<void>;
  printKitchenTicket: (data: ThermalPrintData) => Promise<void>;
  printCashierTicket: (data: ThermalPrintData) => Promise<void>;
  printReceipt: (printData: PrintData, format?: PrintFormat) => Promise<void>;
  printSalesReport: (salesData: SalesReportData, dateRange?: DateRange, settings?: TicketConfig) => Promise<void>;
  printKitchenOrder: (orderData: PrintData) => Promise<void>;
  printCashierCopy: (orderData: PrintData) => Promise<void>;
  lastPrintJob?: PrintJob;
  printQueue: PrintJob[];
  clearQueue: () => void;
  retryPrint: (jobId: string) => Promise<void>;
  error: string | null;
}

// ===== TIPOS PARA CONFIGURACIÓN DEL RESTAURANTE =====
export interface RestaurantConfig extends TicketConfig {
  // Configuración de horarios
  businessHours?: Array<{
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    open: string; // HH:mm
    close: string; // HH:mm
    closed?: boolean;
  }>;
  
  // Configuración de delivery
  delivery?: {
    enabled: boolean;
    radius?: number; // en km
    minimumOrder?: number;
    fee?: number;
    freeDeliveryMinimum?: number;
  };
  
  // Configuración de impuestos y facturación
  tax?: {
    rate: number; // porcentaje
    included: boolean;
    name: string; // ej: "IVA", "Sales Tax"
  };
  
  // Configuración de moneda
  currency?: {
    code: string; // ej: "ARS", "USD"
    symbol: string; // ej: "$", "€"
    position: 'before' | 'after';
    decimals: number;
  };
}

// ===== TIPOS PARA MANEJO DE ERRORES =====
export interface PrintError extends Error {
  code: 'PRINTER_OFFLINE' | 'PAPER_EMPTY' | 'NETWORK_ERROR' | 'INVALID_DATA' | 'TIMEOUT' | 'UNKNOWN';
  details?: any;
  recoverable?: boolean;
}

// ===== TIPOS PARA CONFIGURACIÓN AVANZADA =====
export interface AdvancedPrintSettings {
  // Configuración de retry
  retryAttempts: number;
  retryDelay: number; // en ms
  
  // Configuración de timeout
  printTimeout: number; // en ms
  connectionTimeout: number; // en ms
  
  // Configuración de calidad
  printQuality: 'draft' | 'normal' | 'high';
  densityLevel: number; // 1-15 para impresoras térmicas
  
  // Configuración de papel
  paperWidth: number; // en mm
  paperType: 'thermal' | 'plain' | 'receipt';
  
  // Configuración de corte automático
  autoCut: boolean;
  cutAfterPages: number;
  
  // Configuración de cajón de dinero
  openCashDrawer: boolean;
  cashDrawerPin: 1 | 2;
  
  // Configuración de preview
  showPreview: boolean;
  previewBeforePrint: boolean;
}

// ===== TIPOS PARA INTEGRACIÓN CON SISTEMAS EXTERNOS =====
export interface ExternalSystemConfig {
  // Integración con sistemas de punto de venta
  posIntegration?: {
    enabled: boolean;
    type: 'webhook' | 'api' | 'database';
    endpoint?: string;
    apiKey?: string;
    syncFrequency?: number; // en minutos
  };
  
  // Integración con contabilidad
  accountingIntegration?: {
    enabled: boolean;
    system: 'quickbooks' | 'xero' | 'sage' | 'custom';
    credentials?: Record<string, any>;
    autoSync?: boolean;
  };
  
  // Integración con delivery platforms
  deliveryIntegrations?: Array<{
    platform: 'uber-eats' | 'rappi' | 'pedidos-ya' | 'custom';
    enabled: boolean;
    credentials?: Record<string, any>;
    autoAcceptOrders?: boolean;
  }>;
}

// ===== CONFIGURACIONES POR DEFECTO OPTIMIZADAS =====
export const DEFAULT_THERMAL_CONFIG: ThermalPrintOptions = {
  width: '80mm',
  fontFamily: '"Courier New", "DejaVu Sans Mono", monospace',
  fontSize: '11px',
  fontWeight: '700',
  lineHeight: '1.2',
  encoding: 'UTF-8',
  cutType: 'partial',
  thermalLevel: 'medium',
  printSpeed: 'normal',
  characterSet: 'standard',
  codePageTable: 0
};

export const DEFAULT_TICKET_CONFIG: Partial<TicketConfig> = {
  // Configuración por defecto optimizada para tickets térmicos argentinos
  thermalOptimized: true,
  thermalFontSize: '11px',
  thermalFontWeight: '700',
  thermalLineHeight: '1.2',
  paperWidth: '80mm',
  showRestaurantName: true,
  showAddress: true,
  showTaxId: true,
  showQrCode: false,
  showThankYouMessage: true,
  qrCodeSize: '140x140',
  layoutStyle: 'normal',
  separatorStyle: 'dashed',
  headerStyle: 'centered',
  itemDisplayStyle: 'detailed',
  invoiceType: 'B',
  taxCondition: 'Responsable Inscripto',
  legalDisclaimer: 'Documento no válido como comprobante fiscal'
};

export const DEFAULT_PRINT_SETTINGS: AdvancedPrintSettings = {
  retryAttempts: 3,
  retryDelay: 1000,
  printTimeout: 30000,
  connectionTimeout: 5000,
  printQuality: 'normal',
  densityLevel: 8,
  paperWidth: 80,
  paperType: 'thermal',
  autoCut: true,
  cutAfterPages: 1,
  openCashDrawer: false,
  cashDrawerPin: 1,
  showPreview: false,
  previewBeforePrint: false
};

// ===== TIPOS PARA COMPONENTES UI =====
export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  recommendations?: string[];
  selectedCategoryId?: string;
  isLoading?: boolean;
}

export interface OrderSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onUpdateNotesRequest: (item: OrderItem) => void;
  subtotal: number;
  total: number;
  onPay: () => void;
  printFormat: PrintFormat;
  onPrintFormatChange: (format: PrintFormat) => void;
  openOrders: Order[];
  activeOrderId: string | null;
  onSelectOrder: (orderId: string | null) => void;
  onSaveOrder: (tableNumber: string) => void;
  onPrintTicket?: (type: 'customer' | 'kitchen' | 'cashier') => void;
  isLoading?: boolean;
}

export interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string, amountPaid: number, discount: Discount) => void;
  totalAmount: number;
  orderId: string | null;
}

// ===== TIPOS PARA HOOKS PERSONALIZADOS =====
export interface UseOrdersReturn {
  orders: Order[];
  createOrder: (items: OrderItem[], tableNumber: string, employeeName?: string) => Order | null;
  updateOrderItems: (orderId: string, items: OrderItem[]) => Order | null;
  payOrder: (orderId: string, discount?: Discount) => Order | null;
  cancelOrder: (orderId: string) => boolean;
  getOrderById: (orderId: string) => Order | null;
  getOpenOrders: () => Order[];
  getPaidOrders: () => Order[];
  isLoading: boolean;
  error: string | null;
}

export interface UseProductsReturn {
  products: Product[];
  categories: Category[];
  getProductById: (id: string) => Product | null;
  getProductsByCategory: (categoryId: string) => Product[];
  searchProducts: (query: string) => Product[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

export interface UseTicketConfigReturn {
  config: TicketConfig;
  updateConfig: (newConfig: Partial<TicketConfig>) => void;
  resetConfig: () => void;
  isLoading: boolean;
  error: string | null;
}

// ===== TIPOS PARA VALIDACIÓN Y UTILIDADES =====
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormErrors {
  [key: string]: ValidationError[];
}

// ===== TIPOS PARA CONFIGURACIÓN DE FORMULARIOS =====
export interface FormFieldConfig {
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  type?: 'text' | 'textarea' | 'select' | 'switch' | 'number';
  options?: Array<{ value: string; label: string }>;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
}

// ===== EXPORTACIÓN DE TIPOS PARA FACILITAR IMPORTACIONES =====
export type {
  Product,
  Category,
  OrderItem,
  Order,
  Discount,
  TicketConfig,
  PrintFormat,
  PrintType,
  PrintData,
  ThermalPrintData,
  SalesReportData,
  DateRange
};

// ===== CONSTANTES ÚTILES =====
export const INVOICE_TYPES = ['A', 'B', 'C'] as const;
export const TAX_CONDITIONS = [
  'Responsable Inscripto',
  'Monotributo', 
  'Exento',
  'Consumidor Final'
] as const;
export const PAYMENT_METHODS = [
  'efectivo',
  'credito', 
  'debito',
  'MercadoPago',
  'transferencia'
] as const;
export const PRINT_FORMATS = [
  'thermal-80mm',
  'thermal-58mm', 
  'a4',
  'letter'
] as const;
export const PRINTING_STATIONS = ['cocina', 'barra', 'ambas'] as const;