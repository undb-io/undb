import { setRowHeight, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setRowHeightCommandInput = z
  .object({
    tableId: tableIdSchema,
  })
  .merge(setRowHeight)
