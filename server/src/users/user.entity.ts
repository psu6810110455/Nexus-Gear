import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Address } from '../profile/entities/address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string; // เก็บเป็น bcrypt hash

  @Column({ default: 'customer' })
  role: string; // 'customer' | 'admin'

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  bank_account: string;

  @CreateDateColumn()
  createdAt: Date;

  // 👇 เหลือแค่ชุดนี้ชุดเดียวเท่านั้นครับ (แก้ปัญหา Duplicate และ Object Error)
  @Column({ type: 'varchar', nullable: true }) 
  resetPasswordToken: string | null; // เก็บ Token ลับ

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null; // เก็บเวลาหมดอายุ

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}