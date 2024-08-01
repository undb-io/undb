import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getMembersByIdsQuery = z.object({
  ids: z.string().array().nonempty(),
})

export type IGetMembersByIdsQuery = z.infer<typeof getMembersByIdsQuery>

export class GetMembersByIdsQuery extends Query {
  public readonly ids: [string, ...string[]]
  constructor(props: QueryProps<IGetMembersByIdsQuery>) {
    super()
    this.ids = props.ids
  }
}
