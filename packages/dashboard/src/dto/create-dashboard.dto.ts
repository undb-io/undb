import { baseIdSchema } from "@undb/base"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import {
  dashboardIdSchema,
  dashboardLayoutsSchema,
  dashboardNameSchema,
  dashboardWidgetsSchema,
} from "../value-objects"

export const createDashboardDTO = z.object({
  id: dashboardIdSchema.optional(),
  name: dashboardNameSchema,
  spaceId: spaceIdSchema,
  baseId: baseIdSchema,
  description: z.string().optional(),
  widgets: dashboardWidgetsSchema.optional(),
  layout: dashboardLayoutsSchema.optional(),
})

export type ICreateDashboardDTO = z.infer<typeof createDashboardDTO>
