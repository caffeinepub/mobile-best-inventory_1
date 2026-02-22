interface ReportCardProps {
  title: string;
  period: string;
  value: string;
  subtitle?: string;
}

export default function ReportCard({ title, period, value, subtitle }: ReportCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-gray-500">{period}</span>
      </div>
      <div className="text-2xl font-bold text-[oklch(0.55_0.18_145)]">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-600 mt-2">{subtitle}</div>
      )}
    </div>
  );
}
