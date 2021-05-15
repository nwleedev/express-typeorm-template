import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class UserVerify extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 64,
    unique: true,
  })
  email: string;

  @Column()
  token: string;

  @Column({
    name: 'verified_at',
    nullable: true,
  })
  verifiedAt: Date;

  @Column({
    name: 'expired_at',
  })
  expiredAt: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;
}
