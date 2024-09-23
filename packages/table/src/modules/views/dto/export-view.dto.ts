import { z } from "@undb/zod"
import { viewId } from "../view/view-id.vo"

export const exportViewDTO = z.object({
  viewId: viewId,
})

export type IExportViewDTO = z.infer<typeof exportViewDTO>
