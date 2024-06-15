import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsUUID, IsInt } from 'class-validator';
import { BaseEntity } from './base';

@Entity({ name: 'user_blocks'})
export class UserBlock extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @IsUUID()
  @Column()
  user_id: string;

  @IsUUID()
  @Column()
  blocked_user_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}