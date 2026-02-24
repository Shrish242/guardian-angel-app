import { useLocalStorage } from './useLocalStorage';
import { CheckInData, DEFAULT_CHECK_IN_DATA } from '@/types/app';
import { useCallback, useMemo } from 'react';
import { addDays, addMinutes, isPast, differenceInSeconds } from 'date-fns';

const CHECKIN_KEY = 'wellness-app-checkin';

export function useCheckIn(frequencyDays: number, gracePeriodMinutes: number) {
  const [checkInData, setCheckInData] = useLocalStorage<CheckInData>(CHECKIN_KEY, DEFAULT_CHECK_IN_DATA);

  const performCheckIn = useCallback(() => {
    const now = new Date().toISOString();
    const nextDeadline = addMinutes(
      addDays(new Date(), frequencyDays),
      gracePeriodMinutes
    ).toISOString();

    setCheckInData((prev) => ({
      lastCheckIn: now,
      nextDeadline,
      checkInHistory: [...prev.checkInHistory, now].slice(-30), // Keep last 30 check-ins
    }));
  }, [frequencyDays, gracePeriodMinutes, setCheckInData]);

  const status: 'never' | 'ok' | 'soon' | 'urgent' | 'overdue' = useMemo(() => {
    if (!checkInData.lastCheckIn || !checkInData.nextDeadline) {
      return 'never' as const;
    }

    const deadline = new Date(checkInData.nextDeadline);
    const now = new Date();

    if (isPast(deadline)) {
      return 'overdue' as const;
    }

    const secondsRemaining = differenceInSeconds(deadline, now);
    const totalSeconds = frequencyDays * 24 * 60 * 60 + gracePeriodMinutes * 60;
    const percentRemaining = (secondsRemaining / totalSeconds) * 100;

    if (percentRemaining < 15) {
      return 'urgent' as const;
    } else if (percentRemaining < 40) {
      return 'soon' as const;
    }

    return 'ok' as const;
  }, [checkInData, frequencyDays, gracePeriodMinutes]);

  const clearData = useCallback(() => {
    setCheckInData(DEFAULT_CHECK_IN_DATA);
  }, [setCheckInData]);

  return {
    checkInData,
    performCheckIn,
    status,
    clearData,
  };
}
