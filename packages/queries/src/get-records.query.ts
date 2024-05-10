import { Query, type QueryProps } from '@undb/domain'
import { getRecordsDTO } from '@undb/table'
import { z } from 'zod'

export const getRecordsQuery = getRecordsDTO

export type IGetRecordsQuery = z.infer<typeof getRecordsQuery>

export class GetRecordsQuery extends Query implements IGetRecordsQuery {
  public readonly tableId: string

  constructor(props: QueryProps<IGetRecordsQuery>) {
    super()
    this.tableId = props.tableId
  }
}
