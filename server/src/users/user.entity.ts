import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Address } from '../profile/entities/address.entity';
import { OneToMany } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  resetPasswordToken: string | null; // เก็บ Token ลับ

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null; // เก็บเวลาหมดอายุ
  

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}