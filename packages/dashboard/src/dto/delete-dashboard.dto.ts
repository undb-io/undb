import { z } from "@undb/zod"
import { dashboardIdSchema } from "../value-objects"

export const deleteDashboardDTO = z.object({
  id: dashboardIdSchema,
})

export type IDeleteDashboardDTO = z.infer<typeof deleteDashboardDTO>
