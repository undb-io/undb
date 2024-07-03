import { pagniationSchema } from "@undb/domain"
import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { viewFilterGroup, viewId } from "../../views"

export const getRecordsDTO = z.object({
  tableId: tableId,
  viewId: viewId.optional(),
  q: z.string().optional(),
  filters: viewFilterGroup.optional(),
  pagination: pagniationSchema.optional(),
})

export type IGetRecordsDTO = z.infer<typeof getRecordsDTO>
