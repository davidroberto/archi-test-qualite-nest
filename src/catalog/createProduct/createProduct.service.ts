import { Product } from '../product.entity';
import { Category } from '../category.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CreateProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(
    name: string,
    description: string,
    price: number,
    categoryIds: string[],
  ): Promise<Product> {
    const categories: Category[] = [];

    for (const categoryId of categoryIds) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      categories.push(category);
    }

    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;
    product.categories = categories;

    return this.productRepository.save(product);
  }
}
