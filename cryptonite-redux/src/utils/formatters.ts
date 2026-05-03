export function formatCurrency(value: number, currency: "USD" | "EUR" | "ILS" = "USD"): string {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value || 0);
}
