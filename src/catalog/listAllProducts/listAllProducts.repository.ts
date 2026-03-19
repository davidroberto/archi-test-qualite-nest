import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ListAllProductsRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query(`
      SELECT p.id, p.name, p.description, p.price, c.id AS "categoryId", c.name AS "categoryName"
      FROM product p
      LEFT JOIN category_products_product cp ON cp."productId" = p.id
      LEFT JOIN category c ON c.id = cp."categoryId"
    `);
  }
}
