import type {
  PrintData,
  PrintFormat,
  SalesReportData,
  DateRange,
  TicketConfig,
} from '@/lib/types';

import { useState, useCallback } from 'react';

// ================== Funciones auxiliares ================== //

const generateThermalContent = (
  printData: PrintData,
  format: PrintFormat
): string => {
  const {
    order,
    subtotal,
    total,
    discountAmount,
    paidAt,
    invoice,
    settings,
    tableNumber,
    employeeName,
    qrCodeUrl,
  } = printData;

  return `
    <div class="thermal-receipt">
      <div class="thermal-header">
        ${settings.businessName ? `<div class="thermal-business-name">${settings.businessName}</div>` : ''}
        ${settings.businessAddress ? `<div class="thermal-business-info">${settings.businessAddress}</div>` : ''}
        ${settings.businessPhone ? `<div class="thermal-business-info">Tel: ${settings.businessPhone}</div>` : ''}
        ${settings.businessEmail ? `<div class="thermal-business-info">${settings.businessEmail}</div>` : ''}
      </div>

      <div class="thermal-separator"></div>

      <div class="thermal-center">
        <div class="thermal-bold">TICKET DE VENTA</div>
        <div class="thermal-small">Factura: ${invoice}</div>
        <div class="thermal-small">${new Date(paidAt).toLocaleString('es-ES')}</div>
      </div>

      <div class="thermal-separator"></div>

      <div class="thermal-row">
        <div class="thermal-row-left">Mesa/ID:</div>
        <div class="thermal-row-right">${tableNumber}</div>
      </div>
      ${employeeName ? `
        <div class="thermal-row">
          <div class="thermal-row-left">Empleado:</div>
          <div class="thermal-row-right">${employeeName}</div>
        </div>` : ''}

      <div class="thermal-separator"></div>

      <div class="thermal-center thermal-bold">DETALLE DEL PEDIDO</div>
      <div class="thermal-separator"></div>

      ${order.map(item => `
        <div class="thermal-item">
          <div class="thermal-row">
            <div class="thermal-row-left thermal-item-name">${item.name}</div>
            <div class="thermal-row-right">$${(item.salePrice * item.quantity).toFixed(2)}</div>
          </div>
          <div class="thermal-row">
            <div class="thermal-row-left thermal-small">${item.quantity} x $${item.salePrice.toFixed(2)}</div>
          </div>
          ${item.notes ? `<div class="thermal-small">Nota: ${item.notes}</div>` : ''}
        </div>
      `).join('')}

      <div class="thermal-totals">
        <div class="thermal-total-line">
          <div class="thermal-row-left">Subtotal:</div>
          <div class="thermal-row-right">$${(subtotal ?? 0).toFixed(2)}</div>
        </div>
        ${(discountAmount ?? 0) > 0 ? `
          <div class="thermal-total-line">
            <div class="thermal-row-left">Descuento:</div>
            <div class="thermal-row-right">-$${(discountAmount ?? 0).toFixed(2)}</div>
          </div>` : ''}
        <div class="thermal-grand-total">
          <div class="thermal-row">
            <div class="thermal-row-left">TOTAL:</div>
            <div class="thermal-row-right">$${(total ?? 0).toFixed(2)}</div>
          </div>
        </div>
      </div>

      ${qrCodeUrl ? `
        <div class="thermal-center">
          <img src="${qrCodeUrl}" alt="QR Code" class="thermal-qr" />
        </div>` : ''}

      <div class="thermal-footer">
        ${settings.footerMessage ? `<div>${settings.footerMessage}</div>` : ''}
        <div>¡Gracias por su compra!</div>
        <div class="thermal-small">Sistema TPV - ${new Date().toLocaleDateString('es-ES')}</div>
      </div>
    </div>
  `;
};

