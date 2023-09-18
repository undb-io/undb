import { isEmpty } from 'lodash-es'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { match } from 'ts-pattern'
import { z } from 'zod'
import type { IAttachmentFilter, IAttachmentFilterTypeValue } from '../field/fields/attachment/attachment.filter.js'
import {
  attachmentFilter,
  attachmentFilterOperators,
  attachmentFilterValue,
} from '../field/fields/attachment/attachment.filter.js'
import type { IAutoIncrementFilter } from '../field/fields/auto-increment/auto-increment.filter.js'
import {
  autoIncrementFilter,
  autoIncrementFilterOperators,
  autoIncrementFilterValue,
} from '../field/fields/auto-increment/auto-increment.filter.js'
import type { IAverageFilter } from '../field/fields/average/average.filter.js'
import { averageFilter, averageFilterOperators, averageFilterValue } from '../field/fields/average/average.filter.js'
import type { IBoolFilter } from '../field/fields/bool/bool.filter.js'
import { boolFilter, boolFilterOperators, boolFilterValue } from '../field/fields/bool/bool.filter.js'
import type { ICollaboratorFilter } from '../field/fields/collaborator/collaborator.filter.js'
import {
  collaboratorFilter,
  collaboratorFilterOperators,
  collaboratorFilterValue,
} from '../field/fields/collaborator/collaborator.filter.js'
import type { IColorFilter } from '../field/fields/color/color.filter.js'
import { colorFilter, colorFilterOperators } from '../field/fields/color/color.filter.js'
import type { ICountFilter } from '../field/fields/count/count.filter.js'
import { countFilter, countFilterOperators, countFilterValue } from '../field/fields/count/count.filter.js'
import type { ICreatedAtFilter } from '../field/fields/created-at/created-at.filter.js'
import {
  createdAtFilter,
  createdAtFilterOperators,
  createdAtFilterValue,
} from '../field/fields/created-at/created-at.filter.js'
import type { ICreatedByFilter } from '../field/fields/created-by/created-by.filter.js'
import {
  createdByFilter,
  createdByFilterOperators,
  createdByFilterValue,
} from '../field/fields/created-by/created-by.filter.js'
import type { ICurrencyFilter } from '../field/fields/currency/currency.filter.js'
import {
  currencyFilter,
  currencyFilterOperators,
  currencyFilterValue,
} from '../field/fields/currency/currency.filter.js'
import type { IDateRangeFilter } from '../field/fields/date-range/date-range.filter.js'
import {
  dateRangeFilter,
  dateRangeFilterOperators,
  dateRangeFilterValue,
} from '../field/fields/date-range/date-range.filter.js'
import type { IDateFilter } from '../field/fields/date/date.filter.js'
import { dateFilter, dateFilterOperators, dateFilterValue } from '../field/fields/date/date.filter.js'
import type { IEmailFilter } from '../field/fields/email/email.filter.js'
import { emailFilter, emailFilterOperators, emailFilterValue } from '../field/fields/email/email.filter.js'
import type { IIdFilter } from '../field/fields/id/id.filter.js'
import { idFilter, idFilterOperators, idFilterValue } from '../field/fields/id/id.filter.js'
import type { IJsonFilter } from '../field/fields/json/json.filter.js'
import { jsonFilter, jsonFilterOperators, jsonFilterValue } from '../field/fields/json/json.filter.js'
import { lookupFilter, lookupFilterOperators, lookupFilterValue } from '../field/fields/lookup/lookup.filter.js'
import type { IMaxFilter } from '../field/fields/max/max.filter.js'
import { maxFilter, maxFilterOperators, maxFilterValue } from '../field/fields/max/max.filter.js'
import type { IMinFilter } from '../field/fields/min/min.filter.js'
import { minFilter, minFilterOperators, minFilterValue } from '../field/fields/min/min.filter.js'
import type { IMultiSelectFilter } from '../field/fields/multi-select/multi-select.filter.js'
import {
  multiSelectFilter,
  multiSelectFilterOperators,
  multiSelectFilterValue,
} from '../field/fields/multi-select/multi-select.filter.js'
import type { INumberFilter } from '../field/fields/number/number.filter.js'
import { numberFilter, numberFilterOperators, numberFilterValue } from '../field/fields/number/number.filter.js'
import { parentFilter, parentFilterOperators, parentFilterValue } from '../field/fields/parent/parent.filter.js'
import { qrcodeFilter, qrcodeFilterOperators, qrcodeFilterValue } from '../field/fields/qrcode/qrcode.filter.js'
import type { IRatingFilter } from '../field/fields/rating/rating.filter.js'
import { ratingFilter, ratingFilterOperators, ratingFilterValue } from '../field/fields/rating/rating.filter.js'
import {
  referenceFilter,
  referenceFilterOperators,
  referenceFilterValue,
} from '../field/fields/reference/reference.filter.js'
import type { ISelectFieldValue } from '../field/fields/select/select-field.type.js'
import type { ISelectFilter } from '../field/fields/select/select.filter.js'
import { selectFilter, selectFilterOperators, selectFilterValue } from '../field/fields/select/select.filter.js'
import type { IStringFilter } from '../field/fields/string/string.filter.js'
import { stringFilter, stringFilterOperators, stringFilterValue } from '../field/fields/string/string.filter.js'
import type { ISumFilter } from '../field/fields/sum/sum.filter.js'
import { sumFilter, sumFilterOperators, sumFilterValue } from '../field/fields/sum/sum.filter.js'
import type { ITreeFilter } from '../field/fields/tree/tree.filter.js'
import { treeFilter, treeFilterOperators, treeFilterValue } from '../field/fields/tree/tree.filter.js'
import type { IUpdatedAtFilter } from '../field/fields/updated-at/updated-at.filter.js'
import {
  updatedAtFilter,
  updatedAtFilterOperators,
  updatedAtFilterValue,
} from '../field/fields/updated-at/updated-at.filter.js'
import type { IUpdatedByFilter } from '../field/fields/updated-by/updated-by.filter.js'
import {
  updatedByFilter,
  updatedByFilterOperators,
  updatedByFilterValue,
} from '../field/fields/updated-by/updated-by.filter.js'
import type { IUrlFilter } from '../field/fields/url/url.filter.js'
import { urlFilter, urlFilterOperators, urlFilterValue } from '../field/fields/url/url.filter.js'
import type { IFieldType } from '../field/index.js'
import {
  DateFieldValue,
  DateRangeFieldValue,
  NumberFieldValue,
  SelectFieldValue,
  StringFieldValue,
  colorFieldValue,
} from '../field/index.js'
import {
  BoolIsFalse,
  BoolIsTrue,
  CollaboratorEqual,
  CollaboratorIsEmpty,
  CreatedByIn,
  DateBetween,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateIsTomorrow,
  DateIsYesterday,
  DateLessThan,
  DateLessThanOrEqual,
  DateRangeDateEqual,
  DateRangeDateGreaterThan,
  DateRangeDateGreaterThanOrEqual,
  DateRangeDateLessThan,
  DateRangeDateLessThanOrEqual,
  DateRangeEmpty,
  DateRangeEqual,
  HasExtension,
  HasFileType,
  IsAttachmentEmpty,
  IsTreeRoot,
  JsonEmpty,
  MultiSelectEqual,
  MultiSelectIn,
  MultiSelectIsEmpty,
  NumberEmpty,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  SelectEmpty,
  SelectEqual,
  SelectIn,
  StringContain,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  UdpatedByIn,
  WithRecordCreatedBy,
  WithRecordIds,
  WithRecordUpdatedBy,
} from '../record/index.js'
import type { RecordCompositeSpecification } from '../record/specifications/interface.js'
import type { IConjunction } from './conjunction.js'
import { conjunctions } from './conjunction.js'
import {
  $between,
  $eq,
  $is_empty,
  $is_false,
  $is_not_empty,
  $is_not_today,
  $is_root,
  $is_today,
  $is_tomorrow,
  $is_true,
  $is_yesterday,
  $neq,
} from './operators.js'

