import { motion } from 'framer-motion';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { BottomNav } from '@/components/BottomNav';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useSettings } from '@/hooks/useSettings';
import { Calendar, Activity, TrendingUp } from 'lucide-react';

export default function HistoryPage() {
    const { settings } = useSettings();
    const { checkInData } = useCheckIn(
        settings.checkInFrequencyDays,
        settings.gracePeriodMinutes
    );

    const history = checkInData.checkInHistory;
    const checkInDates = history.map((d) => parseISO(d));

    // Current month calendar
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Stats
    const totalCheckIns = history.length;
    const thisMonthCheckIns = checkInDates.filter(
        (d) => d >= monthStart && d <= monthEnd
    ).length;

    // Streak: consecutive days with at least one check-in (backwards from today)
    const getStreak = () => {
        if (checkInDates.length === 0) return 0;
        let streak = 0;
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // Check backwards day by day
        for (let i = 0; i < 365; i++) {
            const checkDay = new Date(today);
            checkDay.setDate(checkDay.getDate() - i);
            const hasCheckIn = checkInDates.some((d) => isSameDay(d, checkDay));
            if (hasCheckIn) {
                streak++;
            } else if (i > 0) {
                // Don't break on today if no check-in yet today
                break;
            }
        }
        return streak;
    };

    const streak = getStreak();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="min-h-screen bg-background safe-area-top pb-24">
            {/* Header */}
            <header className="px-6 pt-8 pb-6">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-semibold text-foreground">History</h1>
                    <p className="text-muted-foreground mt-1">
                        Your check-in journey
                    </p>
                </motion.div>
            </header>

            <main className="px-6 space-y-6">
                {/* Stats cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-3"
                >
                    <div className="bg-card rounded-lg p-4 border border-border shadow-sm text-center">
                        <Activity className="w-5 h-5 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-foreground">{totalCheckIns}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border shadow-sm text-center">
                        <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-foreground">{thisMonthCheckIns}</p>
                        <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border shadow-sm text-center">
                        <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-foreground">{streak}</p>
                        <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                </motion.div>

                {/* Calendar grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-lg p-4 border border-border shadow-sm"
                >
                    <h2 className="font-medium text-foreground mb-4">
                        {format(now, 'MMMM yyyy')}
                    </h2>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="text-center text-xs text-muted-foreground font-medium py-1"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}

                        {daysInMonth.map((day) => {
                            const hasCheckIn = checkInDates.some((d) => isSameDay(d, day));
                            const isCurrentDay = isToday(day);

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors ${hasCheckIn
                                            ? 'bg-primary text-primary-foreground font-medium'
                                            : isCurrentDay
                                                ? 'bg-muted border-2 border-primary text-foreground font-medium'
                                                : 'text-muted-foreground'
                                        }`}
                                >
                                    {day.getDate()}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Recent check-ins list */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-lg p-4 border border-border shadow-sm"
                >
                    <h2 className="font-medium text-foreground mb-3">Recent Check-ins</h2>
                    {history.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No check-ins yet. Tap "I'm here" to start!
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {[...history]
                                .reverse()
                                .slice(0, 10)
                                .map((dateStr, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                                    >
                                        <span className="text-sm text-foreground">
                                            {format(parseISO(dateStr), 'EEEE, MMM d')}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(parseISO(dateStr), 'h:mm a')}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </motion.div>
            </main>

            <BottomNav />
        </div>
    );
}
