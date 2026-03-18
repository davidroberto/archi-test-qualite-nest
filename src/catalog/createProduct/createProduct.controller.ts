import { Controller, Inject, Post } from '@nestjs/common';
import { CreateProductService } from './createProduct.service';
import { Product } from '../product';

@Controller('catalog')
export class CreateProductController {
  constructor(
    @Inject(CreateProductService) private readonly createProductService: CreateProductService,
  ) {}

  @Post('create-product')
  createProduct(): Product {
    return this.createProductService.execute();
  }