export const filterValue = z.union([
  idFilterValue,
  createdAtFilterValue,
  updatedAtFilterValue,
  autoIncrementFilterValue,
  stringFilterValue,
  emailFilterValue,
  qrcodeFilterValue,
  urlFilterValue,
  jsonFilterValue,
  colorFieldValue,
  numberFilterValue,
  dateFilterValue,
  dateRangeFilterValue,
  selectFilterValue,
  multiSelectFilterValue,
  boolFilterValue,
  referenceFilterValue,
  treeFilterValue,
  parentFilterValue,
  ratingFilterValue,
  currencyFilterValue,
  countFilterValue,
  lookupFilterValue,
  sumFilterValue,
  averageFilterValue,
  attachmentFilterValue,
  collaboratorFilterValue,
  createdByFilterValue,
  updatedByFilterValue,
  minFilterValue,
  maxFilterValue,
])
export type IFilterValue = z.infer<typeof filterValue>

export const operaotrs = z.union([
  idFilterOperators,
  createdAtFilterOperators,
  updatedAtFilterOperators,
  autoIncrementFilterOperators,
  stringFilterOperators,
  emailFilterOperators,
  qrcodeFilterOperators,
  urlFilterOperators,
  jsonFilterOperators,
  colorFilterOperators,
  numberFilterOperators,
  dateFilterOperators,
  dateRangeFilterOperators,
  selectFilterOperators,
  multiSelectFilterOperators,
  boolFilterOperators,
  referenceFilterOperators,
  treeFilterOperators,
  parentFilterOperators,
  ratingFilterOperators,
  currencyFilterOperators,
  countFilterOperators,
  lookupFilterOperators,
  sumFilterOperators,
  averageFilterOperators,
  attachmentFilterOperators,
  collaboratorFilterOperators,
  createdByFilterOperators,
  updatedByFilterOperators,
  minFilterOperators,
  maxFilterOperators,
])
export type IOperator = z.infer<typeof operaotrs>

