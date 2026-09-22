import type { Response } from 'express';

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public statusCode: number,
    public message: string,
    public data?: T,
    public meta?: Meta
  ) {}

  static ok<T>(res: Response, data: T, message = 'Success', meta?: Meta) {
    return res.status(200).json(new ApiResponse(true, 200, message, data, meta));
  }

  static created<T>(res: Response, data: T, message = 'Created') {
    return res.status(201).json(new ApiResponse(true, 201, message, data));
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}