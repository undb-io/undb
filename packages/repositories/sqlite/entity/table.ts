import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ tableName: 'tables' })
export class Table {
  @PrimaryKey({ autoincrement: false })
  id!: string
  @Property()
  name!: string
}
