import { z } from "@undb/zod"
import { viewId } from "../view"

export const exportViewDTO = z.object({
  viewId: viewId,
})

export type IExportViewDTO = z.infer<typeof exportViewDTO>
