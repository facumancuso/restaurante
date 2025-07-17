'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Printer } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import type { Order, PrintData, PrintFormat } from '@/lib/types';
import { useTicketConfig } from '@/hooks/use-ticket-config';
import PrintTicketThermal from "@/components/print-ticket-thermal";
import PrintTicketA4 from "@/components/print-ticket-a4";

export default function SalesPage() {
    const { orders, isLoaded } = useOrders();
    const [ticketConfig] = useTicketConfig();
    const [printData, setPrintData] = useState<PrintData | null>(null);
    const [printFormat, setPrintFormat] = useState<PrintFormat>('thermal-80mm');
    const [isPrinting, setIsPrinting] = useState(false);
    
    const today = new Date();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfDay(today),
        to: endOfDay(today),
    });

    const paidOrders = useMemo(() => orders.filter(o => o.paymentStatus === 'paid' && o.paidAt), [orders]);

    const filteredOrders = useMemo(() => {
        if (!dateRange?.from) return paidOrders;
        
        return paidOrders.filter(order => {
            const paidAt = order.paidAt!;
            const from = startOfDay(dateRange.from!);
            const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from!);
            return paidAt >= from.getTime() && paidAt <= to.getTime();
        });
    }, [paidOrders, dateRange]);

    const salesSummary = useMemo(() => {
        return filteredOrders.reduce(
            (acc, order) => {
                acc.totalRevenue += order.total ?? 0;
                acc.totalDiscount += order.discountAmount ?? 0;
                acc.totalOrders += 1;
                return acc;
            },
            { totalRevenue: 0, totalDiscount: 0, totalOrders: 0 }
        );
    }, [filteredOrders]);

    // Enhanced thermal printing function
    const handlePrintInvoice = async (order: Order) => {
        if (!order.paidAt || !order.invoiceNumber) {
            console.error("No se puede imprimir la factura de un pedido no pagado o incompleto.");
            return;
        }

        setIsPrinting(true);
        
        try {
            setPrintData({
                order: order.items,
                subtotal: order.subtotal!,
                total: order.total!,
                discountAmount: order.discountAmount!,
                paidAt: order.paidAt,
                invoice: order.invoiceNumber,
                type: 'customer',
                settings: ticketConfig,
                tableNumber: order.tableNumber,
                employeeName: order.employeeName,
                qrCodeUrl: ticketConfig.showQrCode && ticketConfig.website ? 
                    `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticketConfig.website)}` : undefined,
            });
        } catch (error) {
            console.error("Error al preparar la impresión:", error);
            setIsPrinting(false);
        }
    };

    // Enhanced print handling for thermal printers
    const handlePrintReport = () => {
        setIsPrinting(true);
        
        // Create a thermal-optimized print layout
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const thermalReportContent = generateThermalReport();
            printWindow.document.write(thermalReportContent);
            printWindow.document.close();
            
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                    setIsPrinting(false);
                }, 500);
            };
        } else {
            // Fallback to current window printing
            window.print();
            setIsPrinting(false);
        }
    };

    // Generate thermal-optimized report
    const generateThermalReport = () => {
        const reportDate = dateRange?.from ? 
            format(dateRange.from, 'dd/MM/yyyy', { locale: es }) : 
            format(new Date(), 'dd/MM/yyyy', { locale: es });
        
        const reportDateTo = dateRange?.to ? 
            format(dateRange.to, 'dd/MM/yyyy', { locale: es }) : '';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Ventas</title>
                <style>
                    @page {
                        size: 80mm auto;
                        margin: 2mm 0;
                    }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        line-height: 1.2;
                        margin: 0;
                        padding: 2mm;
                        width: 76mm;
                        color: #000;
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
                    .summary-box {
                        border: 1px solid #000;
                        padding: 2mm;
                        margin: 2mm 0;
                    }
                </style>
            </head>
            <body>
                <div class="center bold">
                    ${ticketConfig.businessName || 'NEGOCIO'}
                </div>
                <div class="center">REPORTE DE VENTAS</div>
                <div class="separator"></div>
                
                <div class="row">
                    <span>Fecha:</span>
                    <span>${reportDate}${reportDateTo ? ` - ${reportDateTo}` : ''}</span>
                </div>
                <div class="row">
                    <span>Hora:</span>
                    <span>${format(new Date(), 'HH:mm:ss')}</span>
                </div>
                
                <div class="separator"></div>
                <div class="center bold">RESUMEN</div>
                <div class="separator"></div>
                
                <div class="summary-box">
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
                </div>
                
                <div class="separator"></div>
                <div class="center bold">DETALLE DE VENTAS</div>
                <div class="separator"></div>
                
                ${filteredOrders.sort((a,b) => b.paidAt! - a.paidAt!).map(order => `
                    <div class="row small">
                        <span>Fact: ${order.invoiceNumber?.slice(-6) || 'N/A'}</span>
                        <span>${format(new Date(order.paidAt!), 'HH:mm')}</span>
                    </div>
                    <div class="row small">
                        <span>Mesa: ${order.tableNumber}</span>
                        <span class="bold">$${order.total?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div class="row small">
                        <span>Items: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        <span>${order.employeeName || 'N/A'}</span>
                    </div>
                    <div style="margin: 2mm 0; border-bottom: 1px dotted #000;"></div>
                `).join('')}
                
                <div class="separator"></div>
                <div class="center small">
                    Impreso: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                </div>
                <div class="center small">
                    Sistema TPV
                </div>
            </body>
            </html>
        `;
    };

    // Enhanced print effect for thermal printers
    useEffect(() => {
        if (printData) {
            const timer = setTimeout(() => {
                // Apply thermal printer specific settings
                const printStyles = `
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                `;
                
                // Inject print styles
                const styleElement = document.createElement('style');
                styleElement.textContent = printStyles;
                document.head.appendChild(styleElement);
                
                window.print();
                
                // Clean up
                setTimeout(() => {
                    document.head.removeChild(styleElement);
                    setPrintData(null);
                    setIsPrinting(false);
                }, 100);
            }, 200);
            
            return () => clearTimeout(timer);
        }
    }, [printData]);
    
    return (
        <>
            <div className="container mx-auto py-10">
                <div className="flex justify-between items-center mb-6 no-print">
                    <div>
                        <h1 className="text-3xl font-bold">Historial de Ventas</h1>
                        <p className="text-muted-foreground">Revisa los pedidos completados y filtra por fecha.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            onClick={handlePrintReport}
                            disabled={isPrinting}
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            {isPrinting ? 'Imprimiendo...' : 'Imprimir Reporte'}
                        </Button>
                        <Link href="/" passHref>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" /> 
                                Volver al TPV
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="no-print">
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Filtros y Resumen</CardTitle>
                            <CardDescription>Selecciona un rango de fechas para ver las ventas.</CardDescription>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-[280px] justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                                                {format(dateRange.to, "LLL dd, y", { locale: es })}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y", { locale: es })
                                        )
                                    ) : (
                                        <span>Selecciona una fecha</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                                <p className="text-2xl font-bold">${salesSummary.totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Pedidos Totales</p>
                                <p className="text-2xl font-bold">{salesSummary.totalOrders}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Descuentos Aplicados</p>
                                <p className="text-2xl font-bold">${salesSummary.totalDiscount.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Factura Nº</TableHead>
                                <TableHead>Fecha y Hora</TableHead>
                                <TableHead>Mesa/ID</TableHead>
                                <TableHead>Empleado</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="w-[50px] text-right no-print">Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isLoaded && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">Cargando ventas...</TableCell>
                                </TableRow>
                            )}
                            {isLoaded && filteredOrders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">
                                        No se encontraron ventas para el período seleccionado.
                                    </TableCell>
                                </TableRow>
                            )}
                            {isLoaded && filteredOrders.sort((a,b) => b.paidAt! - a.paidAt!).map((order: Order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        {order.invoiceNumber?.slice(-6) ?? 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(order.paidAt!), 'Pp', { locale: es })}
                                    </TableCell>
                                    <TableCell>{order.tableNumber}</TableCell>
                                    <TableCell>{order.employeeName ?? 'N/A'}</TableCell>
                                    <TableCell>
                                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${order.total?.toFixed(2) ?? '0.00'}
                                    </TableCell>
                                    <TableCell className="text-right no-print">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handlePrintInvoice(order)}
                                            disabled={isPrinting}
                                        >
                                            <Printer className="h-4 w-4" />
                                            <span className="sr-only">Imprimir Factura</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Thermal Print Area */}
            <div className="thermal-print-area">
                {printData && printData.type === 'customer' && (
                    <>
                        {printFormat.startsWith('thermal') && (
                            <PrintTicketThermal {...printData} format={printFormat} />
                        )}
                        {printFormat === 'a4' && (
                            <PrintTicketA4 {...printData} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}