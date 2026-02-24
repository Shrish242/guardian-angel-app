export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  isFavorite: boolean;
  category: 'immediate' | 'family' | 'care';
}

export interface AppSettings {
  checkInFrequencyDays: number;
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM format
  gracePeriodMinutes: number;
  userName: string;
  emergencyMessage: string;
  // EmailJS configuration
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
}

export interface CheckInData {
  lastCheckIn: string | null; // ISO date string
  nextDeadline: string | null; // ISO date string
  checkInHistory: string[]; // Array of ISO date strings
}

export const DEFAULT_SETTINGS: AppSettings = {
  checkInFrequencyDays: 7,
  reminderEnabled: true,
  reminderTime: '09:00',
  gracePeriodMinutes: 60,
  userName: '',
  emergencyMessage: 'This is an automated message. I haven\'t checked in to my wellness app within the expected timeframe. Please reach out to make sure I\'m okay.',
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: '',
};

export const DEFAULT_CHECK_IN_DATA: CheckInData = {
  lastCheckIn: null,
  nextDeadline: null,
  checkInHistory: [],
};
