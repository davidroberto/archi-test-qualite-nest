import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductController } from './createProduct/createProduct.controller';
import { CreateProductService } from './createProduct/createProduct.service';
import { DeleteProductController } from './deleteProduct/deleteProduct.controller';
import { DeleteProductService } from './deleteProduct/deleteProduct.service';
import { ListAllProductsController } from './listAllProducts/listAllProducts.controller';
import { ListAllProductsService } from './listAllProducts/listAllProducts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [
    CreateProductController,
    DeleteProductController,
    ListAllProductsController,
  ],
  providers: [
    CreateProductService,
    DeleteProductService,
    ListAllProductsService,
  ],
})
export class CatalogModule {}
