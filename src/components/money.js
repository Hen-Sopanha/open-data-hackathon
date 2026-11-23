// Number formatting for the Partners page. Latin digits in both languages so figures stay comparable.
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const int = new Intl.NumberFormat('en-US');

export const formatUsd = (n) => usd.format(n);
export const formatUsdCompact = (n) => usdCompact.format(n);
export const formatInt = (n) => int.format(n);
