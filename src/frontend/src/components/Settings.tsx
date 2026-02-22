import { useGetSettings, useToggleLock } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useState } from 'react';
import ChangePinDialog from './ChangePinDialog';
import { generateBackup, restoreFromBackup } from '../utils/backupHelpers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Settings() {
  const { data: settings } = useGetSettings();
  const toggleLockMutation = useToggleLock();
  const [showChangePinDialog, setShowChangePinDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleToggleLock = async () => {
    try {
      await toggleLockMutation.mutateAsync();
      toast.success(settings?.lockEnabled ? 'App lock disabled' : 'App lock enabled');
    } catch (error) {
      toast.error('Failed to toggle lock');
    }
  };

  const handleBackup = async () => {
    try {
      await generateBackup();
      toast.success('Backup downloaded!');
    } catch (error) {
      toast.error('Failed to create backup');
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await restoreFromBackup(file);
      toast.success('Data restored successfully!');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to restore backup');
    }
  };

  const handleReset = () => {
    localStorage.clear();
    toast.success('All data reset!');
    window.location.reload();
  };

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <div className="space-y-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm mb-1">App Lock</h3>
            <p className="text-xs text-gray-600">Require PIN to open app</p>
          </div>
          <Switch
            checked={settings?.lockEnabled || false}
            onCheckedChange={handleToggleLock}
          />
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm mb-1">Set/Change PIN</h3>
            <p className="text-xs text-gray-600">Change your 4-digit security code</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChangePinDialog(true)}
          >
            Change
          </Button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm mb-1">Backup Data</h3>
            <p className="text-xs text-gray-600">Save all data to file</p>
          </div>
          <Button
            size="sm"
            onClick={handleBackup}
            className="bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)]"
          >
            Backup
          </Button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm mb-1">Restore Data</h3>
            <p className="text-xs text-gray-600">Load data from backup file</p>
          </div>
          <label>
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
            <Button variant="outline" size="sm" asChild>
              <span>Restore</span>
            </Button>
          </label>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-red-300 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm mb-1 text-red-600">Reset All Data</h3>
            <p className="text-xs text-gray-600">Delete everything permanently</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowResetDialog(true)}
          >
            Reset
          </Button>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800 mt-6">
          <strong>💡 Tip:</strong> Add this page to your home screen for quick access like a real app!
        </div>

        <footer className="text-center text-xs text-gray-500 mt-8 pb-4">
          <p>© {new Date().getFullYear()} Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.55_0.18_145)] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      {showChangePinDialog && (
        <ChangePinDialog onClose={() => setShowChangePinDialog(false)} />
      )}

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your products, sales, and settings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
              Yes, delete everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
