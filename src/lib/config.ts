
import type { 
  RestaurantConfig, 
  ThermalPrintOptions, 
  AdvancedPrintSettings,
  DEFAULT_THERMAL_CONFIG,
  DEFAULT_PRINT_SETTINGS 
} from './types';

/**
 * Configuración principal del restaurante/negocio
 * Actualizada con optimizaciones para impresión térmica
 */
export const restaurantConfig: RestaurantConfig = {
  // Información básica del negocio
  restaurantName: 'La Romarí',
  businessName: 'La Romarí', // Para compatibilidad
  address: 'Dirección del Restaurante, Ciudad',
  businessAddress: 'Dirección del Restaurante, Ciudad', // Para compatibilidad
  phone: '428-9800',
  businessPhone: '428-9800', // Para compatibilidad
  email: 'contacto@mirestaurante.com',
  businessEmail: 'contacto@mirestaurante.com', // Para compatibilidad
  website: 'www.mirestaurante.com',
  
  // Información fiscal Argentina
  taxId: '20-12345678-9',
  invoiceType: 'B',
  posNumber: '00001',
  taxCondition: 'Responsable Inscripto',
  grossIncome: '12345-6',
  activityStartDate: '01/01/2020',
  legalDisclaimer: 'Documento no válido como comprobante fiscal',
  
  // Mensajes personalizados
  thankYouMessage: '¡Gracias por elegirnos!\nEsperamos verte pronto',
  footerMessage: '¡Gracias por elegirnos!\nEsperamos verte pronto', // Para compatibilidad
  
  // Configuración de visibilidad (optimizada para impresión térmica)
  showRestaurantName: true,
  showAddress: true,
  showTaxId: true,
  showWebsite: true,
  showThankYouMessage: true,
  showQrCode: true,
  
  // Configuración térmica optimizada
  thermalOptimized: true,
  thermalFontWeight: '600',
  thermalFontSize: '14px',
  thermalLineHeight: '1.3',
  
  // Información de contacto adicional
  socialMedia: {
    facebook: 'https://www.facebook.com/p/La-Romar%C3%AD-Pizzeria-y-Lomoteca-100063982869419',
    instagram: '@la.romari_',
    whatsapp: '428-9800'
  },
  
  // Horarios de atención
  businessHours: [
    { day: 'monday', open: '08:00', close: '22:00' },
    { day: 'tuesday', open: '08:00', close: '22:00' },
    { day: 'wednesday', open: '08:00', close: '22:00' },
    { day: 'thursday', open: '08:00', close: '22:00' },
    { day: 'friday', open: '08:00', close: '23:00' },
    { day: 'saturday', open: '09:00', close: '23:00' },
    { day: 'sunday', open: '09:00', close: '21:00' }
  ],
  
  // Configuración de delivery
  delivery: {
    enabled: true,
    radius: 5, // km
    minimumOrder: 500, // pesos
    fee: 150, // pesos
    freeDeliveryMinimum: 1000 // pesos
  },
  
  // Configuración de impuestos
  tax: {
    rate: 21, // 21% IVA
    included: true,
    name: 'IVA'
  },
  
  // Configuración de moneda
  currency: {
    code: 'ARS',
    symbol: '$',
    position: 'before',
    decimals: 2
  }
};

/**
 * Configuración optimizada para impresora térmica 3nstar RPT008
 */
export const thermal3nstarConfig: ThermalPrintOptions = {
  width: '80mm',
  fontFamily: '"Courier New", "DejaVu Sans Mono", "Liberation Mono", monospace',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '1.3',
  encoding: 'UTF-8',
  cutType: 'partial',
  cashdrawer: false,
  buzzer: false,
  
  // Configuraciones específicas para 3nstar RPT008
  thermalLevel: 'medium',
  printSpeed: 'normal',
  characterSet: 'standard',
  codePageTable: 0
};

/**
 * Configuración avanzada de impresión optimizada
 */
export const advancedPrintConfig: AdvancedPrintSettings = {
  // Configuración de retry mejorada
  retryAttempts: 3,
  retryDelay: 1500, // ms
  
  // Timeouts optimizados para impresoras térmicas
  printTimeout: 45000, // ms (45 segundos)
  connectionTimeout: 8000, // ms (8 segundos)
  
  // Configuración de calidad para impresión térmica
  printQuality: 'normal',
  densityLevel: 10, // Nivel medio-alto para 3nstar RPT008
  
  // Configuración específica de papel térmico
  paperWidth: 80, // mm
  paperType: 'thermal',
  
  // Configuración de corte optimizada
  autoCut: true,
  cutAfterPages: 1,
  
  // Configuración de cajón de dinero (si se usa)
  openCashDrawer: false,
  cashDrawerPin: 1,
  
  // Configuración de preview
  showPreview: false,
  previewBeforePrint: false
};

