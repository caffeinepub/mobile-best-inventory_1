import { useState } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import ProductCard from './ProductCard';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: products = [] } = useGetAllProducts();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-300">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product name..."
            className="pl-10 rounded-full border-2"
          />
        </div>
      </div>

      <div className="p-4">
        {searchQuery === '' ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4 opacity-50">🔍</div>
            <p>Type to search products</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-4 opacity-50">❌</div>
            <p>No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <ProductCard key={Number(product.id)} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
