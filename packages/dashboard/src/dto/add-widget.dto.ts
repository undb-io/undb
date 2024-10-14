import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardWidgetSchema } from "../value-objects"

export const addWidgetDTO = z.object({
  dashboardId: dashboardIdSchema,
  widget: dashboardWidgetSchema,
})

export type IAddWidgetDTO = z.infer<typeof addWidgetDTO>
