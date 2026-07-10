import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AddProductToOrderService } from '../../addProductToOrder.service';
import {
  InMemoryOrderRepository,
  InMemoryProductRepository,
  InMemoryOrderItemRepository,
} from './addProductToOrder.inMemoryRepository';
import { Order, OrderStatus } from '../../../order.entity';
import { OrderItem } from '../../../orderItem.entity';
import { Product } from '../../../../catalog/product.entity';

const ORDER_ID = '11111111-1111-1111-1111-111111111111';
const PRODUCT_ID = '22222222-2222-2222-2222-222222222222';
const UNKNOWN_ID = '99999999-9999-9999-9999-999999999999';

function makeProduct(overrides: Partial<Product> = {}): Product {
  const product = new Product();
  product.id = PRODUCT_ID;
  product.name = 'Table en chêne';
  product.description = 'Table massive 6 personnes';
  product.price = 50;
  product.stock = 10;
  return Object.assign(product, overrides);
}

function makeOrder(items: OrderItem[] = []): Order {
  const order = new Order();
  order.id = ORDER_ID;
  order.status = OrderStatus.PENDING;
  order.items = items;
  return order;
}

function makeItemWithPrice(price: number): OrderItem {
  const item = new OrderItem();
  item.product = makeProduct({ price });
  return item;
}

describe('Ajouter un produit à une commande (use case)', () => {
  let orderRepository: InMemoryOrderRepository;
  let productRepository: InMemoryProductRepository;
  let orderItemRepository: InMemoryOrderItemRepository;
  let service: AddProductToOrderService;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    productRepository = new InMemoryProductRepository();
    orderItemRepository = new InMemoryOrderItemRepository();
    service = new AddProductToOrderService(
      orderRepository.asRepository(),
      productRepository.asRepository(),
      orderItemRepository.asRepository(),
    );
  });

  it('ajoute le produit à la commande', async () => {
    orderRepository.feedOrder(makeOrder());
    productRepository.feedProduct(makeProduct());

    const updatedOrder = await service.execute(ORDER_ID, PRODUCT_ID);

    expect(orderItemRepository.savedItems).toHaveLength(1);
    expect(updatedOrder.items).toHaveLength(1);
    expect(updatedOrder.items[0].product.id).toBe(PRODUCT_ID);
  });

  it('signale une erreur quand la commande est introuvable', async () => {
    productRepository.feedProduct(makeProduct());

    await expect(service.execute(UNKNOWN_ID, PRODUCT_ID)).rejects.toThrow(
      new NotFoundException(`Order with ID ${UNKNOWN_ID} not found`),
    );
  });

  it('signale une erreur quand le produit est introuvable', async () => {
    orderRepository.feedOrder(makeOrder());

    await expect(service.execute(ORDER_ID, UNKNOWN_ID)).rejects.toThrow(
      new NotFoundException(`Product with ID ${UNKNOWN_ID} not found`),
    );
  });

  it('refuse un produit en rupture de stock', async () => {
    orderRepository.feedOrder(makeOrder());
    productRepository.feedProduct(makeProduct({ stock: 0 }));

    await expect(service.execute(ORDER_ID, PRODUCT_ID)).rejects.toThrow(
      new BadRequestException('Product "Table en chêne" is out of stock'),
    );
  });

  it('refuse une commande contenant déjà 5 produits', async () => {
    const items = Array.from({ length: 5 }, () => makeItemWithPrice(1));
    orderRepository.feedOrder(makeOrder(items));
    productRepository.feedProduct(makeProduct());

    await expect(service.execute(ORDER_ID, PRODUCT_ID)).rejects.toThrow(
      new BadRequestException('Order cannot contain more than 5 products'),
    );
  });

  it('refuse un ajout dépassant le total maximum de 200€', async () => {
    orderRepository.feedOrder(makeOrder([makeItemWithPrice(180)]));
    productRepository.feedProduct(makeProduct({ price: 50 }));

    await expect(service.execute(ORDER_ID, PRODUCT_ID)).rejects.toThrow(
      new BadRequestException('Order total cannot exceed 200€'),
    );
  });
});
