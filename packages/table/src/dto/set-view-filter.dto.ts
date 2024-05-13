import { z } from 'zod'
import { filterGroup, viewId } from '../modules'
import { tableId } from '../table-id.vo'

export const setViewFilterDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  filter: filterGroup,
})

export type ISetViewFilterDTO = z.infer<typeof setViewFilterDTO>
