import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, CreditCard, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PACKAGES = [
  { id: "pkg-1", coins: 60, priceXOF: 10000, priceUSD: 16.50, popular: false },
  { id: "pkg-2", coins: 150, priceXOF: 25000, priceUSD: 41.50, popular: true, bonus: 10 },
  { id: "pkg-3", coins: 350, priceXOF: 50000, priceUSD: 83.00, popular: false, bonus: 35 },
  { id: "pkg-4", coins: 750, priceXOF: 100000, priceUSD: 165.00, popular: false, bonus: 100 },
];

export default function BuyCoins() {
  const { addCoins } = useApp();
  const { toast } = useToast();
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[1].id);
  const [method, setMethod] = useState("crypto");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = () => {
    const pkg = PACKAGES.find(p => p.id === selectedPkg);
    if (!pkg) return;

    setIsProcessing(true);
    // Simulate payment gateway redirect/processing
    setTimeout(() => {
      setIsProcessing(false);
      addCoins(pkg.coins + (pkg.bonus || 0), `Top-up Package: ${pkg.coins} Coins`);
      toast({ title: "Payment Successful", description: "Your coins have been added to your balance." });
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Coins className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Recharge Balance</h1>
          <p className="text-muted-foreground text-lg">Purchase DigitCoins to use platform services instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {PACKAGES.map(pkg => (
            <Card 
              key={pkg.id} 
              onClick={() => setSelectedPkg(pkg.id)}
              className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
                selectedPkg === pkg.id 
                  ? 'border-primary shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-primary/5' 
                  : 'border-white/5 bg-card hover:border-white/20'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-primary text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold font-display text-white">{pkg.coins} Coins</h3>
                    {pkg.bonus && <Badge className="bg-accent/20 text-accent border-0 hover:bg-accent/20 text-xs">+{pkg.bonus} Bonus</Badge>}
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">{pkg.priceXOF.toLocaleString()} FCFA</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPkg === pkg.id ? 'border-primary' : 'border-white/20'}`}>
                  {selectedPkg === pkg.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card/50 border border-white/5 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { id: 'crypto', name: 'Crypto (Oxapay)', icon: Zap },
              { id: 'mtn', name: 'MTN Mobile Money', icon: CreditCard },
              { id: 'moov', name: 'Moov Money', icon: CreditCard }
            ].map(m => (
              <div 
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center gap-3 transition-colors ${
                  method === m.id ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-muted-foreground hover:bg-white/5'
                }`}
              >
                <m.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{m.name}</span>
              </div>
            ))}
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 shadow-lg shadow-primary/20"
            onClick={handlePurchase}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay ${PACKAGES.find(p=>p.id===selectedPkg)?.priceXOF.toLocaleString()} FCFA`}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <ShieldIcon className="w-3 h-3" /> Secure encrypted payment
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

// Simple icon for the footer
function ShieldIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}
