import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';

@Injectable()
export class CreateCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(name: string): Promise<Category> {
    const category = new Category();
    category.name = name;

    return await this.categoryRepository.save(category);
  }
}
