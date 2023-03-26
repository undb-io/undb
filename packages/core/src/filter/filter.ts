import type { CompositeSpecification } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
import { colorFieldValue } from '../field/color-field.type.js'
import { DateFieldValue, NumberFieldValue, SelectFieldValue, StringFieldValue } from '../field/index.js'
import type { ISelectFieldValue } from '../field/select-field.type.js'
import {
  BoolIsFalse,
  BoolIsTrue,
  DateEqual,
  DateGreaterThan,
  DateGreaterThanOrEqual,
  DateIsToday,
  DateLessThan,
  DateLessThanOrEqual,
  DateRangeEqual,
  IsTreeRoot,
  NumberEqual,
  NumberGreaterThan,
  NumberGreaterThanOrEqual,
  NumberLessThan,
  NumberLessThanOrEqual,
  SelectEqual,
  SelectIn,
  StringContain,
  StringEndsWith,
  StringEqual,
  StringRegex,
  StringStartsWith,
  WithRecordIds,
} from '../record/index.js'
import type { IAutoIncrementFilter } from './auto-increment.filter.js'
import { autoIncrementFilter, autoIncrementFilterValue } from './auto-increment.filter.js'
import type { IAverageFilter } from './average.filter.js'
import { averageFilter, averageFilterValue } from './average.filter.js'
import type { IBoolFilter } from './bool.filter.js'
import { boolFilter, boolFilterValue } from './bool.filter.js'
import type { IColorFilter } from './color.filter.js'
import { colorFilter } from './color.filter.js'
import type { IConjunction } from './conjunction.js'
import { conjunctions } from './conjunction.js'
import type { ICountFilter } from './count.filter.js'
import { countFilter, countFilterValue } from './count.filter.js'
import type { ICreatedAtFilter } from './created-at.filter.js'
import { createdAtFilter, createdAtFilterValue } from './created-at.filter.js'
import type { IDateRangeFilter } from './date-range.filter.js'
import { dateRangeFilter, dateRangeFilterValue } from './date-range.filter.js'
import type { IDateFilter } from './date.filter.js'
import { dateFilter, dateFilterValue } from './date.filter.js'
import type { IEmailFilter } from './email.filter.js'
import { emailFilter, emailFilterValue } from './email.filter.js'
import type { IIdFilter } from './id.filter.js'
import { idFilter, idFilterValue } from './id.filter.js'
import { lookupFilter, lookupFilterValue } from './lookup.filter.js'
import type { INumberFilter } from './number.filter.js'
import { numberFilter, numberFilterValue } from './number.filter.js'
import {
  $eq,
  $is_false,
  $is_root,
  $is_today,
  $is_true,
  $neq,
  autoIncrementFilterOperators,
  averageFilterOperators,
  boolFilterOperators,
  colorFilterOperators,
  countFilterOperators,
  createdAtFilterOperators,
  dateFilterOperators,
  dateRangeFilterOperators,
  emailFilterOperators,
  idFilterOperators,
  lookupFilterOperators,
  numberFilterOperators,
  parentFilterOperators,
  ratingFilterOperators,
  referenceFilterOperators,
  selectFilterOperators,
  stringFilterOperators,
  sumFilterOperators,
  treeFilterOperators,
  updatedAtFilterOperators,
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

export const filterValue = z.union([
  idFilterValue,
  createdAtFilterValue,
  updatedAtFilterValue,
  autoIncrementFilterValue,
  stringFilterValue,
  emailFilterValue,
  colorFieldValue,
  numberFilterValue,
  dateFilterValue,
  dateRangeFilterValue,
  selectFilterValue,
  boolFilterValue,
  referenceFilterValue,
  treeFilterValue,
  parentFilterValue,
  ratingFilterValue,
  countFilterValue,
  lookupFilterValue,
  sumFilterValue,
  averageFilterValue,
])
export type IFilterValue = z.infer<typeof filterValue>

export const operaotrs = z.union([
  idFilterOperators,
  createdAtFilterOperators,
  updatedAtFilterOperators,
  autoIncrementFilterOperators,
  stringFilterOperators,
  emailFilterOperators,
  colorFilterOperators,
  numberFilterOperators,
  dateFilterOperators,
  dateRangeFilterOperators,
  selectFilterOperators,
  boolFilterOperators,
  referenceFilterOperators,
  treeFilterOperators,
  parentFilterOperators,
  ratingFilterOperators,
  countFilterOperators,
  lookupFilterOperators,
  sumFilterOperators,
  averageFilterOperators,
])
export type IOperator = z.infer<typeof operaotrs>

const filter = z.discriminatedUnion('type', [
  idFilter,
  createdAtFilter,
  updatedAtFilter,
  autoIncrementFilter,
  stringFilter,
  emailFilter,
  colorFilter,
  numberFilter,
  dateFilter,
  dateRangeFilter,
  selectFilter,
  boolFilter,
  referenceFilter,
  treeFilter,
  parentFilter,
  ratingFilter,
  countFilter,
  lookupFilter,
  sumFilter,
  averageFilter,
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

const isGroup = (filterOrGroup: IFilterOrGroup): filterOrGroup is IGroup => {
  return Object.hasOwn(filterOrGroup, 'conjunction')
}

const isFilter = (filterOrGroup: IFilterOrGroup): filterOrGroup is IFilter => {
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

    default:
      return None
  }
}

const convertNumberFilter = (
  filter: INumberFilter | IAutoIncrementFilter | IRatingFilter | ICountFilter | ISumFilter | IAverageFilter,
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

const convertDateRangeFilter = (filter: IDateRangeFilter): Option<CompositeSpecification> => {
  switch (filter.operator) {
    case $eq.value:
      return Some(DateRangeEqual.fromString(filter.path, filter.value))
    case $neq.value:
      return Some(DateRangeEqual.fromString(filter.path, filter.value).not())

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
      return Some(new DateEqual(filter.path, DateFieldValue.fromString(filter.value as string)))
    }
    case '$neq': {
      return Some(new DateEqual(filter.path, DateFieldValue.fromString(filter.value as string)).not())
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

const convertFilter = (filter: IFilter): Option<CompositeSpecification> => {
  switch (filter.type) {
    case 'id':
      return convertIdFilter(filter)
    case 'string':
    case 'email':
    case 'color':
      return convertStringFilter(filter)
    case 'number':
    case 'rating':
    case 'auto-increment':
    case 'count':
    case 'sum':
    case 'average':
      return convertNumberFilter(filter)
    case 'date':
    case 'created-at':
    case 'updated-at':
      return convertDateFilter(filter)
    case 'date-range':
      return convertDateRangeFilter(filter)
    case 'select':
      return convertSelectFilter(filter)
    case 'bool':
      return convertBoolFilter(filter)
    case 'reference':
      throw new Error('convertFilter.reference not implemented')
    case 'tree':
      return convertTreeFilter(filter)
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
