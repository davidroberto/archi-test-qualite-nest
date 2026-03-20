import { Controller, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PayOrderService } from './payOrder.service';
import { Order } from '../order.entity';

@Controller('order')
export class PayOrderController {
  constructor(
    @Inject(PayOrderService)
    private readonly payOrderService: PayOrderService,
  ) {}

  @Post(':orderId/pay')
  async pay(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<Order> {
    return this.payOrderService.execute(orderId);
  }
}
