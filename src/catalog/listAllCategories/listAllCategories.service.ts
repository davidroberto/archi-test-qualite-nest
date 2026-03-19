import { Inject, Injectable } from '@nestjs/common';
import { ListAllCategoriesRepository } from './listAllCategories.repository';

@Injectable()
export class ListAllCategoriesService {
  constructor(
    @Inject(ListAllCategoriesRepository)
    private readonly listAllCategoriesRepository: ListAllCategoriesRepository,
  ) {}

  async execute() {
    return this.listAllCategoriesRepository.findAll();
  }
}
