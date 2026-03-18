import { Module } from '@nestjs/common';
import { CreateProductController } from './createProduct/createProduct.controller';
import { CreateProductService } from './createProduct/createProduct.service';

@Module({
  controllers: [CreateProductController],
  providers: [CreateProductService],
})
export class CatalogModule {}
