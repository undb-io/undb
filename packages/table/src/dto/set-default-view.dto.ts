import { z } from "@undb/zod"
import { viewId } from "../modules/views/view/view-id.vo"

export const setDefaultViewDTO = z.object({
  viewId: viewId,
})

export type ISetDefaultViewDTO = z.infer<typeof setDefaultViewDTO>
