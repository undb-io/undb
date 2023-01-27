import type {
  ITableSpecVisitor,
  WithCalendarField,
  WithDisplayType,
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
  WithFilter,
  WithKanbanField,
  WithNewField,
  WithNewOption,
  WithOptions,
  WithoutField,
  WithoutOption,
  WithSorts,
  WithTableName,
  WithTableSchema,
  WithTableView,
  WithTableViews,
  WithViewFieldsOrder,
} from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import { Field, Option, SelectField, Table } from '../../entity'
import { View } from '../../entity/view'
import { BaseEntityManager } from '../base-entity-manager'
import { TableSqliteFieldVisitor } from './table-sqlite-field.visitor'

export class TableSqliteMutationVisitor extends BaseEntityManager implements ITableSpecVisitor {
  constructor(private readonly tableId: string, em: EntityManager) {
    super(em)
  }

  private get table(): Table {
    return this.em.getReference(Table, this.tableId)
  }

  private getView(id: string): View {
    return this.em.getReference(View, id)
  }

  private getField(id: string): Field {
    return this.em.getReference(Field, id)
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
    for (const field of s.schema.fields) {
      const visitor = new TableSqliteFieldVisitor(table, this.em)
      field.accept(visitor)

      this.addJobs(async () => visitor.commit())
    }
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
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ filter: s.filter })
    this.em.persist(view)
  }
  sortsEqual(s: WithSorts): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ sorts: s.sorts?.sorts ?? [] })
    this.em.persist(view)
  }
  newField(s: WithNewField): void {
    const table = this.table
    const f = s.field

    const visitor = new TableSqliteFieldVisitor(table, this.em)

    f.accept(visitor)

    this.addJobs(async () => {
      await visitor.commit()
    })
  }
  fieldsOrder(s: WithViewFieldsOrder): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ fieldsOrder: s.viewFieldsOrder.order })
    this.em.persist(view)
  }
  fieldWidthEqual(s: WithFieldWidth): void {
    this.addJobs(async () => {
      const view = this.getView(s.view.id.value)
      await wrap(view).init()
      wrap(view).assign({ fieldOptions: { [s.fieldId]: { width: s.width } } }, { mergeObjects: true })
      this.em.persist(view)
    })
  }
  fieldVisibility(s: WithFieldVisibility): void {
    this.addJobs(async () => {
      const view = this.getView(s.view.id.value)
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
    wrap(view).assign({ kanban: { fieldId: s.fieldId?.value ?? '' } })
    this.em.persist(view)
  }
  calendarFieldEqual(s: WithCalendarField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ calendar: { fieldId: s.fieldId?.value ?? '' } })
    this.em.persist(view)
  }
  optionsEqual(s: WithOptions): void {
    this.addJobs(async () => {
      const field = await this.em.findOne(SelectField, s.field.id.value, { populate: ['options'] })
      if (field) {
        wrap(field).assign({ options: s.options.options.map((option) => new Option(field, option)) })
        this.em.persist(field)
      }
    })
  }
  optionEqual(s: WithNewOption): void {
    const option = this.em.getReference(Option, s.option.key.value as never)
    wrap(option).assign({
      name: s.option.name.value,
      color: { name: s.option.color.name, shade: s.option.color.shade },
    })
    this.em.persist(option)
  }
  newOption(s: WithNewOption): void {
    const field = this.getField(s.field.id.value) as SelectField
    const option = new Option(field, s.option)
    this.em.persist(option)
  }
  witoutOption(s: WithoutOption): void {
    const option = this.em.getReference(Option, s.optionKey.value as never)
    this.em.remove(option)
  }
  withoutField(s: WithoutField): void {
    const field = this.getField(s.field.id.value)
    wrap(field).assign({ deletedAt: new Date() })
    this.em.persist(field)
  }
  fieldOptionsEqual(s: WithFieldOption): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign(s.options.toObject().unwrapOr({}), { mergeObjects: true })
    this.em.persist(view)
  }
  not(): this {
    return this
  }
}
