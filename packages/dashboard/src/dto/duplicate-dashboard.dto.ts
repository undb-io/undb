import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardNameSchema } from "../value-objects"

export const duplicateDashboardDTO = z.object({
  id: dashboardIdSchema,
  spaceId: spaceIdSchema.optional(),
  name: dashboardNameSchema.optional(),
  includeData: z.boolean().optional(),
})

export type IDuplicateDashboardDTO = z.infer<typeof duplicateDashboardDTO>
