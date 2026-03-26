import { useParams } from "wouter";
import { MOCK_TRANSFERS } from "@/lib/mock-db";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Globe } from "lucide-react";
import { format } from "date-fns";

export default function Track() {
  const { code } = useParams();
  
  // Find mock transfer. In a real app, this is a public unauthenticated API call.
  const transfer = MOCK_TRANSFERS.find(t => t.trackingCode === code && t.type === "simulation");

  if (!transfer) {
    return (
      <PublicLayout>
        <div className="py-32 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Tracking Code Not Found</h1>
          <p className="text-muted-foreground">The transfer code "{code}" does not exist or has expired.</p>
        </div>
      </PublicLayout>
    );
  }

  const steps = [
    { label: "Order Received", completed: true, time: transfer.createdAt },
    { label: "Verification", completed: transfer.progress >= 25, time: transfer.progress >= 25 ? new Date(new Date(transfer.createdAt).getTime() + 3600000).toISOString() : null },
    { label: "Processing at Bank", completed: transfer.progress >= 60, time: transfer.progress >= 60 ? new Date(new Date(transfer.createdAt).getTime() + 7200000).toISOString() : null },
    { label: "Delivered", completed: transfer.status === 'completed', time: null }
  ];

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Globe className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display text-muted-foreground uppercase tracking-widest mb-2">Global Transfer</h1>
          <h2 className="text-4xl font-mono font-bold text-white mb-2">{transfer.trackingCode}</h2>
          <BadgeStatus status={transfer.status} />
        </div>

        <Card className="bg-card/60 backdrop-blur-xl border-white/10 shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-8 mb-8">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Sender</p>
                <p className="text-xl font-bold text-white">{transfer.senderName}</p>
                <p className="text-sm text-gray-400">{transfer.senderBank}</p>
              </div>
              
              <div className="flex flex-col items-center px-8 text-center min-w-[200px]">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Amount</p>
                <p className="text-3xl font-mono font-bold text-primary">{transfer.currency} {transfer.amount.toLocaleString()}</p>
              </div>

              <div className="text-center md:text-right mt-6 md:mt-0">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Receiver</p>
                <p className="text-xl font-bold text-white">{transfer.receiverName}</p>
                <p className="text-sm text-gray-400">{transfer.receiverBank}</p>
              </div>
            </div>

            <div className="relative pt-4">
              <div className="absolute left-[27px] top-4 bottom-0 w-0.5 bg-white/10" />
              
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={i} className="relative flex items-start gap-6">
                    <div className={`relative z-10 w-14 h-14 rounded-full border-4 border-card flex items-center justify-center ${
                      step.completed ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'
                    }`}>
                      {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="pt-3">
                      <h4 className={`text-lg font-bold ${step.completed ? 'text-white' : 'text-muted-foreground'}`}>{step.label}</h4>
                      {step.time && (
                        <p className="text-sm text-gray-400 mt-1">{format(new Date(step.time), 'MMM dd, yyyy - HH:mm')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>Powered by DigitPro Secure Infrastructure</p>
        </div>
      </div>
    </PublicLayout>
  );
}

function BadgeStatus({status}: {status: string}) {
  if (status === 'completed') return <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold tracking-widest text-xs uppercase">Completed</span>;
  if (status === 'processing') return <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 font-bold tracking-widest text-xs uppercase animate-pulse">In Transit</span>;
  return <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 font-bold tracking-widest text-xs uppercase">Initiated</span>;
}
