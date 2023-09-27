/* eslint-disable @typescript-eslint/no-empty-function */
import type { QRCodeField } from '../field/fields/qrcode/qrcode-field.js'
import type {
  AttachmentField,
  AutoIncrementField,
  AverageField,
  BoolField,
  CollaboratorField,
  ColorField,
  CountField,
  CreatedAtField,
  CreatedByField,
  CurrencyField,
  DateField,
  DateRangeField,
  EmailField,
  IFieldVisitor,
  IdField,
  JsonField,
  LookupField,
  MaxField,
  MinField,
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
  UrlField,
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
  WithRatingMax,
  WithSymmetricReferenceField,
  WithTimeFormat,
  WithoutField,
  WithoutOption,
} from '../field/index.js'
import type { WithReferenceFieldId } from '../field/specifications/lookup-field.specification.js'
import type {
  WithFormFieldFilter,
  WithFormFieldsRequirements,
  WithFormFieldsSpecification,
  WithFormFieldsVisibility,
  WithFormName,
  WithNewForm,
  WithTableForms,
  WithoutForm,
} from '../form/index.js'
import type { WithFormFieldsOrder } from '../form/specifications/form-fields-order.specification.js'
import type {
  ITableSpecVisitor,
  WithNewField,
  WithTableBaseId,
  WithTableEmoji,
  WithTableFormId,
  WithTableId,
  WithTableIds,
  WithTableName,
  WithTableSchema,
  WithTableViewId,
} from '../specifications/index.js'
import type {
  WithWidgetSpecification,
  WithWidgetsLayout,
  WithoutWidgetSpecification,
} from '../view/dashboard/specifications/widget.specification.js'
import type {
  WithCalendarField,
  WithChartAggregateSpec,
  WithDisplayType,
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
  WithFilter,
  WithGalleryField,
  WithGanttField,
  WithKanbanField,
  WithNewView,
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
  WithVisualizationFieldSpec,
  WithVisualizationNameSpec,
  WithoutView,
} from '../view/index.js'
import type { WithNumberAggregateSpec } from '../visualization/specifications/number-visualization.specification.js'

export abstract class AbstractReferenceFieldSpecVisitor implements ITableSpecVisitor, IFieldVisitor {
  withFormFieldFilter(s: WithFormFieldFilter): void {}
  viewIdEqual(s: WithTableViewId): void {}
  withoutWidget(s: WithoutWidgetSpecification): void {}
  withChartAggregate(s: WithChartAggregateSpec): void {}
  withNumberAggregate(s: WithNumberAggregateSpec): void {}
  withVisualizationName(s: WithVisualizationNameSpec): void {}
  withVisualizationField(s: WithVisualizationFieldSpec): void {}
  withWidgetsLayout(s: WithWidgetsLayout): void {}
  rowHeightEqual(s: WithRowHeight): void {}
  ratingMaxEqual(s: WithRatingMax): void {}
  currencySymbolEqual(s: WithCurrencySymbol): void {}
  id(field: IdField): void {}
  baseIdEq(s: WithTableBaseId): void {}
  createdAt(field: CreatedAtField): void {}
  createdBy(field: CreatedByField): void {}
  updatedBy(field: UpdatedByField): void {}
  updatedAt(field: UpdatedAtField): void {}
  attachment(field: AttachmentField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  string(field: StringField): void {}
  email(field: EmailField): void {}
  qrcode(field: QRCodeField): void {}
  url(field: UrlField): void {}
  json(field: JsonField): void {}
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
  min(field: MinField): void {}
  max(field: MaxField): void {}
  idEqual(s: WithTableId): void {}
  idsIn(s: WithTableIds): void {}
  nameEqual(s: WithTableName): void {}
  schemaEqual(s: WithTableSchema): void {
    for (const field of s.schema.fields) {
      field.accept(this)
    }
  }
  viewsEqual(s: WithTableViews): void {}
  viewEqual(s: WithTableView): void {}
  viewNameEqual(s: WithViewName): void {}
  formsEqual(s: WithTableForms): void {}
  formFieldsEqual(s: WithFormFieldsSpecification): void {}
  withFormName(s: WithFormName): void {}
  formIdEqual(s: WithTableFormId): void {}
  withFormFieldsVisibility(s: WithFormFieldsVisibility): void {}
  withFormFieldsRequirements(s: WithFormFieldsRequirements): void {}
  newForm(s: WithNewForm): void {}
  withoutForm(s: WithoutForm): void {}
  newView(s: WithNewView): void {}
  emojiEqual(s: WithTableEmoji): void {}
  withoutView(s: WithoutView): void {}
  viewsOrderEqual(s: WithViewsOrder): void {}
  sortsEqual(s: WithSorts): void {}
  filterEqual(s: WithFilter): void {}
  fieldsOrder(s: WithViewFieldsOrder): void {}
  formFieldsOrder(s: WithFormFieldsOrder): void {}
  fieldOptionsEqual(s: WithFieldOption): void {}
  fieldWidthEqual(s: WithFieldWidth): void {}
  fieldVisibility(s: WithFieldVisibility): void {}
  pinnedFields(s: WithViewPinnedFields): void {}
  displayTypeEqual(s: WithDisplayType): void {}
  kanbanFieldEqual(s: WithKanbanField): void {}
  galleryFieldEqual(s: WithGalleryField): void {}
  ganttFieldEqual(s: WithGanttField): void {}
  calendarFieldEqual(s: WithCalendarField): void {}
  treeViewFieldEqual(s: WithTreeViewField): void {}
  newField(s: WithNewField): void {
    s.field.accept(this)
  }
  abstract foreignTableIdEqual(s: WithForeignTableId): void
  withoutField(s: WithoutField): void {}
  withDuplicatedField(s: WithDuplicatedField): void {}
  optionsEqual(s: WithOptions): void {}
  optionEqual(s: WithOption): void {}
  newOption(s: WithNewOption): void {}
  withoutOption(s: WithoutOption): void {}
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
  withWidget(s: WithWidgetSpecification): void {}
  withNewFieldType(s: WithNewFieldType): void {}
  or(): this {
    return this
  }
  not(): this {
    return this
  }
}
