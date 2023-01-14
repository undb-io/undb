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

  @Enum({ type: 'string' })
  type: IFieldType
}

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

export type IField = StringField | NumberField | BoolField | DateField | DateRangeField | SelectField
