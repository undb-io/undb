import { widgetId } from "@undb/table"
import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardLayoutSchema } from "../value-objects"

export const duplicateDashboardWidgetDTO = z.object({
  dashboardId: dashboardIdSchema,
  widgetId: widgetId,
  layout: dashboardLayoutSchema,
})

export type IDuplicateDashboardWidgetDTO = z.infer<typeof duplicateDashboardWidgetDTO>
