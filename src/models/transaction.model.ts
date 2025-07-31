import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import type { Optional } from 'sequelize';

interface TransactionAttributes {
  id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  transaction_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionCreationAttributes
  extends Optional<
    TransactionAttributes,
    'id' | 'transaction_date' | 'createdAt' | 'updatedAt'
  > {}

@Table({
  tableName: 'transactions',
  timestamps: true,
  underscored: true,
})
export class Transaction extends Model<
  TransactionAttributes,
  TransactionCreationAttributes
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'sender_id',
  })
  declare sender_id: string;

  @BelongsTo(() => User, 'sender_id')
  declare sender?: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'receiver_id',
  })
  declare receiver_id: string;

  @BelongsTo(() => User, 'receiver_id')
  declare receiver?: User;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare transaction_date: Date;

  declare createdAt: Date;
  declare updatedAt: Date;
}
