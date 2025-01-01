import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type MyResponseObj = {
  statusCode: number;
  message: string | object | string[];
  error: string;
  timestamp: string;
  path: string;
};

@Catch()
export class GlobalExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.response.message.toString(),
      error: exception.response.error || 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof PrismaClientKnownRequestError) {
      // myResponseObj.response = exception.meta.cause.toString();
      if (exception.code === 'P2025') {
        myResponseObj.statusCode = HttpStatus.NOT_FOUND;
        // myResponseObj.response = 'Resource not found';
      } else {
        myResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      }
    }

    // You can add more custom error handling here

    response.status(myResponseObj.statusCode).json(myResponseObj);

    super.catch(exception, host);
  }
}
