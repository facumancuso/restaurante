"use client"

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import type { Discount } from "@/lib/types";

type PaymentMethod = 'efectivo' | 'credito' | 'debito' | 'MercadoPago';

interface PaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentMethod: PaymentMethod, amountPaid: number, discount: Discount) => void;
    totalAmount: number;
    orderId: string | null;
}

export default function PaymentDialog({ isOpen, onClose, onConfirm, totalAmount, orderId }: PaymentDialogProps) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
    const [amountPaid, setAmountPaid] = useState('');
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
    const [discountValue, setDiscountValue] = useState('');

    const discountAmount = useMemo(() => {
        const value = parseFloat(discountValue);
        if (isNaN(value) || value <= 0) return 0;
        if (discountType === 'percentage') {
            return totalAmount * (value / 100);
        }
        return value;
    }, [discountValue, discountType, totalAmount]);
    
    const finalTotal = useMemo(() => {
        const final = totalAmount - discountAmount;
        return final > 0 ? final : 0;
    }, [totalAmount, discountAmount]);

    useEffect(() => {
        if (isOpen) {
            setAmountPaid(finalTotal.toFixed(2));
            if (paymentMethod !== 'efectivo') {
                setAmountPaid(finalTotal.toFixed(2));
            }
        } else {
            // Reset state on close
            setPaymentMethod('efectivo');
            setAmountPaid('');
            setDiscountType('fixed');
            setDiscountValue('');
        }
    }, [isOpen, totalAmount, finalTotal, paymentMethod]);
    
    const change = useMemo(() => {
        const paid = parseFloat(amountPaid);
        if (paymentMethod !== 'efectivo' || isNaN(paid) || paid < finalTotal) {
            return 0;
        }
        return paid - finalTotal;
    }, [amountPaid, finalTotal, paymentMethod]);

    const handleConfirm = () => {
        const paid = parseFloat(amountPaid);
         const discount: Discount = {
            type: discountAmount > 0 ? discountType : 'none',
            value: parseFloat(discountValue) || 0
        };

        if (!isNaN(paid)) {
            onConfirm(paymentMethod, paid, discount);
        }
    };
    
    const isConfirmDisabled = useMemo(() => {
        if (!orderId) return true;
        const paid = parseFloat(amountPaid);
        if (isNaN(paid)) return true;
        if (paid < finalTotal) return true;
        return false;
    }, [amountPaid, finalTotal, orderId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md no-print">
                <DialogHeader>
                    <DialogTitle>Procesar Pago</DialogTitle>
                    <DialogDescription>
                       {orderId ? 'Aplica descuentos y confirma la transacción.' : 'Carga un pedido antes de procesar el pago.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="text-left">
                            <Label>Total Original</Label>
                            <p className="text-2xl font-semibold tracking-tight text-muted-foreground line-through">${totalAmount.toFixed(2)}</p>
                        </div>
                         <div className="text-right">
                            <Label>Total a Pagar</Label>
                            <p className="text-4xl font-bold tracking-tight text-primary">${finalTotal.toFixed(2)}</p>
                        </div>
                    </div>
                    <Separator />
                    
                    <div className="space-y-4">
                      <Label>Aplicar Descuento</Label>
                       <div className="flex items-center gap-2">
                            <RadioGroup value={discountType} onValueChange={(v) => setDiscountType(v as 'fixed' | 'percentage')} className="flex">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="fixed" id="r-fixed" />
                                    <Label htmlFor="r-fixed">Monto Fijo ($)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="percentage" id="r-perc" />
                                    <Label htmlFor="r-perc">Porcentaje (%)</Label>
                                </div>
                            </RadioGroup>
                            <Input
                                id="discount-value"
                                type="number"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                placeholder="0"
                                className="max-w-[120px]"
                            />
                       </div>
                    </div>
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                           <Label htmlFor="payment-method">Método de Pago</Label>
                           <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                                <SelectTrigger id="payment-method">
                                    <SelectValue placeholder="Selecciona método" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                    <SelectItem value="credito">Tarjeta de Crédito</SelectItem>
                                    <SelectItem value="debito">Tarjeta de Débito</SelectItem>
                                    <SelectItem value="MercadoPago">MercadoPago</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount-paid">Monto Recibido</Label>
                            <Input
                                id="amount-paid"
                                type="number"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                disabled={paymentMethod !== 'efectivo'}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    {paymentMethod === 'efectivo' && (
                        <div className="text-right">
                           <Label>Cambio a devolver</Label>
                           <p className="text-2xl font-semibold text-primary">${change.toFixed(2)}</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleConfirm} disabled={isConfirmDisabled}>Confirmar Pago</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
