import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { z } from "@undb/zod"

export const getTableByShareQuery = z.object({
  shareId: shareIdSchema,
})

export type IGetTableByShareQuery = z.infer<typeof getTableByShareQuery>

export class GetTableByShareQuery extends Query implements IGetTableByShareQuery {
  public readonly shareId: string

  constructor(props: QueryProps<IGetTableByShareQuery>) {
    super()
    this.shareId = props.shareId
  }
}
