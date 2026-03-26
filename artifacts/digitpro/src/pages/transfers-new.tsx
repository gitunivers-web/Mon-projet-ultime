import { useState } from "react";
import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Send, FileText, Link as LinkIcon, AlertCircle, Building2, ChevronRight } from "lucide-react";
import { BANKS, BankKey, generateSecureCode, generateTrackingUrl, generateTransactionRef } from "@/lib/transfer-utils";
import { generateTransferPDF, TransferPdfData } from "@/lib/pdf-generator";

type FormData = {
  senderName: string;
  senderAddress: string;
  senderBank: string;
  senderIban: string;
  senderBic: string;
  senderAccountNum: string;
  receiverName: string;
  receiverAddress: string;
  receiverBank: string;
  receiverIban: string;
  receiverBic: string;
  receiverAccountNum: string;
  amount: string;
  currency: string;
  reference: string;
  motif: string;
  transferDate: string;
  valueDate: string;
  estimatedDate: string;
  agencyName: string;
  agencyCode: string;
  operatorName: string;
  selectedBank: BankKey;
};

const today = new Date().toISOString().split("T")[0];
const valueDateDefault = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const estimatedDefault = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];

const INITIAL: FormData = {
  senderName: "", senderAddress: "", senderBank: "", senderIban: "", senderBic: "", senderAccountNum: "",
  receiverName: "", receiverAddress: "", receiverBank: "", receiverIban: "", receiverBic: "", receiverAccountNum: "",
  amount: "", currency: "EUR", reference: "", motif: "", transferDate: today, valueDate: valueDateDefault,
  estimatedDate: estimatedDefault, agencyName: "", agencyCode: "", operatorName: "", selectedBank: "novabank",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-gray-400 text-xs uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SectionTitle({ num, title }: { num: number; title: string }) {
  return (
    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
      <span className="w-5 h-5 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center text-[10px] text-primary font-bold">{num}</span>
      {title}
    </h3>
  );
}

const inputCls = "bg-[#0d1117] border-white/10 text-white placeholder:text-gray-600 h-10 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary";
const selectCls = "flex h-10 w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function TransfersNew() {
  const { spendCoins, addTransfer, coins } = useApp();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [type, setType] = useState<"simulation" | "document">("simulation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL);

  const cost = type === "simulation" ? 30 : 20;
  const set = (k: keyof FormData, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coins < cost) {
      toast({ title: "Coins insuffisants", description: `Vous avez besoin de ${cost} coins.`, variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const success = spendCoins(cost, `${type === "simulation" ? "Simulation virement" : "Ordre virement PDF"} — ${form.receiverName}`, "Transfers");
      if (!success) return;

      const secureCode = generateSecureCode();
      const txRef = form.reference || generateTransactionRef();
      const trackingUrl = type === "simulation" ? generateTrackingUrl(form.selectedBank, secureCode) : "";

      const bank = BANKS[form.selectedBank];

      if (type === "document") {
        const pdfData: TransferPdfData = {
          bank: form.selectedBank,
          type: "ordre",
          senderName: form.senderName,
          senderAddress: form.senderAddress,
          senderIban: form.senderIban || "—",
          senderBic: form.senderBic || bank.swift,
          senderAccountNum: form.senderAccountNum || "—",
          senderBank: form.senderBank,
          receiverName: form.receiverName,
          receiverAddress: form.receiverAddress,
          receiverIban: form.receiverIban || "—",
          receiverBic: form.receiverBic || "—",
          receiverAccountNum: form.receiverAccountNum || "—",
          receiverBank: form.receiverBank,
          amount: parseFloat(form.amount),
          currency: form.currency,
          reference: txRef,
          transactionNumber: generateTransactionRef(),
          motif: form.motif || "Virement bancaire",
          transferDate: form.transferDate,
          valueDate: form.valueDate,
          estimatedDate: form.estimatedDate,
          agencyName: form.agencyName || `${bank.name} — Agence Principale`,
          agencyCode: form.agencyCode || "001",
          operatorName: form.operatorName || "Traitement Automatique",
        };
        generateTransferPDF(pdfData);
      }

      addTransfer({
        id: "tr-" + Date.now(),
        type,
        trackingCode: secureCode,
        trackingUrl,
        senderName: form.senderName,
        senderIban: form.senderIban,
        senderBank: form.senderBank,
        receiverName: form.receiverName,
        receiverIban: form.receiverIban,
        receiverBank: form.receiverBank,
        amount: parseFloat(form.amount),
        currency: form.currency,
        reference: txRef,
        description: form.motif,
        status: "processing",
        progress: 35,
        transferDate: form.transferDate,
        estimatedArrival: form.estimatedDate,
        coinCost: cost,
        createdAt: new Date().toISOString(),
        // @ts-ignore – extra fields for UI
        bankKey: form.selectedBank,
        bankName: bank.name,
      });

      if (type === "simulation") {
        toast({
          title: "✅ Lien de suivi généré",
          description: `URL : ${trackingUrl}`,
        });
      } else {
        toast({ title: "✅ PDF téléchargé", description: "Le document bancaire a été généré avec succès." });
      }
      setLocation("/transfers");
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Simulateur de Virement</h1>
          <p className="text-muted-foreground mt-1 text-sm">Générez un lien de suivi bancaire ou un ordre de virement PDF officiel.</p>
        </div>

        {/* Type selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {([
            { key: "simulation" as const, icon: LinkIcon, label: "Lien de Suivi", sub: "Lien partageable en temps réel", coins: 30, color: "blue" },
            { key: "document" as const, icon: FileText, label: "Ordre PDF Officiel", sub: "Document bancaire téléchargeable", coins: 20, color: "purple" },
          ] as const).map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setType(opt.key)}
              className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                type === opt.key ? "border-primary bg-primary/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <opt.icon className={`w-6 h-6 mb-3 ${opt.color === "blue" ? "text-blue-400" : "text-purple-400"}`} />
              <p className="font-bold text-white text-base">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
              <span className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full ${
                opt.color === "blue" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
              }`}>{opt.coins} coins</span>
              {type === opt.key && <span className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-[10px]">✓</span>}
            </button>
          ))}
        </div>

        {/* Bank selector (simulation only) */}
        {type === "simulation" && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Choisir la banque pour le lien de suivi</p>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(BANKS) as [BankKey, typeof BANKS.novabank][]).map(([key, b]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("selectedBank", key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    form.selectedBank === key ? "border-primary bg-primary/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: b.color }}>
                    {b.logo}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{b.name}</p>
                    <p className="text-[11px] text-gray-500">{b.domain}</p>
                  </div>
                  {form.selectedBank === key && <ChevronRight className="w-4 h-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>
            {form.selectedBank && (
              <div className="mt-3 bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2 text-xs text-gray-400 font-mono">
                🔗 Aperçu du lien : <span className="text-primary">https://secure<span className="text-yellow-400">xxxxxxxx</span>.{BANKS[form.selectedBank].domain}</span>
              </div>
            )}
          </div>
        )}

        {/* Bank selector (document) */}
        {type === "document" && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Banque émettrice du document PDF</p>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(BANKS) as [BankKey, typeof BANKS.novabank][]).map(([key, b]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("selectedBank", key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    form.selectedBank === key ? "border-primary bg-primary/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: b.color }}>
                    {b.logo}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{b.name}</p>
                    <p className="text-[11px] text-gray-500">{b.fullName}</p>
                  </div>
                  {form.selectedBank === key && <span className="text-primary ml-auto text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-[#0a0d13] border-white/5 shadow-2xl mb-4">
            <CardContent className="p-6 md:p-8 space-y-8">

              {/* Section 1 — Sender */}
              <div>
                <SectionTitle num={1} title="Informations du Donneur d'Ordre (Expéditeur)" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nom complet / Raison sociale" required>
                    <Input required className={inputCls} placeholder="Ex: Jean Martin ou SARL Dupont" value={form.senderName} onChange={e => set("senderName", e.target.value)} />
                  </Field>
                  <Field label="Banque de l'expéditeur" required>
                    <Input required className={inputCls} placeholder="Ex: BNP Paribas, Société Générale..." value={form.senderBank} onChange={e => set("senderBank", e.target.value)} />
                  </Field>
                  <Field label="IBAN de l'expéditeur">
                    <Input className={inputCls} placeholder="FR76 3000 6000 0112 3456 7890 189" value={form.senderIban} onChange={e => set("senderIban", e.target.value)} />
                  </Field>
                  <Field label="BIC / SWIFT de l'expéditeur">
                    <Input className={inputCls} placeholder="BNPAFRPPXXX" value={form.senderBic} onChange={e => set("senderBic", e.target.value)} />
                  </Field>
                  <Field label="N° de compte de l'expéditeur">
                    <Input className={inputCls} placeholder="00112345678" value={form.senderAccountNum} onChange={e => set("senderAccountNum", e.target.value)} />
                  </Field>
                  <Field label="Adresse de l'expéditeur">
                    <Input className={inputCls} placeholder="15 Rue de la Paix, 75001 Paris" value={form.senderAddress} onChange={e => set("senderAddress", e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Section 2 — Receiver */}
              <div>
                <SectionTitle num={2} title="Informations du Bénéficiaire (Destinataire)" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nom complet / Raison sociale" required>
                    <Input required className={inputCls} placeholder="Ex: Sophie Leclerc ou ABC Corporation" value={form.receiverName} onChange={e => set("receiverName", e.target.value)} />
                  </Field>
                  <Field label="Banque du bénéficiaire" required>
                    <Input required className={inputCls} placeholder="Ex: Crédit Agricole, Deutsche Bank..." value={form.receiverBank} onChange={e => set("receiverBank", e.target.value)} />
                  </Field>
                  <Field label="IBAN du bénéficiaire">
                    <Input className={inputCls} placeholder="DE89 3704 0044 0532 0130 00" value={form.receiverIban} onChange={e => set("receiverIban", e.target.value)} />
                  </Field>
                  <Field label="BIC / SWIFT du bénéficiaire">
                    <Input className={inputCls} placeholder="DEUTDEDBXXX" value={form.receiverBic} onChange={e => set("receiverBic", e.target.value)} />
                  </Field>
                  <Field label="N° de compte du bénéficiaire">
                    <Input className={inputCls} placeholder="5320130000" value={form.receiverAccountNum} onChange={e => set("receiverAccountNum", e.target.value)} />
                  </Field>
                  <Field label="Adresse du bénéficiaire">
                    <Input className={inputCls} placeholder="Musterstraße 1, 60329 Frankfurt" value={form.receiverAddress} onChange={e => set("receiverAddress", e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Section 3 — Transfer details */}
              <div>
                <SectionTitle num={3} title="Détails du Virement" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Montant" required>
                    <Input required type="number" min="1" step="0.01" className={inputCls} placeholder="0.00" value={form.amount} onChange={e => set("amount", e.target.value)} />
                  </Field>
                  <Field label="Devise">
                    <select className={selectCls} value={form.currency} onChange={e => set("currency", e.target.value)}>
                      <option value="EUR">EUR — Euro</option>
                      <option value="USD">USD — Dollar US</option>
                      <option value="GBP">GBP — Livre sterling</option>
                      <option value="XOF">XOF — Franc CFA</option>
                      <option value="CHF">CHF — Franc suisse</option>
                    </select>
                  </Field>
                  <Field label="Référence (optionnel)">
                    <Input className={inputCls} placeholder="Auto-générée si vide" value={form.reference} onChange={e => set("reference", e.target.value)} />
                  </Field>
                  <Field label="Date d'opération" required>
                    <Input required type="date" className={inputCls} value={form.transferDate} onChange={e => set("transferDate", e.target.value)} />
                  </Field>
                  <Field label="Date de valeur">
                    <Input type="date" className={inputCls} value={form.valueDate} onChange={e => set("valueDate", e.target.value)} />
                  </Field>
                  <Field label="Date d'arrivée estimée">
                    <Input type="date" className={inputCls} value={form.estimatedDate} onChange={e => set("estimatedDate", e.target.value)} />
                  </Field>
                  <div className="md:col-span-3">
                    <Field label="Motif / Libellé du virement" required>
                      <Input required className={inputCls} placeholder="Ex: Paiement facture N°2024-001, Remboursement prêt, Loyer janvier..." value={form.motif} onChange={e => set("motif", e.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Section 4 — Agency details (optional, for PDF) */}
              <div>
                <SectionTitle num={4} title="Détails Agence & Opérateur (optionnels)" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Field label="Agence émettrice">
                      <Input className={inputCls} placeholder={`${BANKS[form.selectedBank].name} — Agence Principale`} value={form.agencyName} onChange={e => set("agencyName", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Code agence">
                    <Input className={inputCls} placeholder="001" value={form.agencyCode} onChange={e => set("agencyCode", e.target.value)} />
                  </Field>
                  <div className="md:col-span-3">
                    <Field label="Nom de l'opérateur">
                      <Input className={inputCls} placeholder="Traitement Automatique" value={form.operatorName} onChange={e => set("operatorName", e.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Submit bar */}
          <div className="bg-[#0a0d13] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 px-4 py-2 rounded-lg border border-amber-400/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Coût : <strong>{cost} coins</strong> — Solde actuel : <strong>{coins} coins</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {type === "simulation" && (
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>Via <strong className="text-white">{BANKS[form.selectedBank].name}</strong></span>
                </div>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || coins < cost}
                className="h-12 px-8 text-base font-bold bg-white text-black hover:bg-gray-100 disabled:opacity-50 rounded-xl ml-auto sm:ml-0"
              >
                {isSubmitting
                  ? "Génération..."
                  : type === "simulation"
                  ? "🔗 Générer le lien"
                  : "📄 Télécharger le PDF"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
