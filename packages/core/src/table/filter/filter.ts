import type { CompositeSpecification } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
import { colorFieldValue } from '../field/color-field.type.js'
import { DateFieldValue, NumberFieldValue, SelectFieldValue, StringFieldValue } from '../field/index.js'
import type { ISelectFieldValue } from '../field/select-field.type.js'
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
  DateRangeEqual,
  HasExtension,
  HasFileType,
  IsAttachmentEmpty,
  IsTreeRoot,
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
import type { IAttachmentFilter, IAttachmentFilterTypeValue } from './attachment.filter.js'
import { attachmentFilter, attachmentFilterValue } from './attachment.filter.js'
import type { IAutoIncrementFilter } from './auto-increment.filter.js'
import { autoIncrementFilter, autoIncrementFilterValue } from './auto-increment.filter.js'
import type { IAverageFilter } from './average.filter.js'
import { averageFilter, averageFilterValue } from './average.filter.js'
import type { IBoolFilter } from './bool.filter.js'
import { boolFilter, boolFilterValue } from './bool.filter.js'
import type { ICollaboratorFilter } from './collaborator.filter.js'
import { collaboratorFilter, collaboratorFilterValue } from './collaborator.filter.js'
import type { IColorFilter } from './color.filter.js'
import { colorFilter } from './color.filter.js'
import type { IConjunction } from './conjunction.js'
import { conjunctions } from './conjunction.js'
import type { ICountFilter } from './count.filter.js'
import { countFilter, countFilterValue } from './count.filter.js'
import type { ICreatedAtFilter } from './created-at.filter.js'
import { createdAtFilter, createdAtFilterValue } from './created-at.filter.js'
import type { ICreatedByFilter } from './created-by.filter.js'
import { createdByFilter, createdByFilterValue } from './created-by.filter.js'
import type { ICurrencyFilter } from './currency.filter.js'
import { currencyFilter, currencyFilterValue } from './currency.filter.js'
import type { IDateRangeFilter } from './date-range.filter.js'
import { dateRangeFilter, dateRangeFilterValue } from './date-range.filter.js'
import type { IDateFilter } from './date.filter.js'
import { dateFilter, dateFilterValue } from './date.filter.js'
import type { IEmailFilter } from './email.filter.js'
import { emailFilter, emailFilterValue } from './email.filter.js'
import type { IIdFilter } from './id.filter.js'
import { idFilter, idFilterValue } from './id.filter.js'
import type { IJsonFilter } from './json.filter.js'
import { jsonFilter, jsonFilterValue } from './json.filter.js'
import { lookupFilter, lookupFilterValue } from './lookup.filter.js'
import type { IMultiSelectFilter } from './multi-select.filter.js'
import { multiSelectFilter, multiSelectFilterValue } from './multi-select.filter.js'
import type { INumberFilter } from './number.filter.js'
import { numberFilter, numberFilterValue } from './number.filter.js'
import {
  $between,
  $eq,
  $is_empty,
  $is_false,
  $is_not_empty,
  $is_root,
  $is_today,
  $is_true,
  $neq,
  attachmentFilterOperators,
  autoIncrementFilterOperators,
  averageFilterOperators,
  boolFilterOperators,
  collaboratorFilterOperators,
  colorFilterOperators,
  countFilterOperators,
  createdAtFilterOperators,
  createdByFilterOperators,
  currencyFilterOperators,
  dateFilterOperators,
  dateRangeFilterOperators,
  emailFilterOperators,
  idFilterOperators,
  jsonFilterOperators,
  lookupFilterOperators,
  multiSelectFilterOperators,
  numberFilterOperators,
  parentFilterOperators,
  ratingFilterOperators,
  referenceFilterOperators,
  selectFilterOperators,
  stringFilterOperators,
  sumFilterOperators,
  treeFilterOperators,
  updatedAtFilterOperators,
  updatedByFilterOperators,
} from './operators.js'
import { parentFilter, parentFilterValue } from './parent.filter.js'
import type { IRatingFilter } from './rating.filter.js'
import { ratingFilter, ratingFilterValue } from './rating.filter.js'
import { referenceFilter, referenceFilterValue } from './reference.filter.js'
import type { ISelectFilter } from './select.filter.js'
import { selectFilter, selectFilterValue } from './select.filter.js'
import type { IStringFilter } from './string.filter.js'
import { stringFilter, stringFilterValue } from './string.filter.js'
import type { ISumFilter } from './sum.filter.js'
import { sumFilter, sumFilterValue } from './sum.filter.js'
import type { ITreeFilter } from './tree.filter.js'
import { treeFilter, treeFilterValue } from './tree.filter.js'
import type { IUpdatedAtFilter } from './updated-at.filter.js'
import { updatedAtFilter, updatedAtFilterValue } from './updated-at.filter.js'
import type { IUpdatedByFilter } from './updated-by.filter.js'
import { updatedByFilter, updatedByFilterValue } from './updated-by.filter.js'

export const filterValue = z.union([
  idFilterValue,
  createdAtFilterValue,
  updatedAtFilterValue,
  autoIncrementFilterValue,
  stringFilterValue,
  emailFilterValue,
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
])
export type IFilterValue = z.infer<typeof filterValue>

export const operaotrs = z.union([
  idFilterOperators,
  createdAtFilterOperators,
  updatedAtFilterOperators,
  autoIncrementFilterOperators,
  stringFilterOperators,
  emailFilterOperators,
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
])
export type IOperator = z.infer<typeof operaotrs>

const filter = z.discriminatedUnion('type', [
  idFilter,
  createdAtFilter,
  updatedAtFilter,
  autoIncrementFilter,
  stringFilter,
  emailFilter,
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

const convertStringFilter = (filter: IStringFilter | IEmailFilter | IColorFilter): Option<CompositeSpecification> => {
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
    | ICurrencyFilter,
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
      throw new Error('TODO')
      return None
    }
    case $is_not_empty.value: {
      throw new Error('TODO')
      return None
    }

    default: {
      return None
    }
  }
}
const convertDateRangeFilter = (filter: IDateRangeFilter): Option<CompositeSpecification> => {
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
