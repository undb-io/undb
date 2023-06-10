/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AverageField } from '../field/average-field.js'
import type { CollaboratorField } from '../field/collaborator-field.js'
import type {
  AttachmentField,
  AutoIncrementField,
  BoolField,
  ColorField,
  CountField,
  CreatedAtField,
  CreatedByField,
  CurrencyField,
  DateField,
  DateRangeField,
  EmailField,
  IdField,
  IFieldVisitor,
  LookupField,
  MultiSelectField,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  TreeField,
  UpdatedAtField,
  UpdatedByField,
  WithAggregateFieldId,
  WithCurrencySymbol,
  WithDisplayFields,
  WithDuplicatedField,
  WithFieldDescription,
  WithFieldDisplay,
  WithFieldName,
  WithFieldRequirement,
  WithForeignTableId,
  WithFormat,
  WithNewFieldType,
  WithNewOption,
  WithOption,
  WithOptions,
  WithoutField,
  WithoutOption,
  WithRatingMax,
  WithSymmetricReferenceField,
  WithTimeFormat,
} from '../field/index.js'
import type { WithReferenceFieldId } from '../field/specifications/lookup-field.specification.js'
import type {
  ITableSpecVisitor,
  WithFilter,
  WithNewField,
  WithTableEmoji,
  WithTableId,
  WithTableName,
  WithTableSchema,
} from '../specifications/index.js'
import type {
  WithoutWidgeSpecification,
  WithWidgeSepecification,
  WithWidgesLayout,
} from '../view/dashboard/specifications/widge.specification.js'
import type {
  WithCalendarField,
  WithChartAggregateSpec,
  WithDisplayType,
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
  WithKanbanField,
  WithNewView,
  WithoutView,
  WithRowHeight,
  WithShowSystemFieldsSpec,
  WithSorts,
  WithTableView,
  WithTableViews,
  WithTreeViewField,
  WithViewFieldsOrder,
  WithViewName,
  WithViewPinnedFields,
  WithViewsOrder,
  WithVirsualizationNameSpec,
} from '../view/index.js'
import type { WithNumberAggregateSpec } from '../virsualization/specifications/number-virsualization.specification.js'

export abstract class AbstractReferenceFieldSpecVisitor implements ITableSpecVisitor, IFieldVisitor {
  withoutWidge(s: WithoutWidgeSpecification): void {}
  withChartAggregate(s: WithChartAggregateSpec): void {}
  withNumberAggregate(s: WithNumberAggregateSpec): void {}
  withVirsualizationName(s: WithVirsualizationNameSpec): void {}
  withWidgesLayout(s: WithWidgesLayout): void {}
  rowHeightEqual(s: WithRowHeight): void {}
  ratingMaxEqual(s: WithRatingMax): void {}
  currencySymbolEqual(s: WithCurrencySymbol): void {}
  id(field: IdField): void {}
  createdAt(field: CreatedAtField): void {}
  createdBy(field: CreatedByField): void {}
  updatedBy(field: UpdatedByField): void {}
  updatedAt(field: UpdatedAtField): void {}
  attachment(field: AttachmentField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  string(field: StringField): void {}
  email(field: EmailField): void {}
  color(field: ColorField): void {}
  number(field: NumberField): void {}
  bool(field: BoolField): void {}
  date(field: DateField): void {}
  dateRange(field: DateRangeField): void {}
  select(field: SelectField): void {}
  multiSelect(field: MultiSelectField): void {}
  abstract reference(field: ReferenceField): void
  abstract tree(field: TreeField): void
  abstract parent(field: ParentField): void
  collaborator(field: CollaboratorField): void {}
  rating(field: RatingField): void {}
  currency(field: CurrencyField): void {}
  count(field: CountField): void {}
  sum(field: SumField): void {}
  average(field: AverageField): void {}
  lookup(field: LookupField): void {}
  idEqual(s: WithTableId): void {}
  nameEqual(s: WithTableName): void {}
  schemaEqual(s: WithTableSchema): void {
    for (const field of s.schema.fields) {
      field.accept(this)
    }
  }
  viewsEqual(s: WithTableViews): void {}
  viewEqual(s: WithTableView): void {}
  viewNameEqual(s: WithViewName): void {}
  newView(s: WithNewView): void {}
  emojiEqual(s: WithTableEmoji): void {}
  withoutView(s: WithoutView): void {}
  viewsOrderEqual(s: WithViewsOrder): void {}
  sortsEqual(s: WithSorts): void {}
  filterEqual(s: WithFilter): void {}
  fieldsOrder(s: WithViewFieldsOrder): void {}
  fieldOptionsEqual(s: WithFieldOption): void {}
  fieldWidthEqual(s: WithFieldWidth): void {}
  fieldVisibility(s: WithFieldVisibility): void {}
  pinnedFields(s: WithViewPinnedFields): void {}
  displayTypeEqual(s: WithDisplayType): void {}
  kanbanFieldEqual(s: WithKanbanField): void {}
  calendarFieldEqual(s: WithCalendarField): void {}
  treeViewFieldEqual(s: WithTreeViewField): void {}
  newField(s: WithNewField): void {
    s.field.accept(this)
  }
  foreignTableIdEqual(s: WithForeignTableId): void {}
  withoutField(s: WithoutField): void {}
  withDuplicatedField(s: WithDuplicatedField): void {}
  optionsEqual(s: WithOptions): void {}
  optionEqual(s: WithOption): void {}
  newOption(s: WithNewOption): void {}
  witoutOption(s: WithoutOption): void {}
  withFieldName(s: WithFieldName): void {}
  withFieldDescription(s: WithFieldDescription): void {}
  withFieldDisplay(s: WithFieldDisplay): void {}
  displayFieldsEqual(s: WithDisplayFields): void {}
  withFormat(s: WithFormat): void {}
  withTimeFormat(s: WithTimeFormat): void {}
  withShowSystemFields(s: WithShowSystemFieldsSpec): void {}
  withFieldRequirement(s: WithFieldRequirement): void {}
  withAggregateFieldId(s: WithAggregateFieldId): void {}
  symmetricReferenceFieldEqual(s: WithSymmetricReferenceField): void {}
  withReferenceFieldId(s: WithReferenceFieldId): void {}
  withWidge(s: WithWidgeSepecification): void {}
  withNewFieldType(s: WithNewFieldType): void {}
  or(): this {
    return this
  }
  not(): this {
    return this
  }
}
