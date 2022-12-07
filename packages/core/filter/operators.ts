import { z } from 'zod'
import type { INumberFieldValue } from '../field/number-field.type'
import { numberFieldValue } from '../field/number-field.type'
import type { ITextFieldValue } from '../field/text-field.type'
import { textFieldValue } from '../field/text-field.type'

export type Filter = RootOperator | Record<string, Operator>

export interface RootOperator {
  $and?: Filter[]
  $or?: Filter[]
}

type ComparableFieldValue = ITextFieldValue | INumberFieldValue
type LeafOperator = { $eq: ComparableFieldValue } | { $neq: ComparableFieldValue }
type NotOperator = { $not: ValueOperator }

type ValueOperator = ComparableFieldValue | LeafOperator
export type Operator = ValueOperator | NotOperator

const $comparableFieldValue = z.union([textFieldValue, numberFieldValue])

const $eq = z.object({ $eq: $comparableFieldValue })
const $neq = z.object({ $neq: $comparableFieldValue })

export const $filterOperator = z.union([$eq, $neq])

const $not = z.lazy(() => z.object({ $not: $filterOperator.or($comparableFieldValue) }))

export const $filter: z.ZodType<Filter> = z.lazy(() =>
  z.union([z.record($comparableFieldValue.or($filterOperator).or($not)), $rootOperator]),
)

const $filters = z.array($filter).optional()
const $rootOperator = z.object({
  $and: $filters,
  $or: $filters,
})
