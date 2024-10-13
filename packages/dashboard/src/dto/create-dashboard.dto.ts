import { baseIdSchema } from "@undb/base"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardNameSchema } from "../value-objects"

export const createDashboardDTO = z.object({
  id: dashboardIdSchema.optional(),
  name: dashboardNameSchema,
  spaceId: spaceIdSchema,
  baseId: baseIdSchema,
})

export type ICreateDashboardDTO = z.infer<typeof createDashboardDTO>
