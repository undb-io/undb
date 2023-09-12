import { z } from 'zod'
import type { ICreatedAtFilterOperator } from '../field'

export const $eq = z.literal('$eq')
export const $neq = z.literal('$neq')
export const $contains = z.literal('$contains')
export const $not_contains = z.literal('$not_contains')
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

export const $start_eq = z.literal('$start_eq')
export const $start_neq = z.literal('$start_neq')
export const $start_gt = z.literal('$start_gt')
export const $start_lt = z.literal('$start_lt')
export const $start_gte = z.literal('$start_gte')
export const $start_lte = z.literal('$start_lte')

export const $end_eq = z.literal('$end_eq')
export const $end_neq = z.literal('$end_neq')
export const $end_gt = z.literal('$end_gt')
export const $end_lt = z.literal('$end_lt')
export const $end_gte = z.literal('$end_gte')
export const $end_lte = z.literal('$end_lte')

export const $is_empty = z.literal('$is_empty')
export const $is_not_empty = z.literal('$is_not_empty')

export const $is_today = z.literal('$is_today')
export const $is_not_today = z.literal('$is_not_today')
export const $is_tomorrow = z.literal('$is_tomorrow')
export const $is_yesterday = z.literal('$is_yesterday')
export const $between = z.literal('$between')

export const $has_file_type = z.literal('$has_file_type')
export const $has_file_extension = z.literal('$has_file_extension')

export const $is_root = z.literal('$is_root')

export const $is_me = z.literal('$is_me')
export const $is_not_me = z.literal('$is_not_me')

export const createdAtBuiltInOperators = new Set<ICreatedAtFilterOperator>([$is_today.value, $is_not_today.value])

export const operatorsWihtoutValue = z.union([
  $is_empty,
  $is_not_empty,
  $is_today,
  $is_not_today,
  $is_tomorrow,
  $is_yesterday,
  $is_root,
  $is_me,
  $is_not_me,
])
export const isOperatorWithoutValue = (value: string): boolean => operatorsWihtoutValue.safeParse(value).success
