import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

type AnyObj = Record<string, any>;

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<any>();
    const res = ctx.getResponse<any>();

    const isHttp = exception instanceof HttpException;

    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const base = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req?.url,
      requestId: req?.id,
    };

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      const body =
        typeof response === 'string'
          ? { message: response }
          : (response as AnyObj);

      const message = Array.isArray(body?.message)
        ? body.message
        : typeof body?.message === 'string'
          ? [body.message]
          : ['Validation failed'];

      return res.status(HttpStatus.BAD_REQUEST).json({
        ...base,
        error: 'Bad Request',
        message,
      });
    }

    if (isHttp) {
      const response = exception.getResponse();
      const body =
        typeof response === 'string'
          ? { message: response }
          : (response as AnyObj);

      const message = Array.isArray(body?.message)
        ? body.message
        : typeof body?.message === 'string'
          ? body.message
          : exception.message;

      return res.status(status).json({
        ...base,
        error: body?.error ?? HttpStatus[status] ?? 'Error',
        message,
      });
    }

    return res.status(status).json({
      ...base,
      error: 'Internal Server Error',
      message: 'Internal server error',
    });
  }
}
