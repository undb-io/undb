import { widgetId } from "@undb/table"
import { z } from "@undb/zod"
import { dashboardIdSchema } from "../value-objects"

export const deleteDashboardWidgetDTO = z.object({
  dashboardId: dashboardIdSchema,
  widgetId: widgetId,
})

export type IDeleteDashboardWidgetDTO = z.infer<typeof deleteDashboardWidgetDTO>
