import { z } from 'zod'
import type { ICreatedAtFilterOperator } from '../field'

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

export const $is_root = z.literal('$is_root')

export const createdAtBuiltInOperators = new Set<ICreatedAtFilterOperator>([$is_today.value])

export const operatorsWihtoutValue = z.union([$is_empty, $is_not_empty, $is_today, $is_root])
export const isOperatorWithoutValue = (value: string): boolean => operatorsWihtoutValue.safeParse(value).success
