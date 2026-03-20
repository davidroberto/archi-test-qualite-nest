import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './orderItem.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ default: OrderStatus.PENDING })
  public status: OrderStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  public items: OrderItem[];
}
