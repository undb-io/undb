/* eslint-disable @typescript-eslint/no-unused-vars */
import type { QueryBuilder } from '@mikro-orm/better-sqlite'
import type {
  ITableSpecVisitor,
  WithAggregateFieldId,
  WithCalendarField,
  WithChartAggregateSpec,
  WithCurrencySymbol,
  WithDisplayFields,
  WithDisplayType,
  WithDuplicatedField,
  WithFieldDescription,
  WithFieldDisplay,
  WithFieldName,
  WithFieldOption,
  WithFieldRequirement,
  WithFieldVisibility,
  WithFieldWidth,
  WithFilter,
  WithForeignTableId,
  WithFormFieldFilter,
  WithFormFieldsOrder,
  WithFormFieldsRequirements,
  WithFormFieldsSpecification,
  WithFormFieldsVisibility,
  WithFormName,
  WithFormat,
  WithGalleryField,
  WithGanttField,
  WithKanbanField,
  WithNewField,
  WithNewFieldType,
  WithNewForm,
  WithNewOption,
  WithNewView,
  WithNumberAggregateSpec,
  WithOption,
  WithOptions,
  WithRatingMax,
  WithReferenceFieldId,
  WithRowHeight,
  WithShowSystemFieldsSpec,
  WithSorts,
  WithSymmetricReferenceField,
  WithTableBaseId,
  WithTableEmoji,
  WithTableFormId,
  WithTableForms,
  WithTableId,
  WithTableIds,
  WithTableName,
  WithTableSchema,
  WithTableView,
  WithTableViewId,
  WithTableViews,
  WithTimeFormat,
  WithTreeViewField,
  WithViewFieldsOrder,
  WithViewName,
  WithViewPinnedFields,
  WithViewsOrder,
  WithVisualizationFieldSpec,
  WithVisualizationNameSpec,
  WithWidgetSpecification,
  WithWidgetsLayout,
  WithoutField,
  WithoutForm,
  WithoutOption,
  WithoutView,
  WithoutWidgetSpecification,
} from '@undb/core'
import type { Table } from '../../entity/index.js'

