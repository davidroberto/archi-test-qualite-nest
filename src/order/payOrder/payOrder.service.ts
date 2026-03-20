import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../order.entity';
import { FakeStripeService } from '../fakeStripe.service';

@Injectable()
export class PayOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(FakeStripeService)
    private readonly fakeStripeService: FakeStripeService,
  ) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }

    if (order.items.length === 0) {
      throw new BadRequestException('Cannot pay an empty order');
    }

    const total = order.items.reduce(
      (sum, item) => sum + Number(item.product.price),
      0,
    );

    const payment = await this.fakeStripeService.charge(total);

    if (!payment.success) {
      throw new BadRequestException('Payment failed');
    }

    order.status = OrderStatus.PAID;
    return this.orderRepository.save(order);
  }
}
