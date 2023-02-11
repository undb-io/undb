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

export const $is_today = z.literal('$is_today')

export const idFilterOperators = z.union([$eq, $neq])
export type IIdFilterOperator = z.infer<typeof idFilterOperators>

export const stringFilterOperators = z.union([$eq, $neq, $contains, $starts_with, $ends_with, $regex])
export type IStringFilterOperator = z.infer<typeof stringFilterOperators>

export const emailFilterOperators = z.union([$eq, $neq])
export type IEmailFilterOperator = z.infer<typeof emailFilterOperators>

export const colorFilterOperators = z.union([$eq, $neq])
export type IColorFilterOperator = z.infer<typeof colorFilterOperators>

export const numberFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])
export type INumberFilterOperator = z.infer<typeof numberFilterOperators>

export const ratingFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])
export type IRatingFilterOperator = z.infer<typeof ratingFilterOperators>

export const boolFilterOperators = z.union([$is_true, $is_false])
export type IBoolFilterOperator = z.infer<typeof boolFilterOperators>

export const selectFilterOperators = z.union([$eq, $neq, $in, $nin])
export type ISelectFilterOperator = z.infer<typeof selectFilterOperators>

export const dateFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte, $is_today])
export type IDateFilterOperator = z.infer<typeof dateFilterOperators>

/**
 * built in date operators
 */
export const dateBuiltInOperators = new Set<IDateFilterOperator>([$is_today.value])

export const referenceFilterOperators = z.union([$eq, $neq])
export type IReferenceFilterOperator = z.infer<typeof referenceFilterOperators>

export const $is_root = z.literal('$is_root')

export const treeFilterOperators = z.union([$eq, $neq, $is_root])
export type ITreeFilterOperator = z.infer<typeof treeFilterOperators>
export const treeBuiltInOperators = new Set<ITreeFilterOperator>([$is_root.value])

export const parentFilterOperators = z.union([$eq, $neq])
export type IParentFilterOperator = z.infer<typeof parentFilterOperators>

export const dateRangeFilterOperators = z.union([$eq, $neq])
export type IDateRangeFilterOperator = z.infer<typeof dateRangeFilterOperators>

export const createdAtFilterOperators = dateFilterOperators
export type ICreatedAtFilterOperator = z.infer<typeof dateFilterOperators>
export const createdAtBuiltInOperators = dateBuiltInOperators

export const updatedAtFilterOperators = dateFilterOperators
export type IUpdatedAtFilterOperator = z.infer<typeof dateFilterOperators>
export const updatedAtBuiltInOperators = dateBuiltInOperators

export const autoIncrementFilterOperators = numberFilterOperators
export type IAutoIncrementFilterOperator = z.infer<typeof autoIncrementFilterOperators>
