import { useState } from 'react';
import type { Product } from '../backend';
import { Button } from '@/components/ui/button';
import EditProductModal from './EditProductModal';
import QuickSaleDialog from './QuickSaleDialog';

interface ProductCardProps {
  product: Product;
  isLowStock?: boolean;
}

export default function ProductCard({ product, isLowStock = false }: ProductCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuickSale, setShowQuickSale] = useState(false);

  const profit = Number(product.salePrice) - Number(product.purchasePrice);
  const isLow = Number(product.quantity) < 5 || isLowStock;

  const categoryLabels: Record<string, string> = {
    Cable: 'Cable / کیبل',
    Charger: 'Charger / چارجر',
    Handsfree: 'Handsfree / ہینڈزفری',
    PowerBank: 'Power Bank / پاور بینک',
    Cover: 'Cover / کور',
    TemperedGlass: 'Tempered Glass / ٹیمپرڈ گلاس',
    Other: 'Other / دیگر',
  };

  return (
    <>
      <div className={`bg-white rounded-xl p-4 shadow-sm border relative transition-transform active:scale-[0.98] ${isLow ? 'border-l-4 border-l-red-500' : 'border-gray-200'}`}>
        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${isLow ? 'bg-red-500' : 'bg-[oklch(0.55_0.18_145)]'}`}>
          {Number(product.quantity)}
        </div>

        <div className="mb-3 pr-10">
          <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
          <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <div className="text-xs text-gray-500">Purchase</div>
            <div className="font-semibold">Rs. {Number(product.purchasePrice).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Sale</div>
            <div className="font-semibold">Rs. {Number(product.salePrice).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Profit</div>
            <div className="font-semibold text-[oklch(0.55_0.18_145)]">Rs. {profit.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Stock Value</div>
            <div className="font-semibold">Rs. {(Number(product.purchasePrice) * Number(product.quantity)).toLocaleString()}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowQuickSale(true)}
            className="flex-1 bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)] hover:opacity-90"
            size="sm"
          >
            Quick Sale
          </Button>
          <Button
            onClick={() => setShowEditModal(true)}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            Edit
          </Button>
        </div>
      </div>

      {showEditModal && (
        <EditProductModal
          product={product}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showQuickSale && (
        <QuickSaleDialog
          product={product}
          onClose={() => setShowQuickSale(false)}
        />
      )}
    </>
  );
}
