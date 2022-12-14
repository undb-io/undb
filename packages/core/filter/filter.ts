import type { CompositeSpecification } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { z } from 'zod'
import { NumberEqual, StringContain, StringEndsWith, StringEqual, StringStartsWith } from '../record'

const $eq = z.literal('$eq')
const $neq = z.literal('$neq')
const $contains = z.literal('$contains')
const $starts_with = z.literal('$starts_with')
const $ends_with = z.literal('$ends_with')
const $regex = z.literal('$regex')

const baseFilter = z.object({
  path: z.string().min(1),
})

const stringFilterOperators = z.union([$eq, $neq, $contains, $starts_with, $ends_with, $regex])
const stringFilter = z
  .object({
    type: z.literal('string'),
    operator: stringFilterOperators,
    value: z.string().nullable(),
  })
  .merge(baseFilter)

export type IStringFilter = z.infer<typeof stringFilter>
export type IStringFilterOperator = z.infer<typeof stringFilterOperators>

const numberFilterOperators = z.union([$eq, $neq])
const numberFilter = z
  .object({
    type: z.literal('number'),
    operator: numberFilterOperators,
    value: z.number().nullable(),
  })
  .merge(baseFilter)
export type INumberFilter = z.infer<typeof numberFilter>
export type INumberFilterOperator = z.infer<typeof numberFilterOperators>

export const operaotrs = z.union([stringFilterOperators, numberFilterOperators])
export type IOperator = z.infer<typeof operaotrs>

const filter = z.discriminatedUnion('type', [stringFilter, numberFilter])

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
  return Object.hasOwn(filterOrGroup, 'type') && Object.hasOwn(filterOrGroup, 'value')
}

const convertFilter = (filter: IFilter): Option<CompositeSpecification> => {
  switch (filter.type) {
    case 'string':
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
    case 'number':
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
        default:
          return None
      }

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
