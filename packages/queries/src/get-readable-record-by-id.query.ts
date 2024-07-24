import { Query, type QueryProps } from "@undb/domain"
import { getRecordByIdDTO, recordReadableValueDTO } from "@undb/table"
import { z } from "@undb/zod"

export const getReadableRecordByIdQuery = getRecordByIdDTO

export type IGetReadableRecordByIdQuery = z.infer<typeof getReadableRecordByIdQuery>

export const getReadableRecordByIdOutput = z.object({
  record: recordReadableValueDTO.nullable(),
})

export type IGetReadableRecordByIdOutput = z.infer<typeof getReadableRecordByIdOutput>

export class GetReadableRecordByIdQuery extends Query implements IGetReadableRecordByIdQuery {
  public readonly tableId: string
  public readonly id: string

  constructor(props: QueryProps<IGetReadableRecordByIdQuery>) {
    super()
    this.tableId = props.tableId
    this.id = props.id
  }
}
