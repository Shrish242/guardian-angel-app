import { motion } from 'framer-motion';
import { Heart, Check } from 'lucide-react';
import { useState } from 'react';

interface CheckInButtonProps {
  onCheckIn: () => void;
  status: 'never' | 'ok' | 'soon' | 'urgent' | 'overdue';
}

export function CheckInButton({ onCheckIn, status }: CheckInButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckIn = () => {
    setShowSuccess(true);
    onCheckIn();
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'overdue':
        return 'bg-destructive hover:bg-destructive/90';
      case 'urgent':
        return 'bg-warning hover:bg-warning/90';
      case 'soon':
        return 'bg-accent hover:bg-accent/90';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings */}
      {!showSuccess && status !== 'ok' && (
        <>
          <motion.div
            className={`absolute w-48 h-48 rounded-full ${getStatusStyles()} opacity-20`}
            animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className={`absolute w-48 h-48 rounded-full ${getStatusStyles()} opacity-20`}
            animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </>
      )}

      {/* Main button */}
      <motion.button
        className={`relative w-48 h-48 rounded-full ${getStatusStyles()} text-primary-foreground shadow-lg ripple flex flex-col items-center justify-center gap-3 transition-colors`}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={handleCheckIn}
        disabled={showSuccess}
      >
        <motion.div
          animate={showSuccess ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {showSuccess ? (
            <Check className="w-16 h-16" strokeWidth={2.5} />
          ) : (
            <Heart className="w-16 h-16" fill="currentColor" />
          )}
        </motion.div>
        <span className="text-xl font-medium">
          {showSuccess ? "You're safe" : "I'm here"}
        </span>
      </motion.button>
    </div>
  );
}
