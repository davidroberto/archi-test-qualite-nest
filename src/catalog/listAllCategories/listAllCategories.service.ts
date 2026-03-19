import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';

@Injectable()
export class ListAllCategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }
}
