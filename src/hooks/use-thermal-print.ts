// use-thermal-print.ts - Hook optimizado para impresión térmica

import { useState, useCallback } from 'react';
import type { OrderItem, TicketConfig, PrintFormat } from '@/lib/types';

interface ThermalPrintData {
  order: OrderItem[];
  subtotal: number;
  total: number;
  discountAmount?: number;
  invoice?: string;
  paidAt?: number;
  tableNumber?: string;
  employeeName?: string;
  qrCodeUrl?: string;
  settings?: TicketConfig;
}

interface UseThermalPrintReturn {
  isPrinting: boolean;
  printCustomerTicket: (data: ThermalPrintData) => Promise<void>;
  printKitchenTicket: (data: ThermalPrintData) => Promise<void>;
  printCashierTicket: (data: ThermalPrintData) => Promise<void>;
  error: string | null;
}

export const useThermalPrint = (): UseThermalPrintReturn => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Importar la función desde el artefacto o copiar aquí
  const generateThermalHTML = useCallback((data: ThermalPrintData, type: 'customer' | 'kitchen' | 'cashier') => {
    // Aquí irá todo el código del generateThermalHTML del artefacto
    // Por ahora uso una versión simplificada, pero debes reemplazar con el código completo
    const { order, subtotal, total, discountAmount = 0, invoice, paidAt, settings, tableNumber, employeeName, qrCodeUrl } = data;
    
    const formattedDate = new Date(paidAt || Date.now()).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const formatArgentinian = (value: number) => {
      return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    };
    
    const sequentialId = invoice ? invoice.slice(-8) : 'PREVIEW';
    const baseSize = settings?.thermalFontSize || '11px';
    const fontWeight = settings?.thermalFontWeight || '700';
    const lineHeight = settings?.thermalLineHeight || '1.2';

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
              }
              
              html, body {
                  font-family: 'Courier New', 'DejaVu Sans Mono', monospace !important;
                  font-size: ${baseSize} !important;
                  font-weight: ${fontWeight} !important;
                  line-height: ${lineHeight} !important;
                  width: 80mm !important;
                  color: #000000 !important;
                  background: #ffffff !important;
              }
              
              body {
                  padding: 3mm !important;
              }
              
              .center { text-align: center !important; }
              .left { text-align: left !important; }
              .row {
                  display: flex !important;
                  justify-content: space-between !important;
                  align-items: flex-start !important;
                  margin: 1mm 0 !important;
                  width: 100% !important;
              }
              
              .item-container {
                  margin: 3mm 0 !important;
                  page-break-inside: avoid !important;
              }
              
              .item-header {
                  font-size: ${parseInt(baseSize) * 0.85}px !important;
                  font-weight: 700 !important;
                  margin-bottom: 1px !important;
              }
              
              .item-name {
                  font-size: ${parseInt(baseSize) * 1.05}px !important;
                  font-weight: 800 !important;
                  word-wrap: break-word !important;
              }
              
              .item-total {
                  font-size: ${parseInt(baseSize) * 1.05}px !important;
                  font-weight: 800 !important;
              }
              
              .separator {
                  border-top: 2px dashed #000000 !important;
                  margin: 4mm 0 !important;
                  width: 100% !important;
              }
              
              .dotted-line {
                  border-top: 1px dotted #666666 !important;
                  margin: 2mm 0 0 0 !important;
                  width: 100% !important;
              }
              
              .total-section {
                  border-top: 3px solid #000000 !important;
                  border-bottom: 3px double #000000 !important;
                  padding: 6px 0 !important;
                  margin: 6px 0 !important;
              }
          </style>
      </head>
      <body>
          ${type === 'customer' ? `
          <!-- INFORMACIÓN DE FACTURA -->
          ${settings?.showRestaurantName && settings?.invoiceType ? `
          <div class="center">
              <div style="font-size: ${parseInt(baseSize) * 2.5}px; font-weight: 900; line-height: 1;">${settings.invoiceType || 'B'}</div>
              <div style="font-size: ${parseInt(baseSize) * 0.9}px; font-weight: 700;">Código N° ${(settings.posNumber || '001').padStart(3, '0')}</div>
          </div>
          ` : ''}
          
          <div class="left" style="margin: 3mm 0;">
              <div style="font-size: ${parseInt(baseSize) * 1.2}px; font-weight: 900;">
                  Factura ${settings?.invoiceType || 'B'}-${(settings?.posNumber || '00001').padStart(5, '0')}-${sequentialId.padStart(8, '0')}
              </div>
              <div><strong>Fecha:</strong> ${formattedDate.split(' ')[0]}</div>
              <div><strong>Hora:</strong> ${formattedDate.split(' ')[1]}</div>
          </div>
          
          <div class="separator"></div>

          <!-- INFORMACIÓN DEL NEGOCIO -->
          <div class="center" style="margin: 3mm 0;">
              ${settings?.showRestaurantName ? `
              <div style="font-size: ${parseInt(baseSize) * 1.3}px; font-weight: 900; text-transform: uppercase;">
                  ${settings.restaurantName || 'Mi Restaurante'}
              </div>` : ''}
              ${settings?.showAddress && settings?.address ? `
              <div style="font-size: ${parseInt(baseSize) * 0.9}px;">${settings.address}</div>` : ''}
              ${settings?.phone ? `
              <div style="font-size: ${parseInt(baseSize) * 0.9}px;">Tel: ${settings.phone}</div>` : ''}
              ${settings?.showTaxId && settings?.taxId ? `
              <div style="font-size: ${parseInt(baseSize) * 0.9}px; font-weight: 700;">CUIT: ${settings.taxId}</div>` : ''}
          </div>

          <div class="separator"></div>
          
          ${tableNumber || employeeName ? `
          ${tableNumber ? `
          <div class="row">
              <span style="font-weight: 700;">Mesa/ID:</span>
              <span style="font-weight: 700;">${tableNumber}</span>
          </div>` : ''}
          ${employeeName ? `
          <div class="row">
              <span style="font-weight: 700;">Atendido por:</span>
              <span>${employeeName}</span>
          </div>` : ''}
          <div class="separator"></div>
          ` : ''}
          
          <div class="center">
              <div style="font-size: ${parseInt(baseSize) * 1.1}px; font-weight: 800;">A CONSUMIDOR FINAL</div>
          </div>
          <div class="separator"></div>
          
          <!-- PRODUCTOS CORREGIDOS -->
          ${order.map((item: any) => `
              <div class="item-container">
                  <div class="item-header">
                      Cant. ${formatArgentinian(item.quantity)} / Precio ${formatArgentinian(item.salePrice)}
                  </div>
                  
                  <div class="row">
                      <div class="item-name" style="width: 65%; margin-right: 8px;">
                          ${item.name}
                      </div>
                      <div class="item-total" style="width: 35%; text-align: right;">
                          ${formatArgentinian(item.salePrice * item.quantity)}
                      </div>
                  </div>
                  
                  ${item.notes ? `
                  <div style="font-size: ${parseInt(baseSize) * 0.9}px; font-weight: 700; font-style: italic; margin-top: 2px; padding-left: 4px;">
                      ** Nota: ${item.notes} **
                  </div>
                  ` : ''}
                  
                  <div class="dotted-line"></div>
              </div>
          `).join('')}

          <!-- TOTALES -->
          <div style="margin: 4mm 0;">
              <div class="row">
                  <span style="font-weight: 700;">Subtotal sin descuentos</span>
                  <span style="font-weight: 700;">${formatArgentinian(subtotal)}</span>
              </div>
              ${discountAmount > 0 ? `
              <div class="row">
                  <span style="font-weight: 700;">Descuento general</span>
                  <span style="font-weight: 700;">-${formatArgentinian(discountAmount)}</span>
              </div>
              ` : ''}
          </div>

          <!-- TOTAL FINAL -->
          <div class="total-section">
              <div class="row">
                  <span style="font-size: ${parseInt(baseSize) * 1.4}px; font-weight: 900;">TOTAL $</span>
                  <span style="font-size: ${parseInt(baseSize) * 1.4}px; font-weight: 900;">${formatArgentinian(total)}</span>
              </div>
          </div>

          <!-- PIE DEL TICKET -->
          <div class="center" style="margin-top: 4mm;">
              ${settings?.showQrCode && qrCodeUrl ? `
              <img src="${qrCodeUrl}" alt="QR Code" style="width: 140px; height: 140px; margin: 4mm auto; display: block; border: 1px solid #000;" onerror="this.style.display='none'" />
              ` : ''}
              
              ${settings?.showThankYouMessage && settings?.thankYouMessage ? `
              <div style="font-weight: 700; margin: 2mm 0;">
                  ${settings.thankYouMessage.split('\n').map((line: string) => `<div>${line}</div>`).join('')}
              </div>
              ` : ''}
              
              ${settings?.legalDisclaimer ? `
              <div style="font-size: ${parseInt(baseSize) * 0.8}px; font-style: italic; margin: 2mm 0;">
                  ${settings.legalDisclaimer}
              </div>
              ` : ''}
          </div>
          ` : type === 'kitchen' ? `
          <!-- TICKET DE COCINA -->
          <div class="center">
              <div style="font-size: ${parseInt(baseSize) * 2.2}px; font-weight: 900;">COMANDA</div>
              ${tableNumber ? `<div style="font-size: ${parseInt(baseSize) * 1.6}px; font-weight: 900;">${tableNumber}</div>` : ''}
              <div>${formattedDate}</div>
          </div>
          
          <div class="separator"></div>
          
          ${order.map((item: any) => `
              <div class="item-container">
                  <div class="row">
                      <span style="font-size: ${parseInt(baseSize) * 1.3}px; font-weight: 900;">${item.quantity}x</span>
                      <span style="font-size: ${parseInt(baseSize) * 1.1}px; font-weight: 800; margin-left: 8px;">${item.name}</span>
                  </div>
                  ${item.notes ? `
                  <div style="font-style: italic; margin-top: 3mm; padding-left: 8mm; font-weight: 800;">
                      ** ${item.notes} **
                  </div>
                  ` : ''}
              </div>
          `).join('')}
          ` : `
          <!-- TICKET DE CAJA -->
          <div class="center">
              <div style="font-size: ${parseInt(baseSize) * 1.6}px; font-weight: 900;">COPIA CAJA</div>
              <div>Pedido: ${invoice || 'PREVIEW'}</div>
              <div>${formattedDate}</div>
          </div>
          
          <div class="separator"></div>
          
          ${order.map((item: any) => `
              <div class="row" style="margin: 2mm 0;">
                  <span style="font-weight: 800;">${item.quantity}x</span>
                  <span style="font-weight: 700; width: 50%; margin: 0 4px;">${item.name}</span>
                  <span style="font-weight: 700;">${formatArgentinian(item.salePrice * item.quantity)}</span>
              </div>
          `).join('')}
          
          <div class="separator"></div>
          <div class="row">
              <span style="font-weight: 900;">TOTAL:</span>
              <span style="font-weight: 900;">${formatArgentinian(total)}</span>
          </div>
          `}
          
          <div style="height: 10mm;"></div>
      </body>
      </html>
    `;
  }, []);

  const printThermalTicket = useCallback(async (data: ThermalPrintData, type: 'customer' | 'kitchen' | 'cashier') => {
    setIsPrinting(true);
    setError(null);

    try {
      console.log(`🖨️ VERSIÓN 3.0 OPTIMIZADA - Iniciando impresión térmica ${type}...`);
      
      const printWindow = window.open('', '_blank', 'width=300,height=600,scrollbars=no,resizable=no');
      
      if (!printWindow) {
        throw new Error('No se pudo abrir ventana de impresión. Permite las ventanas emergentes.');
      }
      
      const content = generateThermalHTML(data, type);
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
      
      // Timeout de seguridad
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 15000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en impresión';
      setError(errorMessage);
      console.error('❌ Error en impresión:', errorMessage);
      throw err;
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
      }, 2000);
    }
  }, [generateThermalHTML]);

  const printCustomerTicket = useCallback(async (data: ThermalPrintData) => {
    return printThermalTicket(data, 'customer');
  }, [printThermalTicket]);

  const printKitchenTicket = useCallback(async (data: ThermalPrintData) => {
    return printThermalTicket(data, 'kitchen');
  }, [printThermalTicket]);

  const printCashierTicket = useCallback(async (data: ThermalPrintData) => {
    return printThermalTicket(data, 'cashier');
  }, [printThermalTicket]);

  return {
    isPrinting,
    printCustomerTicket,
    printKitchenTicket,
    printCashierTicket,
    error
  };
};