export const operaotrsMap: Record<IFieldType, IOperator[]> = {
  string: stringFilterOperators.options.map((v) => v._def.value),
  number: numberFilterOperators.options.map((v) => v._def.value),
  date: dateFilterOperators.options.map((v) => v._def.value),
  id: idFilterOperators.options.map((v) => v._def.value),
  'created-at': createdAtFilterOperators.options.map((v) => v._def.value),
  'updated-at': updatedAtFilterOperators.options.map((v) => v._def.value),
  'auto-increment': autoIncrementFilterOperators.options.map((v) => v._def.value),
  color: colorFilterOperators.options.map((v) => v._def.value),
  email: emailFilterOperators.options.map((v) => v._def.value),
  qrcode: qrcodeFilterOperators.options.map((v) => v._def.value),
  url: urlFilterOperators.options.map((v) => v._def.value),
  json: jsonFilterOperators.options.map((v) => v._def.value),
  select: selectFilterOperators.options.map((v) => v._def.value),
  'multi-select': multiSelectFilterOperators.options.map((v) => v._def.value),
  bool: boolFilterOperators.options.map((v) => v._def.value),
  'date-range': dateRangeFilterOperators.options.map((v) => v._def.value),
  reference: referenceFilterOperators.options.map((v) => v._def.value),
  tree: treeFilterOperators.options.map((v) => v._def.value),
  parent: parentFilterOperators.options.map((v) => v._def.value),
  rating: ratingFilterOperators.options.map((v) => v._def.value),
  currency: currencyFilterOperators.options.map((v) => v._def.value),
  count: countFilterOperators.options.map((v) => v._def.value),
  lookup: lookupFilterOperators.options.map((v) => v._def.value),
  sum: sumFilterOperators.options.map((v) => v._def.value),
  average: averageFilterOperators.options.map((v) => v._def.value),
  attachment: attachmentFilterOperators.options.map((v) => v._def.value),
  collaborator: collaboratorFilterOperators.options.map((v) => v._def.value),
  'created-by': createdByFilterOperators.options.map((v) => v._def.value),
  'updated-by': updatedByFilterOperators.options.map((v) => v._def.value),
  min: minFilterOperators.options.map((v) => v._def.value),
  max: maxFilterOperators.options.map((v) => v._def.value),
}

