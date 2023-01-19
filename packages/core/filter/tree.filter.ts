import { z } from 'zod'
import { treeFieldValue } from '../field/tree-field.type'
import { baseFilter } from './filter.base'
import { treeFilterOperators } from './operators'

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
