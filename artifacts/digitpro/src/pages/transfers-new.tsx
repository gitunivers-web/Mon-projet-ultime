import { useState } from "react";
import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Send, FileText, Link as LinkIcon, AlertCircle } from "lucide-react";

export default function TransfersNew() {
  const { spendCoins, addTransfer } = useApp();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [type, setType] = useState<"simulation" | "document">("simulation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    senderName: "", senderBank: "",
    receiverName: "", receiverBank: "",
    amount: "", currency: "USD",
    date: new Date().toISOString().split('T')[0]
  });

  const cost = type === "simulation" ? 30 : 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      const success = spendCoins(cost, `Generated Transfer ${type === 'simulation' ? 'Link' : 'PDF'}`, "Transfers");
      
      if (success) {
        const id = "tr-" + Math.random().toString(36).substr(2, 9);
        const code = `TRX-${Math.floor(Math.random()*90000)+10000}-X`;
        
        addTransfer({
          id,
          type,
          trackingCode: code,
          trackingUrl: `https://digitpro.app/track/${code}`,
          senderName: formData.senderName,
          senderBank: formData.senderBank,
          receiverName: formData.receiverName,
          receiverBank: formData.receiverBank,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          status: "initiated",
          progress: 10,
          coinCost: cost,
          createdAt: new Date().toISOString()
        });
        
        toast({ title: "Success", description: `Transfer ${type} generated.` });
        setLocation("/transfers");
      }
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Transfer Simulator</h1>
          <p className="text-muted-foreground mt-2">Generate realistic transfer tracking links or PDF receipts.</p>
        </div>

        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => setType("simulation")}
            variant={type === "simulation" ? "default" : "outline"}
            className={`flex-1 h-14 ${type === "simulation" ? "bg-primary text-white" : "border-white/10 hover:bg-white/5"}`}
          >
            <LinkIcon className="w-5 h-5 mr-2" /> Live Tracking Link (30 Coins)
          </Button>
          <Button 
            onClick={() => setType("document")}
            variant={type === "document" ? "default" : "outline"}
            className={`flex-1 h-14 ${type === "document" ? "bg-primary text-white" : "border-white/10 hover:bg-white/5"}`}
          >
            <FileText className="w-5 h-5 mr-2" /> PDF Receipt (20 Coins)
          </Button>
        </div>

        <Card className="bg-card/50 border-white/5 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Sender Details */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs">1</span> Sender Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sender Name</Label>
                    <Input required className="bg-background border-white/10" value={formData.senderName} onChange={e=>setFormData({...formData, senderName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sender Bank</Label>
                    <Input required className="bg-background border-white/10" value={formData.senderBank} onChange={e=>setFormData({...formData, senderBank: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Receiver Details */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs">2</span> Receiver Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Receiver Name</Label>
                    <Input required className="bg-background border-white/10" value={formData.receiverName} onChange={e=>setFormData({...formData, receiverName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Receiver Bank</Label>
                    <Input required className="bg-background border-white/10" value={formData.receiverBank} onChange={e=>setFormData({...formData, receiverBank: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Transfer Details */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs">3</span> Transfer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" required min="1" className="bg-background border-white/10" value={formData.amount} onChange={e=>setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-white"
                      value={formData.currency} onChange={e=>setFormData({...formData, currency: e.target.value})}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" required className="bg-background border-white/10" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 px-4 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" /> This will cost {cost} coins
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-w-[200px] h-12 text-base font-bold bg-white text-black hover:bg-gray-200">
                  {isSubmitting ? "Generating..." : `Generate ${type === 'simulation' ? 'Link' : 'PDF'}`}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
