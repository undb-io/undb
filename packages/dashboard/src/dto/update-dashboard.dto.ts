import { z } from "@undb/zod"
import { dashboardNameSchema } from "../value-objects"

export const updateDashboardDTO = z.object({
  name: dashboardNameSchema.optional(),
  description: z.string().optional(),
})

export type IUpdateDashboardDTO = z.infer<typeof updateDashboardDTO>
