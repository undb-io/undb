import type { Rel } from '@mikro-orm/core'
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
import type {
  Calendar as CoreCalendar,
  Kanban as CoreKanban,
  TreeView as CoreTreeView,
  View as CoreView,
  IRootFilter,
  ISorts,
  IViewDisplayType,
  IViewFieldOption,
  IViewPinnedFields,
} from '@undb/core'
import { BaseEntity } from './base.js'
import { Table } from './table.js'

@Embeddable()
export class Kanban {
  @Property({
    nullable: true,
    serializer(value) {
      return value || undefined
    },
  })
  fieldId?: string

  constructor(kanban: CoreKanban) {
    this.fieldId = kanban.fieldId?.value
  }
}

@Embeddable()
export class Calendar {
  @Property({
    nullable: true,
    serializer(value) {
      return value || undefined
    },
  })
  fieldId?: string

  constructor(calendar: CoreCalendar) {
    this.fieldId = calendar.fieldId?.value
  }
}

@Embeddable()
export class Tree {
  @Property({
    nullable: true,
    serializer(value) {
      return value || undefined
    },
  })
  fieldId?: string

  constructor(tree: CoreTreeView) {
    this.fieldId = tree.fieldId?.value
  }
}

@Entity({ tableName: 'undb_view' })
export class View extends BaseEntity {
  @PrimaryKey()
  id: string

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>

  @Property()
  name: string

  @Property({ type: 'boolean', default: false, nullable: false })
  showSystemFields = false

  @Enum({ items: ['kanban', 'calendar', 'grid', 'tree'] })
  displayType: IViewDisplayType

  @Property({ type: JsonType, nullable: true })
  sorts?: ISorts

  @Embedded({ nullable: true })
  kanban?: Kanban

  @Embedded({ nullable: true })
  calendar?: Calendar

  @Embedded({ nullable: true })
  tree?: Tree

  @Property({ type: JsonType, nullable: true })
  filter?: IRootFilter

  @Property({ type: JsonType, nullable: true })
  fieldOptions?: Record<string, IViewFieldOption>

  @Property({ type: ArrayType, nullable: true })
  fieldsOrder?: string[]

  @Property({ type: JsonType, nullable: true })
  pinnedFields?: IViewPinnedFields

  constructor(table: Rel<Table>, view: CoreView) {
    super()
    this.id = view.id.value
    this.name = view.name.value
    this.table = table
    this.displayType = view.displayType
    this.showSystemFields = view.showSystemFields
    if (view.kanban.isSome()) {
      this.kanban = new Kanban(view.kanban.unwrap())
    }
    if (view.treeView.isSome()) {
      this.tree = new Kanban(view.treeView.unwrap())
    }
    if (view.calendar.isSome()) {
      this.calendar = new Calendar(view.calendar.unwrap())
    }
    this.filter = view.filter?.value
    this.fieldOptions = view.fieldOptions.toObject().into()
    if (view.fieldsOrder) {
      this.fieldsOrder = view.fieldsOrder.order
    }
    if (view.sorts) {
      this.sorts = view.sorts.unpack()
    }
    this.pinnedFields = view.pinnedFields?.toJSON()
  }
}

export const viewEntities = [View, Kanban, Calendar, Tree]
