// // /lib/thermal-print.ts
// // Librería especializada para impresión térmica en 3nstar RPT008 - VERSIÓN OPTIMIZADA

// import { useState, useCallback } from 'react';
// import type { PrintData, TicketConfig, PrintFormat } from '@/lib/types';

// /**
//  * Configuración específica para impresora térmica 3nstar RPT008 - MEJORADA
//  */
// const THERMAL_CONFIG = {
//   width: '80mm',
//   fontFamily: '"Courier New", "DejaVu Sans Mono", "Liberation Mono", monospace',
//   fontSize: '14px',        // Aumentado de 12px
//   lineHeight: '1.3',       // Mejorado de 1.2
//   encoding: 'UTF-8',
//   fontWeight: '600'        // Añadido para mejor legibilidad
// } as const;

// interface SalesReportData {
//   filteredOrders: Array<{
//     invoiceNumber?: string;
//     paidAt: number;
//     tableNumber: string;
//     total?: number;
//   }>;
//   salesSummary: {
//     totalOrders: number;
//     totalRevenue: number;
//     totalDiscount: number;
//   };
// }

// interface DateRange {
//   from?: Date;
//   to?: Date;
// }

// /**
//  * Función principal para imprimir recibos térmicos - MEJORADA
//  */
// export const printThermalReceipt = async (
//   printData: PrintData, 
//   format: PrintFormat = 'thermal-80mm'
// ): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Limpiar cualquier impresión anterior
//       clearPreviousPrint();
      
//       // Preparar el contenido HTML optimizado para térmica
//       const thermalContent = generateOptimizedThermalHTML(printData);
      
//       // Crear ventana de impresión dedicada
//       const printWindow = createThermalPrintWindow();
      
//       if (printWindow) {
//         // Configurar la ventana para impresión térmica
//         setupThermalPrintWindow(printWindow, thermalContent, resolve, reject);
//       } else {
//         // Fallback: usar método tradicional mejorado
//         fallbackThermalPrint(thermalContent, resolve, reject);
//       }
      
//     } catch (error) {
//       console.error('Error en printThermalReceipt:', error);
//       reject(error);
//     }
//   });
// };

// /**
//  * Función para imprimir reportes de ventas en formato térmico - MEJORADA
//  */
// export const printThermalSalesReport = async (
//   salesData: SalesReportData, 
//   dateRange: DateRange | undefined, 
//   settings: TicketConfig
// ): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     try {
//       const reportContent = generateThermalSalesReport(salesData, dateRange, settings);
//       const printWindow = createThermalPrintWindow();
      
//       if (printWindow) {
//         setupThermalPrintWindow(printWindow, reportContent, resolve, reject);
//       } else {
//         fallbackThermalPrint(reportContent, resolve, reject);
//       }
      
//     } catch (error) {
//       console.error('Error en printThermalSalesReport:', error);
//       reject(error);
//     }
//   });
// };

// /**
//  * Limpiar elementos de impresión anteriores
//  */
// const clearPreviousPrint = (): void => {
//   // Remover estilos de impresión anteriores
//   const oldStyles = document.querySelectorAll('[data-thermal-print="true"]');
//   oldStyles.forEach(style => style.remove());
  
//   // Limpiar áreas de impresión
//   const printAreas = document.querySelectorAll('.thermal-print-area, .print-area');
//   printAreas.forEach(area => {
//     if (area instanceof HTMLElement) {
//       area.innerHTML = '';
//       area.style.display = 'none';
//     }
//   });
// };

// /**
//  * Generar HTML optimizado para impresión térmica - MEJORADO
//  */
// const generateOptimizedThermalHTML = (printData: PrintData): string => {
//   const { order, subtotal, total, discountAmount, paidAt, invoice, settings, tableNumber, employeeName, qrCodeUrl } = printData;
  
//   return `
//     <!DOCTYPE html>
//     <html lang="es">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Ticket - ${invoice}</title>
//         ${getThermalPrintStyles()}
//     </head>
//     <body>
//         <div class="thermal-receipt">
//             ${generateReceiptHeader(settings)}
//             ${generateReceiptInfo(invoice, paidAt, tableNumber, employeeName)}
//             ${generateOrderDetails(order)}
//             ${generateTotals(subtotal, total, discountAmount)}
//             ${qrCodeUrl ? generateQRCode(qrCodeUrl) : ''}
//             ${generateReceiptFooter(settings)}
//         </div>
//     </body>
//     </html>
//   `;
// };

