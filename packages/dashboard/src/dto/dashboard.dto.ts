import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardNameSchema } from "../value-objects"

export const dashboardDTO = z.object({
  id: dashboardIdSchema,
  name: dashboardNameSchema,
  spaceId: spaceIdSchema,
})

export type IDashboardDTO = z.infer<typeof dashboardDTO>
