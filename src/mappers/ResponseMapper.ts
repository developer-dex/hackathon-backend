import { ApiResponseDto } from '../dtos/ApiResponseDto';

/**
 * ResponseMapper - Responsible for creating standardized API responses
 * Ensures consistent response structure across the application
 */
export class ResponseMapper {
  /**
   * Create a successful response with data
   */
  public static success<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return {
      success: true,
      data,
      message
    };
  }

  /**
   * Create a failure response with error message
   */
  public static error<T>(message: string, error?: string): ApiResponseDto<T> {
    return {
      success: false,
      message,
      error
    };
  }

  /**
   * Create a response for unauthorized access
   */
  public static unauthorized<T>(error = 'Authentication failed'): ApiResponseDto<T> {
    return this.error('Unauthorized', error);
  }

  /**
   * Create a response for forbidden access
   */
  public static forbidden<T>(error = 'Access denied'): ApiResponseDto<T> {
    return this.error('Forbidden', error);
  }

  /**
   * Create a response for not found resources
   */
  public static notFound<T>(resource = 'Resource', error?: string): ApiResponseDto<T> {
    return this.error(`${resource} not found`, error);
  }

  /**
   * Create a response for validation errors
   */
  public static validationError<T>(error: string): ApiResponseDto<T> {
    return this.error('Validation failed', error);
  }

  /**
   * Create a response for server errors
   */
  public static serverError<T>(error?: Error): ApiResponseDto<T> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return this.error('Internal server error', errorMessage);
  }
} 