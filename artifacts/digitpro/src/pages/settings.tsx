import { useApp } from "@/contexts/app-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useApp();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Settings Saved", description: "Your profile has been updated." });
    }, 800);
  };

  if (!user) return null;

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile and preferences.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <Card className="bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="text-xl text-white">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
              <Avatar className="w-24 h-24 border-2 border-primary/50">
                <AvatarFallback className="bg-primary/20 text-primary text-3xl font-display font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 mb-2">Change Avatar</Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue={user.firstName} className="bg-background border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue={user.lastName} className="bg-background border-white/10" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Email Address</Label>
                  <Input defaultValue={user.email} disabled className="bg-background/50 border-white/5 text-muted-foreground opacity-70" />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSaving} className="bg-primary text-white w-full sm:w-auto px-8">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