// /**
//  * Estilos CSS optimizados para impresión térmica - VERSIÓN MEJORADA
//  */
// const getThermalPrintStyles = (): string => `
//     <style data-thermal-print="true">
//         @page {
//             size: 80mm auto !important;
//             margin: 0 !important;
//             padding: 0 !important;
//         }
        
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//             -webkit-font-smoothing: none !important;
//             font-smoothing: none !important;
//         }
        
//         html, body {
//             width: 80mm !important;
//             font-family: ${THERMAL_CONFIG.fontFamily} !important;
//             font-size: ${THERMAL_CONFIG.fontSize} !important;
//             font-weight: ${THERMAL_CONFIG.fontWeight} !important;
//             line-height: ${THERMAL_CONFIG.lineHeight} !important;
//             color: #000000 !important;
//             background: #ffffff !important;
//             margin: 0 !important;
//             padding: 0 !important;
//         }
        
//         .thermal-receipt {
//             width: 80mm !important;
//             max-width: 80mm !important;
//             padding: 3mm !important;
//             margin: 0 !important;
//             font-family: ${THERMAL_CONFIG.fontFamily} !important;
//             font-size: ${THERMAL_CONFIG.fontSize} !important;
//             font-weight: ${THERMAL_CONFIG.fontWeight} !important;
//             line-height: ${THERMAL_CONFIG.lineHeight} !important;
//         }
        
//         .thermal-center { 
//             text-align: center !important; 
//             font-weight: 700 !important;
//         }
        
//         .thermal-left { 
//             text-align: left !important; 
//             font-weight: 600 !important;
//         }
        
//         .thermal-right { 
//             text-align: right !important; 
//             font-weight: 700 !important;
//         }
        
//         .thermal-bold { 
//             font-weight: 900 !important;
//             font-size: 15px !important;
//         }
        
//         .thermal-small { 
//             font-size: 12px !important;
//             font-weight: 600 !important;
//         }
        
//         .thermal-separator {
//             border-top: 2px dashed #000000 !important;
//             margin: 3mm 0 !important;
//             width: 100% !important;
//             height: 2px !important;
//         }
        
//         .thermal-line {
//             border-top: 2px solid #000000 !important;
//             margin: 2mm 0 !important;
//             width: 100% !important;
//             height: 2px !important;
//         }
        
//         .thermal-row {
//             display: flex !important;
//             justify-content: space-between !important;
//             align-items: center !important;
//             margin: 1mm 0 !important;
//             width: 100% !important;
//             font-weight: 600 !important;
//         }
        
//         .thermal-row-left {
//             flex: 1 !important;
//             text-align: left !important;
//             margin-right: 3mm !important;
//             font-weight: 600 !important;
//         }
        
//         .thermal-row-right {
//             flex: 0 0 auto !important;
//             text-align: right !important;
//             white-space: nowrap !important;
//             font-weight: 700 !important;
//             font-size: 15px !important;
//         }
        
//         .thermal-business-name {
//             font-size: 16px !important;
//             font-weight: 900 !important;
//             text-align: center !important;
//             margin-bottom: 2mm !important;
//             text-transform: uppercase !important;
//         }
        
//         .thermal-business-info {
//             font-size: 12px !important;
//             font-weight: 600 !important;
//             text-align: center !important;
//             margin-bottom: 1.5mm !important;
//         }
        
//         .thermal-header {
//             margin-bottom: 4mm !important;
//             padding-bottom: 2mm !important;
//         }
        
//         .thermal-footer {
//             margin-top: 4mm !important;
//             padding-top: 3mm !important;
//             border-top: 2px dashed #000000 !important;
//             text-align: center !important;
//             font-size: 12px !important;
//             font-weight: 600 !important;
//         }
        
//         .thermal-item {
//             margin: 2mm 0 !important;
//             padding: 1mm 0 !important;
//             border-bottom: 1px dotted #000000 !important;
//         }
        
//         .thermal-item-name {
//             font-weight: 800 !important;
//             font-size: 14px !important;
//             margin-bottom: 1mm !important;
//         }
        
//         .thermal-item-details {
//             font-size: 12px !important;
//             font-weight: 600 !important;
//             color: #000000 !important;
//         }
        
//         .thermal-totals {
//             margin-top: 4mm !important;
//             padding-top: 3mm !important;
//             border-top: 2px solid #000000 !important;
//         }
        
//         .thermal-total-line {
//             display: flex !important;
//             justify-content: space-between !important;
//             margin: 2mm 0 !important;
//             font-weight: 700 !important;
//             font-size: 14px !important;
//         }
        
