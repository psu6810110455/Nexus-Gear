import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity'; 

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;  
  
  @Column()
  name: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}