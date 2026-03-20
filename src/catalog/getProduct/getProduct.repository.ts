import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class GetProductRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string) {
    const rows = await this.dataSource.query(
      `SELECT p.name, p.description FROM product p WHERE p.id = $1`,
      [id],
    );
    return rows[0] ?? null;
  }
}
