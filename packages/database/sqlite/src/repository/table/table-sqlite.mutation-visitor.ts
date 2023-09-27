import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type {
  IFieldType,
  WithAggregateFieldId,
  WithChartAggregateSpec,
  WithCurrencySymbol,
  WithDuplicatedField,
  WithForeignTableId,
  WithFormFieldFilter,
  WithFormFieldsOrder,
  WithFormFieldsRequirements,
  WithFormFieldsSpecification,
  WithFormFieldsVisibility,
  WithFormName,
  WithGalleryField,
  WithGanttField,
  WithNewFieldType,
  WithNewForm,
  WithOption,
  WithReferenceFieldId,
  WithTableBaseId,
  WithTableFormId,
  WithTableForms,
  WithTableIds,
  WithTableViewId,
  WithTimeFormat,
  WithoutForm,
  WithoutWidgetSpecification,
} from '@undb/core'
import {
  WithNewField,
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
  type WithVisualizationFieldSpec,
  type WithVisualizationNameSpec,
  type WithWidgetSpecification,
  type WithWidgetsLayout,
  type WithoutField,
  type WithoutOption,
  type WithoutView,
} from '@undb/core'
import { mapValues } from 'lodash-es'
import { Form } from '../../entity/form.js'
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
  CurrencyField,
  DateField,
  DateRangeField,
  EmailField,
  Field,
  IdField,
  JsonField,
  LookupField,
  MaxField,
  MinField,
  MultiSelectField,
  NumberField,
  Option,
  ParentField,
  QRCodeField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  Table,
  TreeField,
  UpdatedByField,
  UrlField,
} from '../../entity/index.js'
import { View } from '../../entity/view.js'
import { ChartVisualization, NumberVisualization, Visualization } from '../../entity/visualization.js'
import { Widget } from '../../entity/widget.js'
import { BaseEntityManager } from '../base-entity-manager.js'
import { TableSqliteFieldVisitor } from './table-sqlite-field.visitor.js'
import { TableSqliteVisualizationVisitor } from './table-sqlite-visualization.visitor.js'

export class TableSqliteMutationVisitor extends BaseEntityManager implements ITableSpecVisitor {
  constructor(
    private readonly tableId: string,
    em: EntityManager,
  ) {
    super(em)
  }
  viewIdEqual(s: WithTableViewId): void {
    throw new Error('Method not implemented.')
  }
  formIdEqual(s: WithTableFormId): void {
    throw new Error('Method not implemented.')
  }
  private get table(): Table {
    return this.em.getReference(Table, this.tableId)
  }

  private getView(id: string): View {
    return this.em.getReference(View, id)
  }

