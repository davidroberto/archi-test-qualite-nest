import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddProductToOrderRequestDTO {
  @IsUUID('4')
  @IsNotEmpty()
  productId: string;
}
