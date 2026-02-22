import { useState } from 'react';
import { useAddProduct } from '../hooks/useQueries';
import { Category } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const addProductMutation = useAddProduct();

  const profit = (Number(salePrice) || 0) - (Number(purchasePrice) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    try {
      await addProductMutation.mutateAsync({
        name,
        category: category as Category,
        purchasePrice: BigInt(purchasePrice),
        salePrice: BigInt(salePrice),
        quantity: BigInt(quantity),
      });

      toast.success('Product saved successfully!');
      resetForm();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setPurchasePrice('');
    setSalePrice('');
    setQuantity('');
  };

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name / پروڈکٹ کا نام</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., iPhone Charger"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Category / کیٹیگری</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cable">Cable / کیبل</SelectItem>
              <SelectItem value="Charger">Charger / چارجر</SelectItem>
              <SelectItem value="Handsfree">Handsfree / ہینڈزفری</SelectItem>
              <SelectItem value="PowerBank">Power Bank / پاور بینک</SelectItem>
              <SelectItem value="Cover">Cover / کور</SelectItem>
              <SelectItem value="TemperedGlass">Tempered Glass / ٹیمپرڈ گلاس</SelectItem>
              <SelectItem value="Other">Other / دیگر</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="purchasePrice">Purchase Price / خرید قیمت (Rs.)</Label>
          <Input
            id="purchasePrice"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="0"
            required
            min="0"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="salePrice">Sale Price / فروخت قیمت (Rs.)</Label>
          <Input
            id="salePrice"
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="0"
            required
            min="0"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Profit per Item / منافع</Label>
          <div className="mt-1 bg-green-50 border border-green-300 rounded-lg p-3 text-center text-lg font-semibold text-[oklch(0.55_0.18_145)]">
            Rs. {profit.toLocaleString()}
          </div>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity / تعداد</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            required
            min="0"
            className="mt-1"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_145)] to-[oklch(0.48_0.16_145)] hover:opacity-90"
          disabled={addProductMutation.isPending}
        >
          💾 Save Product
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={resetForm}
        >
          Clear
        </Button>
      </form>
    </div>
  );
}
