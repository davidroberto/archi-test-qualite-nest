import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateProductService } from './createProduct.service';
import { CreateProductRequestDTO } from './createProduct.requestDTO';
import { Product } from '../product.entity';

@Controller('catalog')
export class CreateProductController {
  constructor(
    @Inject(CreateProductService)
    private readonly createProductService: CreateProductService,
  ) {}

  @Post('create-product')
  async createProduct(@Body() body: CreateProductRequestDTO): Promise<Product> {
    const { name, description, price } = body;

    return this.createProductService.execute(name, description, price);
  }
}
