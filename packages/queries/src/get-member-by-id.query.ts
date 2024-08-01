import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getMemberByIdQuery = z.object({
  id: z.string(),
})

export type IGetMemberByIdQuery = z.infer<typeof getMemberByIdQuery>

export class GetMemberByIdQuery extends Query {
  public readonly id: string
  constructor(props: QueryProps<IGetMemberByIdQuery>) {
    super()
    this.id = props.id
  }
}
