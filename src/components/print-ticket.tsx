"use client";

import type { OrderItem, TicketConfig } from "@/lib/types";
import GustoPrintLogo from "./gusto-print-logo";

interface PrintTicketProps {
  order: OrderItem[];
  subtotal: number;
  total: number;
  discountAmount?: number;
  settings?: TicketConfig;
  invoice?: string;
  paidAt?: number;
  qrCodeUrl?: string;
}

export default function PrintTicket({ 
  order, 
  subtotal, 
  total, 
  discountAmount = 0,
  settings,
  invoice,
  paidAt,
  qrCodeUrl
}: PrintTicketProps) {
    
    const formattedDate = paidAt 
        ? new Date(paidAt).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric', 
            hour: '2-digit',
            minute: '2-digit'
        });

    const businessName = settings?.restaurantName || settings?.businessName || 'RESTAURANTE APP';
    const thankYouMessage = settings?.thankYouMessage || settings?.footerMessage || '¡Gracias por su compra!';

    const styles = {
        container: {
            width: '80mm',
            fontFamily: '"Courier New", "DejaVu Sans Mono", monospace',
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '1.3',
            color: '#000000'
        },
        businessName: {
            fontSize: '16px',
            fontWeight: '900',
            textTransform: 'uppercase' as const,
            marginBottom: '8px'
        },
        tableHeader: {
            fontWeight: '900',
            fontSize: '12px',
            padding: '4px 2px',
            borderBottom: '2px solid #000'
        },
        tableCell: {
            padding: '4px 2px',
            fontWeight: '700',
            fontSize: '12px',
            verticalAlign: 'top' as const
        },
        itemQuantity: {
            fontWeight: '900',
            fontSize: '13px'
        },
        itemName: {
            fontWeight: '700',
            fontSize: '13px'
        },
        itemPrice: {
            fontWeight: '800',
            fontSize: '13px'
        },
        subtotalText: {
            fontSize: '14px',
            fontWeight: '700'
        },
        totalText: {
            fontWeight: '900',
            fontSize: '18px'
        },
        separator: {
            borderTop: '2px dashed #000',
            margin: '6px 0',
            width: '100%'
        },
        footer: {
            fontSize: '12px',
            fontWeight: '600',
            textAlign: 'center' as const
        }
    };
    
    return (
        <div className="p-3 bg-white text-black" style={styles.container}>
            {/* Solo el nombre del negocio */}
            <div className="text-center mb-3">
                <div style={styles.businessName}>{businessName}</div>
            </div>
            
            <div style={styles.separator}></div>
            <div className="text-center" style={{
                fontWeight: '700',
                fontSize: '14px',
                margin: '6px 0'
            }}>
                PRODUCTOS SOLICITADOS
            </div>
            <div style={styles.separator}></div>
            
            {/* Items Table */}
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
                            <td style={{
                                ...styles.tableCell,
                                ...styles.itemQuantity,
                                width: '15%'
                            }}>
                                {item.quantity}x
                            </td>
                            <td style={{
                                ...styles.tableCell,
                                ...styles.itemName,
                                width: '55%'
                            }}>
                                {item.name}
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#666'
                                }}>
                                    ${item.salePrice.toFixed(2)} c/u
                                </div>
                                {item.notes && (
                                    <div style={{
                                        fontSize: '11px',
                                        fontStyle: 'italic',
                                        fontWeight: '600',
                                        marginTop: '2px'
                                    }}>
                                        ** {item.notes} **
                                    </div>
                                )}
                            </td>
                            <td className="text-right" style={{
                                ...styles.tableCell,
                                ...styles.itemPrice,
                                width: '30%'
                            }}>
                                ${(item.salePrice * item.quantity).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.separator}></div>

            {/* Totals */}
            <div style={styles.subtotalText}>
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between">
                        <span>Descuento:</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            <div style={{
                borderTop: '3px solid #000',
                borderBottom: '3px double #000',
                padding: '8px 0',
                margin: '8px 0'
            }}>
                <div className="flex justify-between" style={styles.totalText}>
                    <span>TOTAL A PAGAR:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
                <div className="text-center my-3">
                    <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        style={{
                            width: '35mm',
                            height: '35mm',
                            margin: '0 auto',
                            display: 'block',
                            border: '1px solid #000'
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Footer */}
            <div style={styles.separator}></div>
            <div style={styles.footer}>
                <div>{thankYouMessage}</div>
                <div style={{
                    fontSize: '11px',
                    marginTop: '4px'
                }}>
                    Sistema TPV - {new Date().toLocaleDateString('es-ES')}
                </div>
            </div>
        </div>
    );
}