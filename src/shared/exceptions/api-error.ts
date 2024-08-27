export class ApiError {
    statusCode: number
    timestamp: string
    path: string
    message?: string
    validationErrors?: string[]
}
