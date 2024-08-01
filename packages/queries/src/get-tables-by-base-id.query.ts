import { baseIdSchema } from "@undb/base"
import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getTablesByBaseIdQuery = z.object({
  baseId: baseIdSchema,
})

export type IGetTablesByBaseIdQuery = z.infer<typeof getTablesByBaseIdQuery>

export class GetTablesByBaseIdQuery extends Query {
  public baseId: string

  constructor(props: QueryProps<IGetTablesByBaseIdQuery>) {
    super()
    this.baseId = props.baseId
  }
}
