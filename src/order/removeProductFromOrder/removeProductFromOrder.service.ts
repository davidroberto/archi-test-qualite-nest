import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order.entity';
import { OrderItem } from '../orderItem.entity';

@Injectable()
export class RemoveProductFromOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async execute(orderId: string, orderItemId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderItem = order.items.find((item) => item.id === orderItemId);

    if (!orderItem) {
      throw new NotFoundException(
        `Order item with ID ${orderItemId} not found in this order`,
      );
    }

    await this.orderItemRepository.delete(orderItemId);
  }
}
