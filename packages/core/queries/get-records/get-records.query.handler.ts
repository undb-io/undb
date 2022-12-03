import type { IQueryHandler } from '@egodb/domain'
import type { IRecordQueryModel } from '../../record'
import type { GetRecordsQuery } from './get-records.query'
import type { IGetRecordsOutput } from './get-records.query.interface'

export class GetRecordsQueryHandler implements IQueryHandler<GetRecordsQuery, IGetRecordsOutput> {
  constructor(protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetRecordsQuery): Promise<IGetRecordsOutput> {
    const records = await this.rm.find()

    return { records }
  }
}
