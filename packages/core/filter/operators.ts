import { z } from 'zod'
import type { INumberFieldValue } from '../field/number-field.type'
import { numberFieldValue } from '../field/number-field.type'
import type { ITextFieldValue } from '../field/text-field.type'
import { textFieldValue } from '../field/text-field.type'

export type Filter<TSchema extends Record<string, ComparableFieldValue> = Record<string, ComparableFieldValue>> =
  | RootOperator
  | TSchema
  | Record<string, Operator>

export interface RootOperator {
  $and?: Filter[]
  $or?: Filter[]
}

type ComparableFieldValue = ITextFieldValue | INumberFieldValue

type FilterOperator = { $eq?: ComparableFieldValue } | { $neq?: ComparableFieldValue }

export type Operator = ComparableFieldValue | FilterOperator | { $not?: FilterOperator }

const $comparableFieldValue = z.union([textFieldValue, numberFieldValue])

const $eq = z.object({ $eq: $comparableFieldValue })
const $neq = z.object({ $neq: $comparableFieldValue })

export const $filterOperator = z.union([$eq, $neq])

const $not = z.lazy(() => z.object({ $not: $filterOperator }))

export const $filter: z.ZodType<Filter> = z.lazy(() =>
  z.union([z.record($comparableFieldValue.or($filterOperator).or($not)), $rootOperator]),
)

const $filters = z.array($filter).optional()
const $rootOperator = z.object({
  $and: $filters,
  $or: $filters,
})