const filter = z.discriminatedUnion('type', [
  idFilter,
  createdAtFilter,
  updatedAtFilter,
  autoIncrementFilter,
  stringFilter,
  emailFilter,
  qrcodeFilter,
  urlFilter,
  jsonFilter,
  colorFilter,
  numberFilter,
  dateFilter,
  dateRangeFilter,
  selectFilter,
  multiSelectFilter,
  boolFilter,
  referenceFilter,
  treeFilter,
  parentFilter,
  ratingFilter,
  currencyFilter,
  countFilter,
  lookupFilter,
  sumFilter,
  averageFilter,
  attachmentFilter,
  collaboratorFilter,
  createdByFilter,
  updatedByFilter,
  minFilter,
  maxFilter,
])

export type IFilter = z.infer<typeof filter>
export type IFilters = IFilter[]

export interface IGroup {
  conjunction: IConjunction
  children?: IFilterOrGroupList
}

const group: z.ZodType<IGroup> = z.lazy(() =>
  z.object({
    conjunction: conjunctions,
    children: z.union([group, filter]).array().nonempty().optional(),
  }),
)

const filterOrGroup = filter.or(group)
export type IFilterOrGroup = z.infer<typeof filterOrGroup>

export const filterOrGroupList = filterOrGroup.array()
export type IFilterOrGroupList = z.infer<typeof filterOrGroupList>
export const rootFilter = filterOrGroup.or(filterOrGroupList)
export type IRootFilter = z.infer<typeof rootFilter>

export const isGroup = (filterOrGroup: IFilterOrGroup): filterOrGroup is IGroup => {
  return Object.hasOwn(filterOrGroup, 'conjunction')
}

export const isFilter = (filterOrGroup: IFilterOrGroup): filterOrGroup is IFilter => {
  return Object.hasOwn(filterOrGroup, 'type') && Object.hasOwn(filterOrGroup, 'operator')
}

const convertIdFilter = (filter: IIdFilter): Option<RecordCompositeSpecification> => {
  if (filter.value === undefined) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new StringEqual(filter.path, new StringFieldValue(filter.value as string)))
    }
    case '$neq': {
      return Some(new StringEqual(filter.path, new StringFieldValue(filter.value as string)).not())
    }
    case '$in': {
      return Some(WithRecordIds.fromIds(filter.value as string[]))
    }
    case '$nin': {
      return Some(WithRecordIds.fromIds(filter.value as string[]).not())
    }

    default:
      return None
  }
}

const convertStringFilter = (
  filter: IStringFilter | IEmailFilter | IColorFilter | IUrlFilter,
): Option<RecordCompositeSpecification> => {
  if (filter.value === undefined) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new StringEqual(filter.path, new StringFieldValue(filter.value)))
    }
    case '$neq': {
      return Some(new StringEqual(filter.path, new StringFieldValue(filter.value)).not())
    }
    case '$contains': {
      return Some(new StringContain(filter.path, new StringFieldValue(filter.value)))
    }
    case '$not_contains': {
      return Some(new StringContain(filter.path, new StringFieldValue(filter.value)).not())
    }
    case '$starts_with': {
      return Some(new StringStartsWith(filter.path, new StringFieldValue(filter.value)))
    }
    case '$ends_with': {
      return Some(new StringEndsWith(filter.path, new StringFieldValue(filter.value)))
    }
    case '$regex': {
      return Some(new StringRegex(filter.path, new StringFieldValue(filter.value)))
    }
    case '$is_empty': {
      return Some(new StringEmpty(filter.path))
    }
    case '$is_not_empty': {
      return Some(new StringEmpty(filter.path).not())
    }

    default:
      return None
  }
}

