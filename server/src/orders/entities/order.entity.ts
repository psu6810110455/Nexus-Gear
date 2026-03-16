import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING   = 'pending',
  PAID      = 'paid',
  TO_SHIP   = 'to_ship',
  SHIPPED   = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, nullable: true })
  order_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'text' })
  shipping_address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slip_image: string | null;

  // ✨ เพิ่ม: เก็บ Stripe PaymentIntent ID สำหรับ QR PromptPay
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripe_payment_intent_id: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_method: string | null;

  @Column({ default: false })
  is_rated: boolean;

  @Column({ type: 'text', nullable: true })
  cancel_reason: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refund_amount: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  refund_channel: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refund_slip: string | null;

  @Column({ type: 'varchar', length: 20, default: 'none' })
  refund_status: string;  // none | pending | refunded | rejected

  @Column({ type: 'varchar', length: 100, nullable: true })
  refund_bank_name: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  refund_bank_account: string | null;

  @Column({ type: 'timestamp', nullable: true })
  refunded_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}