/**
 * Configuraciones específicas por tipo de ticket
 */
export const ticketTypeConfigs = {
  customer: {
    showPrices: true,
    showTotals: true,
    showTaxInfo: true,
    showQrCode: true,
    showLegalDisclaimer: true,
    fontSize: '14px',
    fontWeight: '600'
  },
  
  kitchen: {
    showPrices: false,
    showTotals: false,
    showTaxInfo: false,
    showQrCode: false,
    showLegalDisclaimer: false,
    fontSize: '16px', // Más grande para cocina
    fontWeight: '800', // Más grueso para cocina
    emphasizeQuantities: true,
    emphasizeNotes: true
  },
  
  cashier: {
    showPrices: true,
    showTotals: true,
    showTaxInfo: false,
    showQrCode: false,
    showLegalDisclaimer: false,
    fontSize: '13px',
    fontWeight: '700',
    compact: true
  },
  
  salesReport: {
    showPrices: true,
    showTotals: true,
    showTaxInfo: false,
    showQrCode: false,
    showLegalDisclaimer: false,
    fontSize: '12px',
    fontWeight: '600',
    compact: true,
    showSummary: true
  }
};

/**
 * Configuración de calidad para diferentes tipos de impresora
 */
export const printerQualitySettings = {
  '3nstar-rpt008': {
    densityLevel: 10,
    printSpeed: 'normal',
    thermalLevel: 'medium',
    characterSpacing: 0,
    lineSpacing: 1,
    fontSize: '14px',
    fontWeight: '600'
  },
  
  'generic-80mm': {
    densityLevel: 8,
    printSpeed: 'normal', 
    thermalLevel: 'medium',
    characterSpacing: 0,
    lineSpacing: 1,
    fontSize: '13px',
    fontWeight: '600'
  },
  
  'generic-58mm': {
    densityLevel: 9,
    printSpeed: 'slow',
    thermalLevel: 'medium-high',
    characterSpacing: 0,
    lineSpacing: 0,
    fontSize: '12px',
    fontWeight: '700'
  }
};

/**
 * Comandos ESC/POS específicos para 3nstar RPT008
 */
export const escPosCommands = {
  // Comandos básicos
  INIT: new Uint8Array([0x1B, 0x40]), // ESC @
  RESET: new Uint8Array([0x1B, 0x40]),
  
  // Comandos de texto
  BOLD_ON: new Uint8Array([0x1B, 0x45, 0x01]), // ESC E 1
  BOLD_OFF: new Uint8Array([0x1B, 0x45, 0x00]), // ESC E 0
  UNDERLINE_ON: new Uint8Array([0x1B, 0x2D, 0x01]), // ESC - 1
  UNDERLINE_OFF: new Uint8Array([0x1B, 0x2D, 0x00]), // ESC - 0
  
  // Comandos de alineación
  ALIGN_LEFT: new Uint8Array([0x1B, 0x61, 0x00]), // ESC a 0
  ALIGN_CENTER: new Uint8Array([0x1B, 0x61, 0x01]), // ESC a 1
  ALIGN_RIGHT: new Uint8Array([0x1B, 0x61, 0x02]), // ESC a 2
  
  // Comandos de tamaño de fuente
  FONT_SIZE_NORMAL: new Uint8Array([0x1D, 0x21, 0x00]), // GS ! 0
  FONT_SIZE_DOUBLE_HEIGHT: new Uint8Array([0x1D, 0x21, 0x01]), // GS ! 1
  FONT_SIZE_DOUBLE_WIDTH: new Uint8Array([0x1D, 0x21, 0x10]), // GS ! 16
  FONT_SIZE_DOUBLE_BOTH: new Uint8Array([0x1D, 0x21, 0x11]), // GS ! 17
  
  // Comandos de corte
  CUT_PARTIAL: new Uint8Array([0x1D, 0x56, 0x41, 0x10]), // GS V A 16
  CUT_FULL: new Uint8Array([0x1D, 0x56, 0x00]), // GS V 0
  
  // Comandos de cajón de dinero
  OPEN_DRAWER_1: new Uint8Array([0x1B, 0x70, 0x00, 0x19, 0xFA]), // ESC p 0 25 250
  OPEN_DRAWER_2: new Uint8Array([0x1B, 0x70, 0x01, 0x19, 0xFA]), // ESC p 1 25 250
  
  // Comandos de estado
  GET_STATUS: new Uint8Array([0x10, 0x04, 0x01]), // DLE EOT 1
  
  // Comandos de densidad térmica para 3nstar RPT008
  DENSITY_LIGHT: new Uint8Array([0x1D, 0x7C, 0x00, 0x06]), // Densidad baja
  DENSITY_MEDIUM: new Uint8Array([0x1D, 0x7C, 0x00, 0x0A]), // Densidad media
  DENSITY_HIGH: new Uint8Array([0x1D, 0x7C, 0x00, 0x0E]), // Densidad alta
  
  // Comandos de velocidad para 3nstar RPT008
  SPEED_SLOW: new Uint8Array([0x1D, 0x84, 0x00]), // Velocidad lenta
  SPEED_NORMAL: new Uint8Array([0x1D, 0x84, 0x01]), // Velocidad normal
  SPEED_FAST: new Uint8Array([0x1D, 0x84, 0x02]) // Velocidad rápida
};

