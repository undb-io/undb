import { tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const exportTemplateCommandInput = z.object({
  tableId: tableIdSchema,
})
export type IExportTemplateInput = z.infer<typeof exportTemplateCommandInput>
