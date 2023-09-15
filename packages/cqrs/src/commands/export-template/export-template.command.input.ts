import { recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const exportTemplateCommandInput = z.object({
  tableId: tableIdSchema,
  recordIds: recordIdSchema.array().optional(),
})

export type IExportTemplateInput = z.infer<typeof exportTemplateCommandInput>
