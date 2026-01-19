import { motion } from 'framer-motion';
import { Star, Mail, Trash2, Edit2 } from 'lucide-react';
import { Contact } from '@/types/app';
import { Button } from '@/components/ui/button';

interface ContactCardProps {
  contact: Contact;
  onSetFavorite: (id: string) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onSetFavorite, onEdit, onDelete }: ContactCardProps) {
  const getCategoryLabel = (category: Contact['category']) => {
    switch (category) {
      case 'immediate':
        return 'Immediate Support';
      case 'family':
        return 'Family & Friends';
      case 'care':
        return 'Care Team';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card rounded-lg p-4 border border-border shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{contact.name}</h3>
            {contact.isFavorite && (
              <Star className="w-4 h-4 text-warning fill-warning" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{contact.relationship}</p>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <Mail className="w-3.5 h-3.5" />
            <span>{contact.email}</span>
          </div>
          <span className="inline-block mt-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
            {getCategoryLabel(contact.category)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onSetFavorite(contact.id)}
            title={contact.isFavorite ? 'Primary contact' : 'Set as primary'}
          >
            <Star
              className={`w-4 h-4 ${contact.isFavorite ? 'text-warning fill-warning' : 'text-muted-foreground'}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(contact)}
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(contact.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
