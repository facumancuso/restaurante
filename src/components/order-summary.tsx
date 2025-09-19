"use client";
import { useState, useEffect } from "react";
import type { OrderItem, PrintFormat, Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Minus,
  Banknote,
  FilePlus,
  Save,
  StickyNote,
  Trash2,
  ChefHat,
  Receipt,
  User,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderSummaryProps {
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
}

export default function OrderSummary({
  orderItems,
  onUpdateQuantity,
  onUpdateNotesRequest,
  subtotal,
  total,
  onPay,
  printFormat,
  onPrintFormatChange,
  openOrders,
  activeOrderId,
  onSelectOrder,
  onSaveOrder,
  onPrintTicket,
}: OrderSummaryProps) {
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    if (activeOrderId) {
      const activeOrder = openOrders.find((o) => o.id === activeOrderId);
      setTableNumber(activeOrder?.tableNumber || "");
    } else {
      setTableNumber("");
    }
  }, [activeOrderId, openOrders]);

  const handleSaveClick = () => {
    if (!activeOrderId && !tableNumber) {
      alert("Por favor, introduce un número de mesa o identificador.");
      return;
    }
    onSaveOrder(tableNumber);
  };

  const itemCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative h-full bg-card">
      {/* HEADER FIJO - POSICIÓN ABSOLUTA */}
      <div className="absolute top-0 left-0 right-0 bg-card border-b z-10 p-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Pedido</h2>
            {itemCount > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4">
                {itemCount}
              </Badge>
            )}
          </div>
          
          {/* Order Management */}
          <div className="space-y-1">
            <div className="flex gap-1">
              <Select 
                value={activeOrderId ?? ""} 
                onValueChange={(val) => onSelectOrder(val)}
              >
                <SelectTrigger className="h-6 flex-1 text-xs">
                  <SelectValue placeholder="Cargar..." />
                </SelectTrigger>
                <SelectContent>
                  {openOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs h-3 px-1">
                          {order.items.length}
                        </Badge>
                        <span className="text-xs">{order.tableNumber}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onSelectOrder(null)}
              >
                <FilePlus className="h-2.5 w-2.5" />
              </Button>
            </div>
            
            <Input
              placeholder="Mesa"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              disabled={!!activeOrderId}
              className="h-6 text-xs"
            />
            
            <Button 
              onClick={handleSaveClick} 
              className="w-full h-6 text-xs" 
              disabled={orderItems.length === 0}
              variant={activeOrderId ? "default" : "secondary"}
            >
              <Save className="mr-1 h-2.5 w-2.5" />
              {activeOrderId ? "Actualizar" : "Guardar"}
            </Button>

            {orderItems.length > 0 && onPrintTicket && (
              <div className="grid grid-cols-3 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 text-xs p-0.5"
                  onClick={() => onPrintTicket('kitchen')}
                >
                  <ChefHat className="h-2.5 w-2.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 text-xs p-0.5"
                  onClick={() => onPrintTicket('cashier')}
                >
                  <Receipt className="h-2.5 w-2.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 text-xs p-0.5"
                  onClick={() => onPrintTicket('customer')}
                >
                  <User className="h-2.5 w-2.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ÁREA DE SCROLL - ALTURA CALCULADA FIJA */}
      <div 
        className="absolute left-0 right-0 overflow-hidden"
        style={{ 
          top: '140px', // Altura del header
          bottom: '120px' // Altura del footer
        }}
      >
        {orderItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-3">
              <Receipt className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Pedido vacío</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-background border rounded p-1.5"
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-medium text-xs flex-1 truncate">
                      {item.name}
                    </h4>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0.5 bg-muted rounded px-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-2 w-2" />
                      </Button>
                      <span className="text-xs font-bold w-3 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      ${item.salePrice.toFixed(2)} c/u
                    </span>
                    <span className="font-bold text-primary">
                      ${(item.salePrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div className="p-1 bg-amber-50 border border-amber-200 rounded text-xs mb-1">
                      <span className="text-amber-800">📝 {item.notes}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 px-1 text-xs"
                      onClick={() => onUpdateNotesRequest(item)}
                    >
                      <StickyNote className="mr-0.5 h-2 w-2" />
                      Nota
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 px-1 text-xs text-destructive"
                      onClick={() => onUpdateQuantity(item.id, 0)}
                    >
                      <Trash2 className="mr-0.5 h-2 w-2" />
                      Quitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* FOOTER FIJO - POSICIÓN ABSOLUTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-card border-t shadow-lg z-10">
        <div className="p-2 space-y-2">
          {/* Totals */}
          <div className="bg-muted/30 rounded p-2">
            <div className="flex justify-between items-center text-xs">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <Separator className="my-0.5" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">Total</span>
              <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Pay Button */}
          <Button
            onClick={onPay}
            disabled={!orderItems.length || !activeOrderId}
            className="w-full h-8 font-semibold text-sm"
            size="default"
          >
            <Banknote className="mr-2 h-3 w-3" />
            Cobrar Pedido
          </Button>
          
          {!activeOrderId && orderItems.length > 0 && (
            <p className="text-xs text-center text-muted-foreground">
              💡 Guarda el pedido primero
            </p>
          )}
        </div>
      </div>
    </div>
  );
}