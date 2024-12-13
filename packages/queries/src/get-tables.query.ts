import { baseIdSchema } from "@undb/base"
import { Query, type QueryProps } from "@undb/domain"
import { tableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const getTablesQuery = z.object({
  baseId: baseIdSchema.optional(),
})

export type IGetTablesQuery = z.infer<typeof getTablesQuery>

export const getTablesQueryOutput = z.array(tableDTO)
export type IGetTablesOutput = z.infer<typeof getTablesQueryOutput>

export class GetTablesQuery extends Query implements IGetTablesQuery {
  public readonly baseId?: string

  constructor(query: QueryProps<IGetTablesQuery>) {
    super()
    this.baseId = query.baseId
  }
}
