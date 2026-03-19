import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateCategoryService } from './createCategory.service';
import { CreateCategoryRequestDTO } from './createCategory.requestDTO';
import { Category } from '../category.entity';

@Controller('catalog')
export class CreateCategoryController {
  constructor(
    @Inject(CreateCategoryService)
    private readonly createCategoryService: CreateCategoryService,
  ) {}

  @Post('create-category')
  async createCategory(
    @Body() body: CreateCategoryRequestDTO,
  ): Promise<Category> {
    return await this.createCategoryService.execute(body.name);
  }
}
