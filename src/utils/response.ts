export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

export const sendSuccess = <T>(
  data: T,
  message?: string
): SuccessResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

export const sendError = (message: string): ErrorResponse => {
  return {
    success: false,
    message,
  };
};