const convertNumberFilter = (
  filter:
    | INumberFilter
    | IAutoIncrementFilter
    | IRatingFilter
    | ICountFilter
    | ISumFilter
    | IAverageFilter
    | ICurrencyFilter
    | IMinFilter
    | IMaxFilter,
): Option<RecordCompositeSpecification> => {
  if (filter.value === undefined) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new NumberEqual(filter.path, new NumberFieldValue(filter.value)))
    }
    case '$neq': {
      return Some(new NumberEqual(filter.path, new NumberFieldValue(filter.value)).not())
    }
    case '$gt': {
      return Some(new NumberGreaterThan(filter.path, new NumberFieldValue(filter.value)))
    }
    case '$gte': {
      return Some(new NumberGreaterThanOrEqual(filter.path, new NumberFieldValue(filter.value)))
    }
    case '$lt': {
      return Some(new NumberLessThan(filter.path, new NumberFieldValue(filter.value)))
    }
    case '$lte': {
      return Some(new NumberLessThanOrEqual(filter.path, new NumberFieldValue(filter.value)))
    }
    case '$is_empty': {
      return Some(new NumberEmpty(filter.path))
    }
    case '$is_not_empty': {
      return Some(new NumberEmpty(filter.path).not())
    }
    default:
      return None
  }
}

const convertSelectFilter = (filter: ISelectFilter): Option<RecordCompositeSpecification> => {
  if (filter.value === undefined) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new SelectEqual(filter.path, new SelectFieldValue(filter.value as ISelectFieldValue)))
    }
    case '$neq': {
      return Some(new SelectEqual(filter.path, new SelectFieldValue(filter.value as ISelectFieldValue)).not())
    }
    case '$in': {
      return Some(
        new SelectIn(
          filter.path,
          (filter.value as ISelectFieldValue[]).map((v) => new SelectFieldValue(v)),
        ),
      )
    }
    case '$nin': {
      return Some(
        new SelectIn(
          filter.path,
          (filter.value as ISelectFieldValue[]).map((v) => new SelectFieldValue(v)),
        ).not(),
      )
    }
    case '$is_empty': {
      return Some(new SelectEmpty(filter.path))
    }
    case '$is_not_empty': {
      return Some(new SelectEmpty(filter.path).not())
    }

    default: {
      return None
    }
  }
}

const convertBoolFilter = (filter: IBoolFilter): Option<RecordCompositeSpecification> => {
  switch (filter.operator) {
    case $is_true.value: {
      return Some(new BoolIsTrue(filter.path))
    }
    case $is_false.value: {
      return Some(new BoolIsFalse(filter.path))
    }

    default: {
      return None
    }
  }
}

