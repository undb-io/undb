import { Query, type QueryProps } from "@undb/domain"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"

export const getMembersQuery = z.object({
  q: z.string().optional(),
  spaceId: spaceIdSchema,
})

export type IGetMembersQuery = z.infer<typeof getMembersQuery>

export class GetMembersQuery extends Query implements IGetMembersQuery {
  public readonly q?: string
  public readonly spaceId: string

  constructor(props: QueryProps<IGetMembersQuery>) {
    super()
    this.q = props.q
    this.spaceId = props.spaceId
  }
}
