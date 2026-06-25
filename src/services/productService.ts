import pool from '../db';

export interface ProductCursor {
  updated_at: string;
  id: string;
}

export class ProductService {
  static async getProducts(limit: number, category?: string, cursorStr?: string) {
    let cursor: ProductCursor | null = null;
    
    if (cursorStr) {
      try {
        const decoded = Buffer.from(cursorStr, 'base64').toString('utf-8');
        cursor = JSON.parse(decoded);
      } catch (e) {
        throw new Error('Invalid cursor format');
      }
    }

    const queryParams: any[] = [];
    let queryText = 'SELECT * FROM products';
    const conditions = [];

    if (category) {
      queryParams.push(category);
      conditions.push(`category = $${queryParams.length}`);
    }

    if (cursor) {
      queryParams.push(cursor.updated_at, cursor.id);
      const categoryCondOffset = category ? 1 : 0;
      // PostgreSQL Row Value syntax for keyset pagination
      conditions.push(`(updated_at, id) < ($${categoryCondOffset + 1}, $${categoryCondOffset + 2})`);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY updated_at DESC, id DESC';
    
    // Fetch limit + 1 to check if there is a next page
    queryParams.push(limit + 1);
    queryText += ` LIMIT $${queryParams.length}`;

    const { rows } = await pool.query(queryText, queryParams);

    const hasNextPage = rows.length > limit;
    const data = hasNextPage ? rows.slice(0, limit) : rows;

    let nextCursor: string | null = null;
    if (data.length > 0 && hasNextPage) {
      const lastItem = data[data.length - 1];
      const cursorObj = {
        updated_at: lastItem.updated_at.toISOString(),
        id: lastItem.id
      };
      nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString('base64');
    }

    return {
      data,
      nextCursor,
      hasNextPage
    };
  }
}
