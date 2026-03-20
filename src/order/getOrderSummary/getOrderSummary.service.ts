import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order.entity';
import { GetOrderSummaryRepository } from './getOrderSummary.repository';

@Injectable()
export class GetOrderSummaryService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(GetOrderSummaryRepository)
    private readonly getOrderSummaryRepository: GetOrderSummaryRepository,
  ) {}

  async execute(orderId: string) {
    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const { items, total } =
      await this.getOrderSummaryRepository.findById(orderId);

    return {
      orderId,
      items,
      total,
    };
  }
}
