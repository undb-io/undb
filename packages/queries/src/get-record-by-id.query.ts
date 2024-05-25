import { Query, type QueryProps } from "@undb/domain"
import { getRecordByIdDTO, recordDTO } from "@undb/table"
import { z } from "@undb/zod"

export const getRecordByIdQuery = getRecordByIdDTO

export type IGetRecordByIdQuery = z.infer<typeof getRecordByIdQuery>

export const getRecordByIdOutput = z.object({
  record: recordDTO.nullable(),
})

export type IGetRecordByIdOutput = z.infer<typeof getRecordByIdOutput>

export class GetRecordByIdQuery extends Query implements IGetRecordByIdQuery {
  public readonly tableId: string
  public readonly id: string

  constructor(props: QueryProps<IGetRecordByIdQuery>) {
    super()
    this.tableId = props.tableId
    this.id = props.id
  }
}
