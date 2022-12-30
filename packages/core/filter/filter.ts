import type { CompositeSpecification } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
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
import type { IBoolFilter } from './bool.filter'
import { boolFilter, boolFilterValue } from './bool.filter'
import type { IConjunction } from './conjunction'
import { conjunctions } from './conjunction'
import type { IDateFilter } from './date.filter'
import { dateFilter, dateFilterValue } from './date.filter'
import type { INumberFilter } from './number.filter'
import { numberFilter, numberFilterValue } from './number.filter'
import {
  $is_false,
  $is_today,
  $is_true,
  boolFilterOperators,
  dateFilterOperators,
  numberFilterOperators,
  selectFilterOperators,
  stringFilterOperators,
} from './operators'
import type { ISelectFilter } from './select.filter'
import { selectFilter, selectFilterValue } from './select.filter'
import type { IStringFilter } from './string.filter'
import { stringFilter, stringFilterValue } from './string.filter'

export const filterValue = z.union([
  stringFilterValue,
  numberFilterValue,
  dateFilterValue,
  selectFilterValue,
  boolFilterValue,
])
export type IFilterValue = z.infer<typeof filterValue>

export const operaotrs = z.union([
  stringFilterOperators,
  numberFilterOperators,
  dateFilterOperators,
  selectFilterOperators,
  boolFilterOperators,
])
export type IOperator = z.infer<typeof operaotrs>

const filter = z.discriminatedUnion('type', [stringFilter, numberFilter, dateFilter, selectFilter, boolFilter])

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
  if (!filter.value) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new StringEqual(filter.path, filter.value))
    }
    case '$neq': {
      return Some(new StringEqual(filter.path, filter.value).not())
    }
    case '$contains': {
      return Some(new StringContain(filter.path, filter.value))
    }
    case '$starts_with': {
      return Some(new StringStartsWith(filter.path, filter.value))
    }
    case '$ends_with': {
      return Some(new StringEndsWith(filter.path, filter.value))
    }

    default:
      return None
  }
}

const convertNumberFilter = (filter: INumberFilter): Option<CompositeSpecification> => {
  if (!filter.value) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new NumberEqual(filter.path, filter.value))
    }
    case '$neq': {
      return Some(new NumberEqual(filter.path, filter.value).not())
    }
    case '$gt': {
      return Some(new NumberGreaterThan(filter.path, filter.value))
    }
    case '$gte': {
      return Some(new NumberGreaterThanOrEqual(filter.path, filter.value))
    }
    case '$lt': {
      return Some(new NumberLessThan(filter.path, filter.value))
    }
    case '$lte': {
      return Some(new NumberLessThanOrEqual(filter.path, filter.value))
    }
    default:
      return None
  }
}

const convertSelectFilter = (filter: ISelectFilter): Option<CompositeSpecification> => {
  if (!filter.value) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new SelectEqual(filter.path, filter.value as ISelectFieldValue))
    }
    case '$neq': {
      return Some(new SelectEqual(filter.path, filter.value as ISelectFieldValue).not())
    }
    case '$in': {
      return Some(new SelectIn(filter.path, filter.value as ISelectFieldValue[]))
    }
    case '$nin': {
      return Some(new SelectIn(filter.path, filter.value as ISelectFieldValue[]).not())
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

const convertDateFilter = (filter: IDateFilter): Option<CompositeSpecification> => {
  if (filter.operator === $is_today.value) {
    return Some(new DateIsToday(filter.path))
  }

  if (!filter.value) {
    return None
  }

  switch (filter.operator) {
    case '$eq': {
      return Some(new DateEqual(filter.path, filter.value))
    }
    case '$neq': {
      return Some(new DateEqual(filter.path, filter.value).not())
    }
    case '$gt': {
      return Some(new DateGreaterThan(filter.path, filter.value))
    }
    case '$gte': {
      return Some(new DateGreaterThanOrEqual(filter.path, filter.value))
    }
    case '$lt': {
      return Some(new DateLessThan(filter.path, filter.value))
    }
    case '$lte': {
      return Some(new DateLessThanOrEqual(filter.path, filter.value))
    }
    default:
      return None
  }
}

const convertFilter = (filter: IFilter): Option<CompositeSpecification> => {
  switch (filter.type) {
    case 'string':
      return convertStringFilter(filter)
    case 'number':
      return convertNumberFilter(filter)
    case 'date':
      return convertDateFilter(filter)
    case 'select':
      return convertSelectFilter(filter)
    case 'bool':
      return convertBoolFilter(filter)
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
