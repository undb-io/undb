import type { CompositeSpecification } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
import type { ISelectFieldValue } from '../field/select-field.type'
import { selectFieldValue } from '../field/select-field.type'
import {
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
import {
  $is_today,
  dateFilterOperators,
  numberFilterOperators,
  selectFilterOperators,
  stringFilterOperators,
} from './operators'

const baseFilter = z.object({
  path: z.string().min(1),
})

export const stringFilterValue = z.string().nullable()
const stringFilter = z
  .object({
    type: z.literal('string'),
    operator: stringFilterOperators,
    value: stringFilterValue,
  })
  .merge(baseFilter)

export type IStringFilter = z.infer<typeof stringFilter>
export type IStringFilterOperator = z.infer<typeof stringFilterOperators>

export const numberFilterValue = z.number().nullable()
const numberFilter = z
  .object({
    type: z.literal('number'),
    operator: numberFilterOperators,
    value: numberFilterValue,
  })
  .merge(baseFilter)
export type INumberFilter = z.infer<typeof numberFilter>
export type INumberFilterOperator = z.infer<typeof numberFilterOperators>

export const dateFilterValue = z.date().nullable().optional()
const dateFilter = z
  .object({
    type: z.literal('date'),
    operator: dateFilterOperators,
    value: dateFilterValue,
  })
  .merge(baseFilter)
export type IDateFilter = z.infer<typeof dateFilter>

export const selectFilterValue = selectFieldValue.or(selectFieldValue.array()).nullable()
export type ISelectFilterValue = z.infer<typeof selectFieldValue>
const selectFilter = z
  .object({
    type: z.literal('select'),
    operator: selectFilterOperators,
    value: selectFilterValue,
  })
  .merge(baseFilter)

export type ISelectFilter = z.infer<typeof selectFilter>

export const filterValue = z.union([stringFilterValue, numberFilterValue, dateFilterValue, selectFilterValue])
export type IFilterValue = z.infer<typeof filterValue>

export const operaotrs = z.union([
  stringFilterOperators,
  numberFilterOperators,
  dateFilterOperators,
  selectFilterOperators,
])
export type IOperator = z.infer<typeof operaotrs>

const filter = z.discriminatedUnion('type', [stringFilter, numberFilter, dateFilter, selectFilter])

const $and = z.literal('$and')
const $or = z.literal('$or')
const $not = z.literal('$not')

const conjunctions = z.union([$and, $or, $not])
export type IConjunction = z.infer<typeof conjunctions>

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
