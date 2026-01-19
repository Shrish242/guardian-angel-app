import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface CountdownTimerProps {
  timeRemaining: TimeRemaining | null;
  status: 'never' | 'ok' | 'soon' | 'urgent' | 'overdue';
}

export function CountdownTimer({ timeRemaining, status }: CountdownTimerProps) {
  const [, setTick] = useState(0);

  // Force re-render every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

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
        initial={{ opacity: 0.5, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg px-4 py-3 min-w-[70px] shadow-sm border border-border"
      >
        <span className="text-3xl font-semibold text-foreground tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );

  return (
    <div className="text-center space-y-4">
      <p className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusMessage()}
      </p>
      
      <div className="flex items-center justify-center gap-2">
        <TimeBlock value={timeRemaining.days} label="Days" />
        <span className="text-2xl text-muted-foreground mt-[-20px]">:</span>
        <TimeBlock value={timeRemaining.hours} label="Hours" />
        <span className="text-2xl text-muted-foreground mt-[-20px]">:</span>
        <TimeBlock value={timeRemaining.minutes} label="Mins" />
        <span className="text-2xl text-muted-foreground mt-[-20px]">:</span>
        <TimeBlock value={timeRemaining.seconds} label="Secs" />
      </div>
    </div>
  );
}
