import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Table } from './table'

@Entity({ tableName: 'fields' })
export class Field {
  @PrimaryKey()
  id!: string

  @PrimaryKey()
  tableId!: string

  @ManyToOne(() => Table)
  table!: Table

  @Property()
  name!: string
}
