
// "use client";

// import type { OrderItem, TicketConfig, PrintData } from "@/lib/types";
// import { format } from 'date-fns';

// interface PrintTicketA4Props extends Omit<PrintData, 'type' | 'order' | 'settings'> {
//   order: OrderItem[];
//   settings: TicketConfig;
// }

// export default function PrintTicketA4({ order, subtotal, total, discountAmount, invoice, paidAt, settings, qrCodeUrl }: PrintTicketA4Props) {
//   const totalBeforeTax = subtotal - discountAmount;
//   const formattedDate = paidAt ? format(new Date(paidAt), 'dd/MM/yyyy') : '';
//   const sequentialId = invoice.slice(-8);
//   const fullInvoiceNumber = `Factura ${settings.invoiceType || 'B'}-${settings.posNumber || '00001'}-${sequentialId}`;

//   return (
//     <div className="p-8 bg-white text-black font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
//       <header className="flex justify-between items-start pb-8 border-b border-gray-300">
//         <div>
//           {settings.showRestaurantName && (
//             <>
//               <h1 className="text-4xl font-bold">{settings.restaurantName}</h1>
//             </>
//           )}
//           {settings.showAddress && <p>{settings.address}</p>}
//           {settings.taxCondition && <p>{settings.taxCondition}</p>}
//           {settings.showTaxId && <p>CUIT: {settings.taxId}</p>}
//         </div>
//         <div className="text-right">
//           <h2 className="text-2xl font-semibold uppercase text-gray-600">Factura {settings.invoiceType}</h2>
//           <p><strong>Nº de Factura:</strong> {fullInvoiceNumber}</p>
//           <p><strong>Fecha:</strong> {formattedDate}</p>
//         </div>
//       </header>

//       <main className="my-10">
//         <h3 className="text-xl font-semibold mb-4">Detalles del Pedido</h3>
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-3 font-semibold">Artículo</th>
//               <th className="p-3 font-semibold text-center">Cantidad</th>
//               <th className="p-3 font-semibold text-right">Precio Unit.</th>
//               <th className="p-3 font-semibold text-right">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {order.map(item => (
//               <tr key={item.id} className="border-b border-gray-200">
//                 <td className="p-3">{item.name}</td>
//                 <td className="p-3 text-center">{item.quantity}</td>
//                 <td className="p-3 text-right">${item.salePrice.toFixed(2)}</td>
//                 <td className="p-3 text-right">${(item.salePrice * item.quantity).toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </main>

//       <footer className="mt-10">
//         <div className="flex justify-end">
//           <div className="w-full max-w-xs">
//              <div className="flex justify-between py-2">
//               <span>Subtotal:</span>
//               <span>${subtotal.toFixed(2)}</span>
//             </div>
//             {discountAmount > 0 && (
//               <div className="flex justify-between py-2">
//                 <span>Descuento:</span>
//                 <span>-${discountAmount.toFixed(2)}</span>
//               </div>
//             )}
//             <div className="border-t-2 border-black my-2"></div>
//             <div className="flex justify-between font-bold text-xl py-2">
//               <span>TOTAL:</span>
//               <span>${total.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//         <div className="text-center text-gray-500 text-sm pt-12 flex justify-between items-center">
//             {settings.showThankYouMessage && (
//                 <p>{settings.thankYouMessage}</p>
//             )}
//             {qrCodeUrl && (
//                 <img
//                     src={qrCodeUrl}
//                     alt="QR Code"
//                     className="ml-auto"
//                     width="100"
//                     height="100"
//                 />
//              )}
//         </div>
//         {settings.legalDisclaimer && (
//             <p className="text-center text-xs italic mt-4">{settings.legalDisclaimer}</p>
//         )}
//       </footer>
//     </div>
//   );
// }
