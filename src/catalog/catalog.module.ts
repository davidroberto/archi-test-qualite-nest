import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { CreateProductController } from './createProduct/createProduct.controller';
import { CreateProductService } from './createProduct/createProduct.service';
import { DeleteProductController } from './deleteProduct/deleteProduct.controller';
import { DeleteProductService } from './deleteProduct/deleteProduct.service';
import { ListAllProductsController } from './listAllProducts/listAllProducts.controller';
import { ListAllProductsService } from './listAllProducts/listAllProducts.service';
import { ListAllProductsRepository } from './listAllProducts/listAllProducts.repository';
import { CreateCategoryController } from './createCategory/createCategory.controller';
import { CreateCategoryService } from './createCategory/createCategory.service';
import { DeleteCategoryController } from './deleteCategory/deleteCategory.controller';
import { DeleteCategoryService } from './deleteCategory/deleteCategory.service';
import { ListAllCategoriesController } from './listAllCategories/listAllCategories.controller';
import { ListAllCategoriesService } from './listAllCategories/listAllCategories.service';
import { ListAllCategoriesRepository } from './listAllCategories/listAllCategories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [
    CreateProductController,
    DeleteProductController,
    ListAllProductsController,
    CreateCategoryController,
    DeleteCategoryController,
    ListAllCategoriesController,
  ],
  providers: [
    CreateProductService,
    DeleteProductService,
    ListAllProductsService,
    ListAllProductsRepository,
    CreateCategoryService,
    DeleteCategoryService,
    ListAllCategoriesService,
    ListAllCategoriesRepository,
  ],
})
export class CatalogModule {}
