import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey : true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'user_name',
  })
  userName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
}