import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardNameSchema } from "../value-objects"

export const updateDashboardDTO = z.object({
  id: dashboardIdSchema,
  name: dashboardNameSchema.optional(),
})

export type IUpdateDashboardDTO = z.infer<typeof updateDashboardDTO>
