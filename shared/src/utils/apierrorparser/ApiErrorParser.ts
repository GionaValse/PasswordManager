import { ResponseError } from '../../api';

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

export async function parseApiError(error: unknown): Promise<ApiError> {
  if (error instanceof ResponseError) {
    try {
      const errorData = await error.response.json();

      let message = 'Server error occurred';

      if (Array.isArray(errorData.message)) {
        message = errorData.message.join(', ');
      } else if (typeof errorData.message === 'string') {
        message = errorData.message;
      } else if (typeof errorData.error === 'string') {
        message = errorData.error;
      }

      return {
        message,
        status: error.response.status,
        details: errorData,
      };
    } catch (parseError: unknown) {
      console.error('Error occurred while parsing the API error:', parseError);

      return {
        message: `Network error or server unreachable (${error.response.status})`,
        status: error.response.status,
      };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred',
  };
}