const convertJsonFilter = (filter: IJsonFilter): Option<RecordCompositeSpecification> => {
  switch (filter.operator) {
    case $is_empty.value: {
      return Some(new JsonEmpty(filter.path))
    }
    case $is_not_empty.value: {
      return Some(new JsonEmpty(filter.path).not())
    }

    default: {
      return None
    }
  }
}
const convertDateRangeFilter = (filter: IDateRangeFilter): Option<RecordCompositeSpecification> => {
  if (filter.value !== null) {
    if (Array.isArray(filter.value)) {
      switch (filter.operator) {
        case $eq.value:
          return Some(DateRangeEqual.fromString(filter.path, filter.value))
        case $neq.value:
          return Some(DateRangeEqual.fromString(filter.path, filter.value).not())
        case $between.value: {
          const [from, to] = filter.value
          if (!from || !to) return None
          return Some(new DateBetween(filter.path, new Date(from), new Date(to)))
        }

        default:
          return None
      }
    }

    switch (filter.operator) {
      case '$start_eq':
        return Some(new DateRangeDateEqual('start', filter.path, new Date(filter.value)))
      case '$start_neq':
        return Some(new DateRangeDateEqual('start', filter.path, new Date(filter.value)).not())
      case '$start_gt':
        return Some(new DateRangeDateGreaterThan('start', filter.path, new Date(filter.value)))
      case '$start_lt':
        return Some(new DateRangeDateLessThan('start', filter.path, new Date(filter.value)))
      case '$start_gte':
        return Some(new DateRangeDateGreaterThanOrEqual('start', filter.path, new Date(filter.value)))
      case '$start_lte':
        return Some(new DateRangeDateLessThanOrEqual('start', filter.path, new Date(filter.value)))
      case '$end_eq':
        return Some(new DateRangeDateEqual('end', filter.path, new Date(filter.value)))
      case '$end_neq':
        return Some(new DateRangeDateEqual('end', filter.path, new Date(filter.value)).not())
      case '$end_gt':
        return Some(new DateRangeDateGreaterThan('end', filter.path, new Date(filter.value)))
      case '$end_lt':
        return Some(new DateRangeDateLessThan('end', filter.path, new Date(filter.value)))
      case '$end_gte':
        return Some(new DateRangeDateGreaterThanOrEqual('end', filter.path, new Date(filter.value)))
      case '$end_lte':
        return Some(new DateRangeDateLessThanOrEqual('end', filter.path, new Date(filter.value)))

      default:
        return None
    }
  }

  if (filter.operator === '$is_empty') {
    return Some(new DateRangeEmpty(filter.path, new DateRangeFieldValue(null)))
  } else if (filter.operator === '$is_not_empty') {
    return Some(new DateRangeEmpty(filter.path, new DateRangeFieldValue(null)).not())
  }

  return None
}

const convertDateFilter = (
  filter: IDateFilter | ICreatedAtFilter | IUpdatedAtFilter,
): Option<RecordCompositeSpecification> => {
  if (filter.operator === $is_today.value) {
    return Some(new DateIsToday(filter.path))
  }
  if (filter.operator === $is_not_today.value) {
    return Some(new DateIsToday(filter.path).not())
  }
  if (filter.operator === $is_tomorrow.value) {
    return Some(new DateIsTomorrow(filter.path))
  }
  if (filter.operator === $is_yesterday.value) {
    return Some(new DateIsYesterday(filter.path))
  }

  if (filter.value === undefined) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new DateEqual(filter.path, DateFieldValue.fromNullableString(filter.value as string)))
    }
    case '$neq': {
      return Some(new DateEqual(filter.path, DateFieldValue.fromNullableString(filter.value as string)).not())
    }
    case '$gt': {
      return Some(new DateGreaterThan(filter.path, DateFieldValue.fromString(filter.value as string)))
    }
    case '$gte': {
      return Some(new DateGreaterThanOrEqual(filter.path, DateFieldValue.fromString(filter.value as string)))
    }
    case '$lt': {
      return Some(new DateLessThan(filter.path, DateFieldValue.fromString(filter.value as string)))
    }
    case '$lte': {
      return Some(new DateLessThanOrEqual(filter.path, DateFieldValue.fromString(filter.value as string)))
    }
    case '$between': {
      return Some(
        new DateBetween(
          filter.path,
          new Date((filter.value as [string, string])[0]),
          new Date((filter.value as [string, string])[1]),
        ),
      )
    }
    default:
      return None
  }
}

const convertTreeFilter = (filter: ITreeFilter): Option<RecordCompositeSpecification> => {
  switch (filter.operator) {
    case $is_root.value: {
      return Some(new IsTreeRoot(filter.path))
    }

    default: {
      return None
    }
  }
}

const convertAttachmentFilter = (filter: IAttachmentFilter): Option<RecordCompositeSpecification> => {
  switch (filter.operator) {
    case '$has_file_type':
      return Some(new HasFileType(filter.path, filter.value as IAttachmentFilterTypeValue))
    case '$is_empty':
      return Some(new IsAttachmentEmpty(filter.path, undefined))
    case '$is_not_empty':
      return Some(new IsAttachmentEmpty(filter.path, undefined).not())
    case '$has_file_extension':
      return Some(new HasExtension(filter.path, filter.value as string[]))
  }
}

