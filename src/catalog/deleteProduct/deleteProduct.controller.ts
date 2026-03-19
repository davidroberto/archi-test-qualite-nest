import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { DeleteProductService } from './deleteProduct.service';

@Controller('catalog')
export class DeleteProductController {
  constructor(
    @Inject(DeleteProductService)
    private readonly deleteProductService: DeleteProductService,
  ) {}

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.deleteProductService.execute(id);
  }
}
