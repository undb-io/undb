import { Query, type IPagination, type QueryProps } from "@undb/domain"
import { getRecordsDTO, recordsDTO } from "@undb/table"
import { z } from "@undb/zod"

export const getRecordsQuery = getRecordsDTO

export type IGetRecordsQuery = z.infer<typeof getRecordsQuery>

export const getRecordsOutput = z.object({
  total: z.number(),
  records: recordsDTO,
})

export type IGetRecordsOutput = z.infer<typeof getRecordsOutput>

export class GetRecordsQuery extends Query implements IGetRecordsQuery {
  public readonly tableId: string
  public readonly pagination?: IPagination

  constructor(props: QueryProps<IGetRecordsQuery>) {
    super()
    this.tableId = props.tableId
    this.pagination = props.pagination
  }
}
