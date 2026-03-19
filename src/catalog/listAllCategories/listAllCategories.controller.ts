import { Controller, Get, Inject } from '@nestjs/common';
import { ListAllCategoriesService } from './listAllCategories.service';

@Controller('catalog')
export class ListAllCategoriesController {
  constructor(
    @Inject(ListAllCategoriesService)
    private readonly listAllCategoriesService: ListAllCategoriesService,
  ) {}

  @Get('categories')
  async listAllCategories() {
    return this.listAllCategoriesService.execute();
  }
}
