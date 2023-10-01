import { recordIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const exportTableTemplateCommandInput = z.object({
  tableId: tableIdSchema,
  recordIds: recordIdSchema.array().optional(),
})

export type IExportTableTemplateInput = z.infer<typeof exportTableTemplateCommandInput>
