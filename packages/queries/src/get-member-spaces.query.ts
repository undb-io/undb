import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getMemberSpacesQuery = z.object({
  userId: z.string(),
})

export type IGetMemberSpacesQuery = z.infer<typeof getMemberSpacesQuery>

export class GetMemberSpacesQuery extends Query implements IGetMemberSpacesQuery {
  public readonly userId: string
  constructor(props: QueryProps<IGetMemberSpacesQuery>) {
    super()
    this.userId = props.userId
  }
}
