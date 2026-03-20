import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order.entity';
import { OrderItem } from '../orderItem.entity';
import { Product } from '../../catalog/product.entity';

const MAX_ITEMS_PER_ORDER = 5;
const MAX_ORDER_TOTAL = 200;

@Injectable()
export class AddProductToOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async execute(orderId: string, productId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.stock <= 0) {
      throw new BadRequestException(
        `Product "${product.name}" is out of stock`,
      );
    }

    if (order.items.length >= MAX_ITEMS_PER_ORDER) {
      throw new BadRequestException(
        `Order cannot contain more than ${MAX_ITEMS_PER_ORDER} products`,
      );
    }

    const currentTotal = order.items.reduce(
      (sum, item) => sum + Number(item.product.price),
      0,
    );

    if (currentTotal + Number(product.price) > MAX_ORDER_TOTAL) {
      throw new BadRequestException(
        `Order total cannot exceed ${MAX_ORDER_TOTAL}€`,
      );
    }

    const orderItem = new OrderItem();
    orderItem.order = order;
    orderItem.product = product;
    await this.orderItemRepository.save(orderItem);

    const updatedOrder = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    return updatedOrder!;
  }
}
