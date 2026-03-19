import { Controller, Get, Inject } from '@nestjs/common';
import { ListAllCategoriesService } from './listAllCategories.service';
import { Category } from '../category.entity';

@Controller('catalog')
export class ListAllCategoriesController {
  constructor(
    @Inject(ListAllCategoriesService)
    private readonly listAllCategoriesService: ListAllCategoriesService,
  ) {}

  @Get('categories')
  async listAllCategories(): Promise<Category[]> {
    return this.listAllCategoriesService.execute();
  }
}
