import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { DeleteCategoryService } from './deleteCategory.service';

@Controller('catalog/categories')
export class DeleteCategoryController {
  constructor(
    @Inject(DeleteCategoryService)
    private readonly deleteCategoryService: DeleteCategoryService,
  ) {}

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.deleteCategoryService.execute(id);
  }
}
