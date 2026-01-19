import { useLocalStorage } from './useLocalStorage';
import { Contact } from '@/types/app';
import { useCallback } from 'react';

const CONTACTS_KEY = 'wellness-app-contacts';

export function useContacts() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>(CONTACTS_KEY, []);

  const addContact = useCallback((contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
    };
    setContacts((prev) => [...prev, newContact]);
    return newContact;
  }, [setContacts]);

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, ...updates } : contact
      )
    );
  }, [setContacts]);

  const deleteContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  }, [setContacts]);

  const setFavorite = useCallback((id: string) => {
    setContacts((prev) =>
      prev.map((contact) => ({
        ...contact,
        isFavorite: contact.id === id,
      }))
    );
  }, [setContacts]);

  const getFavoriteContact = useCallback(() => {
    return contacts.find((contact) => contact.isFavorite) || null;
  }, [contacts]);

  const getContactsByCategory = useCallback((category: Contact['category']) => {
    return contacts.filter((contact) => contact.category === category);
  }, [contacts]);

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    setFavorite,
    getFavoriteContact,
    getContactsByCategory,
  };
}
