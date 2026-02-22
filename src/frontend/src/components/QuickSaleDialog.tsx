import { useState } from 'react';
import { useRecordSale } from '../hooks/useQueries';
import type { Product } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface QuickSaleDialogProps {
  product: Product;
  onClose: () => void;
}

export default function QuickSaleDialog({ product, onClose }: QuickSaleDialogProps) {
  const [quantity, setQuantity] = useState('');
  const recordSaleMutation = useRecordSale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const qty = Number(quantity);
    if (qty <= 0 || qty > Number(product.quantity)) {
      toast.error('Invalid quantity!');
      return;
    }

    try {
      await recordSaleMutation.mutateAsync({
        productId: product.id,
        quantity: BigInt(qty),
      });

      const profit = (Number(product.salePrice) - Number(product.purchasePrice)) * qty;
      toast.success(`Sold ${qty} ${product.name}! Profit: Rs. ${profit.toLocaleString()}`);
      onClose();
    } catch (error) {
      toast.error('Failed to record sale');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Sale</DialogTitle>
          <DialogDescription>{product.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Available Stock:</span>
              <span className="font-semibold">{Number(product.quantity)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sale Price:</span>
              <span className="font-semibold">Rs. {Number(product.salePrice).toLocaleString()}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity to Sell</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              min="1"
              max={Number(product.quantity)}
              required
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)]"
              disabled={recordSaleMutation.isPending}
            >
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
