/** Format an amount in Algerian dinars with Latin digits, e.g. "124,500 دج". */
export function formatDZD(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")} دج`;
}
