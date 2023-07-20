import type { CompositeSpecification } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
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
  DateBetween,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
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
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  SelectEqual,
  SelectIn,
  StringContain,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  WithRecordIds,
} from '../record/index.js'
import type { IConjunction } from './conjunction.js'
import { conjunctions } from './conjunction.js'
import { $between, $eq, $is_empty, $is_false, $is_not_empty, $is_root, $is_today, $is_true, $neq } from './operators.js'

export const filterValue = z.union([
  idFilterValue,
  createdAtFilterValue,
  updatedAtFilterValue,
  autoIncrementFilterValue,
  stringFilterValue,
  emailFilterValue,
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

const filter = z.discriminatedUnion('type', [
  idFilter,
  createdAtFilter,
  updatedAtFilter,
  autoIncrementFilter,
  stringFilter,
  emailFilter,
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

const convertIdFilter = (filter: IIdFilter): Option<CompositeSpecification> => {
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
): Option<CompositeSpecification> => {
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
): Option<CompositeSpecification> => {
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
    default:
      return None
  }
}

const convertSelectFilter = (filter: ISelectFilter): Option<CompositeSpecification> => {
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

    default: {
      return None
    }
  }
}

const convertBoolFilter = (filter: IBoolFilter): Option<CompositeSpecification> => {
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

const convertJsonFilter = (filter: IJsonFilter): Option<CompositeSpecification> => {
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
const convertDateRangeFilter = (filter: IDateRangeFilter): Option<CompositeSpecification> => {
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
): Option<CompositeSpecification> => {
  if (filter.operator === $is_today.value) {
    return Some(new DateIsToday(filter.path))
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

const convertTreeFilter = (filter: ITreeFilter): Option<CompositeSpecification> => {
  switch (filter.operator) {
    case $is_root.value: {
      return Some(new IsTreeRoot(filter.path))
    }

    default: {
      return None
    }
  }
}

const convertAttachmentFilter = (filter: IAttachmentFilter): Option<CompositeSpecification> => {
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
  filter: ICollaboratorFilter | ICreatedByFilter | IUpdatedByFilter,
): Option<CompositeSpecification> => {
  switch (filter.operator) {
    case '$eq':
      return Some(CollaboratorEqual.fromString(filter.path, filter.value as string))
    case '$neq':
      return Some(CollaboratorEqual.fromString(filter.path, filter.value as string).not())
    case '$is_empty':
      return Some(new CollaboratorIsEmpty(filter.path))
    case '$is_not_empty':
      return Some(new CollaboratorIsEmpty(filter.path).not())

    default:
      return None
  }
}

const convertMultiSelectFilter = (filter: IMultiSelectFilter): Option<CompositeSpecification> => {
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

const convertFilter = (filter: IFilter): Option<CompositeSpecification> => {
  switch (filter.type) {
    case 'id':
      return convertIdFilter(filter)
    case 'string':
    case 'email':
    case 'url':
    case 'color':
      return convertStringFilter(filter)
    case 'json':
      return convertJsonFilter(filter)
    case 'number':
    case 'rating':
    case 'currency':
    case 'auto-increment':
    case 'count':
    case 'sum':
    case 'average':
    case 'min':
    case 'max':
      return convertNumberFilter(filter)
    case 'collaborator':
    case 'created-by':
    case 'updated-by':
      return convertCollaboratorFilter(filter)
    case 'date':
    case 'created-at':
    case 'updated-at':
      return convertDateFilter(filter)
    case 'date-range':
      return convertDateRangeFilter(filter)
    case 'select':
      return convertSelectFilter(filter)
    case 'multi-select':
      return convertMultiSelectFilter(filter)
    case 'bool':
      return convertBoolFilter(filter)
    case 'reference':
      throw new Error('convertFilter.reference not implemented')
    case 'tree':
      return convertTreeFilter(filter)
    case 'attachment':
      return convertAttachmentFilter(filter)
    default:
      return None
  }
}

const convertFilterOrGroup = (filterOrGroup: IFilterOrGroup): Option<CompositeSpecification> => {
  if (isGroup(filterOrGroup)) {
    return convertFilterOrGroupList(filterOrGroup.children, filterOrGroup.conjunction)
  } else if (isFilter(filterOrGroup)) {
    return convertFilter(filterOrGroup)
  }

  return None
}

const convertFilterOrGroupList = (
  filterOrGroupList: IFilterOrGroupList = [],
  conjunction: IConjunction = '$and',
): Option<CompositeSpecification> => {
  let spec: Option<CompositeSpecification> = None
  for (const filter of filterOrGroupList) {
    if (spec.isNone()) {
      spec = convertFilterOrGroup(filter)
      if (conjunction === '$not') {
        return spec.map((s) => s.not())
      }
    } else {
      if (isFilter(filter)) {
        spec = spec.map((left) => {
          const right = convertFilterOrGroup(filter)
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
      } else if (isGroup(filter)) {
        spec = convertFilterOrGroupList(filter.children, filter.conjunction)
      }
    }
  }

  return spec
}

export const convertFilterSpec = (filter: IRootFilter): Option<CompositeSpecification> => {
  if (Array.isArray(filter)) {
    return convertFilterOrGroupList(filter)
  }

  return convertFilterOrGroup(filter)
}
