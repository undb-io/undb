import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardNameSchema } from "../value-objects"

export const createDashboardDTO = z.object({
  id: dashboardIdSchema.optional(),
  name: dashboardNameSchema,
  spaceId: spaceIdSchema,
})

export type ICreateDashboardDTO = z.infer<typeof createDashboardDTO>
