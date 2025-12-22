import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Camera, Save, Loader2, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { toast } = useToast();
  const { profile, isLoading, updateProfile } = useProfile();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
  });

  // Initialize form with profile data
  useState(() => {
    if (profile?.fullName) {
      setFullName(profile.fullName);
    }
  });

  const handleSave = () => {
    if (fullName.trim()) {
      updateProfile.mutate({ full_name: fullName });
    } else {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    if (profile?.fullName) {
      return profile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        {/* Profile Section */}
        <div className="dashboard-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Profile</h2>
          
          <div className="flex items-start gap-6 mb-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{profile?.fullName || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={fullName || profile?.fullName || ''} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profile?.email || user?.email || ''} 
                disabled 
                className="bg-muted"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="dashboard-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif" className="text-foreground">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates about your tasks</p>
              </div>
              <Switch 
                id="email-notif" 
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notif" className="text-foreground">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about important updates</p>
              </div>
              <Switch 
                id="push-notif" 
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-notif" className="text-foreground">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Receive a weekly summary of activity</p>
              </div>
              <Switch 
                id="weekly-notif" 
                checked={notifications.weekly}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weekly: checked })}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-primary hover:bg-primary/90"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