//         .thermal-grand-total {
//             font-weight: 900 !important;
//             font-size: 18px !important;
//             border-top: 3px solid #000000 !important;
//             border-bottom: 3px double #000000 !important;
//             padding: 3mm 0 !important;
//             margin: 3mm 0 !important;
//             text-transform: uppercase !important;
//         }
        
//         .thermal-qr {
//             width: 35mm !important;
//             height: 35mm !important;
//             margin: 3mm auto !important;
//             display: block !important;
//             border: 1px solid #000000 !important;
//         }
        
//         .thermal-quantity {
//             font-weight: 900 !important;
//             font-size: 15px !important;
//             color: #000000 !important;
//         }
        
//         .thermal-price {
//             font-weight: 800 !important;
//             font-size: 15px !important;
//             color: #000000 !important;
//         }
        
//         .thermal-invoice-number {
//             font-weight: 900 !important;
//             font-size: 16px !important;
//             color: #000000 !important;
//             text-transform: uppercase !important;
//         }
        
//         .thermal-critical {
//             font-weight: 900 !important;
//             font-size: 16px !important;
//             color: #000000 !important;
//             text-shadow: none !important;
//         }
        
//         @media print {
//             * { 
//                 -webkit-print-color-adjust: exact !important;
//                 print-color-adjust: exact !important;
//                 -webkit-font-smoothing: none !important;
//                 font-smoothing: none !important;
//             }
            
//             .thermal-bold,
//             .thermal-grand-total,
//             .thermal-business-name,
//             .thermal-invoice-number,
//             .thermal-quantity,
//             .thermal-price,
//             .thermal-critical {
//                 color: #000000 !important;
//                 text-shadow: none !important;
//             }
//         }
//     </style>
// `;

// /**
//  * Generar encabezado del recibo - SOLO NOMBRE DEL RESTAURANTE
//  */
// const generateReceiptHeader = (settings: TicketConfig): string => {
//   const businessName = settings.restaurantName || settings.businessName || '';
//   if (!businessName) {
//     return `<div class="thermal-header"></div>`;
//   }
  
//   return `
//     <div class="thermal-header">
//       <div class="thermal-business-name">${escapeHtml(businessName)}</div>
//     </div>
//   `;
// };

// /**
//  * Generar información del recibo - SIN HEADER, DIRECTO A PRODUCTOS
//  */
// const generateReceiptInfo = (
//   invoice: string, 
//   paidAt: number, 
//   tableNumber?: string, 
//   employeeName?: string
// ): string => `
//     <div class="thermal-separator"></div>
//     <div class="thermal-center thermal-bold">PRODUCTOS SOLICITADOS</div>
//     <div class="thermal-separator"></div>
// `;

// /**
//  * Generar detalles de la orden - MEJORADO
//  */
// const generateOrderDetails = (order: PrintData['order']): string => 
//     order.map(item => `
//         <div class="thermal-item">
//             <div class="thermal-row">
//                 <div class="thermal-row-left thermal-item-name">${escapeHtml(item.name)}</div>
//                 <div class="thermal-row-right thermal-price">$${(item.salePrice * item.quantity).toFixed(2)}</div>
//             </div>
//             <div class="thermal-row">
//                 <div class="thermal-row-left thermal-item-details">
//                     <span class="thermal-quantity">${item.quantity}</span> x 
//                     <span class="thermal-price">$${item.salePrice.toFixed(2)}</span>
//                 </div>
//                 <div class="thermal-row-right"></div>
//             </div>
//             ${item.notes ? `<div class="thermal-small thermal-bold">Nota: ${escapeHtml(item.notes)}</div>` : ''}
//         </div>
//     `).join('');

// /**
//  * Generar totales - MEJORADO
//  */
// const generateTotals = (subtotal: number, total: number, discountAmount: number): string => `
//     <div class="thermal-totals">
//         <div class="thermal-total-line">
//             <div class="thermal-row-left thermal-bold">Subtotal:</div>
//             <div class="thermal-row-right thermal-price">$${subtotal.toFixed(2)}</div>
//         </div>
//         ${discountAmount > 0 ? `
//         <div class="thermal-total-line">
//             <div class="thermal-row-left thermal-bold">Descuento:</div>
//             <div class="thermal-row-right thermal-price">-$${discountAmount.toFixed(2)}</div>
//         </div>` : ''}
//         <div class="thermal-grand-total">
//             <div class="thermal-row">
//                 <div class="thermal-row-left thermal-critical">TOTAL:</div>
//                 <div class="thermal-row-right thermal-critical">$${total.toFixed(2)}</div>
//             </div>
//         </div>
//     </div>
// `;

