import { Inject, Injectable } from '@nestjs/common';
import { ListAllProductsRepository } from './listAllProducts.repository';

@Injectable()
export class ListAllProductsService {
  constructor(
    @Inject(ListAllProductsRepository)
    private readonly listAllProductsRepository: ListAllProductsRepository,
  ) {}

  async execute() {
    return this.listAllProductsRepository.findAll();
  }
}