export class TableSqliteQueryVisitor implements ITableSpecVisitor {
  constructor(public qb: QueryBuilder<Table>) {}
  withFormFieldFilter(s: WithFormFieldFilter): void {
    throw new Error('Method not implemented.')
  }
  withDuplicatedField(s: WithDuplicatedField): void {
    throw new Error('Method not implemented.')
  }
  withoutWidget(s: WithoutWidgetSpecification): void {
    throw new Error('Method not implemented.')
  }
  withChartAggregate(s: WithChartAggregateSpec): void {
    throw new Error('Method not implemented.')
  }
  withNumberAggregate(s: WithNumberAggregateSpec): void {
    throw new Error('Method not implemented.')
  }
  withVisualizationName(s: WithVisualizationNameSpec): void {
    throw new Error('Method not implemented.')
  }
  withVisualizationField(s: WithVisualizationFieldSpec): void {
    throw new Error('Method not implemented.')
  }
  withWidgetsLayout(s: WithWidgetsLayout): void {
    throw new Error('Method not implemented.')
  }
  idEqual(s: WithTableId): void {
    this.qb.andWhere({ id: s.id.value })
  }
  idsIn(s: WithTableIds): void {
    this.qb.andWhere({ id: { $in: s.ids.map((id) => id.value) } })
  }
  baseIdEq(s: WithTableBaseId): void {
    this.qb.andWhere({ base: s.id.into()?.value ?? null })
  }
  nameEqual(s: WithTableName): void {
    this.qb.andWhere({ name: s.name.value })
  }
  viewIdEqual(s: WithTableViewId): void {
    this.qb.andWhere({ views: s.viewId.value })
  }
  formIdEqual(s: WithTableFormId): void {
    this.qb.andWhere({ forms: s.formId.value })
  }
  emojiEqual(s: WithTableEmoji): void {
    throw new Error('Method not implemented.')
  }
  schemaEqual(s: WithTableSchema): void {
    throw new Error('Method not implemented.')
  }
  viewsEqual(s: WithTableViews): void {
    throw new Error('Method not implemented.')
  }
  viewEqual(s: WithTableView): void {
    throw new Error('Method not implemented.')
  }
  viewNameEqual(s: WithViewName): void {
    throw new Error('Method not implemented.')
  }
  newView(s: WithNewView): void {
    throw new Error('Method not implemented.')
  }
  withoutView(s: WithoutView): void {
    throw new Error('Method not implemented.')
  }
  viewsOrderEqual(s: WithViewsOrder): void {
    throw new Error('Method not implemented.')
  }
  formsEqual(s: WithTableForms): void {
    throw new Error('Method not implemented.')
  }
  formFieldsEqual(s: WithFormFieldsSpecification): void {
    throw new Error('Method not implemented.')
  }
  withFormName(s: WithFormName): void {
    throw new Error('Method not implemented.')
  }
  withFormFieldsVisibility(s: WithFormFieldsVisibility): void {
    throw new Error('Method not implemented.')
  }
  withFormFieldsRequirements(s: WithFormFieldsRequirements): void {
    throw new Error('Method not implemented.')
  }
  newForm(s: WithNewForm): void {
    throw new Error('Method not implemented.')
  }
  withoutForm(s: WithoutForm): void {
    throw new Error('Method not implemented.')
  }
  filterEqual(s: WithFilter): void {
    throw new Error('Method not implemented.')
  }
  newField(s: WithNewField): void {
    throw new Error('Method not implemented.')
  }
  fieldsOrder(s: WithViewFieldsOrder): void {
    throw new Error('Method not implemented.')
  }
  formFieldsOrder(s: WithFormFieldsOrder): void {
    throw new Error('Method not implemented.')
  }
  fieldWidthEqual(s: WithFieldWidth): void {
    throw new Error('Method not implemented.')
  }
  fieldVisibility(s: WithFieldVisibility): void {
    throw new Error('Method not implemented.')
  }
  displayTypeEqual(s: WithDisplayType): void {
    throw new Error('Method not implemented.')
  }
  kanbanFieldEqual(s: WithKanbanField): void {
    throw new Error('Method not implemented.')
  }
  galleryFieldEqual(s: WithGalleryField): void {
    throw new Error('Method not implemented.')
  }
  ganttFieldEqual(s: WithGanttField): void {
    throw new Error('Method not implemented.')
  }
  treeViewFieldEqual(s: WithTreeViewField): void {
    throw new Error('Method not implemented.')
  }
  calendarFieldEqual(s: WithCalendarField): void {
    throw new Error('Method not implemented.')
  }
  rowHeightEqual(s: WithRowHeight): void {
    throw new Error('Method not implemented.')
  }
  optionsEqual(s: WithOptions): void {
    throw new Error('Method not implemented.')
  }
  newOption(s: WithNewOption): void {
    throw new Error('Method not implemented.')
  }
  withoutOption(s: WithoutOption): void {
    throw new Error('Method not implemented.')
  }
  withNewFieldType(s: WithNewFieldType): void {
    throw new Error('Method not implemented.')
  }
  withoutField(s: WithoutField): void {
    throw new Error('Method not implemented.')
  }
  fieldOptionsEqual(s: WithFieldOption): void {
    throw new Error('Method not implemented.')
  }
  optionEqual(s: WithOption): void {
    throw new Error('Method not implemented.')
  }
  sortsEqual(s: WithSorts): void {
    throw new Error('Method not implemented.')
  }
  withFieldName(s: WithFieldName): void {
    throw new Error('Method not implemented.')
  }
  withFieldDescription(s: WithFieldDescription): void {
    throw new Error('Method not implemented.')
  }
  withFieldDisplay(s: WithFieldDisplay): void {
    throw new Error('Method not implemented.')
  }
  displayFieldsEqual(s: WithDisplayFields): void {
    throw new Error('Method not implemented.')
  }
  withFormat(s: WithFormat): void {
    throw new Error('Method not implemented.')
  }
  withTimeFormat(s: WithTimeFormat): void {
    throw new Error('Method not implemented.')
  }
  withShowSystemFields(s: WithShowSystemFieldsSpec): void {
    throw new Error('Method not implemented.')
  }
  pinnedFields(s: WithViewPinnedFields): void {
    throw new Error('Method not implemented.')
  }
  withFieldRequirement(s: WithFieldRequirement): void {
    throw new Error('Method not implemented.')
  }
  symmetricReferenceFieldEqual(s: WithSymmetricReferenceField): void {
    throw new Error('Method not implemented.')
  }
  foreignTableIdEqual(s: WithForeignTableId): void {
    throw new Error('Method not implemented.')
  }
  ratingMaxEqual(s: WithRatingMax): void {
    throw new Error('Method not implemented.')
  }
  currencySymbolEqual(s: WithCurrencySymbol): void {
    throw new Error('Method not implemented.')
  }
  withWidget(s: WithWidgetSpecification): void {
    throw new Error('Method not implemented.')
  }
  withAggregateFieldId(s: WithAggregateFieldId): void {
    throw new Error('Method not implemented.')
  }
  withReferenceFieldId(s: WithReferenceFieldId): void {
    throw new Error('Method not implemented.')
  }
  or(): this {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
