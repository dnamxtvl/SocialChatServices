import { Column } from 'typeorm';

export class BaseEntity {
  @Column()
  created_at: Date;

  @Column({ nullable: true })
  updated_at: Date;
}
