import { baseIdSchema } from "@undb/base"
import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getBaseQuery = z.object({
  baseId: baseIdSchema,
})

export type IGetBaseQuery = z.infer<typeof getBaseQuery>

export class GetBaseQuery extends Query implements IGetBaseQuery {
  public readonly baseId: string

  constructor(props: QueryProps<IGetBaseQuery>) {
    super()
    this.baseId = props.baseId
  }
}
