import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getMembersQuery = z.object({
  q: z.string().optional(),
})

export type IGetMembersQuery = z.infer<typeof getMembersQuery>

export class GetMembersQuery extends Query {
  public readonly q?: string
  constructor(props: QueryProps<IGetMembersQuery>) {
    super()
    this.q = props.q
  }
}
