import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { attachmentFilterOperators } from './operators.js'

export const attachmentFilterValue = z.string().nullable()
export const attachmentFilter = z
  .object({
    type: z.literal('attachment'),
    operator: attachmentFilterOperators,
    value: attachmentFilterValue,
  })
  .merge(baseFilter)

export type IAttachmentFilter = z.infer<typeof attachmentFilter>
export type IAttachmentFilterOperator = z.infer<typeof attachmentFilterOperators>
