// app/transaction/utils/pdfGenerator.ts
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { TransactionGroup } from "../../type/transaction";

export const generateInvoice = async (
  group: TransactionGroup
): Promise<{ success: boolean; message: string }> => {
  try {
    // Create HTML for invoice
    const html = createInvoiceHTML(group);

    // Generate PDF
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Create filename
    const invoiceNumber = group.group_id.substring(0, 8).toUpperCase();
    const pdfName = `Nota_Transaksi_${invoiceNumber}.pdf`;
    const newUri = FileSystem.documentDirectory + pdfName;

    // Save PDF to local storage
    await FileSystem.copyAsync({
      from: uri,
      to: newUri,
    });

    // Share the PDF
    await Sharing.shareAsync(newUri, {
      dialogTitle: "Download Nota Transaksi",
      mimeType: "application/pdf",
    });

    return { success: true, message: "Nota berhasil di-download" };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return { success: false, message: "Gagal membuat nota PDF" };
  }
};

const terbilang = (angka: number): string => {
  const bilangan = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
    "dua belas",
    "tiga belas",
    "empat belas",
    "lima belas",
    "enam belas",
    "tujuh belas",
    "delapan belas",
    "sembilan belas",
  ];

  if (angka < 20) return bilangan[angka];
  if (angka < 100) {
    const puluh = Math.floor(angka / 10);
    const satuan = angka % 10;
    return (
      bilangan[puluh] + " puluh" + (satuan > 0 ? " " + bilangan[satuan] : "")
    );
  }
  if (angka < 200) return "seratus " + terbilang(angka - 100);
  if (angka < 1000) {
    const ratus = Math.floor(angka / 100);
    const sisa = angka % 100;
    return bilangan[ratus] + " ratus" + (sisa > 0 ? " " + terbilang(sisa) : "");
  }
  if (angka < 2000) return "seribu " + terbilang(angka - 1000);
  if (angka < 1000000) {
    const ribu = Math.floor(angka / 1000);
    const sisa = angka % 1000;
    return terbilang(ribu) + " ribu" + (sisa > 0 ? " " + terbilang(sisa) : "");
  }
  if (angka < 1000000000) {
    const juta = Math.floor(angka / 1000000);
    const sisa = angka % 1000000;
    return terbilang(juta) + " juta" + (sisa > 0 ? " " + terbilang(sisa) : "");
  }
  return "";
};

export const createInvoiceHTML = (group: TransactionGroup): string => {
  const invoiceNumber = group.group_id.substring(0, 8).toUpperCase();
  const date = new Date(group.transaction_date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalItems = group.items.reduce((sum, item) => sum + item.quantity, 0);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nota Transaksi</title>
      <style>
        /* ... (CSS styles from original code) ... */
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- ... (HTML content from original code) ... -->
      </div>
    </body>
    </html>
  `;
};
