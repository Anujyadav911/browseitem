import { Request, Response, NextFunction } from 'express';
import { getProductsSchema } from '../validation/product';
import { ProductService } from '../services/productService';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = getProductsSchema.parse(req.query);
      const { limit, category, cursor } = validatedQuery;

      const result = await ProductService.getProducts(limit, category, cursor);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
