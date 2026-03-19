import { Product } from '../product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CreateProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(
    name: string,
    description: string,
    price: number,
  ): Promise<Product> {

    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;

    return this.productRepository.save(product);
  }
}
