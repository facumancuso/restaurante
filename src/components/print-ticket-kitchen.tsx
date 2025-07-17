"use client";

import type { OrderItem } from "@/lib/types";
import { Fragment } from "react";

interface PrintTicketKitchenProps {
  order: OrderItem[];
  paidAt: number;
  invoiceNumber: string;
  tableNumber: string;
  employeeName?: string;
}

export default function PrintTicketKitchen({ order, paidAt, invoiceNumber, tableNumber, employeeName }: PrintTicketKitchenProps) {
    
    const formattedDate = new Date(paidAt).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const kitchenItems = order.filter(item => item.printingStation === 'cocina');
    const barItems = order.filter(item => item.printingStation === 'barra');

    const styles = {
        container: {
            width: '80mm',
            fontFamily: '"Courier New", "DejaVu Sans Mono", monospace',
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '1.3',
            color: '#000000'
        },
        title: {
            fontSize: '24px',
            fontWeight: '900',
            textTransform: 'uppercase' as const,
            marginBottom: '8px'
        },
        tableNumber: {
            fontSize: '20px',
            fontWeight: '900',
            marginBottom: '4px'
        },
        dateText: {
            fontSize: '13px',
            fontWeight: '700'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '900',
            textTransform: 'uppercase' as const,
            margin: '12px 0 8px 0'
        },
        itemQuantity: {
            fontSize: '20px',
            fontWeight: '900'
        },
        itemName: {
            fontSize: '18px',
            fontWeight: '800'
        },
        itemNotes: {
            fontSize: '16px',
            fontWeight: '800',
            fontStyle: 'italic' as const,
            marginTop: '4px',
            paddingLeft: '16px'
        },
        separator: {
            borderTop: '2px dashed #000',
            margin: '8px 0',
            width: '100%'
        },
        timeStamp: {
            fontSize: '14px',
            fontWeight: '700'
        }
    };

    const renderItems = (items: OrderItem[]) => (
        <ul className="list-none p-0 m-0">
            {items.map(item => (
                <li key={item.id} className="my-3">
                    <p style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '8px'
                    }}>
                        <span style={styles.itemQuantity}>{item.quantity}x</span>
                        <span style={styles.itemName}>{item.name}</span>
                    </p>
                    {item.notes && (
                        <p style={styles.itemNotes}>
                            ** {item.notes} **
                        </p>
                    )}
                </li>
            ))}
        </ul>
    );
    
    return (
        <div className="p-4 bg-white text-black" style={styles.container}>
            <div className="text-center mb-3">
                <h1 style={styles.title}>COMANDA</h1>
                {tableNumber && <p style={styles.tableNumber}>{tableNumber}</p>}
                <p style={styles.dateText}>{formattedDate}</p>
                <p style={styles.dateText}>Pedido: {invoiceNumber}</p>
                {employeeName && (
                    <p style={styles.dateText}>
                        Atendido por: {employeeName}
                    </p>
                )}
            </div>
            
            <div style={styles.separator}></div>

            {kitchenItems.length > 0 && (
                <Fragment>
                    <h2 className="text-center" style={styles.sectionTitle}>
                        -- COCINA --
                    </h2>
                    {renderItems(kitchenItems)}
                    <div style={styles.separator}></div>
                </Fragment>
            )}

            {barItems.length > 0 && (
                <Fragment>
                    <h2 className="text-center" style={styles.sectionTitle}>
                        -- BARRA --
                    </h2>
                    {renderItems(barItems)}
                    <div style={styles.separator}></div>
                </Fragment>
            )}

            {kitchenItems.length === 0 && barItems.length === 0 && (
                <p className="text-center" style={{
                    fontWeight: '700',
                    fontSize: '14px'
                }}>
                    No hay artículos para cocina o barra.
                </p>
            )}

            <div className="text-center mt-4">
                <p style={styles.timeStamp}>
                    HORA DE IMPRESIÓN: {new Date().toLocaleTimeString('es-ES')}
                </p>
                <p style={{
                    fontSize: '13px',
                    fontWeight: '600'
                }}>
                    Comanda #{invoiceNumber.slice(-6)}
                </p>
            </div>
        </div>
    );
}