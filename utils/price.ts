export function applyDiscount(price: string, discount: number): string {
  const num = parseInt(price.replace(/[$.,]/g, ""), 10);
  if (isNaN(num)) return price;
  const discounted = Math.floor(num * (1 - discount / 100));
  return "$" + discounted.toLocaleString("es-AR");
}

export function getActivePrice(price: string, offer?: { discount: number; endsAt: string }): string {
  if (offer && new Date(offer.endsAt) > new Date()) {
    return applyDiscount(price, offer.discount);
  }
  return price;
}
