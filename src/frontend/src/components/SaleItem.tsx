import type { Sale } from '../backend';

interface SaleItemProps {
  sale: Sale;
}

export default function SaleItem({ sale }: SaleItemProps) {
  const date = new Date(Number(sale.date) / 1_000_000);

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-lg">{sale.productName}</h4>
        <span className="text-[oklch(0.55_0.18_145)] font-semibold">
          +Rs. {Number(sale.profit).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Qty: {Number(sale.quantity)}</span>
        <span>{date.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
