import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // แก้เป็นแบบ Object: { type: 'text' }
  @Column({ type: 'text' }) 
  description!: string;

  // แก้เป็นแบบ Object: { type: 'decimal', ... }
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ default: 0 })
  stock!: number;

  // แก้คำผิด Columin -> Column และใช้ name: 'image_url'
  @Column({ name: 'image_url', nullable: true })
  imageUrl!: string;

  // รวม type และ options ไว้ในปีกกาเดียว
  @Column({ type: 'decimal', name: 'rating_average', precision: 3, scale: 2, default: 0 })
  ratingAverage!: number;

  // Foreign Key Column
  @Column({ name: 'category_id', nullable: true })
  categoryId!: number;

  // Relation
  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;
}