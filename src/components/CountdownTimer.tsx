import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { differenceInSeconds } from 'date-fns';

interface CountdownTimerProps {
  deadline: string | null;
  status: 'never' | 'ok' | 'soon' | 'urgent' | 'overdue';
}

export function CountdownTimer({ deadline, status }: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  // Update every second for smooth countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time remaining on every tick
  const timeRemaining = useMemo(() => {
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);
    const seconds = differenceInSeconds(deadlineDate, now);

    if (seconds <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(seconds / (24 * 60 * 60)),
      hours: Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)),
      minutes: Math.floor((seconds % (60 * 60)) / 60),
      seconds: seconds % 60,
      total: seconds,
    };
  }, [deadline, now]);

  if (!timeRemaining) {
    return (
      <div className="text-center">
        <p className="text-lg text-muted-foreground">
          Check in to start your wellness timer
        </p>
      </div>
    );
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'overdue':
        return 'Check-in overdue';
      case 'urgent':
        return 'Check in soon';
      case 'soon':
        return 'Next check-in approaching';
      default:
        return 'Time until next check-in';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'overdue':
        return 'text-destructive';
      case 'urgent':
        return 'text-warning';
      case 'soon':
        return 'text-accent-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ opacity: 0.8, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-lg px-2 py-2 sm:px-4 sm:py-3 min-w-[48px] sm:min-w-[70px] shadow-sm border border-border"
      >
        <span className="text-lg sm:text-3xl font-semibold text-foreground tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-1.5 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );

  return (
    <div className="text-center space-y-4">
      <p className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusMessage()}
      </p>
      
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <TimeBlock value={timeRemaining.days} label="Days" />
        <span className="text-lg sm:text-2xl text-muted-foreground mt-[-16px] sm:mt-[-20px]">:</span>
        <TimeBlock value={timeRemaining.hours} label="Hours" />
        <span className="text-lg sm:text-2xl text-muted-foreground mt-[-16px] sm:mt-[-20px]">:</span>
        <TimeBlock value={timeRemaining.minutes} label="Mins" />
        <span className="text-lg sm:text-2xl text-muted-foreground mt-[-16px] sm:mt-[-20px]">:</span>
        <TimeBlock value={timeRemaining.seconds} label="Secs" />
      </div>
    </div>
  );
}
