import type {
  ITableSpecVisitor,
  WithCalendarField,
  WithDisplayFields,
  WithDisplayType,
  WithFieldDescription,
  WithFieldName,
  WithFieldOption,
  WithFieldRequirement,
  WithFieldVisibility,
  WithFieldWidth,
  WithFilter,
  WithFormat,
  WithKanbanField,
  WithNewField,
  WithNewOption,
  WithNewView,
  WithOptions,
  WithoutField,
  WithoutOption,
  WithoutView,
  WithShowSystemFieldsSpec,
  WithSorts,
  WithSymmetricReferenceField,
  WithTableName,
  WithTableSchema,
  WithTableView,
  WithTableViews,
  WithTreeViewField,
  WithViewFieldsOrder,
  WithViewName,
  WithViewPinnedFields,
  WithViewsOrder,
} from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type {
  CreatedAtField,
  DateField,
  DateRangeField,
  ParentField,
  ReferenceField,
  TreeField,
  UpdatedAtField,
} from '../../entity/index.js'
import { Field, Option, SelectField, Table } from '../../entity/index.js'
import { View } from '../../entity/view.js'
import { BaseEntityManager } from '../base-entity-manager.js'
import { TableSqliteFieldVisitor } from './table-sqlite-field.visitor.js'

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
  viewNameEqual(s: WithViewName): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ name: s.name.value })
    this.em.persist(view)
  }
  newView(s: WithNewView): void {
    const table = this.table
    const view = new View(table, s.view)
    this.em.persist(view)
  }
  withoutView(s: WithoutView): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ deletedAt: new Date() })
    this.em.persist(view)
  }
  viewsOrderEqual(s: WithViewsOrder): void {
    const table = this.table
    wrap(table).assign({ viewsOrder: s.order.order })
    this.em.persist(table)
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
  pinnedFields(s: WithViewPinnedFields): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ pinnedFields: s.pinnedFields.toJSON() })
    this.em.persist(view)
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
  treeViewFieldEqual(s: WithTreeViewField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ tree: { fieldId: s.fieldId?.value ?? '' } })
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
  withFieldName(s: WithFieldName): void {
    const field = this.getField(s.field.id.value)
    wrap(field).assign({ name: s.name.value })
    this.em.persist(field)
  }
  withFieldDescription(s: WithFieldDescription): void {
    const field = this.getField(s.field.id.value)
    wrap(field).assign({ description: s.description.value })
    this.em.persist(field)
  }
  displayFieldsEqual(s: WithDisplayFields): void {
    this.addJobs(async () => {
      const field = (await this.em.findOne(Field, { id: s.field.id.value })) as TreeField | ParentField | ReferenceField
      if (field) {
        field.displayFields.set(s.displayFields.map((id) => this.em.getReference(Field, id.value)))

        this.em.persist(field)
      }
    })
  }
  withFormat(s: WithFormat): void {
    const field = this.getField(s.field.id.value) as DateField | DateRangeField | CreatedAtField | UpdatedAtField
    wrap(field).assign({ format: s.format.unpack() })
    this.em.persist(field)
  }
  withShowSystemFields(s: WithShowSystemFieldsSpec): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ showSystemFields: s.showSystemFields })
    this.em.persist(view)
  }
  withFieldRequirement(s: WithFieldRequirement): void {
    const field = this.getField(s.field.id.value)
    wrap(field).assign({ required: s.required })
    this.em.persist(field)
  }
  symmetricReferenceFieldEqual(s: WithSymmetricReferenceField): void {
    const field = this.getField(s.field.id.value) as ReferenceField
    wrap(field).assign({ symmetricReferenceField: s.symmetricReferenceFieldId.value })
    this.em.persist(field)
  }
  not(): this {
    return this
  }
}
