"use client";

import type { OrderItem, PrintFormat, TicketConfig, PrintData } from "@/lib/types";
import { format as formatDate } from "date-fns";

interface PrintTicketThermalProps
  extends Omit<PrintData, "type" | "order" | "settings"> {
  order: OrderItem[];
  settings: TicketConfig;
  format: PrintFormat;
  tableNumber?: string;
  employeeName?: string;
}

export default function PrintTicketThermal({
  order,
  subtotal,
  total,
  discountAmount,
  format,
  invoice,
  paidAt,
  settings,
  qrCodeUrl,
  tableNumber,
  employeeName,
}: PrintTicketThermalProps) {
  const ticketWidth = format === "thermal-58mm" ? "219px" : "302px"; // 80mm ≈ 302px
  const sequentialId = invoice ? invoice.slice(-8) : "";
  const formattedDate = paidAt ? formatDate(new Date(paidAt), "dd/MM/yyyy") : "";
  const formattedTime = paidAt ? formatDate(new Date(paidAt), "HH:mm:ss") : "";

  const formatArgentinian = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const hasDiscount = discountAmount > 0;

  const baseSize = settings.thermalFontSize || "11px";
  const fontWeight = settings.thermalFontWeight || "700";
  const lineHeight = settings.thermalLineHeight || "1.4";

  const thermalStyles = {
    container: {
      width: ticketWidth,
      maxWidth: ticketWidth,
      boxSizing: "border-box" as const,
      fontSize: baseSize,
      lineHeight: lineHeight,
      fontFamily: '"Courier New", "DejaVu Sans Mono", monospace',
      fontWeight: fontWeight,
      color: "#000000",
      background: "#ffffff",
      padding: "0px",
      margin: "0 auto",
    },
    invoiceType: {
      fontSize: "28px",
      fontWeight: "900",
      lineHeight: "1",
      textAlign: "center" as const,
    },
    posCode: {
      fontSize: "11px",
      fontWeight: "700",
      textAlign: "center" as const,
    },
    invoiceNumber: {
      fontWeight: "900",
      fontSize: "13px",
      marginBottom: 4,
    },
    businessName: {
      fontSize: "14px",
      fontWeight: "900",
      textAlign: "center" as const,
      textTransform: "uppercase" as const,
    },
    businessInfo: {
      fontSize: "10px",
      fontWeight: "600",
      textAlign: "center" as const,
    },
    sectionTitle: {
      fontSize: "12px",
      fontWeight: "800",
      textAlign: "center" as const,
      textTransform: "uppercase" as const,
      marginTop: 8,
      marginBottom: 8,
    },
    itemName: {
      fontWeight: "800",
      fontSize: "12px",
      marginBottom: 4,
    },
    itemNotes: {
      fontSize: "10px",
      fontWeight: "700",
      fontStyle: "italic" as const,
      marginTop: "2px",
      paddingLeft: "4px",
    },
    separator: {
      borderTop: "2px dashed #000",
      margin: "6px 0",
      width: "100%",
    },
    solidLine: {
      borderTop: "2px solid #000",
      margin: "4px 0",
      width: "100%",
    },
    doubleLine: {
      borderTop: "3px double #000",
      margin: "6px 0",
      width: "100%",
    },
    flexBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
  };

  return (
    <div style={thermalStyles.container}>
      {settings.showRestaurantName && settings.invoiceType && (
        <div className="mb-3">
          {/* <div style={thermalStyles.invoiceType}>{settings.invoiceType || "B"}</div>
          <div style={thermalStyles.posCode}>
            Código N° {(settings.posNumber || "001").padStart(3, "0")}
          </div> */}
        </div>
      )}

      <div className="mb-3">
        {/* <div style={thermalStyles.invoiceNumber}>
          Factura {settings.invoiceType || "B"}-
          {(settings.posNumber || "00001").padStart(5, "0")}- 
          {sequentialId.padStart(8, "0")}
        </div>

        <div style={{ ...thermalStyles.flexBetween, fontSize: "11px", fontWeight: "700" }}>
          <span>Fecha: {formattedDate}</span>
          <span>Hora: {formattedTime}</span>
        </div> */}
      </div>

      <div style={thermalStyles.separator}></div>

      <div className="mb-3">
        {settings.showRestaurantName && (
          <div style={thermalStyles.businessName}>{settings.restaurantName}</div>
        )}
        {/* {settings.showAddress && settings.address && (
          <div style={thermalStyles.businessInfo}>{settings.address}</div>
        )}
        {settings.phone && (
          <div style={thermalStyles.businessInfo}>Tel: {settings.phone}</div>
        )}
        {settings.taxCondition && (
          <div style={thermalStyles.businessInfo}>{settings.taxCondition}</div>
        )}
        {settings.showTaxId && settings.taxId && (
          <div style={{ ...thermalStyles.businessInfo, fontWeight: "700" }}>
            CUIT: {settings.taxId}
          </div>
        )} */}
      </div>

      {(tableNumber || employeeName) && (
        <>
          <div
            style={{
              ...thermalStyles.flexBetween,
              fontSize: "11px",
              fontWeight: "700",
              marginBottom: 4,
            }}
          >
            {tableNumber && <span>Mesa: {tableNumber}</span>}
            {employeeName && <span>Atiende: {employeeName}</span>}
          </div>
          <div style={thermalStyles.separator}></div>
        </>
      )}

      <div style={thermalStyles.sectionTitle}>Productos</div>
      <div style={thermalStyles.separator}></div>

      {/* Ítems */}
      <div className="my-3">
        {order.map((item) => (
          <div key={item.id} className="mb-3" style={{ pageBreakInside: "avoid" }}>
            <div style={thermalStyles.itemName}>{item.name}</div>
            <div style={thermalStyles.flexBetween}>
              <span style={{ flex: 1, fontSize: "11px", fontWeight: "700" }}>
                {item.quantity} x $ {formatArgentinian(item.salePrice)}
              </span>
              <span style={{ fontSize: "11px", fontWeight: "700", minWidth: "50px", textAlign: "right" }}>
                $ {formatArgentinian(item.salePrice * item.quantity)}
              </span>
            </div>
            {item.notes && (
              <div style={thermalStyles.itemNotes}>
                ** Nota: {item.notes} **
              </div>
            )}
            <div style={{ borderBottom: "1px dotted #666", marginTop: 4 }} />
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="mt-4" style={{ textAlign: "right" }}>
        <div style={{ fontSize: "12px", fontWeight: "700" }}>
          Subtotal: $ {formatArgentinian(subtotal)}
        </div>
        {hasDiscount && (
          <div style={{ fontSize: "12px", fontWeight: "700" }}>
            Descuento: -$ {formatArgentinian(discountAmount)}
          </div>
        )}
      </div>

      <div style={thermalStyles.solidLine}></div>

      <div
        style={{
          fontSize: "16px",
          fontWeight: "900",
          padding: "8px 0",
          borderTop: "3px solid #000",
          borderBottom: "3px double #000",
          margin: "8px 0",
          textAlign: "right",
        }}
      >
        TOTAL: $ {formatArgentinian(total)}
      </div>

      {/* Pie de ticket */}
      <div className="text-center mt-4 space-y-3">
        {settings.showQrCode && qrCodeUrl && (
          <div style={{ textAlign: "center", margin: "8px 0" }}>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              style={{
                display: "block",
                margin: "0 auto",
                width: "140px",
                height: "140px",
                border: "1px solid #000",
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        {settings.showWebsite && settings.website && (
          <div style={{ fontSize: "10px", fontWeight: "700", textAlign: "center" }}>
            {settings.website}
          </div>
        )}
        {settings.showThankYouMessage && settings.thankYouMessage && (
          <div style={{ fontSize: "11px", fontWeight: "700", textAlign: "center", marginTop: "8px" }}>
            {settings.thankYouMessage.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
        {settings.legalDisclaimer && (
          <div style={{ fontStyle: "italic", fontSize: "9px", fontWeight: "600", textAlign: "center", marginTop: "8px" }}>
            {settings.legalDisclaimer}
          </div>
        )}
        <div style={{ fontSize: "9px", fontWeight: "600", textAlign: "center", marginTop: "8px" }}>
          Sistema TPV - {formatDate(new Date(), "dd/MM/yyyy")}
        </div>
      </div>

      <div style={{ height: "10mm" }}></div>
    </div>
  );
}
