type Screen = 'dashboard' | 'add' | 'search' | 'sales' | 'reports' | 'settings';

interface TabBarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export default function TabBar({ activeScreen, onScreenChange }: TabBarProps) {
  const tabs: { id: Screen; icon: string; label: string }[] = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'add', icon: '➕', label: 'Add' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'sales', icon: '💰', label: 'Sales' },
    { id: 'reports', icon: '📈', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onScreenChange(tab.id)}
            className={`flex-1 min-w-[60px] px-2 py-3 text-center text-xs font-medium transition-all ${
              activeScreen === tab.id
                ? 'text-[oklch(0.55_0.18_145)] bg-[oklch(0.98_0.02_145)] border-b-2 border-[oklch(0.55_0.18_145)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="text-xl mb-1">{tab.icon}</div>
            <div>{tab.label}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}
