import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { z } from "@undb/zod"

export const getDashboardByShareQuery = z.object({
  shareId: shareIdSchema,
})

export type IGetDashboardByShareQuery = z.infer<typeof getDashboardByShareQuery>

export class GetDashboardByShareQuery extends Query implements IGetDashboardByShareQuery {
  public readonly shareId: string

  constructor(query: QueryProps<IGetDashboardByShareQuery>) {
    super()
    this.shareId = query.shareId
  }
}
