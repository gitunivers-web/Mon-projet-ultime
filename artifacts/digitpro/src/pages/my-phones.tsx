import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, RefreshCw, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function MyPhones() {
  const { phones } = useApp();

  return (
    <AppLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Numbers</h1>
          <p className="text-muted-foreground mt-2">Active numbers and received SMS codes.</p>
        </div>
        <Link href="/phones">
          <Button className="bg-primary text-white hover:bg-primary/90">
            Get New Number
          </Button>
        </Link>
      </div>

      {phones.length === 0 ? (
        <div className="text-center py-20 bg-card/30 border border-white/5 rounded-2xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No active numbers</h3>
          <p className="text-muted-foreground mb-6">Purchase a virtual number to start receiving verification codes.</p>
          <Link href="/phones">
            <Button>View Available Numbers</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {phones.map(ph => (
            <Card key={ph.id} className="bg-card/40 border-white/5">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge variant="outline" className="mb-2 bg-white/5 border-white/10 text-gray-300">
                      {ph.country} • {ph.service}
                    </Badge>
                    <h3 className="font-mono text-2xl font-bold text-white tracking-widest">{ph.number}</h3>
                  </div>
                  <Badge variant={ph.status === 'active' ? 'default' : 'secondary'} className={
                    ph.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'
                  }>
                    {ph.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="bg-background/80 rounded-xl border border-white/5 p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Latest SMS Code
                    </span>
                    <button className="text-primary hover:text-primary/80 transition-colors" title="Refresh">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  {ph.smsCode ? (
                    <div className="text-3xl font-mono font-bold text-white text-center py-2 tracking-[0.2em]">
                      {ph.smsCode}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground italic">
                      Waiting for SMS...
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Expires: {format(new Date(ph.expiresAt), 'MMM dd, yyyy HH:mm')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
