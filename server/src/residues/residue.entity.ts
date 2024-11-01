import { NumberTransformer } from 'src/common/transformers/number.transformer';
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
    width: 15,
    transformer: new NumberTransformer(),
  })
  article: number;

  @Column({
    type: 'varchar',
    length: 60,
  })
  product: string;

  @Column({
    type: 'bigint',
    width: 15,
    transformer: new NumberTransformer(),
  })
  residue: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: new NumberTransformer(),
  })
  unitPrice: number;

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
