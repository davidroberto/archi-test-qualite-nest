import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column('decimal')
  public price: number;

  @Column({ default: 0 })
  public stock: number;

  @ManyToMany(() => Category, (category) => category.products)
  public categories: Category[];
}
