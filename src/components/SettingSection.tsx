import { motion } from 'framer-motion';

interface SettingSectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

export const SettingSection = ({ icon: Icon, title, children }: SettingSectionProps) => (
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
