import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class GetOrderSummaryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(orderId: string) {
    const items = await this.dataSource.query(
      `SELECT
        oi.id AS "orderItemId",
        p.id AS "productId",
        p.name AS "productName",
        p.price AS "productPrice"
      FROM order_item oi
      JOIN product p ON p.id = oi."productId"
      WHERE oi."orderId" = $1`,
      [orderId],
    );

    const totalResult = await this.dataSource.query(
      `SELECT COALESCE(SUM(p.price), 0) AS "total"
      FROM order_item oi
      JOIN product p ON p.id = oi."productId"
      WHERE oi."orderId" = $1`,
      [orderId],
    );

    return {
      items,
      total: Number(totalResult[0].total),
    };
  }
}
