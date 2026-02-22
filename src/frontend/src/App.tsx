import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import TabBar from './components/TabBar';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import Search from './components/Search';
import Sales from './components/Sales';
import Reports from './components/Reports';
import Settings from './components/Settings';
import PinLockScreen from './components/PinLockScreen';
import { Toaster } from '@/components/ui/sonner';
import { useLockScreen } from './hooks/useLockScreen';

const queryClient = new QueryClient();

type Screen = 'dashboard' | 'add' | 'search' | 'sales' | 'reports' | 'settings';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const { isLocked, unlock } = useLockScreen();

  if (isLocked) {
    return <PinLockScreen onUnlock={unlock} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_145)] to-[oklch(0.96_0.03_145)]">
      <div className="mx-auto max-w-[480px] bg-white min-h-screen shadow-2xl relative">
        <Header />
        <TabBar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
        
        <main className="pb-20">
          {activeScreen === 'dashboard' && <Dashboard />}
          {activeScreen === 'add' && <AddProduct />}
          {activeScreen === 'search' && <Search />}
          {activeScreen === 'sales' && <Sales />}
          {activeScreen === 'reports' && <Reports />}
          {activeScreen === 'settings' && <Settings />}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
