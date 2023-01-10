import type {
  Calendar as CoreCalendar,
  IRootFilter,
  IViewDisplayType,
  IViewFieldOption,
  Kanban as CoreKanban,
  View as CoreView,
} from '@egodb/core'
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
  @Property({ nullable: true })
  fieldId?: string

  constructor(kanban: CoreKanban) {
    this.fieldId = kanban.fieldId?.value
  }
}

@Embeddable()
export class Calendar {
  @Property({ nullable: true })
  fieldId?: string

  constructor(calendar: CoreCalendar) {
    this.fieldId = calendar.fieldId?.value
  }
}

@Entity()
export class View extends BaseEntity {
  @PrimaryKey()
  id: string

  @ManyToOne(() => Table, { primary: true })
  table: Table

  @Property()
  name: string

  @Enum({ type: 'string' })
  displayType: IViewDisplayType

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

  constructor(table: Table, view: CoreView) {
    super()
    this.id = view.id.value
    this.name = view.name.value
    this.table = table
    this.displayType = view.displayType
    if (view.kanban.isSome()) {
      this.kanban = new Kanban(view.kanban.unwrap())
    }
    if (view.calendar.isSome()) {
      this.calendar = new Calendar(view.calendar.unwrap())
    }
    this.filter = view.filter?.value
    if (view.fieldOptions.value.size) {
      this.fieldOptions = Object.fromEntries(view.fieldOptions.value)
    }
    if (view.fieldsOrder) {
      this.fieldsOrder = view.fieldsOrder.order
    }
  }
}
