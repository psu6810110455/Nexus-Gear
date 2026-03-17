// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Address } from '../../profile/entities/address.entity';

@Entity('users') // กำหนดชื่อตารางในฐานข้อมูล
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // บังคับให้อีเมลไม่ซ้ำกัน
  email: string;

  @Column()
  password: string; // เก็บเป็นรหัสผ่านที่เข้ารหัสแล้วในอนาคต

  // 🎯 แก้จาก username เป็น name ให้ตรงกับ Database
  @Column()
  name: string;

  // 🎯 เพิ่มคอลัมน์ให้ตรงกับที่ออกแบบไว้ใน SQL (เผื่ออนาคตใช้งาน)
  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'customer' })
  role: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  bank_account: string;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}