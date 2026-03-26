import { useParams } from "wouter";
import { useApp } from "@/contexts/app-context";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, ArrowRight, Shield } from "lucide-react";
import { format } from "date-fns";
import { BANKS, BankKey } from "@/lib/transfer-utils";

export default function Track() {
  const { code } = useParams<{ code: string }>();
  const { transfers } = useApp();

  const transfer = transfers.find(t => t.trackingCode === code && t.type === "simulation");
  // @ts-ignore
  const bankKey: BankKey = (transfer as any)?.bankKey ?? "novabank";
  const bank = BANKS[bankKey];

  if (!transfer) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0d13" }}>
        {/* Minimal bank header */}
        <div className="h-16 flex items-center px-8" style={{ backgroundColor: bank.color }}>
          <span className="text-white font-black text-2xl tracking-tight">{bank.name.toUpperCase()}</span>
          <span className="ml-3 text-white/60 text-sm font-medium">| Secure Transfer</span>
        </div>
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-32 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Code de Suivi Introuvable</h1>
          <p className="text-gray-400 max-w-sm">Le code <span className="font-mono text-white">«{code}»</span> n'existe pas ou a expiré. Vérifiez l'URL et réessayez.</p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      label: "Ordre Reçu",
      desc: "L'ordre de virement a été enregistré et validé par le système.",
      completed: transfer.progress >= 10,
      time: transfer.createdAt,
    },
    {
      label: "Vérification & Conformité",
      desc: "Contrôle des données bancaires et vérification réglementaire (DSP2).",
      completed: transfer.progress >= 35,
      time: transfer.progress >= 35 ? new Date(new Date(transfer.createdAt).getTime() + 1.5 * 3600000).toISOString() : null,
    },
    {
      label: "En Transit Interbancaire",
      desc: "Les fonds sont en cours de routage vers la banque destinataire via SWIFT.",
      completed: transfer.progress >= 70,
      time: transfer.progress >= 70 ? new Date(new Date(transfer.createdAt).getTime() + 5 * 3600000).toISOString() : null,
    },
    {
      label: "Crédité — Livraison Confirmée",
      desc: "Le virement a été crédité sur le compte du bénéficiaire.",
      completed: transfer.status === "completed",
      time: transfer.status === "completed" ? new Date(new Date(transfer.createdAt).getTime() + 24 * 3600000).toISOString() : null,
    },
  ];

  const progressPct = transfer.progress ?? 35;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#07090f" }}>
      {/* Bank header bar */}
      <div style={{ backgroundColor: bank.color }} className="shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-black text-white text-sm">{bank.logo}</div>
            <div>
              <p className="font-black text-white text-lg leading-none tracking-tight">{bank.name.toUpperCase()}</p>
              <p className="text-white/60 text-xs">{bank.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-xs font-medium">Connexion sécurisée SSL</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Suivi de virement en temps réel</p>
          <h1 className="text-3xl font-mono font-bold text-white mb-1">secure<span style={{ color: bank.color }}>{code}</span></h1>
          <p className="text-xs text-gray-500 font-mono">{BANKS[bankKey].domain}</p>
          <div className="mt-4 inline-block">
            <StatusBadge status={transfer.status} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 bg-white/5 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progressPct}%`, backgroundColor: bank.color }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mb-10 px-1">
          <span>Initié</span><span>Vérification</span><span>En transit</span><span>Livré</span>
        </div>

        {/* Parties */}
        <Card className="border-white/5 mb-8 overflow-hidden" style={{ backgroundColor: "#0d111a" }}>
          <div className="h-1 w-full" style={{ backgroundColor: bank.color }} />
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
              {/* Sender */}
              <div className="flex-1 md:pr-8">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Donneur d'ordre</p>
                <p className="text-lg font-bold text-white">{transfer.senderName}</p>
                <p className="text-sm text-gray-400">{transfer.senderBank}</p>
                {transfer.senderIban && <p className="text-xs text-gray-600 mt-1 font-mono">{transfer.senderIban}</p>}
              </div>

              {/* Amount */}
              <div className="flex flex-col items-center justify-center md:px-8 md:border-x border-white/5 py-4 md:py-0">
                <ArrowRight className="w-5 h-5 text-gray-500 mb-2" />
                <p className="text-2xl md:text-3xl font-mono font-black text-white whitespace-nowrap">
                  {new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(transfer.amount)} <span style={{ color: bank.color }}>{transfer.currency}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{transfer.transferDate ? format(new Date(transfer.transferDate), "dd MMMM yyyy") : "—"}</p>
              </div>

              {/* Receiver */}
              <div className="flex-1 md:pl-8 md:text-right">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Bénéficiaire</p>
                <p className="text-lg font-bold text-white">{transfer.receiverName}</p>
                <p className="text-sm text-gray-400">{transfer.receiverBank}</p>
                {transfer.receiverIban && <p className="text-xs text-gray-600 mt-1 font-mono">{transfer.receiverIban}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="border-white/5 mb-8" style={{ backgroundColor: "#0d111a" }}>
          <CardContent className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-semibold">Étapes de traitement</p>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-white/5" />
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="relative flex gap-5 items-start">
                    <div
                      className="relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={step.completed
                        ? { backgroundColor: bank.color, borderColor: bank.color }
                        : { backgroundColor: "#1a1f2e", borderColor: "#2a2f3e" }
                      }
                    >
                      {step.completed
                        ? <CheckCircle2 className="w-5 h-5 text-white" />
                        : <Clock className="w-4 h-4 text-gray-500" />
                      }
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className={`font-bold text-sm ${step.completed ? "text-white" : "text-gray-500"}`}>{step.label}</h4>
                        {step.time && (
                          <span className="text-[11px] text-gray-500 font-mono">
                            {format(new Date(step.time), "dd/MM/yyyy à HH:mm")}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${step.completed ? "text-gray-400" : "text-gray-600"}`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ref info */}
        {(transfer.reference || transfer.description) && (
          <Card className="border-white/5 mb-8" style={{ backgroundColor: "#0d111a" }}>
            <CardContent className="p-5 grid grid-cols-2 gap-4 text-sm">
              {transfer.reference && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Référence</p>
                  <p className="font-mono text-white text-xs">{transfer.reference}</p>
                </div>
              )}
              {transfer.description && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Motif</p>
                  <p className="text-white text-xs">{transfer.description}</p>
                </div>
              )}
              {transfer.estimatedArrival && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Arrivée estimée</p>
                  <p className="text-white text-xs">{transfer.estimatedArrival}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <Shield className="w-3 h-3" />
            <span>Sécurisé par {bank.fullName} — Infrastructure chiffrée TLS 1.3</span>
          </div>
          <p className="text-[11px] text-gray-700">SWIFT/BIC: {bank.swift} — Conformité DSP2 / Directive UE 2015/2366</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed")
    return <span className="px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">✓ Livré</span>;
  if (status === "processing")
    return <span className="px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest animate-pulse">⟳ En transit</span>;
  return <span className="px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest">· Initié</span>;
}
