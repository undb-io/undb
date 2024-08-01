import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getShareQuery = z.object({
  shareId: z.string(),
})

export type IGetShareQuery = z.infer<typeof getShareQuery>

export class GetShareQuery extends Query implements IGetShareQuery {
  public readonly shareId: string

  constructor(props: QueryProps<IGetShareQuery>) {
    super()
    this.shareId = props.shareId
  }
}
