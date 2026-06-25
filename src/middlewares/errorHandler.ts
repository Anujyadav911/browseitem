import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.issues
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
}
