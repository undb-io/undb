import { Query, type QueryProps } from "@undb/domain"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"

export const getSpaceMemberQuery = z.object({
  userId: z.string(),
  spaceId: spaceIdSchema,
})

export type IGetSpaceMemberQuery = z.infer<typeof getSpaceMemberQuery>

export class GetSpaceMemberQuery extends Query implements IGetSpaceMemberQuery {
  public readonly userId: string
  public readonly spaceId: string

  constructor(props: QueryProps<IGetSpaceMemberQuery>) {
    super()
    this.userId = props.userId
    this.spaceId = props.spaceId
  }
}
