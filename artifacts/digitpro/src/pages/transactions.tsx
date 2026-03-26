import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function Transactions() {
  const { transactions, coins } = useApp();

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Transaction History</h1>
          <p className="text-muted-foreground mt-2">Track your coin usage and top-ups.</p>
        </div>
        <div className="bg-card/50 border border-white/5 rounded-xl px-6 py-3">
          <span className="text-sm text-muted-foreground">Current Balance</span>
          <div className="text-2xl font-bold font-display text-primary">{coins.toLocaleString()} Coins</div>
        </div>
      </div>

      <Card className="bg-card/40 border-white/5 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-white/5 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Transaction</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <span className="font-medium text-white">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {tx.service || "System"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(tx.createdAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-mono font-bold ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
