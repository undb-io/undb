import { Query, type QueryProps } from "@undb/domain"
import { shareIdSchema } from "@undb/share"
import { z } from "@undb/zod"

export const getBaseByShareQuery = z.object({
  shareId: shareIdSchema,
})

export type IGetBaseByShareQuery = z.infer<typeof getBaseByShareQuery>

export class GetBaseByShareQuery extends Query implements IGetBaseByShareQuery {
  public readonly shareId: string

  constructor(props: QueryProps<IGetBaseByShareQuery>) {
    super()
    this.shareId = props.shareId
  }
}
