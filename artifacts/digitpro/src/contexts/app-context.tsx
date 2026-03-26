import React, { createContext, useContext, useState, useEffect } from "react";
import { User, CoinTransaction, Website, PurchasedPhone, Transfer } from "@workspace/api-client-react/src/generated/api.schemas";
import { MOCK_MY_WEBSITES, MOCK_MY_PHONES, MOCK_TRANSFERS, MOCK_TRANSACTIONS } from "@/lib/mock-db";
import { useToast } from "@/hooks/use-toast";

interface AppState {
  user: User | null;
  coins: number;
  websites: Website[];
  phones: PurchasedPhone[];
  transfers: Transfer[];
  transactions: CoinTransaction[];
  login: (email: string) => void;
  logout: () => void;
  spendCoins: (amount: number, reason: string, service: string) => boolean;
  addCoins: (amount: number, reason: string) => void;
  addWebsite: (ws: Website) => void;
  addPhone: (ph: PurchasedPhone) => void;
  addTransfer: (tr: Transfer) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("digitpro_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [coins, setCoins] = useState(120);
  const [websites, setWebsites] = useState<Website[]>(MOCK_MY_WEBSITES);
  const [phones, setPhones] = useState<PurchasedPhone[]>(MOCK_MY_PHONES);
  const [transfers, setTransfers] = useState<Transfer[]>(MOCK_TRANSFERS);
  const [transactions, setTransactions] = useState<CoinTransaction[]>(MOCK_TRANSACTIONS);

  useEffect(() => {
    if (user) {
      localStorage.setItem("digitpro_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("digitpro_user");
    }
  }, [user]);

  const login = (email: string) => {
    setUser({
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      email,
      firstName: email.split("@")[0],
      lastName: "User",
      coinBalance: coins,
      createdAt: new Date().toISOString()
    });
    toast({ title: "Welcome back!", description: "Successfully logged into DigitPro." });
  };

  const logout = () => {
    setUser(null);
    toast({ title: "Logged out", description: "You have been securely logged out." });
  };

  const spendCoins = (amount: number, reason: string, service: string) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      setTransactions(prev => [{
        id: "ctx-" + Date.now(),
        type: "debit",
        amount,
        description: reason,
        service,
        createdAt: new Date().toISOString()
      }, ...prev]);
      return true;
    }
    toast({ 
      title: "Insufficient Coins", 
      description: `You need ${amount} coins. Please recharge your account.`,
      variant: "destructive"
    });
    return false;
  };

  const addCoins = (amount: number, reason: string) => {
    setCoins(prev => prev + amount);
    setTransactions(prev => [{
      id: "ctx-" + Date.now(),
      type: "credit",
      amount,
      description: reason,
      service: "Billing",
      createdAt: new Date().toISOString()
    }, ...prev]);
    toast({ title: "Coins Added", description: `Successfully added ${amount} coins to your balance.` });
  };

  const addWebsite = (ws: Website) => setWebsites(prev => [ws, ...prev]);
  const addPhone = (ph: PurchasedPhone) => setPhones(prev => [ph, ...prev]);
  const addTransfer = (tr: Transfer) => setTransfers(prev => [tr, ...prev]);

  return (
    <AppContext.Provider value={{
      user, coins, websites, phones, transfers, transactions,
      login, logout, spendCoins, addCoins, addWebsite, addPhone, addTransfer
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
