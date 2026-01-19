import { useState, useEffect } from 'react';
import { Contact } from '@/types/app';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contact: Omit<Contact, 'id'>) => void;
  editingContact?: Contact | null;
  onUpdate?: (id: string, updates: Partial<Contact>) => void;
}

export function AddContactDialog({
  open,
  onOpenChange,
  onSave,
  editingContact,
  onUpdate,
}: AddContactDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [category, setCategory] = useState<Contact['category']>('family');

  useEffect(() => {
    if (editingContact) {
      setName(editingContact.name);
      setEmail(editingContact.email);
      setRelationship(editingContact.relationship);
      setCategory(editingContact.category);
    } else {
      setName('');
      setEmail('');
      setRelationship('');
      setCategory('family');
    }
  }, [editingContact, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContact && onUpdate) {
      onUpdate(editingContact.id, { name, email, relationship, category });
    } else {
      onSave({
        name,
        email,
        relationship,
        category,
        isFavorite: false,
      });
    }
    
    onOpenChange(false);
  };

  const isValid = name.trim() && email.trim() && relationship.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {editingContact ? 'Edit Contact' : 'Add Trusted Contact'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g., Parent, Sibling, Friend"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Contact['category'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate Support</SelectItem>
                <SelectItem value="family">Family & Friends</SelectItem>
                <SelectItem value="care">Care Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!isValid}>
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
