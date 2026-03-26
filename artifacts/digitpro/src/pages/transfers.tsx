import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import { FileText, Link as LinkIcon, ExternalLink, Download, SendHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Transfers() {
  const { transfers } = useApp();
  const { toast } = useToast();

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <AppLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Transfers</h1>
          <p className="text-muted-foreground mt-2">Manage your simulated transfers and documents.</p>
        </div>
        <Link href="/transfers/new">
          <Button className="bg-primary text-white hover:bg-primary/90">
            Create New
          </Button>
        </Link>
      </div>

      {transfers.length === 0 ? (
        <div className="text-center py-20 bg-card/30 border border-white/5 rounded-2xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <SendHorizontal className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No transfers yet</h3>
          <p className="text-muted-foreground mb-6">Create a realistic transfer link or PDF receipt.</p>
          <Link href="/transfers/new">
            <Button>Start Simulator</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {transfers.map(tr => (
            <Card key={tr.id} className="bg-card/40 border-white/5">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className={`bg-background border-white/10 flex items-center gap-1.5 ${tr.type === 'simulation' ? 'text-blue-400' : 'text-purple-400'}`}>
                    {tr.type === 'simulation' ? <LinkIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                    {tr.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{format(new Date(tr.createdAt), 'MMM dd, yyyy')}</span>
                </div>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p className="text-2xl font-bold text-white font-mono">{tr.currency} {tr.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className={
                      tr.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-0' :
                      tr.status === 'processing' ? 'bg-amber-500/20 text-amber-400 border-0' :
                      'bg-blue-500/20 text-blue-400 border-0'
                    }>
                      {tr.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-0.5">Sender</p>
                    <p className="font-medium text-white">{tr.senderName}</p>
                    <p className="text-xs text-muted-foreground">{tr.senderBank}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Receiver</p>
                    <p className="font-medium text-white">{tr.receiverName}</p>
                    <p className="text-xs text-muted-foreground">{tr.receiverBank}</p>
                  </div>
                </div>

                <div className="bg-background/80 rounded-xl border border-white/5 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="font-mono text-sm text-gray-400 truncate max-w-[200px]">
                    {tr.trackingCode}
                  </div>
                  
                  {tr.type === 'simulation' ? (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="secondary" size="sm" onClick={() => handleCopy(tr.trackingUrl)} className="flex-1 sm:flex-none h-9 bg-white/5 hover:bg-white/10 text-white">
                        Copy Link
                      </Button>
                      <Link href={`/track/${tr.trackingCode}`}>
                        <Button size="sm" className="flex-1 sm:flex-none h-9 bg-primary text-white hover:bg-primary/90 px-3">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button size="sm" className="w-full sm:w-auto h-9 bg-white text-black hover:bg-gray-200">
                      <Download className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
