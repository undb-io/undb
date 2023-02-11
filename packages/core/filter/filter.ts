import type { CompositeSpecification } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
import { DateFieldValue, NumberFieldValue, SelectFieldValue, StringFieldValue } from '../field'
import { colorFieldValue } from '../field/color-field.type'
import type { ISelectFieldValue } from '../field/select-field.type'
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
  StringStartsWith,
} from '../record'
import type { IAutoIncrementFilter } from './auto-increment.filter'
import { autoIncrementFilter, autoIncrementFilterValue } from './auto-increment.filter'
import type { IBoolFilter } from './bool.filter'
import { boolFilter, boolFilterValue } from './bool.filter'
import { colorFilter } from './color.filter'
import type { IConjunction } from './conjunction'
import { conjunctions } from './conjunction'
import type { ICreatedAtFilter } from './created-at.filter'
import { createdAtFilter, createdAtFilterValue } from './created-at.filter'
import type { IDateRangeFilter } from './date-range.filter'
import { dateRangeFilter, dateRangeFilterValue } from './date-range.filter'
import type { IDateFilter } from './date.filter'
import { dateFilter, dateFilterValue } from './date.filter'
import { emailFilter, emailFilterValue } from './email.filter'
import { idFilter, idFilterValue } from './id.filter'
import type { INumberFilter } from './number.filter'
import { numberFilter, numberFilterValue } from './number.filter'
import {
  $eq,
  $is_false,
  $is_root,
  $is_today,
  $is_true,
  $neq,
  autoIncrementFilterOperators,
  boolFilterOperators,
  colorFilterOperators,
  createdAtFilterOperators,
  dateFilterOperators,
  dateRangeFilterOperators,
  emailFilterOperators,
  idFilterOperators,
  numberFilterOperators,
  parentFilterOperators,
  ratingFilterOperators,
  referenceFilterOperators,
  selectFilterOperators,
  stringFilterOperators,
  treeFilterOperators,
  updatedAtFilterOperators,
} from './operators'
import { parentFilter, parentFilterValue } from './parent.filter'
import type { IRatingFilter } from './rating.filter'
import { ratingFilter, ratingFilterValue } from './rating.filter'
import { referenceFilter, referenceFilterValue } from './reference.filter'
import type { ISelectFilter } from './select.filter'
import { selectFilter, selectFilterValue } from './select.filter'
import type { IStringFilter } from './string.filter'
import { stringFilter, stringFilterValue } from './string.filter'
import type { ITreeFilter } from './tree.filter'
import { treeFilter, treeFilterValue } from './tree.filter'
import type { IUpdatedAtFilter } from './updated-at.filter'
import { updatedAtFilter, updatedAtFilterValue } from './updated-at.filter'

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
])

export type IFilter = z.infer<typeof filter>
export type IFilters = IFilter[]

export interface IGroup {
  conjunction: IConjunction
  children: IFilterOrGroupList
}

const group: z.ZodType<IGroup> = z.lazy(() =>
  z.object({
    conjunction: conjunctions,
    children: z.union([group, filter]).array().nonempty(),
  }),
)

const filterOrGroup = filter.or(group)
export type IFilterOrGroup = z.infer<typeof filterOrGroup>

export const filterOrGroupList = filterOrGroup.array()
export type IFilterOrGroupList = z.infer<typeof filterOrGroupList>
export const rootFilter = z.union([filterOrGroup, filterOrGroupList])
export type IRootFilter = z.infer<typeof rootFilter>

const isGroup = (filterOrGroup: IFilterOrGroup): filterOrGroup is IGroup => {
  return Object.hasOwn(filterOrGroup, 'conjunction')
}

const isFilter = (filterOrGroup: IFilterOrGroup): filterOrGroup is IFilter => {
  return Object.hasOwn(filterOrGroup, 'type') && Object.hasOwn(filterOrGroup, 'operator')
}

const convertStringFilter = (filter: IStringFilter): Option<CompositeSpecification> => {
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

    default:
      return None
  }
}

const convertNumberFilter = (
  filter: INumberFilter | IAutoIncrementFilter | IRatingFilter,
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
      return Some(DateRangeEqual.from(filter.path, filter.value))
    case $neq.value:
      return Some(DateRangeEqual.from(filter.path, filter.value).not())

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
      return Some(new DateEqual(filter.path, new DateFieldValue(filter.value)))
    }
    case '$neq': {
      return Some(new DateEqual(filter.path, new DateFieldValue(filter.value)).not())
    }
    case '$gt': {
      return Some(new DateGreaterThan(filter.path, new DateFieldValue(filter.value)))
    }
    case '$gte': {
      return Some(new DateGreaterThanOrEqual(filter.path, new DateFieldValue(filter.value)))
    }
    case '$lt': {
      return Some(new DateLessThan(filter.path, new DateFieldValue(filter.value)))
    }
    case '$lte': {
      return Some(new DateLessThanOrEqual(filter.path, new DateFieldValue(filter.value)))
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
    case 'string':
      return convertStringFilter(filter)
    case 'number':
    case 'rating':
    case 'auto-increment':
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
  filterOrGroupList: IFilterOrGroupList,
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
