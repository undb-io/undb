import type { IFieldType } from '@egodb/core'
import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { BaseEntity } from './base'
import { Option } from './option'
import { Table } from './table'

export enum FieldType {
  STRING,
  NUMBER,
  DATE,
  DATE_RANGE,
  SELECT,
  BOOL,
}

export const fieldTypeMap: Record<IFieldType, FieldType> = {
  string: FieldType.STRING,
  number: FieldType.NUMBER,
  date: FieldType.DATE,
  select: FieldType.SELECT,
  bool: FieldType.BOOL,
  'date-range': FieldType.DATE_RANGE,
}

export const fieldEnumMap: Record<FieldType, IFieldType> = {
  [FieldType.STRING]: 'string',
  [FieldType.NUMBER]: 'number',
  [FieldType.DATE]: 'date',
  [FieldType.SELECT]: 'select',
  [FieldType.BOOL]: 'bool',
  [FieldType.DATE_RANGE]: 'date-range',
}

@Entity({ tableName: 'fields' })
export class Field extends BaseEntity {
  @PrimaryKey()
  id!: string

  @ManyToOne(() => Table, { primary: true })
  table!: Table;

  [PrimaryKeyType]?: [string, string]

  @Property()
  name!: string

  @Enum(() => FieldType)
  type!: FieldType

  @OneToMany(() => Option, (option) => option.field)
  options = new Collection<Option>(this)
}
