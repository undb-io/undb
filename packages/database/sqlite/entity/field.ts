import type { Field as CoreField, IFieldType } from '@egodb/core'
import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import { Option } from './option'
import { Table } from './table'

@Entity({ abstract: true, discriminatorColumn: 'type' })
export abstract class Field extends BaseEntity {
  constructor(table: Table, field: CoreField) {
    super()
    this.id = field.id.value
    this.key = field.id.value
    this.table = table
    this.name = field.name.value
    this.type = field.type
  }

  @PrimaryKey()
  id: string

  @Property()
  key: string

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Table

  @Property()
  name: string

  @Property({ type: 'bool', default: false })
  system = false

  @Enum({ items: ['id', 'string', 'number', 'date', 'select', 'bool', 'date-range', 'reference', 'tree'] })
  type: IFieldType
}

@Entity({ discriminatorValue: 'id' })
export class IdField extends Field {}

@Entity({ discriminatorValue: 'string' })
export class StringField extends Field {}

@Entity({ discriminatorValue: 'number' })
export class NumberField extends Field {}

@Entity({ discriminatorValue: 'bool' })
export class BoolField extends Field {}

@Entity({ discriminatorValue: 'date' })
export class DateField extends Field {}

@Entity({ discriminatorValue: 'date-range' })
export class DateRangeField extends Field {}

@Entity({ discriminatorValue: 'select' })
export class SelectField extends Field {
  @OneToMany(() => Option, (option) => option.field, { orphanRemoval: true, cascade: [Cascade.ALL] })
  options = new Collection<Option>(this)
}

@Entity({ discriminatorValue: 'reference' })
export class ReferenceField extends Field {}

@Entity({ discriminatorValue: 'tree' })
export class TreeField extends Field {}

export type IField =
  | IdField
  | StringField
  | NumberField
  | BoolField
  | DateField
  | DateRangeField
  | SelectField
  | ReferenceField
  | TreeField

export const fieldEntities = [
  IdField,
  StringField,
  NumberField,
  BoolField,
  DateField,
  DateRangeField,
  SelectField,
  ReferenceField,
  TreeField,
]
