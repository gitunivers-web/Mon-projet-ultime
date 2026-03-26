import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              D
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-wide">DigitPro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="font-semibold px-6 rounded-full bg-white text-black hover:bg-gray-200">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
                  Log in
                </Link>
                <Link href="/register">
                  <Button className="font-semibold px-6 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 border-0">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <footer className="border-t border-white/5 bg-card/50 py-12 mt-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} DigitPro Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
