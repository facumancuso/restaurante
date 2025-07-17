// thermal-print-styles.ts - Estilos optimizados para impresión térmica

export const THERMAL_STYLES = {
  // Contenedor base para todos los tickets térmicos
  container: {
    width: '80mm',
    fontFamily: '"Courier New", "DejaVu Sans Mono", "Liberation Mono", monospace',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '1.3',
    color: '#000000',
    background: '#ffffff',
    padding: '3mm'
  },

  // Títulos principales
  mainTitle: {
    fontSize: '24px',
    fontWeight: '900',
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
    marginBottom: '8px'
  },

  // Títulos secundarios
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '900',
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
    margin: '12px 0 8px 0'
  },

  // Nombre del negocio
  businessName: {
    fontSize: '16px',
    fontWeight: '900',
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
    marginBottom: '4px'
  },

  // Información del negocio
  businessInfo: {
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center' as const
  },

  // Número de factura
  invoiceNumber: {
    fontWeight: '900',
    fontSize: '15px'
  },

  // Número de mesa
  tableNumber: {
    fontSize: '20px',
    fontWeight: '900'
  },

  // Fechas y horarios
  dateText: {
    fontSize: '13px',
    fontWeight: '700'
  },

  // Headers de tabla
  tableHeader: {
    fontWeight: '900',
    fontSize: '13px',
    padding: '4px 8px',
    borderBottom: '2px solid #000'
  },

  // Celdas de tabla
  tableCell: {
    padding: '4px 8px',
    fontWeight: '700',
    fontSize: '13px',
    verticalAlign: 'top' as const
  },

  // Cantidad de productos
  itemQuantity: {
    fontSize: '20px',
    fontWeight: '900'
  },

  // Nombres de productos
  itemName: {
    fontSize: '18px',
    fontWeight: '800'
  },

  // Nombres de productos en tabla
  itemNameTable: {
    fontSize: '13px',
    fontWeight: '700'
  },

  // Precios
  itemPrice: {
    fontSize: '15px',
    fontWeight: '800',
    textAlign: 'right' as const
  },

  // Notas de productos
  itemNotes: {
    fontSize: '16px',
    fontWeight: '800',
    fontStyle: 'italic' as const,
    marginTop: '4px',
    paddingLeft: '16px'
  },

  // Notas en tabla
  itemNotesTable: {
    fontSize: '11px',
    fontStyle: 'italic' as const,
    fontWeight: '600',
    marginTop: '2px'
  },

  // Texto de subtotales
  subtotalText: {
    fontSize: '14px',
    fontWeight: '700'
  },

  // Total final
  totalText: {
    fontWeight: '900',
    fontSize: '18px'
  },

  // Separadores
  separator: {
    borderTop: '2px dashed #000',
    margin: '8px 0',
    width: '100%'
  },

  // Línea sólida
  solidLine: {
    borderTop: '2px solid #000',
    margin: '8px 0',
    width: '100%'
  },

  // Línea gruesa para total
  totalLine: {
    borderTop: '3px solid #000',
    borderBottom: '3px double #000',
    padding: '8px 0',
    margin: '8px 0'
  },

  // Pie de página
  footer: {
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center' as const
  },

  // QR Code
  qrCode: {
    width: '35mm',
    height: '35mm',
    margin: '3mm auto',
    display: 'block' as const,
    border: '1px solid #000'
  }
};

// Utilidades para formateo
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date: Date | number): string => {
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (date: Date | number): string => {
  return new Date(date).toLocaleTimeString('es-ES');
};

// Función para crear separadores
export const createSeparator = (type: 'dashed' | 'solid' | 'total' = 'dashed') => {
  const separatorStyle = document.createElement('div');
  
  switch (type) {
    case 'solid':
      Object.assign(separatorStyle.style, THERMAL_STYLES.solidLine);
      break;
    case 'total':
      Object.assign(separatorStyle.style, THERMAL_STYLES.totalLine);
      break;
    default:
      Object.assign(separatorStyle.style, THERMAL_STYLES.separator);
  }
  
  return separatorStyle;
};

// Configuraciones específicas por tipo de ticket
export const TICKET_CONFIGS = {
  customer: {
    title: 'TICKET DE VENTA',
    showPrices: true,
    showTotals: true,
    showQR: true,
    showThankYou: true
  },
  kitchen: {
    title: 'COMANDA',
    showPrices: false,
    showTotals: false,
    showQR: false,
    showThankYou: false,
    emphasizeQuantity: true,
    showTime: true
  },
  cashier: {
    title: 'COPIA CAJA',
    showPrices: true,
    showTotals: true,
    showQR: false,
    showThankYou: false
  }
};

// Función para aplicar estilos a elementos
export const applyThermalStyles = (element: HTMLElement, styleKey: keyof typeof THERMAL_STYLES) => {
  const styles = THERMAL_STYLES[styleKey];
  Object.assign(element.style, styles);
};