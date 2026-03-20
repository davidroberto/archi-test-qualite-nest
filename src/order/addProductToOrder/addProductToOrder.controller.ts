import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AddProductToOrderService } from './addProductToOrder.service';
import { AddProductToOrderRequestDTO } from './addProductToOrder.requestDTO';
import { Order } from '../order.entity';

@Controller('order')
export class AddProductToOrderController {
  constructor(
    @Inject(AddProductToOrderService)
    private readonly addProductToOrderService: AddProductToOrderService,
  ) {}

  @Post(':orderId/add-product')
  async addProduct(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() body: AddProductToOrderRequestDTO,
  ): Promise<Order> {
    return this.addProductToOrderService.execute(orderId, body.productId);
  }
}
