import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeStripeService {
  async charge(amount: number): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: `fake_txn_${Date.now()}`,
    };
  }
}
