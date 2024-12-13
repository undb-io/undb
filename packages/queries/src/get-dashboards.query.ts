import { baseIdSchema } from "@undb/base"
import { dashboardDTO } from "@undb/dashboard"
import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getDashboardsQuery = z.object({
  baseId: baseIdSchema.optional(),
})

export type IGetDashboardsQuery = z.infer<typeof getDashboardsQuery>

export const getDashboardsQueryOutput = dashboardDTO.array()

export type IGetDashboardsOutput = z.infer<typeof getDashboardsQueryOutput>

export class GetDashboardsQuery extends Query implements IGetDashboardsQuery {
  public readonly baseId?: string

  constructor(query: QueryProps<IGetDashboardsQuery>) {
    super()
    this.baseId = query.baseId
  }
}
