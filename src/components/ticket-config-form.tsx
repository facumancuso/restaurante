"use client";

import { useForm } from "react-hook-form";
import { useTicketConfig } from "@/hooks/use-ticket-config";
import type { TicketConfig } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TicketConfigForm() {
    const [config, setConfig] = useTicketConfig();
    const { toast } = useToast();

const form = useForm<TicketConfig>({
    values: config,
    defaultValues: {
        // Business Info
        restaurantName: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        
        // Fiscal Info
        invoiceType: 'B',
        posNumber: '',
        taxId: '',
        taxCondition: 'Responsable Inscripto',
        grossIncome: '',
        activityStartDate: '',
        
        // Messages
        thankYouMessage: '',
        legalDisclaimer: '',
        
        // Visibility toggles
        showRestaurantName: true,
        showAddress: true,
        showTaxId: true,
        showWebsite: true,
        showThankYouMessage: true,
        showQrCode: true,
        
        // Thermal settings
        thermalOptimized: true,
        thermalFontWeight: '700',
        thermalFontSize: '11px',
        thermalLineHeight: '1.2',
    },
});

    const onSubmit = (values: TicketConfig) => {
        setConfig(values);
        toast({
            title: "Configuración guardada",
            description: "Los ajustes del ticket se han actualizado correctamente. Los cambios se aplicarán en la próxima impresión.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuración Completa de Tickets Térmicos 80mm</CardTitle>
                <CardDescription>
                    Personaliza completamente la información que aparece en los tickets impresos. Optimizado para impresoras térmicas de 80mm como la 3nstar RPT008.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* INFORMACIÓN BÁSICA DEL NEGOCIO */}
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-blue-900">📍 Información del Negocio</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="restaurantName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Restaurante *</FormLabel>
                                            <FormControl><Input {...field} placeholder="La Romarí" /></FormControl>
                                            <FormDescription>Aparece en letras grandes en el encabezado</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección Completa</FormLabel>
                                            <FormControl><Input {...field} placeholder="Mendoza 702 sur, Rawson, San Juan" /></FormControl>
                                            <FormDescription>Dirección completa del negocio</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl><Input {...field} placeholder="+54 9 264 123-4567" /></FormControl>
                                            <FormDescription>Número de contacto</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input {...field} placeholder="contacto@laromari.com" /></FormControl>
                                            <FormDescription>Correo electrónico del negocio</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sitio Web</FormLabel>
                                            <FormControl><Input {...field} placeholder="www.laromari.com" /></FormControl>
                                            <FormDescription>URL del sitio web (para QR)</FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        
                        <Separator />

                        {/* INFORMACIÓN FISCAL ARGENTINA */}
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-green-900">🏛️ Información Fiscal (Argentina)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="invoiceType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Factura *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="A">A - Responsable Inscripto</SelectItem>
                                                    <SelectItem value="B">B - Consumidor Final</SelectItem>
                                                    <SelectItem value="C">C - Consumidor Final (Sin IVA)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Aparece en letras muy grandes</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="posNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Punto de Venta (PDV) *</FormLabel>
                                            <FormControl><Input {...field} placeholder="00001" maxLength={5} /></FormControl>
                                            <FormDescription>Número asignado por AFIP</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="taxId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CUIT *</FormLabel>
                                            <FormControl><Input {...field} placeholder="20-12345678-9" /></FormControl>
                                            <FormDescription>Con guiones</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="taxCondition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Condición frente al IVA</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar condición" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Responsable Inscripto">Responsable Inscripto</SelectItem>
                                                    <SelectItem value="Monotributo">Monotributo</SelectItem>
                                                    <SelectItem value="Exento">Exento</SelectItem>
                                                    <SelectItem value="Consumidor Final">Consumidor Final</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="grossIncome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ingresos Brutos</FormLabel>
                                            <FormControl><Input {...field} placeholder="12345-6" /></FormControl>
                                            <FormDescription>Número de Ingresos Brutos</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="activityStartDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Inicio de Actividades</FormLabel>
                                            <FormControl><Input {...field} placeholder="01/01/2020" /></FormControl>
                                            <FormDescription>Fecha DD/MM/AAAA</FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* MENSAJES PERSONALIZADOS */}
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-purple-900">💬 Mensajes Personalizados</h3>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="thankYouMessage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mensaje de Agradecimiento</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    {...field} 
                                                    rows={3} 
                                                    placeholder="¡Gracias por elegirnos!&#10;Esperamos verte pronto"
                                                />
                                            </FormControl>
                                            <FormDescription>Aparece al final del ticket (usar \n para nueva línea)</FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="legalDisclaimer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aviso Legal</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    placeholder="Documento no válido como comprobante fiscal"
                                                />
                                            </FormControl>
                                            <FormDescription>Disclaimer legal en el pie del ticket</FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />
                        
                        {/* CONTROLES DE VISIBILIDAD */}
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-orange-900">👁️ Controles de Visibilidad</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="showRestaurantName"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium">
                                                    Mostrar Nombre del Restaurante
                                                </FormLabel>
                                                <FormDescription>Encabezado principal del ticket</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch 
                                                    checked={field.value} 
                                                    onCheckedChange={field.onChange} 
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="showAddress"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium">Mostrar Dirección</FormLabel>
                                                <FormDescription>Dirección en el encabezado</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch 
                                                    checked={field.value} 
                                                    onCheckedChange={field.onChange} 
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="showTaxId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium">Mostrar CUIT</FormLabel>
                                                <FormDescription>CUIT en información fiscal</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch 
                                                    checked={field.value} 
                                                    onCheckedChange={field.onChange} 
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="showWebsite"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium">Mostrar Sitio Web</FormLabel>
                                                <FormDescription>URL en el pie del ticket</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch 
                                                    checked={field.value} 
                                                    onCheckedChange={field.onChange} 
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="showThankYouMessage"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium">Mostrar Mensaje de Agradecimiento</FormLabel>
                                                <FormDescription>Mensaje personalizado al final</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch 
                                                    checked={field.value} 
                                                    onCheckedChange={field.onChange} 
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="showQrCode"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium">Mostrar Código QR</FormLabel>
                                                <FormDescription>QR del sitio web (140x140px)</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch 
                                                    checked={field.value} 
                                                    onCheckedChange={field.onChange} 
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* CONFIGURACIÓN AVANZADA DE IMPRESIÓN */}
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-red-900">⚙️ Configuración Avanzada de Impresión Térmica</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="thermalOptimized"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-blue-50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-medium">
                                                    Optimización Térmica Activada
                                                </FormLabel>
                                                <FormDescription>
                                                    Usa fuentes más gruesas y tamaños optimizados
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch 
                                                    checked={field.value ?? true} 
                                                    onCheckedChange={field.onChange} 
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="thermalFontWeight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grosor de Fuente</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value || "700"}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar grosor" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="600">Normal (600)</SelectItem>
                                                    <SelectItem value="700">Medio (700)</SelectItem>
                                                    <SelectItem value="800">Grueso (800)</SelectItem>
                                                    <SelectItem value="900">Muy Grueso (900)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="thermalFontSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tamaño Base de Fuente</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value || "11px"}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar tamaño" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="9px">Muy Pequeño (9px)</SelectItem>
                                                    <SelectItem value="10px">Pequeño (10px)</SelectItem>
                                                    <SelectItem value="11px">Medio (11px)</SelectItem>
                                                    <SelectItem value="12px">Grande (12px)</SelectItem>
                                                    <SelectItem value="13px">Muy Grande (13px)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="thermalLineHeight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Espaciado de Líneas</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value || "1.2"}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar espaciado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1.0">Compacto (1.0)</SelectItem>
                                                    <SelectItem value="1.2">Normal (1.2)</SelectItem>
                                                    <SelectItem value="1.3">Cómodo (1.3)</SelectItem>
                                                    <SelectItem value="1.4">Amplio (1.4)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* INFORMACIÓN Y RECOMENDACIONES */}
                        <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="text-md font-semibold text-green-900 mb-2">
                                    ✅ Configuración Óptima para 3nstar RPT008
                                </h4>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• <strong>Tipo de Factura:</strong> B (más común para restaurantes)</li>
                                    <li>• <strong>Fuente:</strong> Grosor 700-800 para mejor legibilidad</li>
                                    <li>• <strong>QR Code:</strong> 140x140px - tamaño óptimo para térmica</li>
                                    <li>• <strong>Espaciado:</strong> 1.2-1.3 para mejor lectura</li>
                                    <li>• <strong>Ancho:</strong> Optimizado para 80mm de papel térmico</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-md font-semibold text-blue-900 mb-2">
                                    🖨️ Configuración de Navegador Recomendada
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• <strong>Chrome:</strong> Permitir ventanas emergentes</li>
                                    <li>• <strong>Márgenes:</strong> Sin márgenes en configuración de impresión</li>
                                    <li>• <strong>Tamaño:</strong> Personalizado 80mm x automático</li>
                                    <li>• <strong>Orientación:</strong> Vertical (Portrait)</li>
                                </ul>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                                <h4 className="text-md font-semibold text-amber-900 mb-2">
                                    📋 Campos Obligatorios para AFIP
                                </h4>
                                <ul className="text-sm text-amber-800 space-y-1">
                                    <li>• <strong>Nombre del Restaurante:</strong> Razón social registrada</li>
                                    <li>• <strong>Tipo de Factura:</strong> A, B o C según corresponda</li>
                                    <li>• <strong>Punto de Venta:</strong> Asignado por AFIP</li>
                                    <li>• <strong>CUIT:</strong> Con formato XX-XXXXXXXX-X</li>
                                </ul>
                            </div>
                        </div>

                        <Button type="submit" className="w-full font-semibold text-lg py-6">
                            💾 Guardar Configuración Completa
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}