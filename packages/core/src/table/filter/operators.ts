import { z } from 'zod'

export const $eq = z.literal('$eq')
export const $neq = z.literal('$neq')
export const $contains = z.literal('$contains')
export const $starts_with = z.literal('$starts_with')
export const $ends_with = z.literal('$ends_with')
export const $regex = z.literal('$regex')

export const $is_true = z.literal('$is_true')
export const $is_false = z.literal('$is_false')

export const $in = z.literal('$in')
export const $nin = z.literal('$nin')

export const $gt = z.literal('$gt')
export const $lt = z.literal('$lt')
export const $gte = z.literal('$gte')
export const $lte = z.literal('$lte')

export const $is_empty = z.literal('$is_empty')
export const $is_not_empty = z.literal('$is_not_empty')

export const $is_today = z.literal('$is_today')
export const $between = z.literal('$between')

export const $has_file_type = z.literal('$has_file_type')
export const $has_file_extension = z.literal('$has_file_extension')

export const idFilterOperators = z.union([$eq, $neq, $in, $nin])
export type IIdFilterOperator = z.infer<typeof idFilterOperators>

export const jsonFilterOperators = z.union([$is_empty, $is_not_empty])
export type IJsonFilterOperator = z.infer<typeof jsonFilterOperators>

export const colorFilterOperators = z.union([$is_empty, $is_not_empty, $eq, $neq])
export type IColorFilterOperator = z.infer<typeof colorFilterOperators>

export const numberFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])
export type INumberFilterOperator = z.infer<typeof numberFilterOperators>

export const ratingFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])
export type IRatingFilterOperator = z.infer<typeof ratingFilterOperators>

export const currencyFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])
export type ICurrencyFilterOperator = z.infer<typeof currencyFilterOperators>

export const countFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])
export type ICountFilterOperator = z.infer<typeof countFilterOperators>

export const sumFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])
export type ISumFilterOperator = z.infer<typeof sumFilterOperators>

export const boolFilterOperators = z.union([$is_true, $is_false])
export type IBoolFilterOperator = z.infer<typeof boolFilterOperators>

export const selectFilterOperators = z.union([$eq, $neq, $in, $nin])
export type ISelectFilterOperator = z.infer<typeof selectFilterOperators>

export const dateFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte, $between, $is_today])
export type IDateFilterOperator = z.infer<typeof dateFilterOperators>

/**
 * built in date operators
 */
export const dateBuiltInOperators = new Set<IDateFilterOperator>([$is_today.value])

export const isBuiltInDateOperator = (operator: IDateFilterOperator) => dateBuiltInOperators.has(operator)

export const referenceFilterOperators = z.union([$eq, $neq])
export type IReferenceFilterOperator = z.infer<typeof referenceFilterOperators>

export const collaboratorFilterOperators = z.union([$eq, $neq, $in, $nin, $is_empty, $is_not_empty])
export type ICollaboratorFilterOperator = z.infer<typeof collaboratorFilterOperators>

export const multiSelectFilterOperators = z.union([$eq, $neq, $in, $nin, $is_empty, $is_not_empty])
export type IMultiSelectFilterOperator = z.infer<typeof multiSelectFilterOperators>

export const lookupFilterOperators = z.union([$eq, $neq])
export type ILookupFilterOperator = z.infer<typeof lookupFilterOperators>

export const $is_root = z.literal('$is_root')

export const treeFilterOperators = z.union([$eq, $neq, $is_root])
export type ITreeFilterOperator = z.infer<typeof treeFilterOperators>
export const treeBuiltInOperators = new Set<ITreeFilterOperator>([$is_root.value])

export const parentFilterOperators = z.union([$eq, $neq])
export type IParentFilterOperator = z.infer<typeof parentFilterOperators>

export const dateRangeFilterOperators = z.union([$eq, $neq, $between])
export type IDateRangeFilterOperator = z.infer<typeof dateRangeFilterOperators>

export const createdAtFilterOperators = dateFilterOperators
export type ICreatedAtFilterOperator = z.infer<typeof dateFilterOperators>
export const createdAtBuiltInOperators = dateBuiltInOperators

export const updatedAtFilterOperators = dateFilterOperators
export type IUpdatedAtFilterOperator = z.infer<typeof dateFilterOperators>
export const updatedAtBuiltInOperators = dateBuiltInOperators

export const createdByFilterOperators = collaboratorFilterOperators
export type ICreatedByFilterOperator = z.infer<typeof createdByFilterOperators>

export const updatedByFilterOperators = collaboratorFilterOperators
export type IUpdatedByFilterOperator = z.infer<typeof updatedByFilterOperators>

export const operatorsWihtoutValue = z.union([$is_empty, $is_not_empty, $is_today, $is_root])
export const isOperatorWithoutValue = (value: string): boolean => operatorsWihtoutValue.safeParse(value).success
