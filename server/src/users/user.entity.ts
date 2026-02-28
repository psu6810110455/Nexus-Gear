import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;
}