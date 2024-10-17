import { z } from "@undb/zod"
import { dashboardIdSchema } from "../value-objects/dashboard-id.vo"
import { dashboardLayoutsSchema } from "../value-objects/dashboard-layout.vo"

export const relayoutDashboardWidgetsDTO = z.object({
  dashboardId: dashboardIdSchema,
  layout: dashboardLayoutsSchema,
})

export type IRelayoutDashboardWidgetsDTO = z.infer<typeof relayoutDashboardWidgetsDTO>
