import { Product } from '../product';
@Injectable()
export class CreateProductService {

  execute(): Product {
    const product = new Product();
    product.id = '123';
    product.name = 'Sample Product';
    product.description = 'This is a sample product.';
    product.price = 19.99;

    // save product avec le repository
    return product;
  }
}