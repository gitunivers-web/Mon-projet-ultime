import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BANKS, BankKey } from "./transfer-utils";

export interface TransferPdfData {
  bank: BankKey;
  type: "virement" | "ordre";
  // Sender
  senderName: string;
  senderAddress: string;
  senderIban: string;
  senderBic: string;
  senderAccountNum: string;
  senderBank: string;
  // Receiver
  receiverName: string;
  receiverAddress: string;
  receiverIban: string;
  receiverBic: string;
  receiverAccountNum: string;
  receiverBank: string;
  // Transfer
  amount: number;
  currency: string;
  reference: string;
  transactionNumber: string;
  motif: string;
  transferDate: string;
  valueDate: string;
  estimatedDate: string;
  // Extras
  agencyName?: string;
  agencyCode?: string;
  operatorName?: string;
}

function hex2rgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function generateTransferPDF(data: TransferPdfData): void {
  const bank = BANKS[data.bank];
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const [br, bg, bb] = hex2rgb(bank.color);
  const pageW = doc.internal.pageSize.getWidth();

  // ── HEADER BAND ────────────────────────────────────────────────────────
  doc.setFillColor(br, bg, bb);
  doc.rect(0, 0, pageW, 38, "F");

  // Bank name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(bank.name.toUpperCase(), 14, 18);

  // Slogan / full name
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(bank.fullName, 14, 26);
  doc.text(bank.address, 14, 32);

  // Top right: SWIFT
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`SWIFT / BIC : ${bank.swift}`, pageW - 14, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Licensed & regulated financial institution", pageW - 14, 24, { align: "right" });

  // ── DOCUMENT TITLE ───────────────────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  const title = data.type === "ordre" ? "ORDRE DE VIREMENT BANCAIRE" : "CONFIRMATION DE VIREMENT";
  doc.text(title, pageW / 2, 50, { align: "center" });

  // Underline
  doc.setDrawColor(br, bg, bb);
  doc.setLineWidth(0.8);
  doc.line(40, 53, pageW - 40, 53);

  // ── METADATA ROW ────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);

  const metaY = 60;
  doc.text(`N° Transaction : ${data.transactionNumber}`, 14, metaY);
  doc.text(`Référence : ${data.reference}`, pageW / 2, metaY, { align: "center" });
  doc.text(`Date émission : ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}`, pageW - 14, metaY, { align: "right" });

  // ── PARTIES TABLE ────────────────────────────────────────────────────
  autoTable(doc, {
    startY: 68,
    head: [["DONNEUR D'ORDRE", "BÉNÉFICIAIRE"]],
    body: [
      [
        [
          `Nom/Raison sociale : ${data.senderName}`,
          `Adresse : ${data.senderAddress || "—"}`,
          `Banque : ${data.senderBank}`,
          `N° Compte : ${data.senderAccountNum || "—"}`,
          `IBAN : ${data.senderIban}`,
          `BIC / SWIFT : ${data.senderBic}`,
        ].join("\n"),
        [
          `Nom/Raison sociale : ${data.receiverName}`,
          `Adresse : ${data.receiverAddress || "—"}`,
          `Banque : ${data.receiverBank}`,
          `N° Compte : ${data.receiverAccountNum || "—"}`,
          `IBAN : ${data.receiverIban}`,
          `BIC / SWIFT : ${data.receiverBic}`,
        ].join("\n"),
      ],
    ],
    styles: { fontSize: 9, cellPadding: 5, valign: "top", textColor: [30, 30, 30] },
    headStyles: { fillColor: [br, bg, bb], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 10 },
    columnStyles: { 0: { cellWidth: (pageW - 28) / 2 }, 1: { cellWidth: (pageW - 28) / 2 } },
    margin: { left: 14, right: 14 },
  });

  // ── TRANSFER DETAILS ────────────────────────────────────────────────
  const afterPartiesY = (doc as any).lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: afterPartiesY,
    head: [["DÉTAILS DE L'OPÉRATION"]],
    body: [[""]],
    styles: { fontSize: 10, fontStyle: "bold", textColor: [30, 30, 30] },
    headStyles: { fillColor: [br, bg, bb], textColor: [255, 255, 255], fontStyle: "bold" },
    margin: { left: 14, right: 14 },
    tableWidth: pageW - 28,
  });

  const detailsY = (doc as any).lastAutoTable.finalY + 2;

  // Amount box
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, detailsY, pageW - 28, 22, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(br, bg, bb);
  const amountStr = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.amount);
  doc.text(`MONTANT : ${amountStr} ${data.currency}`, pageW / 2, detailsY + 9, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const amountWords = numberToWords(data.amount, data.currency);
  doc.text(amountWords, pageW / 2, detailsY + 17, { align: "center" });

  // Details grid
  autoTable(doc, {
    startY: detailsY + 26,
    body: [
      ["Date d'opération", data.transferDate, "Date de valeur", data.valueDate],
      ["Date d'arrivée estimée", data.estimatedDate, "Motif du virement", data.motif],
      ["Agence émettrice", data.agencyName || bank.name + " — Agence Principale", "Code agence", data.agencyCode || "001"],
      ["Opérateur", data.operatorName || "Traitement Automatique", "Canal", "Espace Client en Ligne"],
    ],
    styles: { fontSize: 9, cellPadding: 4, textColor: [30, 30, 30] },
    alternateRowStyles: { fillColor: [248, 249, 252] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 48, fillColor: [240, 242, 255] },
      1: { cellWidth: 52 },
      2: { fontStyle: "bold", cellWidth: 48, fillColor: [240, 242, 255] },
      3: { cellWidth: 52 },
    },
    margin: { left: 14, right: 14 },
  });

  // ── STATUS BAND ────────────────────────────────────────────────────
  const statusY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFillColor(220, 252, 231);
  doc.setDrawColor(134, 239, 172);
  doc.roundedRect(14, statusY, pageW - 28, 14, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(21, 128, 61);
  doc.text("✓  OPÉRATION VALIDÉE ET ENREGISTRÉE", pageW / 2, statusY + 9, { align: "center" });

  // ── LEGAL NOTICE ───────────────────────────────────────────────────
  const legalY = statusY + 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 130);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(14, legalY - 2, pageW - 14, legalY - 2);
  doc.text(
    `Ce document est une confirmation officielle d'ordre de virement émise par ${bank.fullName}. ` +
    "Il est généré automatiquement et ne nécessite pas de signature manuscrite. " +
    "En cas de contestation, veuillez contacter votre conseiller bancaire dans un délai de 30 jours. " +
    `Référence réglementaire DSP2 / Directive UE 2015/2366. © ${new Date().getFullYear()} ${bank.fullName}. Tous droits réservés.`,
    14, legalY + 4, { maxWidth: pageW - 28 }
  );

  // ── FOOTER ─────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFillColor(br, bg, bb);
  doc.rect(0, footerY, pageW, 12, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(`${bank.fullName} — ${bank.address}`, pageW / 2, footerY + 5, { align: "center" });
  doc.text(`SWIFT/BIC: ${bank.swift} | Document confidentiel — réservé au titulaire du compte`, pageW / 2, footerY + 9, { align: "center" });

  // ── SAVE ────────────────────────────────────────────────────────────
  const filename = `virement_${data.reference.replace(/\s/g, "_")}_${bank.name}.pdf`;
  doc.save(filename);
}

function numberToWords(amount: number, currency: string): string {
  const units: Record<string, string> = { EUR: "Euros", USD: "Dollars américains", GBP: "Livres sterling", XOF: "Francs CFA", CHF: "Francs suisses" };
  const cur = units[currency] || currency;
  const int = Math.floor(amount);
  const dec = Math.round((amount - int) * 100);
  const cents = dec > 0 ? ` et ${dec} centimes` : "";
  return `En toutes lettres : ${int.toLocaleString("fr-FR")} ${cur}${cents}`;
}
