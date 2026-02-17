import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({default: 0})
    stock: number;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @Column('decimal', {name: 'rating_average', precision: 3, scale: 2, default: 0 })
    ratingAverage: number;

    @Column({name: 'category_id', nullable: true })
    categoryId: number;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category: Category;
}

