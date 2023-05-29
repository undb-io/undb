import { tableIdSchema, viewIdSchema } from '@undb/core'
import * as z from 'zod'

export const exportGridCommandInput = z.object({
  tableId: tableIdSchema,
  viewId: viewIdSchema,
})
export type IExportGridInput = z.infer<typeof exportGridCommandInput>
