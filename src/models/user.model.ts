// src/models/user.model.ts
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Transaction } from './transaction.model';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string; // <--- Añadido 'declare'

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string; // <--- Añadido 'declare'

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare email: string; // <--- Añadido 'declare'

  @Column({
    type: DataType.TEXT,
    // allowNull: false, // <-- Asegúrate de que esta línea esté comentada o eliminada
  })
  declare password: string; // <--- ¡Añadido 'declare' AQUÍ!

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
    field: 'account_number',
  })
  declare account_number: string; // <--- Añadido 'declare'

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  declare balance: number; // <--- Añadido 'declare'

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  @HasMany(() => Transaction, 'sender_id')
  declare sentTransactions: Transaction[]; // <--- Añadido 'declare'

  @HasMany(() => Transaction, 'receiver_id')
  declare receivedTransactions: Transaction[]; // <--- Añadido 'declare'
}
