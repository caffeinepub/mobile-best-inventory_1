import { useGetSalesByDateRange, useGetLowStockProducts, useGetAllProducts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import ReportCard from './ReportCard';
import { toast } from 'sonner';
import { exportFullReport, exportLowStockReport } from '../utils/exportHelpers';

export default function Reports() {
  const { data: allProducts = [] } = useGetAllProducts();
  const { data: lowStockProducts = [] } = useGetLowStockProducts();

  const startOfDay = BigInt(new Date().setHours(0, 0, 0, 0) * 1_000_000);
  const endOfDay = BigInt(new Date().setHours(23, 59, 59, 999) * 1_000_000);
  const { data: todaySales = [] } = useGetSalesByDateRange(startOfDay, endOfDay);

  const startOfMonth = BigInt(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() * 1_000_000);
  const endOfMonth = BigInt(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999).getTime() * 1_000_000);
  const { data: monthlySales = [] } = useGetSalesByDateRange(startOfMonth, endOfMonth);

  const dailyTotal = todaySales.reduce((sum, s) => sum + Number(s.salePrice) * Number(s.quantity), 0);
  const dailyItems = todaySales.reduce((sum, s) => sum + Number(s.quantity), 0);
  const monthlyProfit = monthlySales.reduce((sum, s) => sum + Number(s.profit), 0);

  const handleExportFull = () => {
    exportFullReport(allProducts);
    toast.success('Report exported!');
  };

  const handleExportLowStock = () => {
    exportLowStockReport(lowStockProducts);
    toast.success('Low stock report exported!');
  };

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <ReportCard
        title="📅 Daily Sales"
        period="Today"
        value={`Rs. ${dailyTotal.toLocaleString()}`}
        subtitle={`Items sold: ${dailyItems}`}
      />

      <ReportCard
        title="📊 Monthly Profit"
        period="This Month"
        value={`Rs. ${monthlyProfit.toLocaleString()}`}
      />

      <h3 className="text-base font-semibold mb-3 mt-6 flex items-center gap-2">
        📉 Low Stock Report
      </h3>
      <Button
        onClick={handleExportLowStock}
        variant="outline"
        className="w-full mb-6"
      >
        📥 Export Low Stock
      </Button>

      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        📄 Export Data
      </h3>
      <Button
        onClick={handleExportFull}
        className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)] hover:opacity-90"
      >
        📄 Export Full Report
      </Button>
    </div>
  );
}
