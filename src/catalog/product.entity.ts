import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  public category: Category;
}
