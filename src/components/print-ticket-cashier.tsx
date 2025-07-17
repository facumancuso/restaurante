"use client";

import type { OrderItem, PrintData } from "@/lib/types";

interface PrintTicketCashierProps extends Omit<PrintData, 'type' | 'order'> {}

export default function PrintTicketCashier({ order, subtotal, total, discountAmount, paidAt, invoice, settings }: PrintTicketCashierProps) {
    const formattedDate = new Date(paidAt).toLocaleString('es-ES');
    
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
            fontSize: '18px',
            fontWeight: '900',
            textTransform: 'uppercase' as const,
            marginBottom: '8px'
        },
        invoiceNumber: {
            fontWeight: '900',
            fontSize: '15px'
        },
        dateText: {
            fontWeight: '700',
            fontSize: '13px'
        },
        tableHeader: {
            fontWeight: '900',
            fontSize: '13px',
            padding: '4px 8px',
            borderBottom: '2px solid #000'
        },
        tableCell: {
            padding: '4px 8px',
            fontWeight: '700',
            fontSize: '13px',
            borderBottom: '1px solid #000'
        },
        itemQuantity: {
            fontWeight: '900',
            fontSize: '14px'
        },
        itemPrice: {
            fontWeight: '800',
            fontSize: '14px'
        },
        subtotalText: {
            fontSize: '14px',
            fontWeight: '700'
        },
        totalText: {
            fontWeight: '900',
            fontSize: '16px'
        },
        separator: {
            borderTop: '2px dashed #000',
            margin: '8px 0',
            width: '100%'
        },
        solidLine: {
            borderTop: '2px solid #000',
            margin: '8px 0',
            width: '100%'
        }
    };
    
    return (
        <div className="p-4 bg-white text-black" style={styles.container}>
            <div className="text-center mb-4">
                <h1 style={styles.title}>COPIA CAJA</h1>
                <p style={styles.invoiceNumber}>Pedido: {invoice}</p>
                <p style={styles.dateText}>{formattedDate}</p>
            </div>
            
            <div style={styles.separator}></div>
            
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th className="text-left" style={styles.tableHeader}>CANT</th>
                        <th className="text-left" style={styles.tableHeader}>ARTÍCULO</th>
                        <th className="text-right" style={styles.tableHeader}>PRECIO</th>
                    </tr>
                </thead>
                <tbody>
                    {order.map(item => (
                        <tr key={item.id}>
                            <td className="align-top" style={{
                                ...styles.tableCell,
                                ...styles.itemQuantity
                            }}>
                                {item.quantity}x
                            </td>
                            <td className="align-top" style={{
                                ...styles.tableCell,
                                fontWeight: '700'
                            }}>
                                {item.name}
                                {item.notes && (
                                    <div style={{
                                        fontSize: '12px',
                                        fontStyle: 'italic',
                                        fontWeight: '600',
                                        marginTop: '2px'
                                    }}>
                                        ** {item.notes} **
                                    </div>
                                )}
                            </td>
                            <td className="align-top text-right" style={{
                                ...styles.tableCell,
                                ...styles.itemPrice
                            }}>
                                ${(item.salePrice * item.quantity).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.separator}></div>

            <div style={styles.subtotalText}>
                <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between mb-2">
                        <span>Descuento:</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            <div style={styles.solidLine}></div>

            <div className="flex justify-between" style={styles.totalText}>
                <span>TOTAL:</span>
                <span>${total.toFixed(2)}</span>
            </div>

            <div style={styles.separator}></div>
            
            <div className="text-center" style={{
                fontSize: '12px',
                fontWeight: '600',
                marginTop: '8px'
            }}>
                <p>COPIA PARA CAJA</p>
                <p>Sistema TPV - {new Date().toLocaleDateString('es-ES')}</p>
            </div>
        </div>
    );
}