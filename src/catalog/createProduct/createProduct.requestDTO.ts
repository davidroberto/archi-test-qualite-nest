import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductRequestDTO {
  @IsString('Le nom du produit doit être une chaîne de caractères.')
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
