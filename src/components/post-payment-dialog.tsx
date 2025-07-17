"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer, Check, Loader2, ChefHat, Receipt, User } from "lucide-react";

interface PostPaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPrintKitchen: () => void;
    onPrintCashier: () => void;
    onPrintCustomer: () => void;
    isPrinting?: boolean;
}

export default function PostPaymentDialog({ 
    isOpen, 
    onClose, 
    onPrintKitchen, 
    onPrintCashier, 
    onPrintCustomer,
    isPrinting = false
}: PostPaymentDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="no-print sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        ✅ Pago Completado
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Selecciona los documentos que deseas imprimir
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-2 py-4">
                    <Button 
                        variant="outline" 
                        onClick={onPrintKitchen}
                        disabled={isPrinting}
                        className="w-full h-10 justify-start"
                    >
                        {isPrinting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <ChefHat className="mr-2 h-4 w-4" />
                        )}
                        Comanda para Cocina/Barra
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={onPrintCashier}
                        disabled={isPrinting}
                        className="w-full h-10 justify-start"
                    >
                        {isPrinting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Receipt className="mr-2 h-4 w-4" />
                        )}
                        Ticket para Caja
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={onPrintCustomer}
                        disabled={isPrinting}
                        className="w-full h-10 justify-start"
                    >
                        {isPrinting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <User className="mr-2 h-4 w-4" />
                        )}
                        Ticket para Cliente
                    </Button>
                </div>
                
                <DialogFooter>
                    <Button 
                        onClick={onClose}
                        className="w-full"
                        disabled={isPrinting}
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Finalizar y Nuevo Pedido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}