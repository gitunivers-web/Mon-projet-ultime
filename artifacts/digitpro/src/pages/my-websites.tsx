import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Settings, LayoutTemplate } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function MyWebsites() {
  const { websites } = useApp();

  return (
    <AppLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Websites</h1>
          <p className="text-muted-foreground mt-2">Manage your deployed projects.</p>
        </div>
        <Link href="/templates">
          <Button className="bg-primary text-white hover:bg-primary/90">
            Create New
          </Button>
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="text-center py-20 bg-card/30 border border-white/5 rounded-2xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutTemplate className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No websites yet</h3>
          <p className="text-muted-foreground mb-6">Start your digital presence by creating a site from our premium templates.</p>
          <Link href="/templates">
            <Button>Browse Templates</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {websites.map(ws => (
            <Card key={ws.id} className="bg-card/40 border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                      <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{ws.siteName}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        Template: <span className="text-gray-300">{ws.templateName}</span>
                      </p>
                    </div>
                  </div>
                  <Badge variant={ws.status === 'active' ? 'default' : 'secondary'} className={
                    ws.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/20 text-amber-400 border-amber-500/20'
                  }>
                    {ws.status === 'active' ? 'Online' : 'Deploying...'}
                  </Badge>
                </div>

                <div className="bg-background/50 rounded-lg p-3 border border-white/5 mb-6 flex items-center justify-between group">
                  <span className="text-sm font-mono text-muted-foreground truncate mr-4">{ws.url}</span>
                  <a href="#" className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" title="Visit site">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-muted-foreground">
                    Created {format(new Date(ws.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs h-8">
                      <Settings className="w-3.5 h-3.5 mr-1.5" /> Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
