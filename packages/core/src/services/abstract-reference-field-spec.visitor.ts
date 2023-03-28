/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AverageField } from '../field/average-field.js'
import type {
  AutoIncrementField,
  BoolField,
  ColorField,
  CountField,
  CreatedAtField,
  DateField,
  DateRangeField,
  EmailField,
  IFieldVisitor,
  IdField,
  LookupField,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  TreeField,
  UpdatedAtField,
  WithDisplayFields,
  WithFieldDescription,
  WithFieldDisplay,
  WithFieldName,
  WithFieldRequirement,
  WithFormat,
  WithNewOption,
  WithOptions,
  WithSymmetricReferenceField,
  WithoutField,
  WithoutOption,
} from '../field/index.js'
import type {
  ITableSpecVisitor,
  WithFilter,
  WithNewField,
  WithTableId,
  WithTableName,
  WithTableSchema,
} from '../specifications/index.js'
import type {
  WithCalendarField,
  WithDisplayType,
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
  WithKanbanField,
  WithNewView,
  WithShowSystemFieldsSpec,
  WithSorts,
  WithTableView,
  WithTableViews,
  WithTreeViewField,
  WithViewFieldsOrder,
  WithViewName,
  WithViewPinnedFields,
  WithViewsOrder,
  WithoutView,
} from '../view/index.js'

export abstract class AbstractReferenceFieldSpecVisitor implements ITableSpecVisitor, IFieldVisitor {
  id(field: IdField): void {}
  createdAt(field: CreatedAtField): void {}
  updatedAt(field: UpdatedAtField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  string(field: StringField): void {}
  email(field: EmailField): void {}
  color(field: ColorField): void {}
  number(field: NumberField): void {}
  bool(field: BoolField): void {}
  date(field: DateField): void {}
  dateRange(field: DateRangeField): void {}
  select(field: SelectField): void {}
  abstract reference(field: ReferenceField): void
  abstract tree(field: TreeField): void
  abstract parent(field: ParentField): void
  rating(field: RatingField): void {}
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
  withoutField(s: WithoutField): void {}
  optionsEqual(s: WithOptions): void {}
  optionEqual(s: WithNewOption): void {}
  newOption(s: WithNewOption): void {}
  witoutOption(s: WithoutOption): void {}
  withFieldName(s: WithFieldName): void {}
  withFieldDescription(s: WithFieldDescription): void {}
  withFieldDisplay(s: WithFieldDisplay): void {}
  displayFieldsEqual(s: WithDisplayFields): void {}
  withFormat(s: WithFormat): void {}
  withShowSystemFields(s: WithShowSystemFieldsSpec): void {}
  withFieldRequirement(s: WithFieldRequirement): void {}
  symmetricReferenceFieldEqual(s: WithSymmetricReferenceField): void {}
  not(): this {
    return this
  }
}
