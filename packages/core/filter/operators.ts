import { z } from 'zod'
import type { INumberFieldValue } from '../field/number-field.type'
import { numberFieldValue } from '../field/number-field.type'
import type { ITextFieldValue } from '../field/text-field.type'
import { textFieldValue } from '../field/text-field.type'

export type IRecordOperator = Record<string, Operator>
export type IFilter = IRootOperator | IRecordOperator
export type IFilters = IFilter[]

export type IRootOperator = {
  $and?: IFilter[]
  $or?: IFilter[]
}

export type ComparableFieldValue = ITextFieldValue | INumberFieldValue | null
export type LeafOperator = { $eq: ComparableFieldValue } | { $neq: ComparableFieldValue }
export type NotOperator = { $not: ValueOperator }

export type ValueOperator = ComparableFieldValue | LeafOperator
export type Operator = ValueOperator | NotOperator

const $comparableFieldValue = z.union([textFieldValue, numberFieldValue])

const $eq = z.object({ $eq: $comparableFieldValue }).strict()
const $neq = z.object({ $neq: $comparableFieldValue }).strict()

export const $stringFilterOperator = z.union([$eq, $neq])
export type IStringFilterOperator = z.infer<typeof $stringFilterOperator>

export const $filterOperator = z.union([$eq, $neq])
const $mergedLeafOperators = $eq.merge($neq).partial()
export type IMergedLeafOperators = z.infer<typeof $mergedLeafOperators>

const $not = z.lazy(() => z.object({ $not: $filterOperator.or($comparableFieldValue) }).strict())

export const $filter: z.ZodType<IFilter> = z.lazy(() =>
  z.union([z.record($comparableFieldValue.or($filterOperator).or($not)), $rootOperator]),
)

export const $filters = z.array($filter).optional()
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
  export type LeafOperator = keyof IMergedLeafOperators
  export type LeafOperators = LeafOperator[]
}
