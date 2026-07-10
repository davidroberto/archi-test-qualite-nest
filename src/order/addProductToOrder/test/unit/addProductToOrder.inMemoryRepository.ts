import { Repository } from 'typeorm';
import { Order } from '../../../order.entity';
import { OrderItem } from '../../../orderItem.entity';
import { Product } from '../../../../catalog/product.entity';

export class InMemoryOrderRepository {
  private readonly orders = new Map<string, Order>();

  feedOrder(order: Order): void {
    this.orders.set(order.id, order);
  }

  async findOne(options: { where: { id: string } }): Promise<Order | null> {
    return this.orders.get(options.where.id) ?? null;
  }

  asRepository(): Repository<Order> {
    return this as unknown as Repository<Order>;
  }
}

export class InMemoryProductRepository {
  private readonly products = new Map<string, Product>();

  feedProduct(product: Product): void {
    this.products.set(product.id, product);
  }

  async findOneBy(where: { id: string }): Promise<Product | null> {
    return this.products.get(where.id) ?? null;
  }

  asRepository(): Repository<Product> {
    return this as unknown as Repository<Product>;
  }
}

export class InMemoryOrderItemRepository {
  public readonly savedItems: OrderItem[] = [];

  async save(item: OrderItem): Promise<OrderItem> {
    this.savedItems.push(item);
    item.order.items.push(item);
    return item;
  }

  asRepository(): Repository<OrderItem> {
    return this as unknown as Repository<OrderItem>;
  }
}
