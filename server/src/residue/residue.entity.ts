import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('residue')
export class ResidueEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'bigint',
  })
  article: bigint;

  @Column({
    type: 'varchar',
    length: 30,
  })
  product: string;

  @Column({
    type: 'bigint',
  })
  residue: bigint;

  @Column({
    name: 'unit_price',
    type: 'bigint',
  })
  unitPrice: bigint;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
