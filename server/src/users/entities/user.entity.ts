// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}