/**
 * Configuración de estilos CSS personalizados
 */
export const customCSSStyles = {
  // Estilos para impresión térmica optimizada
  thermalOptimized: `
    .thermal-receipt {
      font-family: "Courier New", "DejaVu Sans Mono", monospace !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      line-height: 1.3 !important;
      color: #000000 !important;
      background: #ffffff !important;
    }
    
    .thermal-critical-text {
      font-weight: 900 !important;
      font-size: 16px !important;
      color: #000000 !important;
    }
    
    .thermal-enhanced-numbers {
      font-weight: 800 !important;
      font-size: 15px !important;
      color: #000000 !important;
      font-family: "Courier New", monospace !important;
    }
  `,
  
  // Estilos para preview en pantalla
  screenPreview: `
    .thermal-preview {
      width: 302px;
      margin: 0 auto;
      background: white;
      border: 1px solid #ccc;
      padding: 10px;
      font-family: "Courier New", monospace;
      font-size: 13px;
      line-height: 1.3;
    }
  `
};

/**
 * Configuración de desarrollo y testing
 */
export const developmentConfig = {
  // Configuración para testing
  testing: {
    mockPrinter: true,
    simulateDelay: true,
    delayMs: 2000,
    logPrintJobs: true,
    enableDebugOutput: true
  },
  
  // Configuración para development
  development: {
    showPrintPreview: true,
    enableHotReload: true,
    validatePrintData: true,
    logPerformanceMetrics: true
  },
  
  // Configuración para production
  production: {
    showPrintPreview: false,
    enableHotReload: false,
    validatePrintData: false,
    logPerformanceMetrics: false,
    enableErrorReporting: true
  }
};

/**
 * Función para obtener configuración según el entorno
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  return {
    ...restaurantConfig,
    thermal: thermal3nstarConfig,
    advanced: advancedPrintConfig,
    environment: developmentConfig[env as keyof typeof developmentConfig] || developmentConfig.development
  };
};

/**
 * Función para validar configuración
 */
export const validateConfig = (config: any): string[] => {
  const errors: string[] = [];
  
  if (!config.restaurantName && !config.businessName) {
    errors.push('Nombre del restaurante/negocio es requerido');
  }
  
  if (config.taxId && !/^\d{2}-\d{8}-\d{1}$/.test(config.taxId)) {
    errors.push('Formato de CUIT inválido (debe ser XX-XXXXXXXX-X)');
  }
  
  if (config.thermal?.width && !['58mm', '80mm'].includes(config.thermal.width)) {
    errors.push('Ancho de papel térmico debe ser 58mm o 80mm');
  }
  
  return errors;
};

/**
 * Configuración por defecto para nuevas instalaciones
 */
export const defaultNewInstallConfig = {
  ...restaurantConfig,
  // Configuración inicial optimizada
  thermalOptimized: true,
  showRestaurantName: true,
  showAddress: true,
  showTaxId: false, // Desactivado por defecto hasta que se configure
  showWebsite: false,
  showThankYouMessage: true,
  showQrCode: false, // Desactivado hasta que se configure QR
  
  // Valores por defecto seguros
  restaurantName: 'Mi Negocio',
  address: 'Configurar dirección',
  thankYouMessage: '¡Gracias por su compra!',
  invoiceType: 'B',
  posNumber: '00001'
};

// Exportar configuración principal
export default {
  restaurant: restaurantConfig,
  thermal: thermal3nstarConfig,
  advanced: advancedPrintConfig,
  ticketTypes: ticketTypeConfigs,
  printerQuality: printerQualitySettings,
  escpos: escPosCommands,
  css: customCSSStyles,
  development: developmentConfig,
  getEnvironmentConfig,
  validateConfig,
  defaultNewInstall: defaultNewInstallConfig
};