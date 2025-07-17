"use client";

import { useState, useEffect, useCallback } from 'react';
import type { TicketConfig } from '@/lib/types';
import { restaurantConfig as defaultConfig } from '@/lib/config';

const TICKET_CONFIG_STORAGE_KEY = 'ticketConfig_v3_optimized'; // Actualizada la versión

export function useTicketConfig(): [TicketConfig, (newConfig: Partial<TicketConfig>) => void] {
    const [config, setConfig] = useState<TicketConfig>({
        // Información básica del negocio
        restaurantName: defaultConfig.restaurantName || 'Mi Restaurante',
        address: defaultConfig.address || 'Dirección del Restaurante',
        taxId: defaultConfig.taxId || '',
        website: defaultConfig.website || '',
        thankYouMessage: defaultConfig.thankYouMessage || '¡Gracias por su visita!',
        
        // Configuración de visibilidad - valores por defecto optimizados
        showRestaurantName: true,
        showAddress: true,
        showTaxId: true,
        showWebsite: true,
        showThankYouMessage: true,
        showQrCode: true,
        
        // Información fiscal Argentina
        invoiceType: defaultConfig.invoiceType || 'B',
        posNumber: defaultConfig.posNumber || '00001',
        taxCondition: defaultConfig.taxCondition || 'Responsable Inscripto',
        grossIncome: defaultConfig.grossIncome || '',
        activityStartDate: defaultConfig.activityStartDate || '',
        legalDisclaimer: defaultConfig.legalDisclaimer || 'Documento no válido como comprobante fiscal',
        
        // Campos adicionales para compatibilidad
        businessName: defaultConfig.businessName || defaultConfig.restaurantName || 'Mi Restaurante',
        businessAddress: defaultConfig.businessAddress || defaultConfig.address || 'Dirección del Restaurante',
        businessPhone: defaultConfig.businessPhone || '',
        businessEmail: defaultConfig.businessEmail || '',
        footerMessage: defaultConfig.footerMessage || defaultConfig.thankYouMessage || '¡Gracias por su visita!',
    });
    
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedConfig = localStorage.getItem(TICKET_CONFIG_STORAGE_KEY);
            if (savedConfig) {
                const parsedConfig = JSON.parse(savedConfig);
                
                // Merge saved config with defaults to ensure all keys are present
                // Priorizar campos de la configuración guardada pero asegurar que existan todos los campos
                setConfig(prev => ({
                    ...prev,
                    ...parsedConfig,
                    // Asegurar compatibilidad entre campos business/restaurant
                    businessName: parsedConfig.businessName || parsedConfig.restaurantName || prev.businessName,
                    businessAddress: parsedConfig.businessAddress || parsedConfig.address || prev.businessAddress,
                    footerMessage: parsedConfig.footerMessage || parsedConfig.thankYouMessage || prev.footerMessage,
                }));
            } else {
                // Si no hay configuración guardada, intentar migrar desde versiones anteriores
                const oldConfig = localStorage.getItem('ticketConfig_v2') || localStorage.getItem('ticketConfig');
                if (oldConfig) {
                    try {
                        const parsedOldConfig = JSON.parse(oldConfig);
                        setConfig(prev => ({
                            ...prev,
                            ...parsedOldConfig,
                            // Migrar campos para compatibilidad
                            businessName: parsedOldConfig.businessName || parsedOldConfig.restaurantName || prev.businessName,
                            businessAddress: parsedOldConfig.businessAddress || parsedOldConfig.address || prev.businessAddress,
                            footerMessage: parsedOldConfig.footerMessage || parsedOldConfig.thankYouMessage || prev.footerMessage,
                        }));
                        
                        // Guardar la configuración migrada
                        localStorage.setItem(TICKET_CONFIG_STORAGE_KEY, JSON.stringify({
                            ...config,
                            ...parsedOldConfig,
                        }));
                        
                        // Limpiar versiones antiguas
                        localStorage.removeItem('ticketConfig_v2');
                        localStorage.removeItem('ticketConfig');
                        
                        console.log('Configuración de tickets migrada a la versión optimizada');
                    } catch (migrationError) {
                        console.warn('Error al migrar configuración anterior:', migrationError);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load ticket config from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const updateConfig = useCallback((newConfig: Partial<TicketConfig>) => {
        setConfig(prevConfig => {
            const updatedConfig = { 
                ...prevConfig, 
                ...newConfig,
                // Mantener sincronización entre campos business/restaurant
                businessName: newConfig.businessName || newConfig.restaurantName || prevConfig.businessName,
                restaurantName: newConfig.restaurantName || newConfig.businessName || prevConfig.restaurantName,
                businessAddress: newConfig.businessAddress || newConfig.address || prevConfig.businessAddress,
                address: newConfig.address || newConfig.businessAddress || prevConfig.address,
                footerMessage: newConfig.footerMessage || newConfig.thankYouMessage || prevConfig.footerMessage,
                thankYouMessage: newConfig.thankYouMessage || newConfig.footerMessage || prevConfig.thankYouMessage,
            };
            
            try {
                localStorage.setItem(TICKET_CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig));
                console.log('Configuración de tickets guardada con optimizaciones térmicas');
            } catch (error) {
                console.error("Failed to save ticket config to localStorage", error);
            }
            
            return updatedConfig;
        });
    }, []);

    if (!isLoaded) {
        // Return default config on server or before hydration
        return [config, () => {}];
    }
    
    return [config, updateConfig];
}

// Hook adicional para configuraciones específicas de impresión térmica
export function useThermalPrintConfig() {
    const [config] = useTicketConfig();
    
    // Configuración específica optimizada para impresión térmica
    const thermalConfig = {
        ...config,
        // Asegurar que los campos críticos tengan valores por defecto
        businessName: config.businessName || config.restaurantName || 'Mi Negocio',
        businessAddress: config.businessAddress || config.address || '',
        footerMessage: config.footerMessage || config.thankYouMessage || '¡Gracias por su compra!',
        
        // Configuraciones específicas para térmica
        thermal: {
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '1.3',
            fontFamily: '"Courier New", "DejaVu Sans Mono", monospace',
            separatorWidth: '2px',
            qrSize: '35mm',
            maxCharsPerLine: 42,
            encoding: 'UTF-8'
        }
    };
    
    return thermalConfig;
}

// Función de utilidad para validar configuración
export function validateTicketConfig(config: Partial<TicketConfig>): string[] {
    const errors: string[] = [];
    
    if (!config.restaurantName && !config.businessName) {
        errors.push('El nombre del restaurante/negocio es requerido');
    }
    
    if (config.taxId && !/^\d{2}-\d{8}-\d{1}$/.test(config.taxId)) {
        errors.push('El formato del CUIT debe ser XX-XXXXXXXX-X');
    }
    
    if (config.posNumber && !/^\d{5}$/.test(config.posNumber)) {
        errors.push('El punto de venta debe tener 5 dígitos');
    }
    
    if (config.invoiceType && !['A', 'B', 'C'].includes(config.invoiceType.toUpperCase())) {
        errors.push('El tipo de factura debe ser A, B o C');
    }
    
    return errors;
}

// Función de utilidad para generar configuración de ejemplo
export function getExampleTicketConfig(): TicketConfig {
    return {
        restaurantName: 'Restaurante El Buen Sabor',
        address: 'Av. Corrientes 1234, CABA',
        taxId: '20-12345678-9',
        website: 'www.elbuensabor.com',
        thankYouMessage: '¡Gracias por elegirnos!\nEsperamos verte pronto',
        
        showRestaurantName: true,
        showAddress: true,
        showTaxId: true,
        showWebsite: true,
        showThankYouMessage: true,
        showQrCode: true,
        
        invoiceType: 'B',
        posNumber: '00001',
        taxCondition: 'Responsable Inscripto',
        grossIncome: '12345-6',
        activityStartDate: '01/01/2020',
        legalDisclaimer: 'Documento no válido como comprobante fiscal',
        
        businessName: 'Restaurante El Buen Sabor',
        businessAddress: 'Av. Corrientes 1234, CABA',
        businessPhone: '+54 11 1234-5678',
        businessEmail: 'contacto@elbuensabor.com',
        footerMessage: '¡Gracias por elegirnos!\nEsperamos verte pronto',
    };
}