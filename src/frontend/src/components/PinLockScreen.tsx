import { useState, useEffect } from 'react';
import { useGetSettings, useUpdatePin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PinLockScreenProps {
  onUnlock: () => void;
}

export default function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const [pin, setPin] = useState('');
  const { data: settings } = useGetSettings();
  const updatePinMutation = useUpdatePin();

  useEffect(() => {
    if (pin.length === 4) {
      handleUnlock();
    }
  }, [pin]);

  const handleUnlock = () => {
    if (pin === settings?.pin) {
      onUnlock();
      setPin('');
    } else {
      toast.error('Wrong PIN!');
      setPin('');
    }
  };

  const handleResetPin = async () => {
    if (confirm('Reset PIN to default (1234)?')) {
      try {
        await updatePinMutation.mutateAsync('1234');
        toast.success('PIN reset to 1234');
        onUnlock();
      } catch (error) {
        toast.error('Failed to reset PIN');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)] flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold mb-2">App Locked</h2>
        <p className="text-sm text-gray-600 mb-4">Enter 4-digit PIN</p>

        <div className="flex justify-center gap-3 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < pin.length ? 'bg-[oklch(0.55_0.18_145)]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="text-center text-2xl tracking-widest mb-4"
          placeholder="••••"
          autoFocus
        />

        <Button
          onClick={handleUnlock}
          className="w-full mb-3 bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)]"
        >
          Unlock
        </Button>

        <Button
          onClick={handleResetPin}
          variant="outline"
          className="w-full"
        >
          Forgot PIN?
        </Button>
      </div>
    </div>
  );
}
