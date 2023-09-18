import { z } from 'zod'
import { baseFilter } from '../../../filter/filter.base.js'
import { $is_empty, $is_not_empty } from '../../../filter/operators.js'

export const qrcodeFilterOperators = z.union([$is_empty, $is_not_empty])

export const qrcodeFilterValue = z.null()
export const qrcodeFilter = z
  .object({
    type: z.literal('qrcode'),
    operator: qrcodeFilterOperators,
    value: qrcodeFilterValue,
  })
  .merge(baseFilter)

export type IQRCodeFilter = z.infer<typeof qrcodeFilter>
export type IQRCodeFilterOperator = z.infer<typeof qrcodeFilterOperators>
