import type { Product } from '../backend';

export function exportFullReport(products: Product[]) {
  const date = new Date().toLocaleDateString();
  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity), 0);
  const totalValue = products.reduce((sum, p) => sum + Number(p.purchasePrice) * Number(p.quantity), 0);

  let content = `MOBILE BEST INVENTORY REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Total Products: ${products.length}
Total Stock: ${totalStock}
Total Value: Rs. ${totalValue.toLocaleString()}

PRODUCTS LIST
-------------
`;

  products.forEach((p) => {
    content += `
Name: ${p.name}
Category: ${p.category}
Purchase: Rs. ${Number(p.purchasePrice).toLocaleString()}
Sale: Rs. ${Number(p.salePrice).toLocaleString()}
Stock: ${Number(p.quantity)}
Value: Rs. ${(Number(p.purchasePrice) * Number(p.quantity)).toLocaleString()}
---
`;
  });

  downloadTextFile(content, `inventory-report-${date}.txt`);
}

export function exportLowStockReport(products: Product[]) {
  const date = new Date().toLocaleDateString();
  let content = `LOW STOCK REPORT - ${date}\n\n`;

  products.forEach((p) => {
    content += `${p.name} (${p.category}) - Qty: ${Number(p.quantity)}\n`;
  });

  downloadTextFile(content, `low-stock-${date}.txt`);
}

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
