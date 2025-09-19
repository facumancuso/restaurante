"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cog, Package, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import MenuCategories from "@/components/menu-categories";
import ProductList from "@/components/product-list";
import OrderSummary from "@/components/order-summary";
import GustoPrintLogo from "@/components/gusto-print-logo";
import PaymentDialog from "@/components/payment-dialog";
import PostPaymentDialog from "@/components/post-payment-dialog";
import ProductDetailDialog from "@/components/product-detail-dialog";
import ItemNotesDialog from "@/components/item-notes-dialog";

import { useToast } from "@/hooks/use-toast";
import { useTicketConfig } from "@/hooks/use-ticket-config";
import { useOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";

// Tipos básicos para evitar errores de importación
interface Product {
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

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface OrderItem extends Product {
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  tableNumber: string;
  employeeName?: string;
  subtotal?: number;
  total?: number;
  discountAmount?: number;
  paymentStatus: 'open' | 'paid';
  paidAt?: number;
  invoiceNumber?: string;
  createdAt: number;
  updatedAt: number;
}

interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  reason?: string;
}

type PrintFormat = 'thermal-80mm' | 'thermal-58mm' | 'a4';

interface PosClientPageProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

// ===== FUNCIÓN DE IMPRESIÓN TÉRMICA OPTIMIZADA =====
const printThermalTicket = (printData: any) => {
  try {
    console.log('🖨️ VERSIÓN 3.0 - TAMAÑOS OPTIMIZADOS - Iniciando impresión térmica...', printData);
    
    const printWindow = window.open('', '_blank', 'width=300,height=500,scrollbars=no,resizable=no');
    
    if (!printWindow) {
      console.error('❌ Error: No se pudo abrir ventana de impresión');
      alert('Por favor, permite las ventanas emergentes para imprimir.\n\nEn Chrome:\n1. Haz clic en el ícono de ventana bloqueada\n2. Selecciona "Permitir siempre ventanas emergentes"');
      return;
    }
    
    const content = generateThermalHTML(printData);
    printWindow.document.write(content);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 2000);
      }, 1000);
    };
    
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.close();
      }
    }, 15000);
    
  } catch (error) {
    console.error('❌ Error en impresión:', error);
    alert(`Error al imprimir: ${error.message}`);
  }
};

