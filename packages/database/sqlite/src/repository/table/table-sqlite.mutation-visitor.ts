import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import {
  type BaseField,
  type ITableSpecVisitor,
  type WithCalendarField,
  type WithDisplayFields,
  type WithDisplayType,
  type WithFieldDescription,
  type WithFieldDisplay,
  type WithFieldName,
  type WithFieldOption,
  type WithFieldRequirement,
  type WithFieldVisibility,
  type WithFieldWidth,
  type WithFilter,
  type WithFormat,
  type WithKanbanField,
  type WithNewField,
  type WithNewOption,
  type WithNewView,
  type WithNumberAggregateSpec,
  type WithOptions,
  type WithRatingMax,
  type WithRowHeight,
  type WithShowSystemFieldsSpec,
  type WithSorts,
  type WithSymmetricReferenceField,
  type WithTableEmoji,
  type WithTableName,
  type WithTableSchema,
  type WithTableView,
  type WithTableViews,
  type WithTreeViewField,
  type WithViewFieldsOrder,
  type WithViewName,
  type WithViewPinnedFields,
  type WithViewsOrder,
  type WithVirsualizationNameSpec,
  type WithWidgeSepecification,
  type WithWidgesLayout,
  type WithoutField,
  type WithoutOption,
  type WithoutView,
} from '@undb/core'
import type { CreatedAtField, UpdatedAtField } from '../../entity/index.js'
import {
  AttachmentField,
  AutoIncrementField,
  AverageField,
  BoolField,
  CollaboratorField,
  ColorField,
  CountField,
  CreatedByField,
  DateField,
  DateRangeField,
  EmailField,
  Field,
  IdField,
  LookupField,
  NumberField,
  Option,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  Table,
  TreeField,
  UpdatedByField,
} from '../../entity/index.js'
import { View } from '../../entity/view.js'
import { NumberVirsualization, Virsualization } from '../../entity/virsualization.js'
import { Widge } from '../../entity/widge.js'
import { BaseEntityManager } from '../base-entity-manager.js'
import { TableSqliteFieldVisitor } from './table-sqlite-field.visitor.js'
import { TableSqliteVirsualizationVisitor } from './table-sqlite-virsualization.visitor.js'

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

  #getField(field: BaseField): Field {
    const {
      type,
      id: { value: id },
    } = field
    switch (type) {
      case 'date':
        return this.em.getReference(DateField, id)
      case 'string':
        return this.em.getReference(StringField, id)
      case 'number':
        return this.em.getReference(NumberField, id)
      case 'id':
        return this.em.getReference(IdField, id)
      case 'created-at':
        return this.em.getReference(CreatedByField, id)
      case 'updated-at':
        return this.em.getReference(UpdatedByField, id)
      case 'auto-increment':
        return this.em.getReference(AutoIncrementField, id)
      case 'color':
        return this.em.getReference(ColorField, id)
      case 'email':
        return this.em.getReference(EmailField, id)
      case 'select':
        return this.em.getReference(SelectField, id)
      case 'bool':
        return this.em.getReference(BoolField, id)
      case 'date-range':
        return this.em.getReference(DateRangeField, id)
      case 'reference':
        return this.em.getReference(ReferenceField, id)
      case 'tree':
        return this.em.getReference(TreeField, id)
      case 'parent':
        return this.em.getReference(ParentField, id)
      case 'rating':
        return this.em.getReference(RatingField, id)
      case 'count':
        return this.em.getReference(CountField, id)
      case 'lookup':
        return this.em.getReference(LookupField, id)
      case 'sum':
        return this.em.getReference(SumField, id)
      case 'average':
        return this.em.getReference(AverageField, id)
      case 'attachment':
        return this.em.getReference(AttachmentField, id)
      case 'collaborator':
        return this.em.getReference(CollaboratorField, id)
      case 'created-by':
        return this.em.getReference(CreatedByField, id)
      case 'updated-by':
        return this.em.getReference(UpdatedByField, id)
    }
  }

  idEqual(): void {
    throw new Error('[TableSqliteMutationVisitor.idEqual] Method not implemented.')
  }
  nameEqual(s: WithTableName): void {
    const table = this.table
    wrap(table).assign({ name: s.name.value })
    this.em.persist(table)
  }
  emojiEqual(s: WithTableEmoji): void {
    const table = this.table
    wrap(table).assign({ emoji: s.emoji.unpack() })
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
  rowHeightEqual(s: WithRowHeight): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ rowHeight: s.rowHeight.unpack() })
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
    const field = this.em.getReference(SelectField, s.field.id.value)
    const option = new Option(field, s.option)
    this.em.persist(option)
  }
  witoutOption(s: WithoutOption): void {
    const option = this.em.getReference(Option, s.optionKey.value as never)
    this.em.remove(option)
  }
  withoutField(s: WithoutField): void {
    const field = this.#getField(s.field)
    wrap(field).assign({ deletedAt: new Date() })
    this.em.persist(field)
  }
  fieldOptionsEqual(s: WithFieldOption): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign(s.options.toObject().unwrapOr({}), { mergeObjects: true })
    this.em.persist(view)
  }
  withFieldName(s: WithFieldName): void {
    const field = this.#getField(s.field)
    wrap(field).assign({ name: s.name.value })
    this.em.persist(field)
  }
  withFieldDescription(s: WithFieldDescription): void {
    const field = this.#getField(s.field)
    wrap(field).assign({ description: s.description.value })
    this.em.persist(field)
  }
  withFieldDisplay(s: WithFieldDisplay): void {
    const field = this.#getField(s.field)
    wrap(field).assign({ display: s.display })
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
    const field = this.#getField(s.field) as DateField | DateRangeField | CreatedAtField | UpdatedAtField
    wrap(field).assign({ format: s.format.unpack() })
    this.em.persist(field)
  }
  withShowSystemFields(s: WithShowSystemFieldsSpec): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ showSystemFields: s.showSystemFields })
    this.em.persist(view)
  }
  withFieldRequirement(s: WithFieldRequirement): void {
    const field = this.#getField(s.field)
    wrap(field).assign({ required: s.required })
    this.em.persist(field)
  }
  symmetricReferenceFieldEqual(s: WithSymmetricReferenceField): void {
    const field = this.em.getReference(ReferenceField, s.field.id.value)
    wrap(field).assign({ symmetricReferenceField: s.symmetricReferenceFieldId.value })
    this.em.persist(field)
  }
  ratingMaxEqual(s: WithRatingMax): void {
    const field = this.em.getReference(RatingField, s.field.id.value)
    wrap(field).assign({ max: s.max })
    this.em.persist(field)
  }
  withWidge(s: WithWidgeSepecification): void {
    const view = this.getView(s.view.id.value)
    const widge = new Widge(view, s.widge)

    const vv = new TableSqliteVirsualizationVisitor(this.tableId, this.em)
    s.widge.virsualization?.accept(vv)

    widge.virsualization = vv.virsualization
    this.em.persist(widge)
  }
  withWidgesLayout(s: WithWidgesLayout): void {
    for (const [id, layout] of s.widgesMap) {
      const widge = this.em.getReference(Widge, id)
      wrap(widge).assign({ layout })
      this.em.persist(widge)
    }
  }
  withVirsualizationName(s: WithVirsualizationNameSpec): void {
    const virsualization = this.em.getReference(Virsualization, s.virsualizationId)
    wrap(virsualization).assign({ name: s.name.value })
    this.em.persist(virsualization)
  }
  withNumberAggregate(s: WithNumberAggregateSpec): void {
    const virsualization = this.em.getReference(NumberVirsualization, s.virsualizationId.value)
    wrap(virsualization).assign({ fieldId: s.fieldId.value, numberAggregateFunction: s.aggregateFunction })
    this.em.persist(virsualization)
  }
  not(): this {
    return this
  }
}
