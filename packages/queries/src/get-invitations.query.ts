import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getInivitationsQuery = z.object({
  q: z.string().optional(),
})

export type IGetInivitationsQuery = z.infer<typeof getInivitationsQuery>

export class GetInivitationsQuery extends Query {
  public readonly q?: string
  constructor(props: QueryProps<IGetInivitationsQuery>) {
    super()
    this.q = props.q
  }
}
