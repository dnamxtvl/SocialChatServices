import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, Length, IsEmail, IsUUID, IsInt, MaxLength, IsIP } from 'class-validator';
import { VALIDATION } from 'src/const/validation';
import { GenderEnum } from 'src/const/enums/user/gender';
import { RelationshipStatusEnum } from 'src/const/enums/user/relationship-status';
import { UserStatusEnum } from 'src/const/enums/user/status';
import { BaseEntity } from './base';
import { UserStatusActiveEnum } from 'src/const/enums/user/status-active';
import { TypeAccountEnum } from 'src/const/enums/user/type-account';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsUUID()
  id: string;

  @Column()
  @IsNotEmpty()
  @Length(VALIDATION.FIRST_NAME.MIN_LENGTH, VALIDATION.FIRST_NAME.MAX_LENGTH)
  first_name: string;

  @Column()
  @IsNotEmpty()
  @Length(VALIDATION.LAST_NAME.MIN_LENGTH, VALIDATION.LAST_NAME.MAX_LENGTH)
  last_name: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Column({ nullable: true })
  email_verified_at: Date;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true })
  background_profile: string

  @Column({ nullable: true })
  from_city_id: number

  @Column({ nullable: true })
  current_city_id: number

  @Column({ nullable: true })
  relationship_status: RelationshipStatusEnum

  @Column()
  gender: GenderEnum

  @Column()
  organization_id: number

  @Column({ nullable: true })
  unit_room_id: number

  @Column()
  @IsInt()
  @Length(VALIDATION.DAY_OF_BIRTH.MIN, VALIDATION.DAY_OF_BIRTH.MAX)
  day_of_birth: number

  @Column()
  @IsInt()
  @Length(VALIDATION.MONTH_OF_BIRTH.MIN, VALIDATION.MONTH_OF_BIRTH.MAX)
  month_of_birth: number

  @Column()
  @IsInt()
  @Length(VALIDATION.YEAR_OF_BIRTH.MIN, VALIDATION.YEAR_OF_BIRTH.MAX)
  year_of_birth: number

  @Column({ nullable: true })
  @MaxLength(VALIDATION.ABOUNT_ME.MAX_LENGTH)
  about_me: string

  @Column({ nullable: true })
  latest_login: Date;

  @Column({ nullable: true })
  @IsIP()
  latest_ip_login: string;

  @Column({ nullable: true })
  last_activity_at: Date;

  @Column()
  @IsInt()
  type_account: TypeAccountEnum

  @Column()
  @IsInt()
  status: UserStatusEnum

  @Column()
  @IsInt()
  status_active: UserStatusActiveEnum

  @Column({ nullable: true })
  remember_token: string

  @Column({ nullable: true })
  deleted_at: Date;
}