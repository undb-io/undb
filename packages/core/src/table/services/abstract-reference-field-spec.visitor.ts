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
  UpdatedByField,
  WithDisplayFields,
  WithFieldDescription,
  WithFieldDisplay,
  WithFieldName,
  WithFieldRequirement,
  WithFormat,
  WithNewOption,
  WithOptions,
  WithRatingMax,
  WithSymmetricReferenceField,
  WithoutField,
  WithoutOption,
} from '../field/index.js'
import type {
  ITableSpecVisitor,
  WithFilter,
  WithNewField,
  WithTableEmoji,
  WithTableId,
  WithTableName,
  WithTableSchema,
} from '../specifications/index.js'
import type { WithWidgeSepecification } from '../view/dashboard/specifications/widge.specification.js'
import type {
  WithCalendarField,
  WithDisplayType,
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
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
  WithoutView,
} from '../view/index.js'

export abstract class AbstractReferenceFieldSpecVisitor implements ITableSpecVisitor, IFieldVisitor {
  rowHeightEqual(s: WithRowHeight): void {}
  ratingMaxEqual(s: WithRatingMax): void {}
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
  abstract reference(field: ReferenceField): void
  abstract tree(field: TreeField): void
  abstract parent(field: ParentField): void
  collaborator(field: CollaboratorField): void {}
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
  withWidge(s: WithWidgeSepecification): void {}
  not(): this {
    return this
  }
}
