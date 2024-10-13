import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { dashboardIdSchema, dashboardNameSchema } from "../value-objects"

export const uniqueDashboardDTO = z
  .object({
    dashboardId: dashboardIdSchema,
    dashboardName: dashboardNameSchema,
    spaceId: spaceIdSchema,
  })
  .partial()

export type IUniqueDashboardDTO = z.infer<typeof uniqueDashboardDTO>
