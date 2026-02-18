// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // กำหนดชื่อตารางในฐานข้อมูล
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // บังคับให้อีเมลไม่ซ้ำกัน
  email: string;

  @Column()
  password: string; // เก็บเป็นรหัสผ่านที่เข้ารหัสแล้วในอนาคต

  @Column({ nullable: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;
}