const injectThermalPrintStyles = (): void => {
  const styleId = 'thermal-print-styles';
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) existingStyle.remove();

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @media print {
      @page { size: 80mm auto !important; margin: 0 !important; padding: 0 !important; }
      html, body {
        width: 80mm !important;
        font-family: 'Courier New', monospace !important;
        font-size: 12px !important;
        margin: 0; padding: 0;
        color: black; background: white;
      }
      body > *:not(.thermal-print-area):not(.print-area) {
        display: none !important;
      }
      .thermal-print-area, .print-area {
        display: block !important;
        visibility: visible !important;
        width: 80mm !important;
        padding: 2mm;
      }
      .thermal-print-area *, .print-area * {
        max-width: 76mm !important;
        word-wrap: break-word !important;
      }
    }
  `;
  document.head.appendChild(style);
};

const removeThermalPrintStyles = (): void => {
  const style = document.getElementById('thermal-print-styles');
  if (style) style.remove();
};

// ================== Funciones principales ================== //

export const printThermalReceipt = (
  printData: PrintData,
  format: PrintFormat = 'thermal-80mm'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const content = generateThermalContent(printData, format);
      injectThermalPrintStyles();

      const printArea = (document.querySelector('.thermal-print-area') || document.querySelector('.print-area')) as HTMLElement | null;

      if (printArea) {
        printArea.innerHTML = content;
        printArea.style.display = 'block';
        printArea.style.visibility = 'visible';
      }

      const beforePrint = () => {
        document.body.style.visibility = 'hidden';
        if (printArea) {
          printArea.style.display = 'block';
          printArea.style.visibility = 'visible';
        }
      };

      const afterPrint = () => {
        document.body.style.visibility = 'visible';
        if (printArea) {
          printArea.style.display = 'none';
          printArea.style.visibility = 'hidden';
          printArea.innerHTML = '';
        }
        removeThermalPrintStyles();
        window.removeEventListener('beforeprint', beforePrint);
        window.removeEventListener('afterprint', afterPrint);
        resolve();
      };

      window.addEventListener('beforeprint', beforePrint);
      window.addEventListener('afterprint', afterPrint);

      setTimeout(() => {
        window.print();
      }, 300);
    } catch (error) {
      console.error('Error al imprimir:', error);
      reject(error);
    }
  });
};

const generateThermalSalesReport = (
  salesData: SalesReportData,
  dateRange?: DateRange,
  settings?: TicketConfig
): string => {
  const { filteredOrders, salesSummary } = salesData;
  const reportDate = dateRange?.from?.toLocaleDateString('es-ES') || '';
  const reportDateTo = dateRange?.to?.toLocaleDateString('es-ES') || '';

  return `
    <div class="center bold">${settings?.businessName || 'NEGOCIO'}</div>
    <div class="center">REPORTE DE VENTAS</div>
    <div class="separator"></div>
    <div class="row"><span>Fecha:</span><span>${reportDate}${reportDateTo ? ` - ${reportDateTo}` : ''}</span></div>
    <div class="row"><span>Hora:</span><span>${new Date().toLocaleTimeString('es-ES')}</span></div>
    <div class="separator"></div>
    <div class="center bold">RESUMEN</div>
    <div class="separator"></div>
    <div class="row bold"><span>Total Pedidos:</span><span>${salesSummary.totalOrders}</span></div>
    <div class="row bold"><span>Ingresos:</span><span>$${salesSummary.totalRevenue.toFixed(2)}</span></div>
    <div class="row"><span>Descuentos:</span><span>$${salesSummary.totalDiscount.toFixed(2)}</span></div>
    <div class="separator"></div>
    <div class="center bold">DETALLE</div>
    <div class="separator"></div>
    ${filteredOrders.slice(0, 20).map(order => `
      <div class="row small">
        <span>#${order.invoiceNumber || order.id}</span>
        <span>$${(order.total ?? 0).toFixed(2)}</span>
      </div>
    `).join('')}
    <div class="separator"></div>
    <div class="center">Fin del reporte</div>
  `;
};

export const usePrintThermalReport = () => {
  const [loading, setLoading] = useState(false);

  const printSalesReport = useCallback((
    salesData: SalesReportData,
    dateRange?: DateRange,
    settings?: TicketConfig
  ) => {
    setLoading(true);
    try {
      injectThermalPrintStyles();
      const content = generateThermalSalesReport(salesData, dateRange, settings);

      const printArea = (document.querySelector('.thermal-print-area') || document.querySelector('.print-area')) as HTMLElement | null;

      if (printArea) {
        printArea.innerHTML = content;
        printArea.style.display = 'block';
        printArea.style.visibility = 'visible';
      }

      const beforePrint = () => {
        document.body.style.visibility = 'hidden';
        if (printArea) {
          printArea.style.display = 'block';
          printArea.style.visibility = 'visible';
        }
      };

      const afterPrint = () => {
        document.body.style.visibility = 'visible';
        if (printArea) {
          printArea.style.display = 'none';
          printArea.style.visibility = 'hidden';
          printArea.innerHTML = '';
        }
        removeThermalPrintStyles();
        setLoading(false);
        window.removeEventListener('beforeprint', beforePrint);
        window.removeEventListener('afterprint', afterPrint);
      };

      window.addEventListener('beforeprint', beforePrint);
      window.addEventListener('afterprint', afterPrint);

      setTimeout(() => {
        window.print();
      }, 300);
    } catch (error) {
      console.error('Error al imprimir reporte:', error);
      setLoading(false);
    }
  }, []);

  return { printSalesReport, loading };
};
