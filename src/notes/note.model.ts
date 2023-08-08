import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class Note extends Model {
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  createdAt: string;

  @Column(DataType.TEXT)
  content: string;

  @Column(DataType.STRING)
  category: string;

  @Column(DataType.ARRAY(DataType.STRING))
  dates: string[];

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  archived: boolean;
}
