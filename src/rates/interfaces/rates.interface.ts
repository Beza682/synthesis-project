export interface Rates {
    date: Date
    base: string
    rates: Record<string, string>
}