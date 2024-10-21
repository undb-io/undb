import { z } from "@undb/zod"
import { dashboardIdSchema } from "../value-objects"

export const duplicateDashboardDTO = z.object({
  id: dashboardIdSchema,
})

export type IDuplicateDashboardDTO = z.infer<typeof duplicateDashboardDTO>
