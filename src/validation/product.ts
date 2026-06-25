import { z } from 'zod';

export const getProductsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  category: z.string().optional(),
  cursor: z.string().optional()
});

export type GetProductsQuery = z.infer<typeof getProductsSchema>;
