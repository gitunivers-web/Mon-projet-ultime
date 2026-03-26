import { useState } from "react";
import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_TEMPLATES } from "@/lib/mock-db";
import { Coins, Check, ArrowRight } from "lucide-react";
import { WebTemplate } from "@workspace/api-client-react/src/generated/api.schemas";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Templates() {
  const { spendCoins, addWebsite } = useApp();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<WebTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");

  const categories = ["All", "Business", "Portfolio", "E-commerce", "Blog"];
  
  const filteredTemplates = selectedCategory === "All" 
    ? MOCK_TEMPLATES 
    : MOCK_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleCreate = () => {
    if (!selectedTemplate || !siteName) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      const success = spendCoins(selectedTemplate.coinCost, `Created Website '${siteName}'`, "Websites");
      
      if (success) {
        addWebsite({
          id: "ws-" + Date.now(),
          siteName,
          templateId: selectedTemplate.id,
          templateName: selectedTemplate.name,
          url: `https://${siteName.toLowerCase().replace(/[^a-z0-9]/g, '')}.digitpro.site`,
          status: "pending",
          createdAt: new Date().toISOString()
        });
        
        toast({ title: "Website Created!", description: "Your new site is being deployed." });
        setSelectedTemplate(null);
        setLocation("/my-websites");
      }
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Website Builder</h1>
          <p className="text-muted-foreground mt-2">Deploy beautiful, responsive websites in seconds.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <Button 
              key={cat} 
              variant={selectedCategory === cat ? "default" : "outline"}
              className={`rounded-full ${selectedCategory !== cat ? 'border-white/10 bg-card hover:bg-white/5' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(tpl => (
          <Card key={tpl.id} className="bg-card/40 border-white/5 overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="aspect-[16/10] relative overflow-hidden bg-muted">
              {/* Using generated images via base URL */}
              <img 
                src={`${import.meta.env.BASE_URL}images/${tpl.previewImage}`} 
                alt={tpl.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback if local image missing during dev
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Button onClick={() => { setSelectedTemplate(tpl); setSiteName(""); setTagline(""); }} className="w-full bg-white text-black hover:bg-gray-200">
                  Select Template
                </Button>
              </div>
              {tpl.featured && (
                <Badge className="absolute top-3 left-3 bg-primary text-white border-0 shadow-lg">Featured</Badge>
              )}
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-white">{tpl.name}</h3>
                  <p className="text-xs text-muted-foreground">{tpl.category}</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex gap-1 items-center font-mono">
                  <Coins className="w-3 h-3" /> {tpl.coinCost}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{tpl.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {tpl.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="bg-card border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Configure Website</DialogTitle>
            <DialogDescription>
              Customizing '{selectedTemplate?.name}'. This will cost <strong className="text-primary">{selectedTemplate?.coinCost} coins</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Project / Site Name *</Label>
              <Input 
                value={siteName} 
                onChange={e => setSiteName(e.target.value)} 
                placeholder="e.g. Acme Corp"
                className="bg-background/50 border-white/10 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline (Optional)</Label>
              <Input 
                value={tagline} 
                onChange={e => setTagline(e.target.value)} 
                placeholder="Innovating the future"
                className="bg-background/50 border-white/10 focus:border-primary"
              />
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mt-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                Your website will be instantly deployed to a secure subdomain. You can map a custom domain later.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!siteName || isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white gap-2 min-w-[140px]"
            >
              {isSubmitting ? "Deploying..." : (
                <>Deploy Site <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
