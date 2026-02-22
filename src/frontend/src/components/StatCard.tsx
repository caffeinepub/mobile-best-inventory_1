interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  variant?: 'default' | 'alert' | 'profit';
}

export default function StatCard({ title, value, icon, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'border-gray-200 bg-white',
    alert: 'border-red-300 bg-red-50',
    profit: 'border-green-300 bg-green-50',
  };

  const valueStyles = {
    default: 'text-[oklch(0.55_0.18_145)]',
    alert: 'text-red-600',
    profit: 'text-[oklch(0.55_0.18_145)]',
  };

  return (
    <div className={`rounded-xl p-4 border shadow-sm text-center ${variantStyles[variant]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">{title}</div>
      <div className={`text-2xl font-bold ${valueStyles[variant]}`}>{value}</div>
    </div>
  );
}
