export const toIdSet = (items) =>
  new Set(items.map((i) => i.product.id));
