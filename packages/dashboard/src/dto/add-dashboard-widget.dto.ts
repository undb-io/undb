import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardLayoutSchema, dashboardWidgetSchema } from "../value-objects"

export const addDashboardWidgetDTO = z.object({
  dashboardId: dashboardIdSchema,
  widget: dashboardWidgetSchema,
  layout: dashboardLayoutSchema,
})

export type IAddDashboardWidgetDTO = z.infer<typeof addDashboardWidgetDTO>
