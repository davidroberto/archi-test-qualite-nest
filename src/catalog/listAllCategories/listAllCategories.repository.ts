import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ListAllCategoriesRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAll() {
    return this.dataSource.query(`
      SELECT c.id, c.name
      FROM category c
    `);
  }
}
