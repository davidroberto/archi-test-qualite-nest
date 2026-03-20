import { Controller, Inject, Post } from '@nestjs/common';
import { CreateOrderService } from './createOrder.service';
import { Order } from '../order.entity';

@Controller('order')
export class CreateOrderController {
  constructor(
    @Inject(CreateOrderService)
    private readonly createOrderService: CreateOrderService,
  ) {}

  @Post('create')
  async createOrder(): Promise<Order> {
    return this.createOrderService.execute();
  }
}
