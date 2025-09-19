// Funciones mejoradas para impresión térmica en 3nstar RPT008

// Función principal de impresión térmica
export const printThermalReceipt = (printData, format = 'thermal-80mm') => {
  return new Promise((resolve, reject) => {
    try {
      // Preparar el contenido para impresión
      const printContent = generateThermalContent(printData, format);
      
      // Configurar las opciones de impresión específicas para térmica
      const printOptions = {
        // Eliminar headers y footers del navegador
        // Esto se puede hacer desde el navegador: Chrome > Más opciones > Más configuraciones > Desmarcar "Encabezados y pies de página"
      };
      
      // Inyectar estilos CSS específicos para impresión térmica
      injectThermalPrintStyles();
      
      // Insertar contenido en el área de impresión
      const printArea = document.querySelector('.thermal-print-area') || document.querySelector('.print-area');
      if (printArea) {
        printArea.innerHTML = printContent;
        printArea.style.display = 'block';
        printArea.style.visibility = 'visible';
      }
      
      // Configurar el evento de impresión
      const beforePrint = () => {
        document.body.style.visibility = 'hidden';
        if (printArea) {
          printArea.style.visibility = 'visible';
          printArea.style.display = 'block';
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
      
      // Agregar event listeners
      window.addEventListener('beforeprint', beforePrint);
      window.addEventListener('afterprint', afterPrint);
      
      // Ejecutar impresión después de un pequeño delay
      setTimeout(() => {
        window.print();
      }, 300);
      
    } catch (error) {
      console.error('Error al imprimir:', error);
      reject(error);
    }
  });
};

// Generar contenido HTML optimizado para impresión térmica
const generateThermalContent = (printData, format) => {
  const { order, subtotal, total, discountAmount, paidAt, invoice, settings, tableNumber, employeeName, qrCodeUrl } = printData;
  
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
        <div class="thermal-bold"></div>
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
            <div class="thermal-row-right"></div>
          </div>
          ${item.notes ? `<div class="thermal-small">Nota: ${item.notes}</div>` : ''}
        </div>
      `).join('')}
      
      <div class="thermal-totals">
        <div class="thermal-total-line">
          <div class="thermal-row-left">Subtotal:</div>
          <div class="thermal-row-right">$${subtotal.toFixed(2)}</div>
        </div>
        ${discountAmount > 0 ? `
        <div class="thermal-total-line">
          <div class="thermal-row-left">Descuento:</div>
          <div class="thermal-row-right">-$${discountAmount.toFixed(2)}</div>
        </div>` : ''}
        <div class="thermal-grand-total">
          <div class="thermal-row">
            <div class="thermal-row-left">TOTAL:</div>
            <div class="thermal-row-right">$${total.toFixed(2)}</div>
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

// Inyectar estilos CSS específicos para impresión térmica
const injectThermalPrintStyles = () => {
  const styleId = 'thermal-print-styles';
  
  // Remover estilos existentes
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Crear nuevos estilos
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @media print {
      @page {
        size: 80mm auto !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      
      html, body {
        width: 80mm !important;
        margin: 0 !important;
        padding: 0 !important;
        font-family: 'Courier New', monospace !important;
        font-size: 12px !important;
        line-height: 1.2 !important;
        background: white !important;
        color: black !important;
      }
      
      body > *:not(.thermal-print-area):not(.print-area) {
        display: none !important;
        visibility: hidden !important;
      }
      
      .thermal-print-area,
      .print-area {
        display: block !important;
        visibility: visible !important;
        position: static !important;
        width: 80mm !important;
        max-width: 80mm !important;
        margin: 0 !important;
        padding: 2mm !important;
      }
      
      .thermal-print-area *,
      .print-area * {
        max-width: 76mm !important;
        word-wrap: break-word !important;
      }
    }
  `;
  
  document.head.appendChild(style);
};

// Remover estilos de impresión térmica
const removeThermalPrintStyles = () => {
  const style = document.getElementById('thermal-print-styles');
  if (style) {
    style.remove();
  }
};

// Función para imprimir reporte de ventas térmico
export const printThermalSalesReport = (salesData, dateRange, settings) => {
  const reportContent = generateThermalSalesReport(salesData, dateRange, settings);
  
  // Crear ventana de impresión
  const printWindow = window.open('', '_blank', 'width=300,height=600');
  
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Ventas</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 2mm;
            width: 76mm;
            color: #000;
            background: #fff;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .separator { 
            border-top: 1px dashed #000; 
            margin: 3mm 0; 
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 1mm 0;
          }
          .small { font-size: 10px; }
        </style>
      </head>
      <body>
        ${reportContent}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Configurar impresión
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  } else {
    // Fallback: usar ventana actual
    console.warn('No se pudo abrir ventana de impresión, usando ventana actual');
    
    injectThermalPrintStyles();
    
    const printArea = document.querySelector('.thermal-print-area') || document.querySelector('.print-area');
    if (printArea) {
      printArea.innerHTML = reportContent;
      printArea.style.display = 'block';
      printArea.style.visibility = 'visible';
      
      setTimeout(() => {
        window.print();
        printArea.innerHTML = '';
        printArea.style.display = 'none';
        removeThermalPrintStyles();
      }, 300);
    }
  }
};

