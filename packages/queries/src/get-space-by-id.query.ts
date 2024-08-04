import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getSpaceByIdQuery = z.object({
  id: z.string(),
})

export type IGetSpaceByIdQuery = z.infer<typeof getSpaceByIdQuery>

export class GetSpaceByIdQuery extends Query implements IGetSpaceByIdQuery {
  public readonly id: string

  constructor(props: QueryProps<IGetSpaceByIdQuery>) {
    super()
    this.id = props.id
  }
}
