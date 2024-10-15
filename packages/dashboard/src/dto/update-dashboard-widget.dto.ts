import { z } from "@undb/zod"
import { dashboardWidgetSchema } from "../value-objects"
import { dashboardIdSchema } from "../value-objects/dashboard-id.vo"

export const updateDashboardWidgetDTO = z.object({
  id: dashboardIdSchema,
  widget: dashboardWidgetSchema,
})

export type IUpdateDashboardWidgetDTO = z.infer<typeof updateDashboardWidgetDTO>
