import type { Response } from 'express';

export const ApiResponse = {
  success<T>(res: Response, data: T, statusCode = 200, meta?: Record<string, unknown>) {
    return res.status(statusCode).json({ success: true, data, ...(meta && { meta }) });
  },
  created<T>(res: Response, data: T) {
    return ApiResponse.success(res, data, 201);
  },
  noContent(res: Response) {
    return res.status(204).send();
  },
  paginated<T>(res: Response, data: T[], total: number, page: number, limit: number) {
    return res.status(200).json({
      success: true,
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  },
};