  #getField(type: IFieldType, id: string): Field {
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
      case 'qrcode':
        return this.em.getReference(QRCodeField, id)
      case 'url':
        return this.em.getReference(UrlField, id)
      case 'json':
        return this.em.getReference(JsonField, id)
      case 'select':
        return this.em.getReference(SelectField, id)
      case 'multi-select':
        return this.em.getReference(MultiSelectField, id)
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
      case 'currency':
        return this.em.getReference(CurrencyField, id)
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
      case 'min':
        return this.em.getReference(MinField, id)
      case 'max':
        return this.em.getReference(MaxField, id)
    }
  }

  idEqual(): void {
    throw new Error('[TableSqliteMutationVisitor.idEqual] Method not implemented.')
  }
  idsIn(s: WithTableIds): void {
    throw new Error('[TableSqliteMutationVisitor.idsIn] Method not implemented.')
  }
  baseIdEq(s: WithTableBaseId): void {
    const table = this.table
    if (s.id.isNone()) {
      this.addJobs(async () => {
        await wrap(table).init()
        wrap(table).assign({ base: null })
        await this.em.persistAndFlush(table)
      })
    } else {
      wrap(table).assign({ base: s.id.into()?.value || null })
      this.em.persist(table)
    }
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
  formsEqual(s: WithTableForms): void {
    const table = this.table
    wrap(table).assign({ forms: s.forms.forms.map((form) => new Form(table, form)) })
    this.em.persist(table)
  }
  formFieldsEqual(s: WithFormFieldsSpecification): void {
    const form = this.em.getReference(Form, s.formId)
    wrap(form).assign({ fields: s.fields })
    this.em.persist(form)
  }
  withFormName(s: WithFormName): void {
    const form = this.em.getReference(Form, s.formId)
    wrap(form).assign({ name: s.name.value })
    this.em.persist(form)
  }
  withFormFieldsVisibility(s: WithFormFieldsVisibility): void {
    this.addJobs(async () => {
      const form = this.em.getReference(Form, s.formId)
      await wrap(form).init()
      const fields = mapValues(s.visibility, (hidden) => ({ hidden }))
      wrap(form).assign({ fields }, { mergeObjects: true, merge: true })
      await this.em.persistAndFlush(form)
    })
  }
  withFormFieldsRequirements(s: WithFormFieldsRequirements): void {
    this.addJobs(async () => {
      const form = this.em.getReference(Form, s.formId)
      await wrap(form).init()
      const fields = mapValues(s.requirements, (required) => ({ required }))
      wrap(form).assign({ fields }, { mergeObjects: true, merge: true })
      await this.em.persistAndFlush(form)
    })
  }
  withFormFieldFilter(s: WithFormFieldFilter): void {
    this.addJobs(async () => {
      const form = this.em.getReference(Form, s.formId)
      await wrap(form).init()
      const fields = { [s.fieldId]: { filter: s.filter } }
      wrap(form).assign({ fields }, { mergeObjects: true, merge: true })
      await this.em.persistAndFlush(form)
    })
  }
  newForm(s: WithNewForm): void {
    const table = this.table
    const form = new Form(table, s.form)
    this.em.persist(form)
  }
  withoutForm(s: WithoutForm): void {
    const form = this.em.getReference(Form, s.form.id.value)
    this.em.remove(form)
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

    this.unshiftQueries(...visitor.queries)
  }
  withDuplicatedField(s: WithDuplicatedField): void {
    const spec = new WithNewField(s.field)
    this.newField(spec)
  }
  fieldsOrder(s: WithViewFieldsOrder): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ fieldsOrder: s.viewFieldsOrder.order })
    this.em.persist(view)
  }
  formFieldsOrder(s: WithFormFieldsOrder): void {
    const form = this.em.getReference(Form, s.formId)
    wrap(form).assign({ fieldsOrder: s.formFieldsOrder.order })
    this.em.persist(form)
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
    wrap(view).assign({ kanban: { fieldId: s.fieldId?.value || null } })
    this.em.persist(view)
  }
  galleryFieldEqual(s: WithGalleryField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ gallery: { fieldId: s.fieldId?.value || null } })
    this.em.persist(view)
  }
  ganttFieldEqual(s: WithGanttField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ gantt: { fieldId: s.fieldId?.value || null } })
    this.em.persist(view)
  }
  treeViewFieldEqual(s: WithTreeViewField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ tree: { fieldId: s.fieldId?.value || null } })
    this.em.persist(view)
  }
  calendarFieldEqual(s: WithCalendarField): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ calendar: { fieldId: s.fieldId?.value || null } })
    this.em.persist(view)
  }
  optionsEqual(s: WithOptions): void {
    this.addJobs(async () => {
      const field =
        s.type === 'select'
          ? await this.em.findOne(SelectField, s.fieldId, { populate: ['options'] })
          : await this.em.findOne(MultiSelectField, s.fieldId, { populate: ['options'] })
      if (field) {
        wrap(field).assign({ options: s.options.options.map((option, index) => new Option(field, option, index + 1)) })
        this.em.persist(field)
      }
    })
  }
  optionEqual(s: WithOption): void {
    const option = this.em.getReference(Option, s.option.key.value as never)
    wrap(option).assign({
      name: s.option.name.value,
      color: { name: s.option.color.name, shade: s.option.color.shade },
    })
    this.em.persist(option)
  }
  newOption(s: WithNewOption): void {
    this.addJobs(async () => {
      const field = this.#getField(s.type, s.fieldId) as SelectField | MultiSelectField
      const count = await this.em.count(Option, { field: s.fieldId })
      const option = new Option(field, s.option, count + 1)
      this.em.persist(option)
    })
  }
  withoutOption(s: WithoutOption): void {
    const option = this.em.getReference(Option, s.optionKey.value as never)
    this.em.remove(option)
  }
  withNewFieldType(s: WithNewFieldType): void {
    const { tableName } = this.em.getMetadata().get(Field.name)
    const query = `UPDATE ${tableName} SET type = '${s.newType}' WHERE id = '${s.field.id.value}'`
    this.addQueries(query)
  }
  withoutField(s: WithoutField): void {
    const field = this.#getField(s.type, s.fieldId)
    wrap(field).assign({ deletedAt: new Date() })
    this.em.persist(field)
  }
  fieldOptionsEqual(s: WithFieldOption): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign(s.options.toObject().unwrapOr({}), { mergeObjects: true })
    this.em.persist(view)
  }
  withFieldName(s: WithFieldName): void {
    const field = this.#getField(s.type, s.fieldId)
    wrap(field).assign({ name: s.name.value })
    this.em.persist(field)
  }
  withFieldDescription(s: WithFieldDescription): void {
    const field = this.#getField(s.type, s.fieldId)
    wrap(field).assign({ description: s.description.value })
    this.em.persist(field)
  }
  withFieldDisplay(s: WithFieldDisplay): void {
    const field = this.#getField(s.type, s.fieldId)
    wrap(field).assign({ display: s.display })
    this.em.persist(field)
  }
  displayFieldsEqual(s: WithDisplayFields): void {
    this.addJobs(async () => {
      const field = (await this.em.findOne(Field, { id: s.fieldId })) as TreeField | ParentField | ReferenceField
      if (field) {
        field.displayFields.set(s.displayFields.map((id) => this.em.getReference(Field, id.value)))
        this.em.persist(field)
      }
    })
  }
  withFormat(s: WithFormat): void {
    const field = this.#getField(s.type, s.fieldId) as DateField | DateRangeField | CreatedAtField | UpdatedAtField
    wrap(field).assign({ format: s.format.unpack() })
    this.em.persist(field)
  }
  withTimeFormat(s: WithTimeFormat): void {
    this.addJobs(async () => {
      const field = (await this.em.findOne(Field, s.fieldId)) as
        | DateField
        | DateRangeField
        | CreatedAtField
        | UpdatedAtField
      if (field) {
        field.timeFormat = s.format.unpack() ?? null
        await this.em.persistAndFlush(field)
      }
    })
  }
  withShowSystemFields(s: WithShowSystemFieldsSpec): void {
    const view = this.getView(s.view.id.value)
    wrap(view).assign({ showSystemFields: s.showSystemFields })
    this.em.persist(view)
  }
  withFieldRequirement(s: WithFieldRequirement): void {
    const field = this.#getField(s.type, s.fieldId)
    wrap(field).assign({ required: s.required })
    this.em.persist(field)
  }
  symmetricReferenceFieldEqual(s: WithSymmetricReferenceField): void {
    const field = this.em.getReference(ReferenceField, s.fieldId)
    wrap(field).assign({ symmetricReferenceField: s.symmetricReferenceFieldId.value })
    this.em.persist(field)
  }
  foreignTableIdEqual(s: WithForeignTableId): void {
    const field = this.em.getReference(ReferenceField, s.fieldId)
    field.foreignTable = this.em.getReference(Table, s.foreignTableId.value)
    this.em.persist(field)
  }
  ratingMaxEqual(s: WithRatingMax): void {
    const field = this.em.getReference(RatingField, s.fieldId)
    wrap(field).assign({ max: s.max })
    this.em.persist(field)
  }
  currencySymbolEqual(s: WithCurrencySymbol): void {
    const field = this.em.getReference(CurrencyField, s.fieldId)
    wrap(field).assign({ symbol: s.symbol.symbol })
    this.em.persist(field)
  }
  withWidget(s: WithWidgetSpecification): void {
    const view = this.getView(s.view.id.value)
    const widget = new Widget(view, s.widget)

    const vv = new TableSqliteVisualizationVisitor(this.tableId, this.em)
    s.widget.visualization?.accept(vv)

    widget.visualization = vv.visualization
    this.em.persist(widget)
  }
  withoutWidget(s: WithoutWidgetSpecification): void {
    const widget = this.em.getReference(Widget, s.widgetId)
    wrap(widget).assign({ deletedAt: new Date() })
    this.em.persist(widget)
  }
  withWidgetsLayout(s: WithWidgetsLayout): void {
    for (const [id, layout] of s.widgetsMap) {
      const widget = this.em.getReference(Widget, id)
      wrap(widget).assign({ layout })
      this.em.persist(widget)
    }
  }
  withVisualizationName(s: WithVisualizationNameSpec): void {
    const visualization = this.em.getReference(Visualization, s.visualizationId)
    wrap(visualization).assign({ name: s.name.value })
    this.em.persist(visualization)
  }
  withVisualizationField(s: WithVisualizationFieldSpec): void {
    this.addJobs(async () => {
      const visualization = this.em.getReference(Visualization, s.visualizationId)
      await wrap(visualization).init()
      wrap(visualization as ChartVisualization | NumberVisualization).assign({ fieldId: s.fieldId?.value || null })
      await this.em.persistAndFlush(visualization)
    })
  }
  withNumberAggregate(s: WithNumberAggregateSpec): void {
    this.addJobs(async () => {
      const visualization = await this.em.findOne(NumberVisualization, s.visualizationId.value)
      if (visualization) {
        visualization.fieldId = s.fieldId?.value ?? null
        visualization.numberAggregateFunction = s.aggregateFunction ?? null
        await this.em.persistAndFlush(visualization)
      }
    })
  }
  withChartAggregate(s: WithChartAggregateSpec): void {
    this.addJobs(async () => {
      const visualization = await this.em.findOne(ChartVisualization, s.visualizationId.value)
      if (visualization) {
        visualization.fieldId = s.fieldId?.value ?? null
        visualization.chartAggregateFunction = s.aggregateFunction ?? null
        await this.em.persistAndFlush(visualization)
      }
    })
  }
  withAggregateFieldId(s: WithAggregateFieldId): void {
    const field = this.#getField(s.type, s.fieldId)
    if (field instanceof SumField) {
      wrap(field).assign({ sumAggregateField: this.em.getReference(Field, s.aggregateFieldId.value) })
    } else if (field instanceof AverageField) {
      wrap(field).assign({ averageAggregateField: this.em.getReference(Field, s.aggregateFieldId.value) })
    } else if (field instanceof MinField) {
      wrap(field).assign({ minAggregateField: this.em.getReference(Field, s.aggregateFieldId.value) })
    } else if (field instanceof MaxField) {
      wrap(field).assign({ maxAggregateField: this.em.getReference(Field, s.aggregateFieldId.value) })
    }
    this.em.persist(field)
  }
  withReferenceFieldId(s: WithReferenceFieldId): void {
    const field = this.#getField(s.type, s.fieldId) as
      | SumField
      | AverageField
      | LookupField
      | CountField
      | MinField
      | MaxField
    if (field instanceof SumField) {
      wrap(field).assign({ sumReferenceField: this.em.getReference(Field, s.referenceFieldId.value) })
    } else if (field instanceof AverageField) {
      wrap(field).assign({ averageReferenceField: this.em.getReference(Field, s.referenceFieldId.value) })
    } else if (field instanceof CountField) {
      wrap(field).assign({ countReferenceField: this.em.getReference(Field, s.referenceFieldId.value) })
    } else if (field instanceof LookupField) {
      wrap(field).assign({ lookupReferenceField: this.em.getReference(Field, s.referenceFieldId.value) })
    } else if (field instanceof MinField) {
      wrap(field).assign({ minReferenceField: this.em.getReference(Field, s.referenceFieldId.value) })
    } else if (field instanceof MaxField) {
      wrap(field).assign({ maxReferenceField: this.em.getReference(Field, s.referenceFieldId.value) })
    }
    this.em.persist(field)
  }
  or(): this {
    return this
  }
  not(): this {
    return this
  }
}
