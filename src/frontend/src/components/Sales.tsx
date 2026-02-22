import { useState, useEffect } from 'react';
import { useGetAllProducts, useRecordSale, useGetSalesByDateRange } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import SaleItem from './SaleItem';

export default function Sales() {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const { data: products = [] } = useGetAllProducts();
  const recordSaleMutation = useRecordSale();

  const startOfDay = BigInt(new Date().setHours(0, 0, 0, 0) * 1_000_000);
  const endOfDay = BigInt(new Date().setHours(23, 59, 59, 999) * 1_000_000);
  const { data: todaySales = [] } = useGetSalesByDateRange(startOfDay, endOfDay);

  const selectedProduct = products.find((p) => p.id.toString() === selectedProductId);
  const total = selectedProduct ? Number(selectedProduct.salePrice) * Number(quantity || 0) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId || !quantity) {
      toast.error('Please fill all fields');
      return;
    }

    const product = products.find((p) => p.id.toString() === selectedProductId);
    if (!product) return;

    if (Number(quantity) > Number(product.quantity)) {
      toast.error('Not enough stock!');
      return;
    }

    try {
      await recordSaleMutation.mutateAsync({
        productId: BigInt(selectedProductId),
        quantity: BigInt(quantity),
      });

      const profit = (Number(product.salePrice) - Number(product.purchasePrice)) * Number(quantity);
      toast.success(`Sale recorded! Profit: Rs. ${profit.toLocaleString()}`);
      
      setSelectedProductId('');
      setQuantity('');
    } catch (error) {
      toast.error('Failed to record sale');
    }
  };

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <h2 className="text-xl font-semibold mb-4">Record Sale</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="product">Select Product</Label>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={Number(product.id)} value={product.id.toString()}>
                  {product.name} (Stock: {Number(product.quantity)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProduct && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Available Stock</div>
                  <div className="font-semibold text-lg">{Number(selectedProduct.quantity)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Sale Price</div>
                  <div className="font-semibold text-lg">Rs. {Number(selectedProduct.salePrice).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity Sold</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="1"
                max={Number(selectedProduct.quantity)}
                required
                className="mt-1"
              />
            </div>

            <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center text-lg font-semibold text-[oklch(0.55_0.18_145)]">
              Total: Rs. {total.toLocaleString()}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)] hover:opacity-90"
              disabled={recordSaleMutation.isPending}
            >
              ✅ Confirm Sale
            </Button>
          </div>
        )}
      </form>

      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        🕐 Recent Sales
      </h3>

      {todaySales.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-4 opacity-50">💰</div>
          <p>No sales recorded today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todaySales.slice().reverse().slice(0, 10).map((sale) => (
            <SaleItem key={Number(sale.id)} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
}
