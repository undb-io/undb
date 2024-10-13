import { baseIdSchema } from "@undb/base"
import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getDashboardsQuery = z.object({
  baseId: baseIdSchema.optional(),
})

export type IGetDashboardsQuery = z.infer<typeof getDashboardsQuery>

export class GetDashboardsQuery extends Query implements IGetDashboardsQuery {
  public readonly baseId?: string

  constructor(query: QueryProps<IGetDashboardsQuery>) {
    super()
    this.baseId = query.baseId
  }
}
