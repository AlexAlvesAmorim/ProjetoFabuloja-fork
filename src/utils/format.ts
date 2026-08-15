export function formatPrice(price: string | number): string {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  if (Number.isNaN(value)) return '0,00';
  return value.toFixed(2).replace('.', ',');
}
