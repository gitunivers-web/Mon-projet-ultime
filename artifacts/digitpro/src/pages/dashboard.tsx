import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe, Smartphone, Send, ArrowRight, Activity, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, websites, phones, transfers, transactions } = useApp();

  const stats = [
    { title: "Active Websites", value: websites.length, icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Phone Numbers", value: phones.length, icon: Smartphone, color: "text-purple-400", bg: "bg-purple-400/10" },
    { title: "Transfers Sent", value: transfers.length, icon: Send, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your digital assets and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((s, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-white/5 shadow-lg">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{s.title}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/templates">
              <div className="group cursor-pointer p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-card to-background hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Create Website</h3>
                <p className="text-sm text-muted-foreground mb-4">Deploy a new template instantly.</p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Start Building <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/transfers/new">
              <div className="group cursor-pointer p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-card to-background hover:border-emerald-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Simulate Transfer</h3>
                <p className="text-sm text-muted-foreground mb-4">Generate tracking links or PDFs.</p>
                <div className="flex items-center text-sm font-medium text-emerald-400">
                  New Transfer <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Activity
            </h2>
            <Link href="/transactions" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          
          <Card className="bg-card/50 backdrop-blur-sm border-white/5">
            <CardContent className="p-0">
              {recentTransactions.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {recentTransactions.map(tx => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="min-w-0 flex-1 pr-4">
                        <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</p>
                      </div>
                      <div className={`font-mono font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No transactions yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
