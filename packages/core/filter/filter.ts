import { z } from 'zod'
import { fieldNameSchema } from '../field'

const $eq = z.literal('$eq')
const $neq = z.literal('$neq')

const baseFilter = z.object({
  path: fieldNameSchema.or(z.tuple([fieldNameSchema, z.string().array().nonempty()])),
})

const stringFilterOperators = z.union([$eq, $neq])
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
type IConjunction = z.infer<typeof conjunctions>

export type IFilter = z.infer<typeof filter>
export type IFilters = IFilter[]

export interface IGroup {
  conjection: IConjunction
  children: Array<IFilter | IGroup>
}

const group: z.ZodType<IGroup> = z.lazy(() =>
  z.object({
    conjection: conjunctions,
    children: z.union([group, filter]).array().nonempty(),
  }),
)

const filterOrGroup = filter.or(group)
export type IFilterOrGroup = z.infer<typeof filterOrGroup>

export const rootFilterList = filterOrGroup.array()
export type IRootFilterList = z.infer<typeof rootFilterList>
export const rootFilter = z.union([filterOrGroup, rootFilterList])
export type IRootFilter = z.infer<typeof rootFilter>
