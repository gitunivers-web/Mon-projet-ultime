import { useState } from "react";
import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_PHONES } from "@/lib/mock-db";
import { Coins, Smartphone, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PhoneNumber } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Phones() {
  const { spendCoins, addPhone } = useApp();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const countries = ["All", ...Array.from(new Set(MOCK_PHONES.map(p => p.country)))];
  
  const filteredPhones = selectedCountry === "All" 
    ? MOCK_PHONES 
    : MOCK_PHONES.filter(p => p.country === selectedCountry);

  const handlePurchase = () => {
    if (!selectedPhone) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      const success = spendCoins(selectedPhone.coinCost, `Purchased Phone Number (${selectedPhone.countryCode})`, "Phones");
      
      if (success) {
        addPhone({
          id: "mph-" + Date.now(),
          number: selectedPhone.number,
          country: selectedPhone.country,
          service: "Multi-service",
          expiresAt: new Date(Date.now() + 86400000 * selectedPhone.durationDays).toISOString(),
          status: "active",
          createdAt: new Date().toISOString()
        });
        toast({ title: "Number Acquired!", description: "You can now receive SMS for verification." });
        setSelectedPhone(null);
        setLocation("/my-phones");
      }
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Virtual Numbers</h1>
          <p className="text-muted-foreground mt-2">Private disposable numbers for SMS verification.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {countries.map(c => (
            <Button 
              key={c} 
              variant={selectedCountry === c ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${selectedCountry !== c ? 'border-white/10 bg-card hover:bg-white/5' : ''}`}
              onClick={() => setSelectedCountry(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhones.map(phone => (
          <Card key={phone.id} className="bg-card/40 border-white/5 hover:border-primary/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg font-display">
                    {phone.countryCode === 'US' ? '🇺🇸' : phone.countryCode === 'FR' ? '🇫🇷' : phone.countryCode === 'GB' ? '🇬🇧' : phone.countryCode === 'DE' ? '🇩🇪' : phone.countryCode === 'CI' ? '🇨🇮' : '🌍'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{phone.country}</h3>
                    <p className="text-xs text-muted-foreground">{phone.durationDays} Days Duration</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex gap-1 items-center font-mono">
                  <Coins className="w-3 h-3" /> {phone.coinCost}
                </Badge>
              </div>

              <div className="font-mono text-xl text-center py-4 bg-background/50 rounded-xl border border-white/5 mb-6 text-gray-300 group-hover:text-white transition-colors">
                {phone.number.replace(/\d{4}$/, 'XXXX')}
              </div>

              <div className="mb-6 flex flex-wrap gap-2 justify-center">
                {phone.services.map(s => (
                  <span key={s} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/5 text-gray-400">
                    {s}
                  </span>
                ))}
              </div>

              <Button 
                onClick={() => setSelectedPhone(phone)} 
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                Get Number
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPhone} onOpenChange={(open) => !open && setSelectedPhone(null)}>
        <DialogContent className="bg-card border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-primary" /> Purchase Number
            </DialogTitle>
            <DialogDescription>
              You are about to acquire a virtual number for {selectedPhone?.country}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Number Format</div>
            <div className="text-3xl font-mono text-white tracking-widest">{selectedPhone?.number}</div>
            
            <div className="mt-6 w-full p-4 bg-background border border-white/5 rounded-xl space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supported Services</span>
                <span className="text-white text-right">{selectedPhone?.services.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validity</span>
                <span className="text-white">{selectedPhone?.durationDays} Days</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/5">
                <span className="font-bold text-white">Total Cost</span>
                <span className="font-bold text-primary flex items-center gap-1"><Coins className="w-4 h-4"/> {selectedPhone?.coinCost}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPhone(null)} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button onClick={handlePurchase} disabled={isProcessing} className="bg-primary hover:bg-primary/90 text-white">
              {isProcessing ? "Processing..." : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
