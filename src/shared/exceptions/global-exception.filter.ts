import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { ApiError } from './api-error'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    /* logger */
    private readonly _baseLogContext = AllExceptionsFilter.name
    private readonly _logger = new Logger(this._baseLogContext)

    constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this._httpAdapterHost

        const ctx = host.switchToHttp()

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        let message: string | undefined
        let validationErrors: string[] | undefined

        if (
            exception instanceof HttpException &&
            exception.getStatus() !== HttpStatus.NOT_FOUND
        ) {
            message = exception.message

            if (message === 'Bad Request Exception') {
                message = 'Validation failed'

                validationErrors = (
                    exception.getResponse() as { message: string[] | undefined }
                ).message
            }
        } else if (exception instanceof Error) {
            message = exception.message
        }

        const responseBody: ApiError = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message,
            validationErrors,
        }

        this._logger.warn(`Response error: ${JSON.stringify(responseBody)}`)

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
    }
}
