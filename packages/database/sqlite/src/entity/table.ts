import {
  ArrayType,
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  type Rel,
} from '@mikro-orm/core'
import { type Table as CoreTable } from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { Base } from './base.js'
import type { IField } from './field.js'
import { Field, ReferenceField } from './field.js'
import { Form } from './form.js'
import { View } from './view.js'

@Entity({ tableName: 'undb_table' })
export class Table extends BaseEntity {
  constructor(table: CoreTable, base?: Rel<Base>) {
    super()
    this.id = table.id.value
    this.name = table.name.value
    this.emoji = table.emoji.unpack() ?? ''
    this.viewsOrder = table.viewsOrder.toJSON()
    this.base = base
  }

  @PrimaryKey()
  id!: string

  @Property()
  name!: string

  @Property()
  emoji!: string

  @OneToMany(() => Field, (field) => field.table, { orphanRemoval: true, cascade: [Cascade.ALL] })
  fields = new Collection<IField>(this)

  @OneToMany(() => View, (view) => view.table, { orphanRemoval: true, cascade: [Cascade.ALL] })
  views = new Collection<View>(this)

  @OneToMany(() => Form, (form) => form.table, { orphanRemoval: true, cascade: [Cascade.ALL] })
  forms = new Collection<Form>(this)

  @ManyToOne(() => Base, { nullable: true })
  base?: Rel<Base>

  @OneToMany(() => ReferenceField, (field) => field.foreignTable)
  referencedBy = new Collection<ReferenceField>(this)

  @Property({ type: ArrayType, nullable: true })
  viewsOrder: string[]
}
