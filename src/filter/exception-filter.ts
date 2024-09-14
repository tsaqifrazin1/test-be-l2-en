import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException, ForbiddenException, NotFoundException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  logger = new Logger();
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();

    this.logger.error(exception, exception.stack);
    response
      .status(status)
      .json({
        status: 'error',
        message: error['message'] ? error['message'] : 'error',
      });
  }
}
