import type {
  ITableSpecVisitor,
  WithCalendarField,
  WithDisplayType,
  WithFieldVisibility,
  WithFieldWidth,
  WithFilter,
  WithKanbanField,
  WithNewField,
  WithNewOption,
  WithOptions,
  WithoutOption,
  WithTableName,
  WithTableSchema,
  WithTableView,
  WithTableViews,
  WithViewFieldsOrder,
} from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import { Field, Option, SelectField, Table } from '../../entity'
import { FieldFactory } from '../../entity/field.factory'
import { View } from '../../entity/view'

export class TableSqliteMutationVisitor implements ITableSpecVisitor {
  private jobs: (() => Promise<void>)[] = []
  constructor(private readonly tableId: string, private readonly em: EntityManager) {}
  public async commit() {
    await Promise.all(this.jobs.map((job) => job()))
    await this.em.flush()
  }

  private get table(): Table {
    return this.em.getReference(Table, this.tableId)
  }

  private getView(id: string): View {
    return this.em.getReference(View, [id, this.tableId])
  }

  private getField(id: string): Field {
    return this.em.getReference(Field, [id, this.tableId])
  }

  idEqual(): void {
    throw new Error('[TableSqliteMutationVisitor.idEqual] Method not implemented.')
  }
  nameEqual(s: WithTableName): void {
    const table = this.table
    wrap(table).assign({ name: s.name.value })
    this.em.persist(table)
  }
  schemaEqual(s: WithTableSchema): void {
    const table = this.table
    wrap(table).assign({ fields: s.schema.fields.map((field) => FieldFactory.create(table, field)) })
    this.em.persist(table)
  }
  viewsEqual(s: WithTableViews): void {
    const table = this.table
    wrap(table).assign({ views: s.views.views.map((view) => new View(table, view)) })
    this.em.persist(table)
  }
  viewEqual(s: WithTableView): void {
    const table = this.table
    const view = this.getView(s.view.id.value)
    wrap(view).assign(new View(table, s.view))
    this.em.persist(view)
  }
  filterEqual(s: WithFilter): void {
    const view = this.getView(s.viewId)
    wrap(view).assign({ filter: s.filter })
    this.em.persist(view)
  }
  newField(s: WithNewField): void {
    const table = this.table
    const f = s.field
    const field = FieldFactory.create(table, f)
    this.em.persist(field)
    if (field instanceof SelectField && f.type === 'select') {
      wrap(field).assign({ options: f.options.options.map((option) => new Option(field, option)) })
      this.em.persist(field)
    }
  }
  fieldsOrder(s: WithViewFieldsOrder): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ fieldsOrder: s.viewFieldsOrder.order })
    this.em.persist(view)
  }
  fieldWidthEqual(s: WithFieldWidth): void {
    this.jobs.push(async () => {
      const view = this.getView(s.viewId)
      await wrap(view).init()
      wrap(view).assign({ fieldOptions: { [s.fieldId]: { width: s.width } } }, { mergeObjects: true })
      this.em.persist(view)
    })
  }
  fieldVisibility(s: WithFieldVisibility): void {
    this.jobs.push(async () => {
      const view = this.getView(s.viewId)
      await wrap(view).init()
      wrap(view).assign({ fieldOptions: { [s.fieldId]: { hidden: s.hidden } } }, { mergeObjects: true })
      this.em.persist(view)
    })
  }
  displayTypeEqual(s: WithDisplayType): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ displayType: s.displayType })
    this.em.persist(view)
  }
  kanbanFieldEqual(s: WithKanbanField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ kanban: { fieldId: s.fieldId.value } })
    this.em.persist(view)
  }
  calendarFieldEqual(s: WithCalendarField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ calendar: { fieldId: s.fieldId.value } })
    this.em.persist(view)
  }
  optionsEqual(s: WithOptions): void {
    this.jobs.push(async () => {
      const field = this.getField(s.field.id.value) as SelectField
      await field.options.init()
      wrap(field).assign({ options: s.options.options.map((option) => new Option(field, option)) })
      this.em.persist(field)
    })
  }
  newOption(s: WithNewOption): void {
    const field = this.getField(s.field.id.value) as SelectField
    const option = new Option(field, s.option)
    this.em.persist(option)
  }
  witoutOption(s: WithoutOption): void {
    this.jobs.push(async () => {
      await this.em
        .qb(Option)
        .delete()
        .where({ id: s.optionId.value, field: [s.field.id.value, this.tableId] })
    })
  }
  not(): this {
    return this
  }
}
