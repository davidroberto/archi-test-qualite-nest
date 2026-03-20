import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { GetProductService } from './getProduct.service';

@Controller('catalog')
export class GetProductController {
  constructor(
    @Inject(GetProductService)
    private readonly getProductService: GetProductService,
  ) {}

  @Get('products/:id')
  async getProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.getProductService.execute(id);
  }
}
