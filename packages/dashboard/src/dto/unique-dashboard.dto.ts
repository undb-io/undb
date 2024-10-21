import { baseNameSchema } from "@undb/base"
import { z } from "@undb/zod"
import { dashboardIdSchema,dashboardNameSchema } from "../value-objects"

export const uniqueDashboardDTO = z
  .object({
    dashboardId: dashboardIdSchema,
    dashboardName: dashboardNameSchema,
    baseName: baseNameSchema
    })
  .partial()

export type IUniqueDashboardDTO = z.infer<typeof uniqueDashboardDTO>
