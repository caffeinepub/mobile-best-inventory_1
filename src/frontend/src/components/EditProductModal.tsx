import { useState } from 'react';
import { useUpdateProduct, useDeleteProduct } from '../hooks/useQueries';
import type { Product, Category } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function EditProductModal({ product, onClose }: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState<Category>(product.category);
  const [purchasePrice, setPurchasePrice] = useState(product.purchasePrice.toString());
  const [salePrice, setSalePrice] = useState(product.salePrice.toString());
  const [quantity, setQuantity] = useState(product.quantity.toString());

  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        input: {
          name,
          category,
          purchasePrice: BigInt(purchasePrice),
          salePrice: BigInt(salePrice),
          quantity: BigInt(quantity),
        },
      });

      toast.success('Product updated!');
      onClose();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProductMutation.mutateAsync(product.id);
      toast.success('Product deleted!');
      onClose();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cable">Cable</SelectItem>
                <SelectItem value="Charger">Charger</SelectItem>
                <SelectItem value="Handsfree">Handsfree</SelectItem>
                <SelectItem value="PowerBank">Power Bank</SelectItem>
                <SelectItem value="Cover">Cover</SelectItem>
                <SelectItem value="TemperedGlass">Tempered Glass</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="salePrice">Sale Price</Label>
            <Input
              id="salePrice"
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              required
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)]"
            disabled={updateProductMutation.isPending}
          >
            Update Product
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
          >
            Delete Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
