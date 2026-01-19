import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckInButton } from '@/components/CheckInButton';
import { CountdownTimer } from '@/components/CountdownTimer';
import { BottomNav } from '@/components/BottomNav';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useSettings } from '@/hooks/useSettings';
import { useContacts } from '@/hooks/useContacts';
import { useEmailJS } from '@/hooks/useEmailJS';
import { EMAILJS_CONFIG } from '@/config/emailjs';
import { Shield, Users, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function HomePage() {
  const { settings } = useSettings();
  const { performCheckIn, status, checkInData } = useCheckIn(
    settings.checkInFrequencyDays,
    settings.gracePeriodMinutes
  );
  const { contacts, getFavoriteContact } = useContacts();
  const favoriteContact = getFavoriteContact();
  const [alertSent, setAlertSent] = useState(false);
  const alertSentRef = useRef(false);

  const emailJS = useEmailJS(EMAILJS_CONFIG);

  // Check for overdue status and send alerts
  useEffect(() => {
    if (status === 'overdue' && emailJS.isConfigured && contacts.length > 0 && !alertSentRef.current) {
      alertSentRef.current = true;
      setAlertSent(true);
      
      emailJS.sendEmergencyAlert(contacts, settings, checkInData.lastCheckIn).then((result) => {
        if (result.success) {
          toast.success('Emergency alerts sent to your contacts');
        } else {
          toast.error('Some alerts failed to send');
        }
      });
    }
    
    // Reset alert flag when status changes from overdue
    if (status !== 'overdue') {
      alertSentRef.current = false;
      setAlertSent(false);
    }
  }, [status, emailJS, contacts, settings, checkInData.lastCheckIn]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background safe-area-top pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold text-foreground">
            {getGreeting()}
            {settings.userName && `, ${settings.userName}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            Your wellness check-in
          </p>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center px-6 pt-8">
        {/* Check-in button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CheckInButton onCheckIn={performCheckIn} status={status} />
        </motion.div>

        {/* Last check-in info */}
        {checkInData.lastCheckIn && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground mt-6"
          >
            Last check-in: {format(new Date(checkInData.lastCheckIn), 'MMM d, h:mm a')}
          </motion.p>
        )}

        {/* Countdown timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 w-full max-w-sm"
        >
          <CountdownTimer deadline={checkInData.nextDeadline} status={status} />
        </motion.div>

        {/* Status cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-sm mt-10 space-y-3"
        >
          {/* Trusted circle status */}
          <Link
            to="/contacts"
            className="block bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Trusted Circle</h3>
                <p className="text-sm text-muted-foreground">
                  {contacts.length === 0
                    ? 'Add your emergency contacts'
                    : `${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`}
                  {favoriteContact && ` • ${favoriteContact.name} is primary`}
                </p>
              </div>
            </div>
          </Link>

          {/* Protection status */}
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                contacts.length > 0 ? 'bg-success/20' : 'bg-muted'
              }`}>
                <Shield className={`w-5 h-5 ${
                  contacts.length > 0 ? 'text-success' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Protection Status</h3>
                <p className="text-sm text-muted-foreground">
                  {contacts.length > 0
                    ? 'Your contacts will be notified if needed'
                    : 'Add contacts to enable alerts'}
                </p>
              </div>
            </div>
          </div>

          {/* Alert sent indicator */}
          {status === 'overdue' && alertSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-destructive">Alerts Sent</h3>
                  <p className="text-sm text-destructive/80">
                    Your contacts have been notified
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
