import { tableIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const exportGridCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
  type: z.enum(['csv', 'excel']),
})
export type IExportGridInput = z.infer<typeof exportGridCommandInput>
