import type {
  ITableSpecVisitor,
  ReferenceField,
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

  private handlerNewReferenceField(field: ReferenceField) {
    this.jobs.push(async () => {
      const refenrenceTableName = `${field.id.value}_${this.tableId}`
      this.em.getKnex().schema.createTable(refenrenceTableName, (tb) => {
        tb.string('id').notNullable()
        tb.string('ref_id').notNullable()
        tb.primary(['id', 'ref_id'], { constraintName: `pk_${refenrenceTableName}` })
      })
    })
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
    wrap(table).assign({ fields: FieldFactory.createMany(table, s.schema.fields) })
    this.em.persist(table)

    for (const referenceField of s.schema.referenceFields) {
      this.handlerNewReferenceField(referenceField)
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
  newField(s: WithNewField): void {
    const table = this.table
    const f = s.field

    if (f.type === 'reference') {
      this.handlerNewReferenceField(f)
    }

    const field = FieldFactory.create(table, f)
    if (field) {
      if (field instanceof SelectField && f.type === 'select') {
        wrap(field).assign({ options: f.options.options.map((option) => new Option(field, option)) })
      }
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
      const view = this.getView(s.view.id.value)
      await wrap(view).init()
      wrap(view).assign({ fieldOptions: { [s.fieldKey]: { width: s.width } } }, { mergeObjects: true })
      this.em.persist(view)
    })
  }
  fieldVisibility(s: WithFieldVisibility): void {
    this.jobs.push(async () => {
      const view = this.getView(s.view.id.value)
      await wrap(view).init()
      wrap(view).assign({ fieldOptions: { [s.fieldKey]: { hidden: s.hidden } } }, { mergeObjects: true })
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
    wrap(view).assign({ kanban: { fieldKey: s.fieldKey?.value ?? '' } })
    this.em.persist(view)
  }
  calendarFieldEqual(s: WithCalendarField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ calendar: { fieldKey: s.fieldKey?.value ?? '' } })
    this.em.persist(view)
  }
  optionsEqual(s: WithOptions): void {
    this.jobs.push(async () => {
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
