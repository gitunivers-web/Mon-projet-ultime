import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useApp } from '@/contexts/app-context';
import { 
  LayoutDashboard, LayoutTemplate, Phone, Send, 
  History, Settings, Coins, LogOut, Menu, X, Globe, Smartphone, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
  { label: 'Web Builder', href: '/templates', icon: LayoutTemplate, section: 'Services' },
  { label: 'My Websites', href: '/my-websites', icon: Globe, section: 'Services' },
  { label: 'Phone Numbers', href: '/phones', icon: Phone, section: 'Services' },
  { label: 'My Phones', href: '/my-phones', icon: Smartphone, section: 'Services' },
  { label: 'Transfers', href: '/transfers', icon: Send, section: 'Services' },
  { label: 'Buy Coins', href: '/buy-coins', icon: Coins, section: 'Billing' },
  { label: 'Transactions', href: '/transactions', icon: History, section: 'Billing' },
  { label: 'Settings', href: '/settings', icon: Settings, section: 'Account' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, coins, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  const NavContent = () => (
    <>
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/25">
            D
          </div>
          <span className="text-xl font-display font-bold text-white tracking-wide">DigitPro</span>
        </Link>
      </div>

      <div className="px-4 pb-6">
        <div className="bg-gradient-to-br from-card to-background border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-inner">
          <span className="text-sm text-muted-foreground font-medium">Available Balance</span>
          <div className="flex items-center gap-2 text-primary font-display">
            <Coins className="w-5 h-5" />
            <span className="text-3xl font-bold">{coins.toLocaleString()}</span>
          </div>
          <Link href="/buy-coins" className="w-full mt-2">
            <Button variant="outline" size="sm" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary">
              Recharge Coins
            </Button>
          </Link>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        {['Overview', 'Services', 'Billing', 'Account'].map((section) => (
          <div key={section} className="mb-6">
            <h4 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section}
            </h4>
            {SIDEBAR_ITEMS.filter(i => i.section === section).map((item) => {
              const isActive = location === item.href || location.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  <div className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }
                  `}>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarFallback className="bg-secondary text-primary font-medium">
              {user.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-card border-r border-white/5 shadow-2xl z-20">
        <NavContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-white/5 shadow-2xl z-50 flex flex-col md:hidden"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-4 text-muted-foreground">
                <X className="w-6 h-6" />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-foreground p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-primary font-display font-bold">
            <Coins className="w-4 h-4" />
            <span>{coins.toLocaleString()}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