// /**
//  * Generar código QR - MEJORADO
//  */
// const generateQRCode = (qrCodeUrl: string): string => `
//     <div class="thermal-center">
//         <img src="${qrCodeUrl}" alt="QR Code" class="thermal-qr" onerror="this.style.display='none'" />
//     </div>
// `;

// /**
//  * Generar pie del recibo - MEJORADO
//  */
// const generateReceiptFooter = (settings: TicketConfig): string => `
//     <div class="thermal-footer">
//         ${settings.footerMessage || settings.thankYouMessage ? `<div class="thermal-bold">${escapeHtml(settings.footerMessage || settings.thankYouMessage)}</div>` : ''}
//         <div class="thermal-bold">¡Gracias por su compra!</div>
//         <div class="thermal-small">Sistema TPV - ${new Date().toLocaleDateString('es-ES')}</div>
//     </div>
// `;

// /**
//  * Crear ventana de impresión térmica
//  */
// const createThermalPrintWindow = (): Window | null => {
//   try {
//     return window.open('', '_blank', 'width=320,height=600,scrollbars=no,resizable=no');
//   } catch (error) {
//     console.warn('No se pudo crear ventana de impresión:', error);
//     return null;
//   }
// };

// /**
//  * Configurar ventana de impresión térmica
//  */
// const setupThermalPrintWindow = (
//   printWindow: Window, 
//   content: string, 
//   resolve: () => void, 
//   reject: (error: Error) => void
// ): void => {
//   try {
//     printWindow.document.write(content);
//     printWindow.document.close();
    
//     printWindow.onload = () => {
//       setTimeout(() => {
//         try {
//           printWindow.print();
//           printWindow.close();
//           resolve();
//         } catch (error) {
//           console.error('Error al imprimir:', error);
//           printWindow.close();
//           reject(error instanceof Error ? error : new Error('Error desconocido al imprimir'));
//         }
//       }, 1000);
//     };
    
//     setTimeout(() => {
//       if (!printWindow.closed) {
//         printWindow.close();
//         reject(new Error('Timeout en impresión'));
//       }
//     }, 10000);
    
//   } catch (error) {
//     printWindow.close();
//     reject(error instanceof Error ? error : new Error('Error al configurar ventana de impresión'));
//   }
// };

// /**
//  * Método de impresión fallback - MEJORADO
//  */
// const fallbackThermalPrint = (
//   content: string, 
//   resolve: () => void, 
//   reject: (error: Error) => void
// ): void => {
//   try {
//     // Inyectar estilos en la página actual
//     const styleElement = document.createElement('style');
//     styleElement.setAttribute('data-thermal-print', 'true');
//     styleElement.innerHTML = getThermalPrintStyles().replace(/<\/?style[^>]*>/g, '');
//     document.head.appendChild(styleElement);
    
//     // Buscar o crear área de impresión
//     let printArea = document.querySelector('.thermal-print-area') as HTMLElement;
//     if (!printArea) {
//       printArea = document.createElement('div');
//       printArea.className = 'thermal-print-area';
//       document.body.appendChild(printArea);
//     }
    
//     // Insertar contenido
//     const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
//     printArea.innerHTML = bodyMatch ? bodyMatch[1] : content;
//     printArea.style.display = 'block';
//     printArea.style.visibility = 'visible';
    
//     // Configurar eventos de impresión
//     const beforePrint = () => {
//       document.body.style.visibility = 'hidden';
//       printArea.style.visibility = 'visible';
//       printArea.style.display = 'block';
//     };
    
//     const afterPrint = () => {
//       document.body.style.visibility = 'visible';
//       printArea.style.display = 'none';
//       printArea.innerHTML = '';
//       styleElement.remove();
//       window.removeEventListener('beforeprint', beforePrint);
//       window.removeEventListener('afterprint', afterPrint);
//       resolve();
//     };
    
//     window.addEventListener('beforeprint', beforePrint);
//     window.addEventListener('afterprint', afterPrint);
    
//     setTimeout(() => {
//       window.print();
//     }, 500);
    
//   } catch (error) {
//     reject(error instanceof Error ? error : new Error('Error en impresión fallback'));
//   }
// };

// /**
//  * Generar reporte de ventas para impresión térmica - MEJORADO
//  */
// const generateThermalSalesReport = (
//   salesData: SalesReportData, 
//   dateRange: DateRange | undefined, 
//   settings: TicketConfig
// ): string => {
//   const { filteredOrders, salesSummary } = salesData;
//   const reportDate = dateRange?.from ? 
//     dateRange.from.toLocaleDateString('es-ES') : 
//     new Date().toLocaleDateString('es-ES');
//   const reportDateTo = dateRange?.to ? 
//     dateRange.to.toLocaleDateString('es-ES') : '';

