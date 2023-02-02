import type {
  Field as CoreField,
  IFieldType,
  ParentField as CoreParentField,
  TreeField as CoreTreeField,
} from '@egodb/core'
import {
  ArrayType,
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { BaseEntity } from './base'
import { Option } from './option'
import { Table } from './table'

@Entity({ abstract: true, discriminatorColumn: 'type' })
export abstract class Field extends BaseEntity {
  constructor(table: Table, field: CoreField) {
    super()
    this.id = field.id.value
    this.table = table
    this.name = field.name.value
    this.type = field.type
  }

  @PrimaryKey()
  id: string

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Table

  @Property()
  name: string

  @Property({ type: 'bool', default: false })
  system = false

  @Enum({
    items: [
      'id',
      'created-at',
      'updated-at',
      'auto-increment',
      'string',
      'email',
      'color',
      'number',
      'date',
      'select',
      'bool',
      'date-range',
      'reference',
      'tree',
      'parent',
    ],
  })
  type: IFieldType
}

@Entity({ discriminatorValue: 'id' })
export class IdField extends Field {}

@Entity({ discriminatorValue: 'created-at' })
export class CreatedAtField extends Field {}

@Entity({ discriminatorValue: 'updated-at' })
export class UpdatedAtField extends Field {}

@Entity({ discriminatorValue: 'auto-increment' })
export class AutoIncrementField extends Field {}

@Entity({ discriminatorValue: 'string' })
export class StringField extends Field {}

@Entity({ discriminatorValue: 'email' })
export class EmailField extends Field {}

@Entity({ discriminatorValue: 'color' })
export class ColorField extends Field {}

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
export class TreeField extends Field {
  constructor(table: Table, field: CoreTreeField) {
    super(table, field)
    this.parentFieldId = field.parentFieldId!.value
    this.displayFieldIds = field.displayFieldIds?.map((f) => f.value)
  }

  @Property()
  parentFieldId: string

  @Property({ type: ArrayType, nullable: true })
  displayFieldIds?: string[]
}

@Entity({ discriminatorValue: 'parent' })
export class ParentField extends Field {
  constructor(table: Table, field: CoreParentField) {
    super(table, field)
    this.treeFieldId = field.treeFieldId.value
    this.displayFieldIds = field.displayFieldIds?.map((f) => f.value)
  }

  @Property()
  treeFieldId!: string

  @Property({ type: ArrayType, nullable: true })
  displayFieldIds?: string[]
}

export type IField =
  | IdField
  | CreatedAtField
  | UpdatedAtField
  | AutoIncrementField
  | StringField
  | EmailField
  | ColorField
  | NumberField
  | BoolField
  | DateField
  | DateRangeField
  | SelectField
  | ReferenceField
  | TreeField
  | ParentField

export const fieldEntities = [
  IdField,
  CreatedAtField,
  UpdatedAtField,
  AutoIncrementField,
  StringField,
  EmailField,
  ColorField,
  NumberField,
  BoolField,
  DateField,
  DateRangeField,
  SelectField,
  ReferenceField,
  TreeField,
  ParentField,
]
