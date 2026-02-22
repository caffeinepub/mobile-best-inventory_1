import { useGetAllProducts, useGetLowStockProducts } from '../hooks/useQueries';
import StatCard from './StatCard';
import ProductCard from './ProductCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { data: products = [] } = useGetAllProducts();
  const { data: lowStockProducts = [] } = useGetLowStockProducts();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity), 0);
  const lowStockCount = lowStockProducts.length;
  const expectedProfit = products.reduce(
    (sum, p) => sum + (Number(p.salePrice) - Number(p.purchasePrice)) * Number(p.quantity),
    0
  );

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard title="Total Products" value={totalProducts} icon="📦" />
        <StatCard title="Total Stock" value={totalStock} icon="📊" />
        <StatCard title="Low Stock Alert" value={lowStockCount} icon="⚠️" variant="alert" />
        <StatCard title="Expected Profit" value={`Rs. ${expectedProfit.toLocaleString()}`} icon="💰" variant="profit" />
      </div>

      {lowStockCount > 0 && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 text-sm">
            Some products are running low on stock!
          </AlertDescription>
        </Alert>
      )}

      <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
        📦 Low Stock Products
      </h2>

      {lowStockCount === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-4 opacity-50">📦</div>
          <p>No low stock items</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <ProductCard key={Number(product.id)} product={product} isLowStock />
          ))}
        </div>
      )}
    </div>
  );
}
