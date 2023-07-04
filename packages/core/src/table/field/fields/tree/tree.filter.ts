import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $eq, $is_root, $neq } from '../../../filter/operators.js'
import { treeFieldValue } from './tree-field.type.js'

export const treeFilterOperators = z.union([$eq, $neq, $is_root])
export type ITreeFilterOperator = z.infer<typeof treeFilterOperators>
export const treeBuiltInOperators = new Set<ITreeFilterOperator>([$is_root.value])

export const treeFilterValue = treeFieldValue.or(treeFieldValue.array()).nullable()
export type ITreeFilterValue = z.infer<typeof treeFieldValue>
export const treeFilter = z
  .object({
    type: z.literal('tree'),
    operator: treeFilterOperators,
    value: treeFilterValue,
  })
  .merge(baseFilter)

export type ITreeFilter = z.infer<typeof treeFilter>
