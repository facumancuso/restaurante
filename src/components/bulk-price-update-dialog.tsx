
"use client"

import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface BulkPriceUpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (type: 'percentage' | 'fixed', value: number, supplier: string) => void;
    suppliers: string[];
}

export default function BulkPriceUpdateDialog({ isOpen, onClose, onConfirm, suppliers }: BulkPriceUpdateDialogProps) {
    const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
    const [value, setValue] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState<string>('all');

    useEffect(() => {
        if (!isOpen) {
            setType('percentage');
            setValue('');
            setSelectedSupplier('all');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            onConfirm(type, numericValue, selectedSupplier);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="no-print">
                <DialogHeader>
                    <DialogTitle>Aumento de Precios en Masa</DialogTitle>
                    <DialogDescription>
                        Aumenta el precio de venta de los productos por porcentaje o monto fijo, opcionalmente filtrando por proveedor.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Proveedor</Label>
                        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los proveedores</SelectItem>
                                {suppliers.map(supplier => (
                                    <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Tipo de Aumento</Label>
                        <RadioGroup value={type} onValueChange={(v) => setType(v as 'percentage' | 'fixed')}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="percentage" id="r1" />
                                <Label htmlFor="r1">Porcentaje (%)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fixed" id="r2" />
                                <Label htmlFor="r2">Monto Fijo ($)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="value">Valor</Label>
                        <Input
                            id="value"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={type === 'percentage' ? 'Ej: 10 para 10%' : 'Ej: 100 para $100'}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleConfirm}>Aplicar Aumento</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
