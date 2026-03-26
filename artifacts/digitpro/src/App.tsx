import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/app-context";
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Templates from "@/pages/templates";
import MyWebsites from "@/pages/my-websites";
import Phones from "@/pages/phones";
import MyPhones from "@/pages/my-phones";
import TransfersNew from "@/pages/transfers-new";
import Transfers from "@/pages/transfers";
import Track from "@/pages/track";
import BuyCoins from "@/pages/buy-coins";
import Transactions from "@/pages/transactions";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/templates" component={Templates} />
      <Route path="/my-websites" component={MyWebsites} />
      <Route path="/phones" component={Phones} />
      <Route path="/my-phones" component={MyPhones} />
      <Route path="/transfers/new" component={TransfersNew} />
      <Route path="/transfers" component={Transfers} />
      <Route path="/track/:code" component={Track} />
      <Route path="/buy-coins" component={BuyCoins} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
