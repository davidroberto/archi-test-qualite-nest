import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RemoveProductFromOrderService } from './removeProductFromOrder.service';

@Controller('order')
export class RemoveProductFromOrderController {
  constructor(
    @Inject(RemoveProductFromOrderService)
    private readonly removeProductFromOrderService: RemoveProductFromOrderService,
  ) {}

  @Delete(':orderId/remove-product/:orderItemId')
  async removeProduct(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('orderItemId', ParseUUIDPipe) orderItemId: string,
  ): Promise<void> {
    return this.removeProductFromOrderService.execute(orderId, orderItemId);
  }
}
