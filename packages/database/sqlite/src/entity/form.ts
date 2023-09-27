import { ArrayType, Cascade, Entity, JsonType, ManyToOne, PrimaryKey, Property, type Rel } from '@mikro-orm/core'
import { type Form as CoreForm, type IFormFields } from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { Table } from './table.js'

@Entity({ tableName: 'undb_form' })
export class Form extends BaseEntity {
  constructor(table: Rel<Table>, form: CoreForm) {
    super()
    this.table = table

    this.id = form.id.value
    this.name = form.name.value
    this.fields = form.fields.toJSON()
    this.fieldsOrder = form.fieldsOrder?.toJSON()
  }

  @PrimaryKey()
  id: string

  @Property()
  name: string

  @Property({ type: JsonType })
  fields: IFormFields

  @Property({ type: ArrayType, nullable: true })
  fieldsOrder?: string[]

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>
}
