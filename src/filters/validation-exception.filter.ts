import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const messages = exceptionResponse['message'];

      // Convert array of messages into an object { field: "error message" }
      const formattedErrors = Array.isArray(messages)
        ? messages.reduce((acc, msg) => {
            // Extracting the field and message properly
            const parts = msg.split(' '); // Split by space
            const fieldName = parts[0]; // First word as field name
            const errorMessage = parts.slice(1).join(' '); // Rest as message

            acc[fieldName] = errorMessage;
            return acc;
          }, {} as Record<string, string>)
        : messages;

      response.status(400).json({
        message: formattedErrors,
        error: 'Bad Request',
        statusCode: 400,
      });
    } else {
      response.status(400).json(exceptionResponse);
    }
  }
}
