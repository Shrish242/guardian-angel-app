import { motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { useSettings } from '@/hooks/useSettings';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useContacts } from '@/hooks/useContacts';
import { useEmailJS } from '@/hooks/useEmailJS';
import { EMAILJS_CONFIG } from '@/config/emailjs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Clock, Bell, User, MessageSquare, Trash2, Shield, Send, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { clearData, checkInData } = useCheckIn(settings.checkInFrequencyDays, settings.gracePeriodMinutes);
  const { contacts } = useContacts();
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [localName, setLocalName] = useState(settings.userName);
  
  const emailJS = useEmailJS(EMAILJS_CONFIG);

  // Sync local name when settings change externally
  useEffect(() => {
    setLocalName(settings.userName);
  }, [settings.userName]);

  const handleClearAllData = () => {
    clearData();
    resetSettings();
    window.localStorage.removeItem('wellness-app-contacts');
    window.location.reload();
  };

  const handleSendTestEmail = async () => {
    if (contacts.length === 0) {
      toast.error('Add at least one contact first');
      return;
    }
    
    const favoriteContact = contacts.find(c => c.isFavorite) || contacts[0];
    setIsSendingTest(true);
    
    const result = await emailJS.sendTestEmail(
      favoriteContact.email,
      favoriteContact.name,
      settings
    );
    
    setIsSendingTest(false);
    
    if (result.success) {
      toast.success(`Test email sent to ${favoriteContact.email}`);
    } else {
      toast.error(`Failed: ${result.error}`);
    }
  };

  const frequencyOptions = [
    { value: 1, label: 'Daily' },
    { value: 3, label: 'Every 3 days' },
    { value: 7, label: 'Weekly' },
    { value: 14, label: 'Every 2 weeks' },
    { value: 30, label: 'Monthly' },
  ];

  const gracePeriodOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 360, label: '6 hours' },
  ];

  const SettingSection = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg p-4 border border-border shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 text-foreground">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="font-medium">{title}</h2>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background safe-area-top pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Customize your wellness check-in
          </p>
        </motion.div>
      </header>

      <main className="px-6 space-y-4">
        {/* Profile */}
        <SettingSection icon={User} title="Profile">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={() => updateSettings({ userName: localName })}
              placeholder="Enter your name"
            />
            <p className="text-xs text-muted-foreground">
              Used in greetings and emergency messages
            </p>
          </div>
        </SettingSection>

        {/* Check-in Frequency */}
        <SettingSection icon={Clock} title="Check-in Frequency">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>How often should you check in?</Label>
              <Select
                value={String(settings.checkInFrequencyDays)}
                onValueChange={(v) => updateSettings({ checkInFrequencyDays: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Grace period before alert</Label>
              <Select
                value={String(settings.gracePeriodMinutes)}
                onValueChange={(v) => updateSettings({ gracePeriodMinutes: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gracePeriodOptions.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Extra time before contacting your trusted circle
              </p>
            </div>
          </div>
        </SettingSection>

        {/* Reminders */}
        <SettingSection icon={Bell} title="Daily Reminders">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable daily reminders</Label>
                <p className="text-xs text-muted-foreground">
                  Get a gentle nudge to open the app
                </p>
              </div>
              <Switch
                checked={settings.reminderEnabled}
                onCheckedChange={(checked) => updateSettings({ reminderEnabled: checked })}
              />
            </div>

            {settings.reminderEnabled && (
              <div className="space-y-2">
                <Label htmlFor="reminderTime">Reminder time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                />
              </div>
            )}
          </div>
        </SettingSection>

        {/* Emergency Message */}
        <SettingSection icon={MessageSquare} title="Emergency Message">
          <div className="space-y-2">
            <Label htmlFor="message">Message to your contacts</Label>
            <Textarea
              id="message"
              value={settings.emergencyMessage}
              onChange={(e) => updateSettings({ emergencyMessage: e.target.value })}
              rows={4}
              placeholder="This message will be sent to your contacts..."
            />
            <p className="text-xs text-muted-foreground">
              This will be sent if you miss a check-in
            </p>
          </div>
        </SettingSection>

        {/* Email Alerts */}
        <SettingSection icon={Shield} title="Email Alerts">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Email alerts are configured</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Emergency emails will be sent to your trusted contacts if you miss a check-in.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendTestEmail}
              disabled={isSendingTest || contacts.length === 0}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSendingTest ? 'Sending...' : 'Send Test Email'}
            </Button>
            {contacts.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Add at least one contact to send a test email.
              </p>
            )}
          </div>
        </SettingSection>

        {/* Protection Status */}
        <SettingSection icon={Shield} title="Status">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Emergency contacts</span>
              <span className="font-medium">{contacts.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Check-in frequency</span>
              <span className="font-medium">
                {frequencyOptions.find(o => o.value === settings.checkInFrequencyDays)?.label}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Grace period</span>
              <span className="font-medium">
                {gracePeriodOptions.find(o => o.value === settings.gracePeriodMinutes)?.label}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Email alerts</span>
              <span className="font-medium text-green-600">Ready</span>
            </div>
          </div>
        </SettingSection>

        {/* Clear Data */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your contacts, check-in history, and settings.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllData}>
                  Yes, clear everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-6 text-xs text-muted-foreground"
        >
          <p>Wellness Check-in App</p>
          <p className="mt-1">Your data stays on your device</p>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
