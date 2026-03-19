import { Controller, Get, Inject } from '@nestjs/common';
import { ListAllProductsService } from './listAllProducts.service';
import { Product } from '../product.entity';

@Controller('catalog')
export class ListAllProductsController {
  constructor(
    @Inject(ListAllProductsService)
    private readonly listAllProductsService: ListAllProductsService,
  ) {}

  @Get('products')
  async listAllProducts(): Promise<Product[]> {
    return this.listAllProductsService.execute();
  }
}
