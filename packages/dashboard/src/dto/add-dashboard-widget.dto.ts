import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardWidgetSchema } from "../value-objects"

export const addDashboardWidgetDTO = z.object({
  dashboardId: dashboardIdSchema,
  widget: dashboardWidgetSchema,
})

export type IAddDashboardWidgetDTO = z.infer<typeof addDashboardWidgetDTO>
