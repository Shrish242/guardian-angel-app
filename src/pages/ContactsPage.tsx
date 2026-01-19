import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Heart, Stethoscope } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { ContactCard } from '@/components/ContactCard';
import { AddContactDialog } from '@/components/AddContactDialog';
import { useContacts } from '@/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/app';

export default function ContactsPage() {
  const {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    setFavorite,
    getContactsByCategory,
  } = useContacts();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingContact(null);
    }
  };

  const immediateContacts = getContactsByCategory('immediate');
  const familyContacts = getContactsByCategory('family');
  const careContacts = getContactsByCategory('care');

  const CategorySection = ({
    title,
    icon: Icon,
    contacts,
  }: {
    title: string;
    icon: React.ElementType;
    contacts: Contact[];
  }) => {
    if (contacts.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="w-4 h-4" />
          <h2 className="text-sm font-medium uppercase tracking-wide">{title}</h2>
        </div>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onSetFavorite={setFavorite}
                onEdit={handleEdit}
                onDelete={deleteContact}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background safe-area-top pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Trusted Circle</h1>
            <p className="text-muted-foreground mt-1">
              People who'll be notified if needed
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            size="icon"
            className="rounded-full h-12 w-12 shadow-md"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </motion.div>
      </header>

      {/* Contacts list */}
      <main className="px-6 space-y-6">
        {contacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              No contacts yet
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">
              Add trusted people who should be notified if you miss a check-in
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Contact
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <CategorySection
              title="Immediate Support"
              icon={Heart}
              contacts={immediateContacts}
            />
            <CategorySection
              title="Family & Friends"
              icon={Users}
              contacts={familyContacts}
            />
            <CategorySection
              title="Care Team"
              icon={Stethoscope}
              contacts={careContacts}
            />
          </motion.div>
        )}
      </main>

      <AddContactDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSave={addContact}
        editingContact={editingContact}
        onUpdate={updateContact}
      />

      <BottomNav />
    </div>
  );
}
