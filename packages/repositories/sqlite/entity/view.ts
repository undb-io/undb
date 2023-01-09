import type { IRootFilter, IViewDisplayType, IViewFieldOption } from '@egodb/core'
import {
  ArrayType,
  Embeddable,
  Embedded,
  Entity,
  Enum,
  JsonType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { BaseEntity } from './base'
import { Table } from './table'

@Embeddable()
export class Kanban {
  @Property()
  fieldId!: string
}

@Embeddable()
export class Calendar {
  @Property()
  fieldId!: string
}

@Entity()
export class View extends BaseEntity {
  @PrimaryKey()
  id!: string

  @ManyToOne(() => Table, { primary: true })
  table!: Table

  @Property()
  name!: string

  @Enum({ type: 'string' })
  displayType!: IViewDisplayType

  @Embedded({ nullable: true })
  kanban?: Kanban

  @Embedded({ nullable: true })
  calendar?: Calendar

  @Property({ type: JsonType, nullable: true })
  filter?: IRootFilter

  @Property({ type: JsonType, nullable: true })
  fieldOptions?: Record<string, IViewFieldOption>

  @Property({ type: ArrayType, nullable: true })
  fieldsOrder?: string[]
}
