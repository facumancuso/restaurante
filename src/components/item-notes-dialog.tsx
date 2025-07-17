
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { OrderItem } from "@/lib/types";

interface ItemNotesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (itemId: string, notes: string) => void;
    item: OrderItem | null;
}

export default function ItemNotesDialog({ isOpen, onClose, onSave, item }: ItemNotesDialogProps) {
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (item) {
            setNotes(item.notes || '');
        }
    }, [item]);

    const handleSave = () => {
        if (item) {
            onSave(item.id, notes);
        }
    };

    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md no-print">
                <DialogHeader>
                    <DialogTitle>Notas para: {item.name}</DialogTitle>
                    <DialogDescription>
                        Añade instrucciones especiales para este artículo. Se imprimirán en la comanda de cocina.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="notes-textarea">Notas</Label>
                    <Textarea
                        id="notes-textarea"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Sin tomate, poco hecho, etc."
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Notas</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