const convertCollaboratorFilter = (
  filter: ICollaboratorFilter,
  userId: string,
): Option<RecordCompositeSpecification> => {
  return match(filter.operator)
    .returnType<Option<RecordCompositeSpecification>>()
    .with('$eq', () => Some(CollaboratorEqual.fromString(filter.path, filter.value as string)))
    .with('$neq', () => Some(CollaboratorEqual.fromString(filter.path, filter.value as string).not()))
    .with('$is_empty', () => Some(new CollaboratorIsEmpty(filter.path)))
    .with('$is_not_empty', () => Some(new CollaboratorIsEmpty(filter.path).not()))
    .with('$is_me', () => Some(CollaboratorEqual.fromString(filter.path, userId)))
    .with('$is_not_me', () => Some(CollaboratorEqual.fromString(filter.path, userId).not()))
    .exhaustive()
}

const convertUpdatedByFilter = (filter: IUpdatedByFilter, userId: string): Option<RecordCompositeSpecification> => {
  return match(filter)
    .returnType<Option<RecordCompositeSpecification>>()
    .with({ operator: '$eq' }, (filter) => Some(WithRecordUpdatedBy.fromString(filter.value as string)))
    .with({ operator: '$neq' }, (filter) => Some(WithRecordUpdatedBy.fromString(filter.value as string).not()))
    .with({ operator: '$is_me' }, (filter) => Some(WithRecordUpdatedBy.fromString(userId)))
    .with({ operator: '$is_not_me' }, (filter) => Some(WithRecordUpdatedBy.fromString(userId).not()))
    .with({ operator: '$in' }, (filter) => Some(new UdpatedByIn(filter.value as string[])))
    .with({ operator: '$nin' }, (filter) => Some(new UdpatedByIn(filter.value as string[]).not()))
    .exhaustive()
}

const convertCreatedByFilter = (filter: ICreatedByFilter, userId: string): Option<RecordCompositeSpecification> => {
  return match(filter)
    .returnType<Option<RecordCompositeSpecification>>()
    .with({ operator: '$eq' }, (filter) => Some(WithRecordCreatedBy.fromString(filter.value as string)))
    .with({ operator: '$neq' }, (filter) => Some(WithRecordCreatedBy.fromString(filter.value as string).not()))
    .with({ operator: '$is_me' }, (filter) => Some(WithRecordCreatedBy.fromString(userId)))
    .with({ operator: '$is_not_me' }, (filter) => Some(WithRecordCreatedBy.fromString(userId).not()))
    .with({ operator: '$in' }, (filter) => Some(new CreatedByIn(filter.value as string[])))
    .with({ operator: '$nin' }, (filter) => Some(new CreatedByIn(filter.value as string[]).not()))
    .exhaustive()
}

const convertMultiSelectFilter = (filter: IMultiSelectFilter): Option<RecordCompositeSpecification> => {
  switch (filter.operator) {
    case '$eq':
      return Some(MultiSelectEqual.fromStrings(filter.path, filter.value as string[]))
    case '$neq':
      return Some(MultiSelectEqual.fromStrings(filter.path, filter.value as string[]).not())
    case '$is_empty':
      return Some(new MultiSelectIsEmpty(filter.path))
    case '$is_not_empty':
      return Some(new MultiSelectIsEmpty(filter.path).not())
    case '$in':
      return Some(MultiSelectIn.fromStrings(filter.path, filter.value as string[]))
    case '$nin':
      return Some(MultiSelectIn.fromStrings(filter.path, filter.value as string[]).not())

    default:
      return None
  }
}

