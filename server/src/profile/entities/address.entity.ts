import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// Import User Entity จากโฟลเดอร์ users ของคุณ
import { User } from '../../users/entities/user.entity'; 

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column('text')
  address: string;

  @Column({ default: false })
  isDefault: boolean;

  // เชื่อมความสัมพันธ์: หลายที่อยู่ (Many) เป็นของ 1 ผู้ใช้ (One)
  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number; //  หมายเหตุ: ถ้าในไฟล์ user.entity.ts ของคุณ ตัวแปร id เป็นประเภท string (เช่น UUID) ให้เปลี่ยนตรงนี้เป็น string ตามด้วยนะครับ
}