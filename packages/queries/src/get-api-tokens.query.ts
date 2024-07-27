import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getApiTokensQuery = z.object({
  userId: z.string(),
})

export type IGetApiTokensQuery = z.infer<typeof getApiTokensQuery>

export class GetApiTokensQuery extends Query implements IGetApiTokensQuery {
  public readonly userId: string

  constructor(props: QueryProps<IGetApiTokensQuery>) {
    super()
    this.userId = props.userId
  }
}
