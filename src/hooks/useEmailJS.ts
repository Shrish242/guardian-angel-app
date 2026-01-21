import emailjs from '@emailjs/browser';
import { Contact, AppSettings } from '@/types/app';
import { useCallback } from 'react';

interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export function useEmailJS(config: EmailJSConfig) {
  const sendEmergencyAlert = useCallback(
    async (contacts: Contact[], settings: AppSettings, lastCheckIn: string | null) => {
      if (!config.serviceId || !config.templateId || !config.publicKey) {
        console.error('EmailJS not configured');
        return { success: false, error: 'EmailJS not configured' };
      }

      if (contacts.length === 0) {
        return { success: false, error: 'No contacts to notify' };
      }

      const results: { email: string; success: boolean; error?: string }[] = [];

      // Send to each contact
      for (const contact of contacts) {
        try {
          await emailjs.send(
            config.serviceId,
            config.templateId,
            {
              to_name: contact.name,
              to_email: contact.email,
              from_name: settings.userName || 'Pulse User',
              user_name: settings.userName || 'A loved one',
              relationship: contact.relationship,
              message: `${settings.userName || 'Someone'} sent you a message. This is a message from the Pulse app. Please check upon them at your earliest convenience.`,
              last_checkin: lastCheckIn
                ? new Date(lastCheckIn).toLocaleString()
                : 'Never',
            },
            config.publicKey
          );
          results.push({ email: contact.email, success: true });
        } catch (error: any) {
          console.error(`Failed to send to ${contact.email}:`, error);
          results.push({
            email: contact.email,
            success: false,
            error: error?.text || 'Unknown error',
          });
        }
      }

      const allSuccessful = results.every((r) => r.success);
      return {
        success: allSuccessful,
        results,
        error: allSuccessful ? undefined : 'Some emails failed to send',
      };
    },
    [config]
  );

  const sendTestEmail = useCallback(
    async (toEmail: string, toName: string, settings: AppSettings) => {
      if (!config.serviceId || !config.templateId || !config.publicKey) {
        return { success: false, error: 'EmailJS not configured' };
      }

      try {
        await emailjs.send(
          config.serviceId,
          config.templateId,
          {
            to_name: toName,
            to_email: toEmail,
            from_name: settings.userName || 'Pulse User',
            user_name: settings.userName || 'A loved one',
            relationship: 'Test',
            message: `${settings.userName || 'Someone'} sent you a message. This is a message from the Pulse app. Please check upon them at your earliest convenience.`,
            last_checkin: new Date().toLocaleString(),
          },
          config.publicKey
        );
        return { success: true };
      } catch (error: any) {
        console.error('Test email failed:', error);
        return { success: false, error: error?.text || 'Unknown error' };
      }
    },
    [config]
  );

  const isConfigured = Boolean(config.serviceId && config.templateId && config.publicKey);

  return {
    sendEmergencyAlert,
    sendTestEmail,
    isConfigured,
  };
}
