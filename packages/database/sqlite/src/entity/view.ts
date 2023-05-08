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
import type { IViewRowHeight } from '@undb/core'
import {
  viewRowHeights,
  type Calendar as CoreCalendar,
  type Kanban as CoreKanban,
  type TreeView as CoreTreeView,
  type ViewVO as CoreView,
  type IRootFilter,
  type ISorts,
  type IViewDisplayType,
  type IViewFieldOption,
  type IViewPinnedFields,
} from '@undb/core'
import { BaseEntity } from './base.js'
import { Table } from './table.js'

@Embeddable()
export class Layout {
  @Property()
  x!: number
  @Property()
  y!: number
  @Property()
  h!: number
  @Property()
  w!: number
}

@Embeddable()
export class Widge {
  @Embedded({ object: true })
  layout!: Layout
}

@Embeddable()
export class Dashboard {
  @Embedded(() => Widge, { array: true })
  widges: Widge[] = []
}

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

  @Enum({ items: ['kanban', 'calendar', 'grid', 'tree', 'dashboard'] })
  displayType: IViewDisplayType

  @Property({ type: JsonType, nullable: true })
  sorts?: ISorts

  @Embedded({ nullable: true })
  kanban?: Kanban

  @Embedded({ nullable: true })
  calendar?: Calendar

  @Embedded({ nullable: true })
  dashboard?: Dashboard

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

  @Enum({ items: viewRowHeights, nullable: true })
  rowHeight?: IViewRowHeight

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
    this.rowHeight = view.rowHeight?.unpack()
  }
}

export const viewEntities = [View, Kanban, Calendar, Tree, Dashboard, Widge, Layout]
