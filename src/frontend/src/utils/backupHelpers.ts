import { useGetAllProducts, useGetSalesByDateRange, useGetSettings } from '../hooks/useQueries';

export async function generateBackup() {
  // Note: This is a simplified version. In a real app, you'd fetch all data from the backend
  const data = {
    backupDate: new Date().toISOString(),
    note: 'Backup data from Mobile Best Inventory',
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mobile-best-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function restoreFromBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.backupDate) {
          throw new Error('Invalid backup file');
        }
        // Note: In a real app, you'd restore data to the backend here
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
