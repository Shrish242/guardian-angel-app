import { useLocalStorage } from './useLocalStorage';
import { AppSettings, DEFAULT_SETTINGS } from '@/types/app';
import { useCallback } from 'react';

const SETTINGS_KEY = 'wellness-app-settings';

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
