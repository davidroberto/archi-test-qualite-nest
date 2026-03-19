import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateProductService } from './createProduct.service';
import { Product } from '../product.entity';

type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
};

@Controller('catalog')
export class CreateProductController {
  constructor(
    @Inject(CreateProductService)
    private readonly createProductService: CreateProductService,
  ) {}

  @Post('create-product')
  async createProduct(@Body() body: CreateProductRequest): Promise<Product> {
    const { name, description, price } = body;

    return this.createProductService.execute(name, description, price);
  }
}
