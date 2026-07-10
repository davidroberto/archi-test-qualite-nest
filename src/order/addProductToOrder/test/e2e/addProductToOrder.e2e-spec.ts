import * as request from 'supertest';
import { TestApp } from '../../../../shared/test/testApp';
import { Order, OrderStatus } from '../../../order.entity';
import { OrderItem } from '../../../orderItem.entity';
import { Product } from '../../../../catalog/product.entity';

const fakeOrder: Partial<Order> = {
  id: '11111111-1111-4111-8111-111111111111',
  status: OrderStatus.PENDING,
  items: [],
};

const fakeProduct: Partial<Product> = {
  id: '22222222-2222-4222-8222-222222222222',
  name: 'Table en chêne',
  description: 'Table massive 6 personnes',
  price: 50,
  stock: 10,
};

describe('Add Product To Order (e2e)', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await TestApp.start();
  }, 90_000);

  afterEach(async () => {
    await testApp.resetDatabase();
  });

  afterAll(async () => {
    await testApp.stop();
  });

  async function insertOrder(): Promise<void> {
    const repository = testApp.dataSource.getRepository(Order);
    await repository.save(repository.create(fakeOrder));
  }

  async function insertProduct(overrides: Partial<Product> = {}): Promise<void> {
    const repository = testApp.dataSource.getRepository(Product);
    await repository.save(repository.create({ ...fakeProduct, ...overrides }));
  }

  it('ajoute le produit à la commande', async () => {
    // avant que le test soit exécuté, une BDD est démarrée
    // grâce à Docker et test container
    // et elle est reliée à l'application

    // on insère dans cette BDD une commande et un produit
    await insertOrder();
    await insertProduct();

    // je fais une requête vers l'api d'ajout de produit au panier
    // en lui envoyant l'id de la commande (parametre d'url)
    // et l'id du produit à ajouter dans la commande
    const response = await request(testApp.app.getHttpServer())
      .post(`/api/order/${fakeOrder.id}/add-product`)
      .send({ productId: fakeProduct.id });

    // je vérifie que l'api me retourne bien une 201
    expect(response.status).toBe(201);
    // je viens vérifier que l'api me renvoie la commande avec le produit
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].product.id).toBe(fakeProduct.id);

    // je viens vérifier que le produit est enregistré dans la commande
    // dans la BDD
    const items = await testApp.dataSource.getRepository(OrderItem).find();
    expect(items).toHaveLength(1);

    // quand le test est terminé : La bdd docker est supprimée
  });

  it('renvoie 404 quand la commande est introuvable', async () => {
    await insertProduct();

    const response = await request(testApp.app.getHttpServer())
      .post('/api/order/99999999-9999-4999-8999-999999999999/add-product')
      .send({ productId: fakeProduct.id });

    expect(response.status).toBe(404);
  });

  it('renvoie 400 quand le produit est en rupture de stock', async () => {
    await insertOrder();
    await insertProduct({ stock: 0 });

    const response = await request(testApp.app.getHttpServer())
      .post(`/api/order/${fakeOrder.id}/add-product`)
      .send({ productId: fakeProduct.id });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('out of stock');
  });

  it('renvoie 400 quand productId n’est pas un UUID', async () => {
    await insertOrder();

    const response = await request(testApp.app.getHttpServer())
      .post(`/api/order/${fakeOrder.id}/add-product`)
      .send({ productId: 'not-a-uuid' });

    expect(response.status).toBe(400);
  });
});
