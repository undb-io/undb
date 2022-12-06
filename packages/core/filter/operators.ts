import { z } from 'zod'
import type { INumberFieldValue } from '../field/number-field.type'
import { numberFieldValue } from '../field/number-field.type'
import type { ITextFieldValue } from '../field/text-field.type'
import { textFieldValue } from '../field/text-field.type'

type Filter<TSchema extends Record<string, ComparableFieldValue> = Record<string, ComparableFieldValue>> =
  | RootOperator
  | TSchema
  | Record<string, Operator>

export interface RootOperator {
  $and?: Filter[]
  $or?: Filter[]
}

type ComparableFieldValue = ITextFieldValue | INumberFieldValue

type FieldOperator = {
  $eq?: ComparableFieldValue
  $neq?: ComparableFieldValue
}

export type Operator = ComparableFieldValue | FieldOperator

const $comparableFieldValue: z.ZodOptional<z.ZodType<ComparableFieldValue>> = z
  .union([textFieldValue, numberFieldValue])
  .optional()

export const $fieldOperator: z.ZodType<FieldOperator> = z.object({
  $eq: $comparableFieldValue,
  $neq: $comparableFieldValue,
})

export const $filter: z.ZodType<Filter> = z.lazy(() =>
  z.union([$rootOperator, z.record(z.union([$comparableFieldValue, $fieldOperator]))]),
)
export type IFilter = z.infer<typeof $filter>

const $filters = z.array($filter).optional()
const $rootOperator: z.ZodType<RootOperator> = z.object({
  $and: $filters,
  $or: $filters,
})
