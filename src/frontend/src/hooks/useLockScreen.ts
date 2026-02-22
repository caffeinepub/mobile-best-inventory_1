import { useState, useEffect } from 'react';
import { useGetSettings } from './useQueries';

export function useLockScreen() {
  const { data: settings } = useGetSettings();
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (settings?.lockEnabled) {
      setIsLocked(true);
    }
  }, [settings?.lockEnabled]);

  const unlock = () => {
    setIsLocked(false);
  };

  return { isLocked, unlock };
}