//   const reportContent = `
//     <div class="thermal-center thermal-bold">
//       ${settings?.businessName || settings?.restaurantName || 'NEGOCIO'}
//     </div>
//     <div class="thermal-center thermal-bold">REPORTE DE VENTAS</div>
//     <div class="thermal-separator"></div>
    
//     <div class="thermal-row">
//       <span class="thermal-bold">Fecha:</span>
//       <span class="thermal-bold">${reportDate}${reportDateTo ? ` - ${reportDateTo}` : ''}</span>
//     </div>
//     <div class="thermal-row">
//       <span class="thermal-bold">Hora:</span>
//       <span class="thermal-bold">${new Date().toLocaleTimeString('es-ES')}</span>
//     </div>
    
//     <div class="thermal-separator"></div>
//     <div class="thermal-center thermal-bold">RESUMEN</div>
//     <div class="thermal-separator"></div>
    
//     <div class="thermal-row thermal-bold">
//       <span>Total Pedidos:</span>
//       <span class="thermal-critical">${salesSummary.totalOrders}</span>
//     </div>
//     <div class="thermal-row thermal-bold">
//       <span>Ingresos:</span>
//       <span class="thermal-critical">$${salesSummary.totalRevenue.toFixed(2)}</span>
//     </div>
//     <div class="thermal-row">
//       <span class="thermal-bold">Descuentos:</span>
//       <span class="thermal-price">$${salesSummary.totalDiscount.toFixed(2)}</span>
//     </div>
    
//     <div class="thermal-separator"></div>
//     <div class="thermal-center thermal-bold">DETALLE</div>
//     <div class="thermal-separator"></div>
    
//     ${filteredOrders.slice(0, 20).map(order => `
//       <div class="thermal-row thermal-small">
//         <span class="thermal-bold">#${order.invoiceNumber?.slice(-6) || 'N/A'}</span>
//         <span class="thermal-bold">${new Date(order.paidAt).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</span>
//       </div>
//       <div class="thermal-row thermal-small">
//         <span>Mesa: ${order.tableNumber}</span>
//         <span class="thermal-price">$${order.total?.toFixed(2) || '0.00'}</span>
//       </div>
//       <div style="margin: 1mm 0; border-bottom: 1px dotted #000;"></div>
//     `).join('')}
    
//     <div class="thermal-separator"></div>
//     <div class="thermal-center thermal-small">
//       <div class="thermal-bold">Impreso: ${new Date().toLocaleString('es-ES')}</div>
//     </div>
//     <div class="thermal-center thermal-small">
//       <div class="thermal-bold">Sistema TPV</div>
//     </div>
//   `;

//   return `
//     <!DOCTYPE html>
//     <html lang="es">
//     <head>
//         <meta charset="UTF-8">
//         <title>Reporte de Ventas</title>
//         ${getThermalPrintStyles()}
//     </head>
//     <body>
//         <div class="thermal-receipt">
//             ${reportContent}
//         </div>
//     </body>
//     </html>
//   `;
// };

// /**
//  * Escapar HTML para prevenir inyección
//  */
// const escapeHtml = (text: string): string => {
//   const div = document.createElement('div');
//   div.textContent = text;
//   return div.innerHTML;
// };

// // Hook personalizado para React - MEJORADO
// export const useThermalPrint = () => {
//   const [isPrinting, setIsPrinting] = useState<boolean>(false);
  
//   const printReceipt = useCallback(async (printData: PrintData, format: PrintFormat = 'thermal-80mm') => {
//     setIsPrinting(true);
//     try {
//       await printThermalReceipt(printData, format);
//     } catch (error) {
//       console.error('Error en impresión:', error);
//       throw error;
//     } finally {
//       setIsPrinting(false);
//     }
//   }, []);
  
//   const printSalesReport = useCallback(async (salesData: SalesReportData, dateRange: DateRange | undefined, settings: TicketConfig) => {
//     setIsPrinting(true);
//     try {
//       await printThermalSalesReport(salesData, dateRange, settings);
//     } catch (error) {
//       console.error('Error en impresión de reporte:', error);
//       throw error;
//     } finally {
//       setIsPrinting(false);
//     }
//   }, []);
  
//   return {
//     printReceipt,
//     printSalesReport,
//     isPrinting
//   };
// };