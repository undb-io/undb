import { z } from 'zod'
import { userIdSchema } from '../../../user/value-objects/index.js'
import { tableNameSchema } from '../../value-objects'
import { tableIdSchema } from '../../value-objects/table-id.vo.js'

export const baseRecordEventSchema = z.object({
  tableId: tableIdSchema,
  tableName: tableNameSchema,
})
export type IBaseRecordEventPayload = z.infer<typeof baseRecordEventSchema>

export type BaseRecordEventName = `record.${string}`

export const baseEventSchema = z.object({
  id: z.string().uuid(),
  operatorId: userIdSchema,
  timestamp: z.string().datetime(),
})
