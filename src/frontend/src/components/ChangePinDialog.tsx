import { useState } from 'react';
import { useUpdatePin } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ChangePinDialogProps {
  onClose: () => void;
}

export default function ChangePinDialog({ onClose }: ChangePinDialogProps) {
  const [newPin, setNewPin] = useState('');
  const updatePinMutation = useUpdatePin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast.error('Please enter a valid 4-digit PIN');
      return;
    }

    try {
      await updatePinMutation.mutateAsync(newPin);
      toast.success('PIN changed successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to change PIN');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change PIN</DialogTitle>
          <DialogDescription>Enter a new 4-digit PIN code</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newPin">New PIN</Label>
            <Input
              id="newPin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < newPin.length ? 'bg-[oklch(0.55_0.18_145)]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)]"
              disabled={updatePinMutation.isPending}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
