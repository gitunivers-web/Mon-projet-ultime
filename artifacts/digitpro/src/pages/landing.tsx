import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Smartphone, Send, Shield, Zap, Coins } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";

const features = [
  { icon: Globe, title: "Web Builder", desc: "Deploy stunning SaaS, Portfolio, or E-commerce sites in seconds." },
  { icon: Smartphone, title: "Virtual Numbers", desc: "Private, disposable numbers for WhatsApp, Telegram, and SMS verification." },
  { icon: Send, title: "Bank Transfers", desc: "Simulate realistic transfers with tracking links and downloadable PDFs." },
  { icon: Shield, title: "Total Privacy", desc: "No personal data required for services. Secure and anonymous." },
];

export default function Landing() {
  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-8">
                <Zap className="w-4 h-4" /> The Ultimate Digital Toolkit
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white leading-tight mb-8">
                Build, Communicate, <br/>
                <span className="text-gradient">Simulate Seamlessly.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                DigitPro is your all-in-one platform for rapid website creation, virtual privacy numbers, and realistic document simulations. Powered by a unified coin system.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/10 w-full sm:w-auto">
                    Start Creating Now
                  </Button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-white/20 bg-black/20 hover:bg-white/5 w-full sm:w-auto backdrop-blur-md">
                    Explore Services
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative dashboard preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20"
        >
          <div className="relative rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-2 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-auto">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
              alt="Platform abstract representation" 
              className="w-full h-full object-cover rounded-xl opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-card/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Everything you need.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">One account, one balance, endless possibilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / COINS */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-6">
                <Coins className="w-4 h-4" /> Simple Pricing
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                Pay only for <br/> what you use.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                DigitPro operates on a straightforward coin system. Buy coins via Crypto or Mobile Money, and spend them instantly across any of our services. No hidden subscriptions.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white">
                  <div className="w-2 h-2 rounded-full bg-primary" /> 50 Coins = Professional Website
                </li>
                <li className="flex items-center gap-3 text-white">
                  <div className="w-2 h-2 rounded-full bg-primary" /> 30 Coins = Virtual Phone Number
                </li>
                <li className="flex items-center gap-3 text-white">
                  <div className="w-2 h-2 rounded-full bg-primary" /> 30 Coins = Transfer Simulation Link
                </li>
              </ul>
              <Link href="/register">
                <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                  Create Free Account
                </Button>
              </Link>
            </div>
            <div className="flex-1 relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative h-full flex flex-col items-center justify-center glass-card rounded-full border-2 border-white/10 p-8 shadow-2xl">
                <Coins className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                <h3 className="text-3xl font-display font-bold text-white">DigitCoins</h3>
                <p className="text-muted-foreground mt-2">The universal currency</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
