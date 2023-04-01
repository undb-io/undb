import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { attachmentFilterOperators } from './operators.js'

const attachmentFilterTypeValue = z.enum(['image', 'video', 'text'])
export const attachmentFilterValue = z.string().nullable().or(attachmentFilterTypeValue)

export const attachmentFilter = z
  .object({
    type: z.literal('attachment'),
    operator: attachmentFilterOperators,
    value: attachmentFilterValue,
  })
  .merge(baseFilter)

export type IAttachmentFilter = z.infer<typeof attachmentFilter>
export type IAttachmentFilterOperator = z.infer<typeof attachmentFilterOperators>
