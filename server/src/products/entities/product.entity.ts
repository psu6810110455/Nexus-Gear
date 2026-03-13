import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ default: false })
  isHidden: boolean;

  // เชื่อมกับ Category (หลาย Product อยู่ใน 1 Category)
  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ name: 'rating_average', type: 'float', default: 0, nullable: true })
  rating_average: number;

  // รูปภาพหลายรูปของสินค้า
  @OneToMany(() => ProductImage, (image) => image.product, { eager: true, cascade: true })
  images: ProductImage[];
}