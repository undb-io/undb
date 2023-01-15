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
  Cascade,
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
  fieldKey?: string

  constructor(kanban: CoreKanban) {
    this.fieldKey = kanban.fieldKey?.value
  }
}

@Embeddable()
export class Calendar {
  @Property({ nullable: true })
  fieldKey?: string

  constructor(calendar: CoreCalendar) {
    this.fieldKey = calendar.fieldKey?.value
  }
}

@Entity()
export class View extends BaseEntity {
  @PrimaryKey()
  id: string

  @Property()
  key: string

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Table

  @Property()
  name: string

  @Enum({ items: ['kanban', 'calendar', 'grid'] })
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
    this.key = view.key.value
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
    this.fieldOptions = view.fieldOptions.toObject().into()
    if (view.fieldsOrder) {
      this.fieldsOrder = view.fieldsOrder.order
    }
  }
}