// Generar contenido del reporte de ventas para impresión térmica
const generateThermalSalesReport = (salesData, dateRange, settings) => {
  const { filteredOrders, salesSummary } = salesData;
  const reportDate = dateRange?.from ? 
    dateRange.from.toLocaleDateString('es-ES') : 
    new Date().toLocaleDateString('es-ES');
  const reportDateTo = dateRange?.to ? 
    dateRange.to.toLocaleDateString('es-ES') : '';

  return `
    <div class="center bold">
      ${settings?.businessName || 'NEGOCIO'}
    </div>
    <div class="center">REPORTE DE VENTAS</div>
    <div class="separator"></div>
    
    <div class="row">
      <span>Fecha:</span>
      <span>${reportDate}${reportDateTo ? ` - ${reportDateTo}` : ''}</span>
    </div>
    <div class="row">
      <span>Hora:</span>
      <span>${new Date().toLocaleTimeString('es-ES')}</span>
    </div>
    
    <div class="separator"></div>
    <div class="center bold">RESUMEN</div>
    <div class="separator"></div>
    
    <div class="row bold">
      <span>Total Pedidos:</span>
      <span>${salesSummary.totalOrders}</span>
    </div>
    <div class="row bold">
      <span>Ingresos:</span>
      <span>$${salesSummary.totalRevenue.toFixed(2)}</span>
    </div>
    <div class="row">
      <span>Descuentos:</span>
      <span>$${salesSummary.totalDiscount.toFixed(2)}</span>
    </div>
    
    <div class="separator"></div>
    <div class="center bold">DETALLE</div>
    <div class="separator"></div>
    
    ${filteredOrders.slice(0, 20).map(order => `
      <div class="row small">
        <span>#${order.invoiceNumber?.slice(-6) || 'N/A'}</span>
        <span>${new Date(order.paidAt).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</span>
      </div>
      <div class="row small">
        <span>Mesa: ${order.tableNumber}</span>
        <span class="bold">$${order.total?.toFixed(2) || '0.00'}</span>
      </div>
      <div style="margin: 1mm 0; border-bottom: 1px dotted #000;"></div>
    `).join('')}
    
    <div class="separator"></div>
    <div class="center small">
      Impreso: ${new Date().toLocaleString('es-ES')}
    </div>
    <div class="center small">
      Sistema TPV
    </div>
  `;
};

// Función para configurar impresión térmica en React components
export const useThermalPrint = () => {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const printReceipt = useCallback(async (printData, format = 'thermal-80mm') => {
    setIsPrinting(true);
    try {
      await printThermalReceipt(printData, format);
    } catch (error) {
      console.error('Error en impresión:', error);
    } finally {
      setIsPrinting(false);
    }
  }, []);
  
  const printSalesReport = useCallback(async (salesData, dateRange, settings) => {
    setIsPrinting(true);
    try {
      await printThermalSalesReport(salesData, dateRange, settings);
    } catch (error) {
      console.error('Error en impresión de reporte:', error);
    } finally {
      setIsPrinting(false);
    }
  }, []);
  
  return {
    printReceipt,
    printSalesReport,
    isPrinting
  };
};