export const createSuccessResponse = <T>({
  message,
  data,
  meta,
}: {
  message?: string | null;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}) => {
  return {
    success: true,
    message: message ?? null,
    data,
    meta,
  };
};

export const createErrorResponse = ({
  message,
  errors,
}: {
  message?: string | Record<string, string>;
  errors?: string | Record<string, any>;
}) => {
  return {
    success: false,
    message,
    errors,
    data: null,
  };
};
