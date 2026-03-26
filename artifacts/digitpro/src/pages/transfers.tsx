import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import { FileText, Link as LinkIcon, ExternalLink, Download, SendHorizontal, Copy, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BANKS, BankKey } from "@/lib/transfer-utils";
import { generateTransferPDF, TransferPdfData } from "@/lib/pdf-generator";

export default function Transfers() {
  const { transfers } = useApp();
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "✅ Copié !", description: "L'URL a été copiée dans le presse-papier." });
  };

  const handleDownloadPdf = (tr: any) => {
    const bankKey: BankKey = tr.bankKey ?? "novabank";
    const bank = BANKS[bankKey];
    const data: TransferPdfData = {
      bank: bankKey,
      type: "ordre",
      senderName: tr.senderName,
      senderAddress: "",
      senderIban: tr.senderIban ?? "—",
      senderBic: bank.swift,
      senderAccountNum: "—",
      senderBank: tr.senderBank,
      receiverName: tr.receiverName,
      receiverAddress: "",
      receiverIban: tr.receiverIban ?? "—",
      receiverBic: "—",
      receiverAccountNum: "—",
      receiverBank: tr.receiverBank,
      amount: tr.amount,
      currency: tr.currency,
      reference: tr.reference ?? tr.trackingCode,
      transactionNumber: "TRF" + Date.now(),
      motif: tr.description ?? "Virement bancaire",
      transferDate: tr.transferDate ?? new Date().toISOString().split("T")[0],
      valueDate: tr.transferDate ?? new Date().toISOString().split("T")[0],
      estimatedDate: tr.estimatedArrival ?? "Sous 3 jours ouvrables",
    };
    generateTransferPDF(data);
    toast({ title: "📄 PDF généré", description: "Le document bancaire est en cours de téléchargement." });
  };

  return (
    <AppLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Mes Virements</h1>
          <p className="text-muted-foreground mt-1 text-sm">Gérez vos liens de suivi et vos documents PDF.</p>
        </div>
        <Link href="/transfers/new">
          <Button className="bg-primary text-white hover:bg-primary/90">
            + Nouveau
          </Button>
        </Link>
      </div>

      {transfers.length === 0 ? (
        <div className="text-center py-20 bg-card/30 border border-white/5 rounded-2xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <SendHorizontal className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Aucun virement</h3>
          <p className="text-muted-foreground mb-6">Créez un lien de suivi ou un PDF bancaire.</p>
          <Link href="/transfers/new">
            <Button>Démarrer</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {transfers.map(tr => {
            const bankKey: BankKey = (tr as any).bankKey ?? "novabank";
            const bank = BANKS[bankKey];
            return (
              <Card key={tr.id} className="bg-card/40 border-white/5 overflow-hidden">
                {/* bank color top bar */}
                <div className="h-1" style={{ backgroundColor: bank.color }} />
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded flex items-center justify-center text-white text-[10px] font-black" style={{ backgroundColor: bank.color }}>
                        {bank.logo}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{bank.name}</p>
                        <p className="text-[10px] text-gray-500">{bank.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`border-white/10 flex items-center gap-1.5 text-[10px] ${tr.type === "simulation" ? "text-blue-400" : "text-purple-400"}`}>
                        {tr.type === "simulation" ? <LinkIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {tr.type === "simulation" ? "LIEN" : "PDF"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{format(new Date(tr.createdAt), "dd/MM/yyyy")}</span>
                    </div>
                  </div>

                  {/* Amount / Status */}
                  <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/5">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">Montant</p>
                      <p className="text-2xl font-bold text-white font-mono">
                        {new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(tr.amount)}
                        <span className="text-sm ml-1" style={{ color: bank.color }}>{tr.currency}</span>
                      </p>
                    </div>
                    <Badge className={
                      tr.status === "completed" ? "bg-emerald-500/15 text-emerald-400 border-0" :
                      tr.status === "processing" ? "bg-amber-500/15 text-amber-400 border-0" :
                      "bg-blue-500/15 text-blue-400 border-0"
                    }>
                      {tr.status === "completed" ? "Livré" : tr.status === "processing" ? "En transit" : "Initié"}
                    </Badge>
                  </div>

                  {/* Parties */}
                  <div className="grid grid-cols-2 gap-4 mb-5 text-xs">
                    <div>
                      <p className="text-gray-500 mb-0.5 uppercase tracking-wider text-[10px]">Expéditeur</p>
                      <p className="font-semibold text-white">{tr.senderName}</p>
                      <p className="text-gray-500">{tr.senderBank}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5 uppercase tracking-wider text-[10px]">Bénéficiaire</p>
                      <p className="font-semibold text-white">{tr.receiverName}</p>
                      <p className="text-gray-500">{tr.receiverBank}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {tr.type === "simulation" ? (
                    <div className="bg-background/60 border border-white/5 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Lien de suivi partageable</p>
                      <p className="font-mono text-xs text-gray-300 truncate mb-3">{tr.trackingUrl || `https://secure${tr.trackingCode}.${bank.domain}`}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopy(tr.trackingUrl || `https://secure${tr.trackingCode}.${bank.domain}`)}
                          className="flex-1 h-8 bg-white/5 hover:bg-white/10 text-white text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1.5" /> Copier le lien
                        </Button>
                        <Link href={`/track/${tr.trackingCode}`}>
                          <Button size="sm" className="h-8 text-white text-xs px-3" style={{ backgroundColor: bank.color }}>
                            <Eye className="w-3.5 h-3.5 mr-1" /> Aperçu
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleDownloadPdf(tr)}
                      className="w-full h-10 text-sm font-semibold text-white"
                      style={{ backgroundColor: bank.color }}
                    >
                      <Download className="w-4 h-4 mr-2" /> Télécharger le PDF bancaire
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
