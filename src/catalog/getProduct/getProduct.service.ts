import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetProductRepository } from './getProduct.repository';

@Injectable()
export class GetProductService {
  constructor(
    @Inject(GetProductRepository)
    private readonly getProductRepository: GetProductRepository,
  ) {}

  async execute(id: string) {
    const product = await this.getProductRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
