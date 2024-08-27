export class Paginated<T> {
    data: T[]
    cursor: number
    count?: number
}
