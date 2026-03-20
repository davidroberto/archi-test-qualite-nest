import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../catalog/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Order, (order) => order.items)
  public order: Order;

  @ManyToOne(() => Product, { eager: true })
  public product: Product;
}
