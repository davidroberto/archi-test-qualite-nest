import { NotFoundException } from '@nestjs/common';
import { GetProductService } from './getProduct.service';
import { InMemoryGetProductRepository } from './getProduct.inMemoryRepository';

const PRODUCT_ID = '11111111-1111-1111-1111-111111111111';
const UNKNOWN_ID = '99999999-9999-9999-9999-999999999999';

describe('Consulter un produit (use case)', () => {
  let repository: InMemoryGetProductRepository;
  let service: GetProductService;

  beforeEach(() => {
    repository = new InMemoryGetProductRepository();
    service = new GetProductService(repository);
  });

  it('retourne le produit demandé', async () => {
    repository.feedProductExists(PRODUCT_ID, {
      name: 'Table en chêne',
      description: 'Table massive 6 personnes',
    });

    const product = await service.execute(PRODUCT_ID);

    expect(product).toEqual({
      name: 'Table en chêne',
      description: 'Table massive 6 personnes',
    });
  });

  it('signale une erreur quand le produit est introuvable', async () => {
    await expect(service.execute(UNKNOWN_ID)).rejects.toThrow(
      new NotFoundException('Product not found'),
    );
  });
});
