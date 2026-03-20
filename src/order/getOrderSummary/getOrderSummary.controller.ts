import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { GetOrderSummaryService } from './getOrderSummary.service';

@Controller('order')
export class GetOrderSummaryController {
  constructor(
    @Inject(GetOrderSummaryService)
    private readonly getOrderSummaryService: GetOrderSummaryService,
  ) {}

  @Get(':orderId/summary')
  async getOrderSummary(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.getOrderSummaryService.execute(orderId);
  }
}