const generateThermalHTML = (printData: any) => {
  const { order, subtotal, total, discountAmount, invoice, paidAt, settings, tableNumber, employeeName, qrCodeUrl, type } = printData;
  
  const formattedDate = new Date(paidAt || Date.now()).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const businessName = settings?.restaurantName || settings?.businessName || 'Mi Restaurante';
  const address = settings?.address || settings?.businessAddress || '';
  const phone = settings?.businessPhone || '';
  const taxId = settings?.taxId || '';
  const thankYouMessage = settings?.thankYouMessage || settings?.footerMessage || '¡Gracias por su compra!';
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Ticket - ${invoice || 'PREVIEW'}</title>
        <style>
            @page {
                size: 80mm auto !important;
                margin: 0 !important;
            }
            
            * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                -webkit-font-smoothing: none !important;
                font-smoothing: none !important;
            }
            
            html, body {
                font-family: 'Courier New', 'DejaVu Sans Mono', 'Liberation Mono', monospace !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                line-height: 1.2 !important;
                width: 80mm !important;
                color: #000000 !important;
                background: #ffffff !important;
            }
            
            body {
                padding: 3mm !important;
            }
            
            .center { 
                text-align: center !important; 
                font-weight: 700 !important;
            }
            .bold { 
                font-weight: 800 !important; 
            }
            .small { 
                font-size: 10px !important; 
                font-weight: 600 !important;
            }
            .medium { 
                font-size: 12px !important; 
                font-weight: 700 !important;
            }
            .large { 
                font-size: 14px !important; 
                font-weight: 800 !important;
            }
            .xlarge { 
                font-size: 16px !important; 
                font-weight: 900 !important;
            }
            .business-name {
                font-size: 13px !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
                margin-bottom: 2px !important;
            }
            .business-info {
                font-size: 10px !important;
                font-weight: 600 !important;
            }
            .ticket-title {
                font-size: 15px !important;
                font-weight: 900 !important;
                text-transform: uppercase !important;
                margin: 4px 0 !important;
            }
            .invoice-number {
                font-size: 11px !important;
                font-weight: 700 !important;
            }
            .date-text {
                font-size: 10px !important;
                font-weight: 600 !important;
            }
            .section-title {
                font-size: 12px !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
            }
            .item-quantity {
                font-size: 13px !important;
                font-weight: 800 !important;
            }
            .item-name {
                font-size: 12px !important;
                font-weight: 700 !important;
            }
            .item-price {
                font-size: 11px !important;
                font-weight: 700 !important;
            }
            .item-details {
                font-size: 9px !important;
                font-weight: 600 !important;
            }
            .item-notes {
                font-size: 10px !important;
                font-weight: 700 !important;
                font-style: italic !important;
                margin-top: 2mm !important;
                padding-left: 3mm !important;
            }
            .total-text {
                font-size: 12px !important;
                font-weight: 800 !important;
            }
            
            .separator {
                border-top: 2px dashed #000000 !important;
                margin: 4mm 0 !important;
                width: 100% !important;
            }
            
            .solid-line {
                border-top: 2px solid #000000 !important;
                margin: 3mm 0 !important;
                width: 100% !important;
            }
            
            .row {
                display: flex !important;
                justify-content: space-between !important;
                align-items: flex-start !important;
                margin: 2mm 0 !important;
                font-weight: 700 !important;
            }
            
            .item {
                margin: 3mm 0 !important;
                border-bottom: 1px dotted #000000 !important;
                padding-bottom: 1mm !important;
            }
            
            .total-section {
                margin-top: 4mm !important;
                padding: 3mm 0 !important;
                border-top: 3px solid #000000 !important;
                border-bottom: 3px double #000000 !important;
            }
            
            .qr-code {
                width: 25mm !important;
                height: 25mm !important;
                margin: 3mm auto !important;
                display: block !important;
                border: 1px solid #000000 !important;
            }
            
            .footer-text {
                font-size: 10px !important;
                font-weight: 600 !important;
            }
            
            .time-stamp {
                font-size: 11px !important;
                font-weight: 700 !important;
            }
        </style>
    </head>
    <body>
    <div class="separator"></div>
        <div class="center">
            <div class="business-name">${businessName}</div>
        </div>
        
        
      
        
        <div class="separator"></div>
        
        ${tableNumber ? `
        <div class="row">
            <span class="medium">Mesa/ID:</span>
            <span class="medium bold">${tableNumber}</span>
        </div>` : ''}
        ${employeeName ? `
        <div class="row">
            <span class="medium">Empleado:</span>
            <span class="medium">${employeeName}</span>
        </div>` : ''}
        
        <div class="separator"></div>
        <div class="center section-title">PRODUCTOS</div>
        <div class="separator"></div>
        
        ${order.map((item: any) => `
            <div class="item">
                ${type === 'kitchen' ? `
                    <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 1mm;">
                        <span class="item-quantity">${item.quantity}x</span>
                        <span class="item-name">${item.name}</span>
                    </div>
                    ${item.notes ? `<div class="item-notes">** ${item.notes} **</div>` : ''}
                ` : `
                    <div class="row">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">$${(item.salePrice * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="row">
                        <span class="item-details">${item.quantity} x $${item.salePrice.toFixed(2)}</span>
                        <span class="item-details">${item.printingStation || 'general'}</span>
                    </div>
                    ${item.notes ? `<div class="item-notes">** NOTA: ${item.notes} **</div>` : ''}
                `}
            </div>
        `).join('')}
        
        ${type !== 'kitchen' ? `
        <div class="solid-line"></div>
        <div class="row">
            <span class="total-text">Subtotal:</span>
            <span class="total-text">$${(subtotal || 0).toFixed(2)}</span>
        </div>
        ${discountAmount > 0 ? `
        <div class="row">
            <span class="total-text">Descuento:</span>
            <span class="total-text">-$${discountAmount.toFixed(2)}</span>
        </div>` : ''}
        
        <div class="total-section">
            <div class="row">
                <span class="large bold">TOTAL:</span>
                <span class="large bold">$${(total || subtotal || 0).toFixed(2)}</span>
            </div>
        </div>
        
        ${qrCodeUrl ? `
        <div class="center">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" onerror="this.style.display='none'" />
        </div>` : ''}
        ` : ''}
        
        <div class="separator"></div>
        <div class="center">
            ${type === 'kitchen' ? `
                <div class="time-stamp">HORA: ${new Date().toLocaleTimeString('es-ES')}</div>
                <div class="footer-text">Comanda #${(invoice || 'PREVIEW').slice(-6)}</div>
            ` : `
                <div class="footer-text">${thankYouMessage}</div>
                <div class="footer-text">Sistema TPV - ${new Date().toLocaleDateString('es-ES')}</div>
            `}
        </div>
        
        <div style="height: 10mm;"></div>
    </body>
    </html>
  `;
};

export default function PosClientPage({ initialProducts, initialCategories }: PosClientPageProps) {
  const { products, isLoaded } = useProducts();
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [employeeName, setEmployeeName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [printFormat, setPrintFormat] = useState<PrintFormat>('thermal-80mm');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingNotesFor, setEditingNotesFor] = useState<OrderItem | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const [ticketConfig] = useTicketConfig();
  const { orders, createOrder, updateOrderItems, payOrder } = useOrders();
  const [orderForPrinting, setOrderForPrinting] = useState<Order | null>(null);
  const { toast } = useToast();

  const displayProducts = isLoaded ? products : initialProducts;
  const allCategories = [{ id: 'all', name: 'Todos' }, ...initialCategories];
  const openOrders = useMemo(() => orders.filter(o => o.paymentStatus === 'open'), [orders]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setRecommendations([]);
  };

  const handleAddToCart = useCallback((product: Product) => {
    setCurrentOrderItems((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.id === product.id);
      if (existingItem) {
        return prevOrder.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevOrder, { ...product, quantity: 1, notes: '' }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    setCurrentOrderItems((prevOrder) => {
      if (quantity <= 0) {
        return prevOrder.filter((item) => item.id !== productId);
      }
      return prevOrder.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const handleSaveNotes = useCallback((productId: string, notes: string) => {
    setCurrentOrderItems((prevOrder) =>
      prevOrder.map((item) =>
        item.id === productId ? { ...item, notes: notes.trim() } : item
      )
    );
    setEditingNotesFor(null);
  }, []);

  const handleSelectOrder = (orderId: string | null) => {
    setActiveOrderId(orderId);
    if (orderId) {
      const selectedOrder = orders.find(o => o.id === orderId);
      setCurrentOrderItems(selectedOrder?.items || []);
    } else {
      setCurrentOrderItems([]);
    }
  };

  const handleSaveOrder = (tableNumber: string) => {
    if (currentOrderItems.length === 0) {
      toast({ title: "Error", description: "No puedes guardar un pedido vacío.", variant: "destructive"});
      return;
    }

    if (!activeOrderId && !employeeName) {
      toast({ title: "Error", description: "Por favor, introduce el nombre del empleado.", variant: "destructive" });
      return;
    }

    let savedOrder;
    if (activeOrderId) {
      savedOrder = updateOrderItems(activeOrderId, currentOrderItems);
      toast({ title: "Pedido Actualizado", description: `El pedido para ${savedOrder?.tableNumber} ha sido actualizado.` });
    } else {
      savedOrder = createOrder(currentOrderItems, tableNumber, employeeName);
      toast({ title: "Pedido Guardado", description: `Nuevo pedido para ${tableNumber} guardado.` });
    }
    
    if(savedOrder) {
      setActiveOrderId(savedOrder.id);
    }
  };

  const handleConfirmPayment = (paymentMethod: string, amountPaid: number, discount: Discount) => {
    if (!activeOrderId) return;
    
    const paidOrder = payOrder(activeOrderId, discount);
    
    if (paidOrder) {
      toast({
        title: "Pago Exitoso",
        description: `Pedido #${paidOrder.invoiceNumber?.slice(-5)} registrado correctamente.`,
      });
      
      handleSelectOrder(null);
      setIsPaymentDialogOpen(false);
      setOrderForPrinting(paidOrder);
    } else {
      toast({ title: "Error", description: "No se pudo procesar el pago.", variant: "destructive"});
    }
  };

  const handleFinalizeOrder = () => {
    setOrderForPrinting(null);
  };

  // Función para impresión desde pedido actual
  const handlePrintFromOrder = async (type: 'customer' | 'kitchen' | 'cashier') => {
    if (!currentOrderItems.length || isPrinting) return;
    
    setIsPrinting(true);
    
    try {
      const subtotal = currentOrderItems.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
      const total = subtotal;
      const tempInvoice = `PREVIEW-${Date.now().toString().slice(-6)}`;
      
      const printDataForThermal = {
        order: currentOrderItems,
        subtotal,
        total,
        discountAmount: 0,
        paidAt: Date.now(),
        invoice: tempInvoice,
        type,
        settings: ticketConfig,
        tableNumber: activeOrderId ? orders.find(o => o.id === activeOrderId)?.tableNumber : 'Sin guardar',
        employeeName: employeeName || 'N/A',
        qrCodeUrl: ticketConfig.showQrCode && ticketConfig.website ? 
          `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticketConfig.website)}` : undefined,
      };

      printThermalTicket(printDataForThermal);
      
      toast({
        title: "Impresión Enviada",
        description: `Ticket ${type === 'customer' ? 'de cliente' : type === 'kitchen' ? 'de cocina' : 'de caja'} enviado a la impresora.`,
      });
      
    } catch (error) {
      console.error('❌ Error en impresión:', error);
      toast({
        title: "Error de Impresión",
        description: "No se pudo imprimir el ticket.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
      }, 2000);
    }
  };

  // Función para impresión post-pago
  const handlePrintPostPayment = async (type: 'customer' | 'kitchen' | 'cashier') => {
    if (!orderForPrinting || isPrinting) return;
    
    setIsPrinting(true);
    
    try {
      const printDataForThermal = {
        order: orderForPrinting.items,
        subtotal: orderForPrinting.subtotal!,
        total: orderForPrinting.total!,
        discountAmount: orderForPrinting.discountAmount || 0,
        paidAt: orderForPrinting.paidAt!,
        invoice: orderForPrinting.invoiceNumber!,
        type,
        settings: ticketConfig,
        tableNumber: orderForPrinting.tableNumber,
        employeeName: orderForPrinting.employeeName,
        qrCodeUrl: ticketConfig.showQrCode && ticketConfig.website ? 
          `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticketConfig.website)}` : undefined,
      };

      printThermalTicket(printDataForThermal);
      
      toast({
        title: "Impresión Enviada",
        description: `Ticket ${type === 'customer' ? 'de cliente' : type === 'kitchen' ? 'de cocina' : 'de caja'} enviado a la impresora.`,
      });
      
    } catch (error) {
      console.error('❌ Error en impresión:', error);
      toast({
        title: "Error de Impresión",
        description: "No se pudo imprimir el ticket.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
      }, 2000);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetailDialog = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "all") return displayProducts;
    return displayProducts.filter(
      (product) => product.categoryId === selectedCategoryId
    );
  }, [selectedCategoryId, displayProducts]);

  const { subtotal, total } = useMemo(() => {
    const subtotal = currentOrderItems.reduce(
      (acc, item) => acc + item.salePrice * item.quantity,
      0
    );
    const total = subtotal;
    return { subtotal, total };
  }, [currentOrderItems]);

  return (
    <>
      <div className="flex h-screen flex-col bg-background no-print">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-3">
            <GustoPrintLogo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">
              {ticketConfig?.restaurantName || 'Mi Restaurante'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="employee-name" className="text-sm">Empleado:</Label>
              <Input 
                id="employee-name"
                placeholder="Nombre"
                className="w-24 h-7 text-xs"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
            <Link href="/sales" passHref>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <DollarSign className="mr-1 h-3 w-3" />
                Ventas
              </Button>
            </Link>
            <Link href="/orders" passHref>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Package className="mr-1 h-3 w-3" />
                Cocina
              </Button>
            </Link>
            <Link href="/admin" passHref>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Cog className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <main className="grid h-full grid-cols-1 md:grid-cols-[minmax(0,_1fr)_400px] lg:grid-cols-[240px_minmax(0,_1fr)_440px]">
            {/* Categories Sidebar - MÁS ANGOSTA */}
            <aside className="hidden h-full flex-col border-r lg:flex">
              <MenuCategories
                categories={allCategories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={handleSelectCategory}
              />
            </aside>
            
            {/* Products Section */}
            <section className="flex h-full flex-col overflow-hidden">
              <div className="p-3 lg:hidden border-b">
                <MenuCategories
                  categories={allCategories}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={handleSelectCategory}
                  isMobile
                />
              </div>
              <ProductList
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                recommendations={recommendations}
              />
            </section>
            
            {/* Order Summary Sidebar - MÁS ANCHO */}
            <aside className="flex h-full flex-col border-l md:flex">
              <OrderSummary
                orderItems={currentOrderItems}
                onUpdateQuantity={handleUpdateQuantity}
                onUpdateNotesRequest={setEditingNotesFor}
                subtotal={subtotal}
                total={total}
                onPay={() => setIsPaymentDialogOpen(true)}
                printFormat={printFormat}
                onPrintFormatChange={setPrintFormat}
                openOrders={openOrders}
                activeOrderId={activeOrderId}
                onSelectOrder={handleSelectOrder}
                onSaveOrder={handleSaveOrder}
                onPrintTicket={handlePrintFromOrder}
              />
            </aside>
          </main>
        </div>
      </div>
      
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onConfirm={handleConfirmPayment}
        totalAmount={total}
        orderId={activeOrderId}
      />
      
      <PostPaymentDialog
        isOpen={!!orderForPrinting}
        onClose={handleFinalizeOrder}
        onPrintKitchen={() => handlePrintPostPayment('kitchen')}
        onPrintCashier={() => handlePrintPostPayment('cashier')}
        onPrintCustomer={() => handlePrintPostPayment('customer')}
        isPrinting={isPrinting}
      />
      
      <ProductDetailDialog
        isOpen={!!selectedProduct}
        onClose={handleCloseDetailDialog}
        product={selectedProduct}
        onAddToCart={(product) => {
          handleAddToCart(product);
          handleCloseDetailDialog();
        }}
      />
      
      <ItemNotesDialog
        isOpen={!!editingNotesFor}
        onClose={() => setEditingNotesFor(null)}
        item={editingNotesFor}
        onSave={handleSaveNotes}
      />
    </>
  );
}