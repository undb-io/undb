import type { IQueryHandler } from '@egodb/domain'
import type { IRecordQueryModel } from '../../record'
import { WithRecordTableIdS } from '../../record'
import type { ITableRepository } from '../../table.repository'
import type { GetRecordsQuery } from './get-records.query'
import type { IGetRecordsOutput } from './get-records.query.interface'

export class GetRecordsQueryHandler implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordsQuery): Promise<IGetRecordsOutput> {
    const spec = WithRecordTableIdS(query.tableId).unwrap()

    const records = await this.rm.find(spec)

    return { records }
  }
}