const convertFilter = (
  filter: IFilter,
  userId: string,
  validFieldIds: Option<string[]>,
): Option<RecordCompositeSpecification> => {
  if (validFieldIds.isSome() && !validFieldIds.unwrap().includes(filter.path)) {
    return None
  }
  return match(filter)
    .returnType<Option<RecordCompositeSpecification>>()
    .with({ type: 'id' }, (filter) => convertIdFilter(filter))
    .with({ type: 'string' }, { type: 'email' }, { type: 'url' }, { type: 'color' }, (filter) =>
      convertStringFilter(filter),
    )
    .with({ type: 'json' }, (filter) => convertJsonFilter(filter))
    .with(
      { type: 'number' },
      { type: 'rating' },
      { type: 'currency' },
      { type: 'auto-increment' },
      { type: 'count' },
      { type: 'sum' },
      { type: 'average' },
      { type: 'min' },
      { type: 'max' },
      (filter) => convertNumberFilter(filter),
    )
    .with({ type: 'collaborator' }, (filter) => convertCollaboratorFilter(filter, userId))
    .with({ type: 'created-by' }, (filter) => convertCreatedByFilter(filter, userId))
    .with({ type: 'updated-by' }, (filter) => convertUpdatedByFilter(filter, userId))
    .with({ type: 'date' }, { type: 'created-at' }, { type: 'updated-at' }, (filter) => convertDateFilter(filter))
    .with({ type: 'date-range' }, (filter) => convertDateRangeFilter(filter))
    .with({ type: 'select' }, (filter) => convertSelectFilter(filter))
    .with({ type: 'multi-select' }, (filter) => convertMultiSelectFilter(filter))
    .with({ type: 'bool' }, (filter) => convertBoolFilter(filter))
    .with({ type: 'reference' }, (filter) => {
      throw new Error('convertFilter.reference not implemented')
    })
    .with({ type: 'tree' }, (filter) => convertTreeFilter(filter))
    .with({ type: 'attachment' }, (filter) => convertAttachmentFilter(filter))
    .otherwise(() => None)
}

const convertFilterOrGroup = (
  filterOrGroup: IFilterOrGroup,
  userId: string,
  validFieldIds: Option<string[]>,
): Option<RecordCompositeSpecification> => {
  if (isGroup(filterOrGroup)) {
    return convertFilterOrGroupList(filterOrGroup.children, userId, validFieldIds, filterOrGroup.conjunction)
  } else if (isFilter(filterOrGroup)) {
    return convertFilter(filterOrGroup, userId, validFieldIds)
  }

  return None
}

const convertFilterOrGroupList = (
  filterOrGroupList: IFilterOrGroupList = [],
  userId: string,
  validFieldIds: Option<string[]>,
  conjunction: IConjunction = '$and',
): Option<RecordCompositeSpecification> => {
  let spec: Option<RecordCompositeSpecification> = None
  for (const filter of filterOrGroupList) {
    if (spec.isNone()) {
      spec = convertFilterOrGroup(filter, userId, validFieldIds)
      if (conjunction === '$not') {
        return spec.map((s) => s.not())
      }
    } else {
      if (isFilter(filter)) {
        if (validFieldIds.isSome() && !validFieldIds.unwrap().includes(filter.path)) {
          spec = None
        } else {
          spec = spec.map((left) => {
            const right = convertFilterOrGroup(filter, userId, validFieldIds)
            if (right.isSome()) {
              if (conjunction === '$and') {
                return left.and(right.unwrap())
              } else if (conjunction === '$or') {
                return left.or(right.unwrap())
              }
              return left.and(right.unwrap().not())
            }
            return left
          })
        }
      } else if (isGroup(filter)) {
        spec = convertFilterOrGroupList(filter.children, userId, validFieldIds, filter.conjunction)
      }
    }
  }

  return spec
}

export const convertFilterSpec = (
  filter: IRootFilter,
  userId: string,
  validFieldIds: Option<string[]> = None,
): Option<RecordCompositeSpecification> => {
  if (Array.isArray(filter)) {
    return convertFilterOrGroupList(filter, userId, validFieldIds)
  }

  return convertFilterOrGroup(filter, userId, validFieldIds)
}

export const isEmptyFilter = (filter: IRootFilter) => isEmpty(filter)
