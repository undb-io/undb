import {
  ArrayType,
  Cascade,
  Collection,
  Embeddable,
  Embedded,
  Entity,
  Enum,
  JsonType,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  StringType,
  type Rel,
} from '@mikro-orm/core'
import {
  viewRowHeights,
  type Calendar as CoreCalendar,
  type Gallery as CoreGallery,
  type Gantt as CoreGantt,
  type Kanban as CoreKanban,
  type TreeView as CoreTreeView,
  type ViewVO as CoreView,
  type IRootFilter,
  type ISorts,
  type IViewDisplayType,
  type IViewFieldOption,
  type IViewPinnedFields,
  type IViewRowHeight,
} from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { Table } from './table.js'
import { VisualizationFactory } from './visualization.factory.js'
import { Widget } from './widget.js'

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
export class Gantt {
  @Property({
    nullable: true,
    serializer(value) {
      return value || undefined
    },
  })
  fieldId?: string

  constructor(gantt: CoreGantt) {
    this.fieldId = gantt.fieldId?.value
  }
}

@Embeddable()
export class Gallery {
  @Property({
    nullable: true,
    serializer(value) {
      return value || undefined
    },
  })
  fieldId?: string

  constructor(gallery: CoreGallery) {
    this.fieldId = gallery.fieldId?.value
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

  @Property({ type: StringType })
  displayType: IViewDisplayType

  @Property({ type: JsonType, nullable: true })
  sorts?: ISorts

  @Embedded({ nullable: true })
  kanban?: Kanban

  @Embedded({ nullable: true })
  gallery?: Gallery

  @Embedded({ nullable: true })
  gantt?: Gantt

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

  @Enum({ items: viewRowHeights, nullable: true })
  rowHeight?: IViewRowHeight

  @OneToMany(() => Widget, (widget) => widget.view)
  widgets = new Collection<Widget>(this)

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
    if (view.dashboard.isSome()) {
      const dashboard = view.dashboard.unwrap()
      for (const widget of dashboard.widgets) {
        const widgetEntity = new Widget(this, widget)

        widgetEntity.visualization = widget.visualization
          ? VisualizationFactory.create(table, widget.visualization)
          : undefined
        this.widgets.add(widgetEntity)
      }
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

export const viewEntities = [View, Kanban, Gallery, Calendar, Tree, Gantt]
