import type { Rel } from '@mikro-orm/core'
import { Cascade, Entity, JsonType, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { type Form as CoreForm, type IFormFields } from '@undb/core'
import { BaseEntity } from './base.js'
import { Table } from './table.js'

@Entity({ tableName: 'undb_form' })
export class Form extends BaseEntity {
  constructor(table: Rel<Table>, form: CoreForm) {
    super()
    this.id = form.id.value
    this.name = form.name.value
    this.fields = form.fields.toJSON()
    this.table = table
  }

  @PrimaryKey()
  id: string

  @Property()
  name: string

  @Property({ type: JsonType })
  fields: IFormFields

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>
}
