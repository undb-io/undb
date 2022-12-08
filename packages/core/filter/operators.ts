import { z } from 'zod'
import type { INumberFieldValue } from '../field/number-field.type'
import { numberFieldValue } from '../field/number-field.type'
import type { ITextFieldValue } from '../field/text-field.type'
import { textFieldValue } from '../field/text-field.type'

export type IFilter = RootOperator | Record<string, Operator>

export interface RootOperator {
  $and?: IFilter[]
  $or?: IFilter[]
}

type ComparableFieldValue = ITextFieldValue | INumberFieldValue
type LeafOperator = { $eq: ComparableFieldValue } | { $neq: ComparableFieldValue }
type NotOperator = { $not: ValueOperator }

type ValueOperator = ComparableFieldValue | LeafOperator
export type Operator = ValueOperator | NotOperator

const $comparableFieldValue = z.union([textFieldValue, numberFieldValue])

const $eq = z.object({ $eq: $comparableFieldValue }).strict()
const $neq = z.object({ $neq: $comparableFieldValue }).strict()

export const $filterOperator = z.union([$eq, $neq])

const $not = z.lazy(() => z.object({ $not: $filterOperator.or($comparableFieldValue) }).strict())

export const $filter: z.ZodType<IFilter> = z.lazy(() =>
  z.union([z.record($comparableFieldValue.or($filterOperator).or($not)), $rootOperator]),
)

const $filters = z.array($filter).optional()
const $rootOperator = z
  .object({
    $and: $filters,
    $or: $filters,
  })
  .strict()

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IOperator {
  export type Eq = z.infer<typeof $eq>
  export type Neq = z.infer<typeof $neq>
  export type Not = z.infer<typeof $not>
}
