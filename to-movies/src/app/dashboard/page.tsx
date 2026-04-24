"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, User, CreditCard, Settings, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const isPremium = profile?.subscription_tier === "premium";

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="pt-24 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="bg-slate-800 border border-slate-700 mb-8">
              <TabsTrigger value="account" className="data-[state=active]:bg-slate-700">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="subscription" className="data-[state=active]:bg-slate-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Account Information</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-200">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-slate-800/50 border-slate-700 text-slate-400"
                    />
                    <p className="text-xs text-slate-500">Email cannot be changed</p>
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {isPremium ? (
                      <>
                        <Crown className="h-5 w-5 text-yellow-500" />
                        Premium Member
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5 text-slate-400" />
                        Free Plan
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {isPremium
                      ? "You have access to all premium features"
                      : "Upgrade to unlock premium features"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPremium ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-yellow-500" />
                        <div>
                          <p className="text-white font-medium">Premium Active</p>
                          <p className="text-slate-400 text-sm">Full access to all movies in 1080p HD</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-800 rounded-lg">
                          <p className="text-slate-400 text-sm">Video Quality</p>
                          <p className="text-white font-medium">1080p HD</p>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-lg">
                          <p className="text-slate-400 text-sm">Ads</p>
                          <p className="text-white font-medium">No Ads</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                          <Clock className="h-6 w-6 text-slate-400" />
                          <div>
                            <p className="text-white font-medium">Free Plan</p>
                            <p className="text-slate-400 text-sm">Limited access to movies in 720p</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-800 rounded-lg">
                            <p className="text-slate-400 text-sm">Video Quality</p>
                            <p className="text-white font-medium">720p</p>
                          </div>
                          <div className="p-4 bg-slate-800 rounded-lg">
                            <p className="text-slate-400 text-sm">Ads</p>
                            <p className="text-white font-medium">With Ads</p>
                          </div>
                        </div>
                      </div>
                      <Link href="/pricing">
                        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black gap-2">
                          <Crown className="h-4 w-4" />
                          Upgrade to Premium
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Settings</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Email Notifications</h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Receive updates about new movies and features
                    </p>
                    <p className="text-green-500 text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Enabled
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Data & Privacy</h4>
                    <p className="text-slate-400 text-sm">
                      Your data is stored securely and never shared with third parties
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
