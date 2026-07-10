import { GetProductRepository } from './getProduct.repository';

type StoredProduct = { name: string; description: string };

export class InMemoryGetProductRepository extends GetProductRepository {
  private readonly products = new Map<string, StoredProduct>();

  constructor() {
    super(null as never);
  }

  feedProductExists(id: string, product: StoredProduct): void {
    this.products.set(id, product);
  }

  async findById(id: string) {
    return this.products.get(id) ?? null;
  }
}
