import { ApiResponseDto, PaginationMeta } from '../dtos/ApiResponseDto';

/**
 * ResponseMapper - Responsible for creating standardized API responses
 * Ensures consistent response structure across the application
 */
export class ResponseMapper {
  /**
   * Create a successful response with data
   */
  public static success<T>(
    data: T, 
    message = 'Success', 
    pagination?: PaginationMeta
  ): ApiResponseDto<T> {
    return {
      success: true,
      data,
      message,
      statusCode: 200,
      ...(pagination && { pagination })
    };
  }

  /**
   * Create a failure response with error message
   */
  public static error<T>(message: string, error?: string, statusCode: number = 400): ApiResponseDto<T> {
    return {
      success: false,
      message,
      error,
      statusCode
    };
  }

  /**
   * Create a response for unauthorized access
   */
  public static unauthorized<T>(error = 'Authentication failed'): ApiResponseDto<T> {
    return this.error('Unauthorized', error, 401);
  }

  /**
   * Create a response for forbidden access
   */
  public static forbidden<T>(error = 'Access denied'): ApiResponseDto<T> {
    return this.error('Forbidden', error, 403);
  }

  /**
   * Create a response for not found resources
   */
  public static notFound<T>(error = 'Resource not found'): ApiResponseDto<T> {
    return this.error('Not found', error, 404);
  }

  /**
   * Create a response for validation errors
   */
  public static validationError<T>(error: string): ApiResponseDto<T> {
    return this.error('Validation failed', error, 400);
  }

  /**
   * Create a response for server errors
   */
  public static serverError<T>(error?: Error): ApiResponseDto<T> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return this.error('Internal server error', errorMessage, 500);
  }

  /**
   * Create a bad request error response
   * @param error The error that occurred
   * @returns An API response with error details
   */
  public static badRequest<T>(error: string): ApiResponseDto<T> {
    return this.error('Bad request', error, 400);
  }
} 