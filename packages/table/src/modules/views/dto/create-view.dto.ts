import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { viewId, viewName, viewType } from "../view"

export const createViewDTO = z.object({
  id: viewId.optional(),
  name: viewName,
  type: viewType,
})

export const createViewWithoutNameDTO = createViewDTO.omit({ name: true })

export type ICreateViewDTO = z.infer<typeof createViewDTO>

export const createTableViewDTO = createViewDTO.merge(z.object({ tableId }))

export type ICreateTableViewDTO = z.infer<typeof createTableViewDTO>
