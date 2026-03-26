import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useApp } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useApp();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(formData.email);
      setLocation("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/25">
            D
          </div>
        </Link>

        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/10 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join DigitPro to access all services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-muted-foreground">First Name</Label>
                <Input 
                  id="firstName" required placeholder="John"
                  value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="bg-background/50 border-white/10 h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-muted-foreground">Last Name</Label>
                <Input 
                  id="lastName" required placeholder="Doe"
                  value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="bg-background/50 border-white/10 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
              <Input 
                id="email" type="email" required placeholder="hello@example.com"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-background/50 border-white/10 h-12 rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">Password</Label>
              <Input 
                id="password" type="password" required placeholder="••••••••" minLength={8}
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                className="bg-background/50 border-white/10 h-12 rounded-xl"
              />
            </div>

            <Button 
              type="submit" disabled={isLoading}
              className="w-full h-12 text-base font-semibold rounded-xl bg-white text-black hover:bg-gray-200 mt-4"
            >
              {isLoading ? "Creating..." : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> Create Account
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
