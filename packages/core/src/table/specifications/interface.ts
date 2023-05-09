import type { CompositeSpecification, ISpecVisitor } from '@undb/domain'
import { type ISpecification } from '@undb/domain'
import type {
  WithFieldDescription,
  WithFieldDisplay,
  WithFieldName,
} from '../field/specifications/base-field.specification.js'
import type { WithFormat } from '../field/specifications/date-field.specification.js'
import type { WithFieldRequirement } from '../field/specifications/field-constraints.specification.js'
import type { WithoutField } from '../field/specifications/field.specification.js'
import type { WithRatingMax } from '../field/specifications/rating-field.specification.js'
import type {
  WithDisplayFields,
  WithSymmetricReferenceField,
} from '../field/specifications/reference-field.specification.js'
import type { WithNewOption, WithOptions, WithoutOption } from '../field/specifications/select-field.specification.js'
import { type Table } from '../table.js'
import type { WithWidgeSepecification } from '../view/dashboard/specifications/widge.specification.js'
import type { WithKanbanField, WithViewsOrder } from '../view/index.js'
import type { WithCalendarField } from '../view/specifications/calendar.specification.js'
import type { WithDisplayType } from '../view/specifications/display-type.specification.js'
import type { WithFilter } from '../view/specifications/filters.specificaiton.js'
import type { WithRowHeight } from '../view/specifications/row-height.specification.js'
import type { WithShowSystemFieldsSpec } from '../view/specifications/show-system-fields.specification.js'
import type { WithSorts } from '../view/specifications/sorts.specification.js'
import type { WithTreeViewField } from '../view/specifications/tree-view.specification.js'
import type {
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
} from '../view/specifications/view-field-option.specification.js'
import type { WithViewFieldsOrder } from '../view/specifications/view-fields-order.specification.js'
import type { WithViewPinnedFields } from '../view/specifications/view-pinned-fields.specification.js'
import type {
  WithNewView,
  WithTableView,
  WithTableViews,
  WithViewName,
  WithoutView,
} from '../view/specifications/views.specification.js'
import type { WithTableEmoji } from './table-emoji.specification.js'
import type { WithNewField } from './table-field.specification.js'
import type { WithTableId } from './table-id.specification.js'
import type { WithTableName } from './table-name.specification.js'
import type { WithTableSchema } from './table-schema.specification.js'

export interface ITableSpecVisitor extends ISpecVisitor {
  idEqual(s: WithTableId): void
  nameEqual(s: WithTableName): void
  emojiEqual(s: WithTableEmoji): void
  schemaEqual(s: WithTableSchema): void
  viewsEqual(s: WithTableViews): void
  viewEqual(s: WithTableView): void
  viewNameEqual(s: WithViewName): void
  newView(s: WithNewView): void
  withoutView(s: WithoutView): void
  viewsOrderEqual(s: WithViewsOrder): void

  sortsEqual(s: WithSorts): void

  filterEqual(s: WithFilter): void
  fieldsOrder(s: WithViewFieldsOrder): void
  fieldOptionsEqual(s: WithFieldOption): void
  fieldWidthEqual(s: WithFieldWidth): void
  fieldVisibility(s: WithFieldVisibility): void
  pinnedFields(s: WithViewPinnedFields): void

  ratingMaxEqual(s: WithRatingMax): void

  rowHeightEqual(s: WithRowHeight): void
  displayTypeEqual(s: WithDisplayType): void
  kanbanFieldEqual(s: WithKanbanField): void
  calendarFieldEqual(s: WithCalendarField): void
  treeViewFieldEqual(s: WithTreeViewField): void

  newField(s: WithNewField): void
  withoutField(s: WithoutField): void

  optionsEqual(s: WithOptions): void
  optionEqual(s: WithNewOption): void
  newOption(s: WithNewOption): void
  witoutOption(s: WithoutOption): void

  withFieldName(s: WithFieldName): void
  withFieldDescription(s: WithFieldDescription): void
  withFieldDisplay(s: WithFieldDisplay): void
  displayFieldsEqual(s: WithDisplayFields): void
  withFormat(s: WithFormat): void

  withShowSystemFields(s: WithShowSystemFieldsSpec): void

  withFieldRequirement(s: WithFieldRequirement): void
  symmetricReferenceFieldEqual(s: WithSymmetricReferenceField): void

  withWidge(s: WithWidgeSepecification): void
}

export type ITableSpec = ISpecification<Table, ITableSpecVisitor>

export type TableCompositeSpecificaiton = CompositeSpecification<Table, ITableSpecVisitor>
