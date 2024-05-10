import { z } from 'zod'
import { tableId } from '../../../table-id.vo'

export const getRecordsDTO = z.object({
  tableId: tableId,
})

export type IGetRecordsDTO = z.infer<typeof getRecordsDTO>
