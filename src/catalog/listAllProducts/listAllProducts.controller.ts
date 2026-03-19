import { Controller, Get, Inject } from '@nestjs/common';
import { ListAllProductsService } from './listAllProducts.service';

@Controller('catalog')
export class ListAllProductsController {
  constructor(
    @Inject(ListAllProductsService)
    private readonly listAllProductsService: ListAllProductsService,
  ) {}

  @Get('products')
  async listAllProducts() {
    return this.listAllProductsService.execute();
  }
}
